import { publicProcedure, protectedProcedure, router } from "./railway-trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

import {
  // Bookings / leads
  createBooking,
  createDriverApplication,
  createCorporateInquiry,
  createContactMessage,

  // Admin inbox
  getAllDriverApplications,
  updateDriverApplicationStatus,
  updateDriverApplicationNotes,
  updateDriverApplicationAssignment,

  getAllCorporateInquiries,
  updateCorporateInquiryStatus,
  updateCorporateInquiryNotes,
  updateCorporateInquiryAssignment,

  getAllContactMessages,
  markContactMessageAsRead,
  updateContactMessageNotes,
  updateContactMessageAssignment,

  // CMS
  getSiteContent,
  getAllSiteContent,
  upsertSiteContent,
  getSiteImage,
  getAllSiteImages,
  upsertSiteImage,
  deleteSiteImage,

  // Team
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,

  // ✅ Phase 1 onboarding (DB helpers)
  createDriverOnboardingToken,
  getDriverOnboardingByToken,
  markDriverOnboardingTokenUsed,
  upsertDriverVehicle,
  upsertDriverDocument,
  getDriverOnboardingProfile,
  setDriverDocumentReview,
} from "./db";

import { storagePut } from "./storage";
import { sendEmail, notifyOwner } from "./railway-email";
import { emailTemplates, EmailTemplateType } from "./emailTemplates";

/* ----------------------------------------
   Admin-only middleware
---------------------------------------- */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user?.role;

  if (role !== "admin" && role !== "staff") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }

  return next({ ctx });
});

/* ----------------------------------------
   Quote helper
---------------------------------------- */
function calculateQuote(serviceType: string, distance: number): number {
  const baseRates: Record<string, number> = {
    standard: 350,
    courier: 500,
    airport: 3500,
    executive: 550,
  };
  const perMileRates: Record<string, number> = {
    standard: 180,
    courier: 150,
    airport: 0,
    executive: 280,
  };

  return (
    (baseRates[serviceType] || 350) +
    Math.round(distance * (perMileRates[serviceType] || 180))
  );
}

/* ----------------------------------------
   Helpers (Phase 1 Onboarding)
---------------------------------------- */
const DRIVER_DOC_TYPES = [
  "LICENSE_FRONT",
  "LICENSE_BACK",
  "BADGE",
  "PLATING",
  "INSURANCE",
  "MOT",
] as const;

function getPublicBaseUrl() {
  // ✅ Put this in Railway env for reliability:
  // PUBLIC_BASE_URL=https://www.cloudcarsltd.com
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.VITE_PUBLIC_BASE_URL ||
    "https://www.cloudcarsltd.com"
  );
}

/* ----------------------------------------
   App Router
---------------------------------------- */
export const appRouter = router({
  /* ---------- AUTH ---------- */
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),

  /* ---------- BOOKINGS ---------- */
  booking: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email(),
          customerPhone: z.string().min(1),
          serviceType: z.enum(["standard", "courier", "airport", "executive"]),
          pickupAddress: z.string().min(1),
          destinationAddress: z.string().min(1),
          pickupDate: z.string().min(1),
          pickupTime: z.string().min(1),
          passengers: z.number().min(1).max(8).default(1),
          specialRequests: z.string().optional(),
          estimatedPrice: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createBooking({
          ...input,
          specialRequests: input.specialRequests ?? null,
          estimatedPrice: input.estimatedPrice ?? null,
        });
        return {
          success: true,
          bookingId: (result as any).id ?? (result as any).insertId,
        };
      }),

    getQuote: publicProcedure
      .input(
        z.object({
          serviceType: z.enum(["standard", "courier", "airport", "executive"]),
          estimatedMiles: z.number().min(0),
        })
      )
      .query(({ input }) => {
        const price = calculateQuote(input.serviceType, input.estimatedMiles);
        return {
          estimatedPrice: price,
          formattedPrice: `£${(price / 100).toFixed(2)}`,
          serviceType: input.serviceType,
        };
      }),
  }),

  /* ---------- DRIVERS ---------- */
  driver: router({
    submitApplication: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          licenseNumber: z.string().min(1),
          yearsExperience: z.number().min(0),
          vehicleOwner: z.boolean().default(false),
          vehicleType: z.string().optional(),
          availability: z.enum(["fulltime", "parttime", "weekends"]),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createDriverApplication({
            ...input,
            vehicleType: input.vehicleType ?? null,
            message: input.message ?? null,
            internalNotes: null,
            assignedTo: null,
          });

          notifyOwner({
            title: "New Driver Application",
            content: `${input.fullName} applied. Phone: ${input.phone}`,
          }).catch((err) => console.error("⚠️ notifyOwner failed", err));

          return {
            success: true,
            applicationId: (result as any).id ?? (result as any).insertId,
          };
        } catch (err: any) {
          console.error("❌ submitApplication failed", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err?.message || "Driver application failed",
          });
        }
      }),
  }),

  /* ---------- CORPORATE ---------- */
  corporate: router({
    inquire: publicProcedure
      .input(
        z.object({
          companyName: z.string().min(1),
          contactName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          estimatedMonthlyTrips: z.string().optional(),
          requirements: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createCorporateInquiry({
          ...input,
          estimatedMonthlyTrips: input.estimatedMonthlyTrips ?? null,
          requirements: input.requirements ?? null,
          internalNotes: null,
          assignedTo: null,
        });

        await notifyOwner({
          title: "New Corporate Inquiry",
          content: `${input.companyName} (${input.contactName})`,
        });

        return {
          success: true,
          inquiryId: (result as any).id ?? (result as any).insertId,
        };
      }),
  }),

  /* ---------- CONTACT ---------- */
  contact: router({
    send: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().min(1),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createContactMessage({
          ...input,
          phone: input.phone ?? null,
          internalNotes: null,
          assignedTo: null,
        });

        await notifyOwner({
          title: "New Contact Message",
          content: `${input.name}: ${input.subject}`,
        });

        return {
          success: true,
          messageId: (result as any).id ?? (result as any).insertId,
        };
      }),
  }),

  /* ---------- CMS ---------- */
  cms: router({
    getContent: publicProcedure
      .input(z.object({ sectionKey: z.string() }))
      .query(async ({ input }) =>
        (await getSiteContent(input.sectionKey)) ?? {
          sectionKey: input.sectionKey,
          title: null,
          subtitle: null,
          description: null,
          buttonText: null,
          buttonLink: null,
          extraData: null,
        }
      ),

    getAllContent: publicProcedure.query(getAllSiteContent),

    getImage: publicProcedure
      .input(z.object({ imageKey: z.string() }))
      .query(async ({ input }) =>
        (await getSiteImage(input.imageKey)) ?? {
          imageKey: input.imageKey,
          url: null,
          altText: null,
          caption: null,
        }
      ),

    getAllImages: publicProcedure.query(getAllSiteImages),

    updateContent: adminProcedure
      .input(
        z.object({
          sectionKey: z.string(),
          title: z.string().optional(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          buttonText: z.string().optional(),
          buttonLink: z.string().optional(),
          extraData: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertSiteContent({
          sectionKey: input.sectionKey,
          title: input.title ?? null,
          subtitle: input.subtitle ?? null,
          description: input.description ?? null,
          buttonText: input.buttonText ?? null,
          buttonLink: input.buttonLink ?? null,
          extraData: input.extraData ?? null,
        });
        return { success: true };
      }),

    uploadImage: adminProcedure
      .input(
        z.object({
          imageKey: z.string(),
          base64Data: z.string(),
          mimeType: z.string().default("image/png"),
          altText: z.string().optional(),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, "base64");
        const ext = input.mimeType.split("/")[1] || "png";
        const filename = `cms/${input.imageKey}-${nanoid(8)}.${ext}`;
        const { url } = await storagePut(filename, buffer, input.mimeType);

        await upsertSiteImage({
          imageKey: input.imageKey,
          url,
          altText: input.altText ?? null,
          caption: input.caption ?? null,
        });

        return { success: true, url };
      }),

    deleteImage: adminProcedure
      .input(z.object({ imageKey: z.string() }))
      .mutation(async ({ input }) => {
        await deleteSiteImage(input.imageKey);
        return { success: true };
      }),
  }),

  /* =======================================================================
     ✅ DRIVER ONBOARDING (Phase 1) - Public (token based)
     ======================================================================= */
  driverOnboarding: router({
    getByToken: publicProcedure
      .input(z.object({ token: z.string().min(10) }))
      .query(async ({ input }) => {
        const tokenRow = await getDriverOnboardingByToken(input.token);
        if (!tokenRow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired onboarding link",
          });
        }
        return await getDriverOnboardingProfile(
          (tokenRow as any).driverApplicationId
        );
      }),

    saveVehicle: publicProcedure
      .input(
        z.object({
          token: z.string().min(10),
          registration: z.string().min(1),
          make: z.string().min(1),
          model: z.string().min(1),
          colour: z.string().min(1),
          year: z.string().optional(),
          plateNumber: z.string().optional(),
          capacity: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const tokenRow = await getDriverOnboardingByToken(input.token);
        if (!tokenRow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired onboarding link",
          });
        }

        await upsertDriverVehicle({
          driverApplicationId: (tokenRow as any).driverApplicationId,
          registration: input.registration,
          make: input.make,
          model: input.model,
          colour: input.colour,
          year: input.year ?? null,
          plateNumber: input.plateNumber ?? null,
          capacity: input.capacity ?? null,
        });

        return { success: true };
      }),

    uploadDocument: publicProcedure
      .input(
        z.object({
          token: z.string().min(10),
          type: z.enum(DRIVER_DOC_TYPES),
          base64Data: z.string().min(20),
          mimeType: z.string().default("image/jpeg"),
          expiryDate: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const tokenRow = await getDriverOnboardingByToken(input.token);
        if (!tokenRow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired onboarding link",
          });
        }

        const buffer = Buffer.from(input.base64Data, "base64");
        const ext = input.mimeType.split("/")[1] || "bin";
        const filename = `drivers/${(tokenRow as any).driverApplicationId}/${
          input.type
        }-${nanoid(10)}.${ext}`;

        const { url } = await storagePut(filename, buffer, input.mimeType);

        await upsertDriverDocument({
          driverApplicationId: (tokenRow as any).driverApplicationId,
          type: input.type as any,
          fileUrl: url,
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        });

        return { success: true, url };
      }),

    submit: publicProcedure
      .input(z.object({ token: z.string().min(10) }))
      .mutation(async ({ input }) => {
        const tokenRow = await getDriverOnboardingByToken(input.token);
        if (!tokenRow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired onboarding link",
          });
        }

        await markDriverOnboardingTokenUsed(input.token);
        return { success: true };
      }),
  }),

  /* ---------- ADMIN ---------- */
  admin: router({
    getDriverApplications: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(500).optional() }).optional())
      .query(async ({ input }) => {
        const rows: any[] = await getAllDriverApplications();
        const limit = input?.limit ?? 200;

        return rows.slice(0, limit).map((r: any) => ({
          id: r.id,
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
          licenseNumber: r.licenseNumber,
          yearsExperience: r.yearsExperience,
          vehicleOwner: r.vehicleOwner,
          availability: r.availability,
          message: typeof r.message === "string" ? r.message.slice(0, 5000) : r.message,
          status: r.status,
          assignedTo: r.assignedTo,
          internalNotes:
            typeof r.internalNotes === "string"
              ? r.internalNotes.slice(0, 5000)
              : r.internalNotes,
          createdAt: r.createdAt,
        }));
      }),

    updateDriverStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "reviewing", "approved", "rejected"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateDriverApplicationStatus(input.id, input.status);
        return { success: true };
      }),

    updateDriverNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => {
        await updateDriverApplicationNotes(input.id, input.notes);
        return { success: true };
      }),

    updateDriverAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input }) => {
        await updateDriverApplicationAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    getCorporateInquiries: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(500).optional() }).optional())
      .query(async ({ input }) => {
        const rows: any[] = await getAllCorporateInquiries();
        const limit = input?.limit ?? 200;

        return rows.slice(0, limit).map((r: any) => ({
          id: r.id,
          companyName: r.companyName,
          contactName: r.contactName,
          email: r.email,
          phone: r.phone,
          estimatedMonthlyTrips: r.estimatedMonthlyTrips,
          requirements:
            typeof r.requirements === "string"
              ? r.requirements.slice(0, 5000)
              : r.requirements,
          status: r.status,
          assignedTo: r.assignedTo,
          internalNotes:
            typeof r.internalNotes === "string"
              ? r.internalNotes.slice(0, 5000)
              : r.internalNotes,
          createdAt: r.createdAt,
        }));
      }),

    updateCorporateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "contacted", "converted", "declined"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateCorporateInquiryStatus(input.id, input.status);
        return { success: true };
      }),

    updateCorporateNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => {
        await updateCorporateInquiryNotes(input.id, input.notes);
        return { success: true };
      }),

    updateCorporateAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input }) => {
        await updateCorporateInquiryAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    getContactMessages: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(500).optional() }).optional())
      .query(async ({ input }) => {
        const rows: any[] = await getAllContactMessages();
        const limit = input?.limit ?? 200;

        return rows.slice(0, limit).map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          subject: r.subject,
          message: typeof r.message === "string" ? r.message.slice(0, 5000) : r.message,
          isRead: r.isRead,
          assignedTo: r.assignedTo,
          internalNotes:
            typeof r.internalNotes === "string"
              ? r.internalNotes.slice(0, 5000)
              : r.internalNotes,
          createdAt: r.createdAt,
        }));
      }),

    markContactRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markContactMessageAsRead(input.id);
        return { success: true };
      }),

    updateContactNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => {
        await updateContactMessageNotes(input.id, input.notes);
        return { success: true };
      }),

    updateContactAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input }) => {
        await updateContactMessageAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    sendEmail: adminProcedure
      .input(
        z.object({
          to: z.string().email(),
          subject: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return {
          success: await sendEmail({
            to: input.to,
            subject: input.subject,
            html: input.message.replace(/\n/g, "<br/>"),
          }),
        };
      }),

    sendTemplateEmail: adminProcedure
      .input(
        z.object({
          to: z.string().email(),
          templateType: z.string(),
          variables: z.record(z.string(), z.string()),
        })
      )
      .mutation(async ({ input }) => {
        const template = emailTemplates[input.templateType as EmailTemplateType];
        if (!template) throw new Error("Invalid template type");

        let subject = template.subject;
        let body = template.body;

        Object.entries(input.variables).forEach(([k, v]) => {
          subject = subject.replace(new RegExp(`\\{${k}\\}`, "g"), v);
          body = body.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });

        return {
          success: await sendEmail({
            to: input.to,
            subject,
            html: body.replace(/\n/g, "<br/>"),
          }),
        };
      }),

    getTeamMembers: adminProcedure.query(getAllTeamMembers),

    createTeamMember: adminProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email().optional(),
          role: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createTeamMember(input.name, input.email, input.role);
      }),

    updateTeamMember: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTeamMember(id, data);
        return { success: true };
      }),

    deleteTeamMember: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTeamMember(input.id);
        return { success: true };
      }),

    /* ==============================
       ✅ Phase 1 - Admin Onboarding
       ============================== */

    sendDriverOnboardingLink: adminProcedure
      .input(z.object({ driverApplicationId: z.number() }))
      .mutation(async ({ input }) => {
        const apps: any[] = await getAllDriverApplications();
        const app = apps.find(
          (a) => Number(a.id) === Number(input.driverApplicationId)
        );

        if (!app) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Driver application not found",
          });
        }

        const rawToken = nanoid(32);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await createDriverOnboardingToken({
          driverApplicationId: Number(app.id),
          rawToken,
          expiresAt,
        });

        const link = `${getPublicBaseUrl()}/driver/onboarding?token=${rawToken}`;

        const html = `
          <p>Hi ${app.fullName || "Driver"},</p>
          <p>Please complete your driver onboarding by uploading your documents and vehicle details:</p>
          <p><a href="${link}">${link}</a></p>
          <p>This link expires in 7 days.</p>
          <p>Cloud Cars</p>
        `;

        const ok = await sendEmail({
          to: app.email,
          subject: "Complete your driver onboarding",
          html,
        });

        // ✅ IMPORTANT: if Mailgun fails, throw so the frontend shows an error
        if (!ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Mailgun failed to send onboarding email. Check Railway variables.",
          });
        }

        return { success: true, link };
      }),

    getDriverOnboardingProfile: adminProcedure
      .input(z.object({ driverApplicationId: z.number() }))
      .query(async ({ input }) => {
        return await getDriverOnboardingProfile(input.driverApplicationId);
      }),

    reviewDriverDocument: adminProcedure
      .input(
        z.object({
          docId: z.number(),
          status: z.enum(["approved", "rejected"]),
          rejectionReason: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await setDriverDocumentReview({
          docId: input.docId,
          status: input.status,
          reviewedBy:
  (ctx.user as any)?.email ||
  (ctx.user as any)?.username ||
  String((ctx.user as any)?.id ?? "") ||
  "admin",
          rejectionReason: input.rejectionReason ?? null,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;