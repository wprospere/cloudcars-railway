// server/routers.ts
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

  // Admin activity (timeline)
  getAdminActivityForEntity,

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
  resendDriverOnboardingToken,
  getDriverOnboardingByToken,
  markDriverOnboardingTokenUsed,
  upsertDriverVehicle,
  upsertDriverDocument,
  getDriverOnboardingProfile,
  setDriverDocumentReview,
  reviewDriverDocumentByAppAndType,

  // ✅ reminder event
  logDriverOnboardingReminder,
} from "./db";

// ✅ FIX: import refreshUrlFromStored from storage.ts (single source of truth)
import { storagePut, storageGet, refreshUrlFromStored } from "./storage";

import { sendEmail, notifyOwner } from "./railway-email";
import { emailTemplates, EmailTemplateType } from "./emailTemplates";

/* ----------------------------------------
   ✅ CRON helpers (INLINE)
---------------------------------------- */
function requireCronKey(providedKey: string) {
  const expected = process.env.CRON_KEY;

  if (!expected) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "CRON_KEY is not set on the server",
    });
  }

  if (!providedKey || providedKey !== expected) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid cron key",
    });
  }
}

/**
 * ✅ Safe stub to unblock deploy.
 * Replace later with real reminder logic.
 */
async function runAutoOnboardingReminders(): Promise<{
  checked: number;
  sent: number;
  skipped: number;
}> {
  return { checked: 0, sent: 0, skipped: 0 };
}

/* ----------------------------------------
   Admin-only middleware
---------------------------------------- */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.user as any)?.role;
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

const DRIVER_APP_STATUSES = [
  "pending",
  "reviewing",
  "link_sent",
  "docs_received",
  "approved",
  "rejected",
] as const;

function getPublicBaseUrl() {
  // ✅ Default to apex (safer if www not attached)
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.VITE_PUBLIC_BASE_URL ||
    "https://cloudcarsltd.com"
  );
}

/** ✅ Pull best-available admin identifier for audit attribution. */
function getAdminEmail(ctx: any): string | null {
  return (
    (ctx.user as any)?.email ||
    (ctx.user as any)?.username ||
    (typeof (ctx.user as any)?.id !== "undefined"
      ? String((ctx.user as any).id)
      : null) ||
    null
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
        } as any);

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
          } as any);

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
        } as any);

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
        } as any);

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
      .query(async ({ input }) => {
        const row =
          (await getSiteImage(input.imageKey)) ?? {
            imageKey: input.imageKey,
            url: null,
            altText: null,
            caption: null,
          };

        const freshUrl = await refreshUrlFromStored(row.url);
        return { ...row, url: freshUrl };
      }),

    getAllImages: publicProcedure.query(async () => {
      const rows = await getAllSiteImages();
      const refreshed = await Promise.all(
        (rows ?? []).map(async (r: any) => {
          const freshUrl = await refreshUrlFromStored(r?.url ?? null);
          return { ...r, url: freshUrl };
        })
      );
      return refreshed;
    }),

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
        } as any);
        return { success: true };
      }),

    /**
     * Uploads a CMS image:
     * - Stores KEY in DB (stable)
     * - Returns signed URL for immediate preview
     */
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

        // ✅ STORE KEY (NOT expiring URL)
        const { key } = await storagePut(filename, buffer, input.mimeType);

        await upsertSiteImage({
          imageKey: input.imageKey,
          url: key, // ✅ store key in DB
          altText: input.altText ?? null,
          caption: input.caption ?? null,
        } as any);

        // ✅ return fresh URL for admin preview
        const fresh = await storageGet(key);
        return { success: true, url: fresh.url, key };
      }),

    deleteImage: adminProcedure
      .input(z.object({ imageKey: z.string() }))
      .mutation(async ({ input }) => {
        await deleteSiteImage(input.imageKey);
        return { success: true };
      }),
  }),

  /* =======================================================================
     ✅ DRIVER ONBOARDING (Public token-based)
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

        // ✅ Refresh doc urls (we store KEYS in DB)
        const profile = await getDriverOnboardingProfile(
          (tokenRow as any).driverApplicationId
        );

        const documents = await Promise.all(
          (profile?.documents ?? []).map(async (d: any) => ({
            ...d,
            fileUrl: await refreshUrlFromStored(d?.fileUrl ?? null),
          }))
        );

        return { ...profile, documents };
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
        } as any);

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
        const keyPath = `drivers/${(tokenRow as any).driverApplicationId}/${
          input.type
        }-${nanoid(10)}.${ext}`;

        // ✅ store KEY
        const { key } = await storagePut(keyPath, buffer, input.mimeType);

        await upsertDriverDocument({
          driverApplicationId: (tokenRow as any).driverApplicationId,
          type: input.type as any,
          fileUrl: key, // ✅ store key (not signed url)
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        } as any);

        const fresh = await storageGet(key);
        return { success: true, url: fresh.url, key };
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
    /**
     * ✅ CRON endpoint – automatic onboarding reminders
     * Protected by CRON_KEY (not admin/staff auth)
     */
    runAutoOnboardingReminders: publicProcedure
      .input(z.object({ key: z.string().min(10) }))
      .mutation(async ({ input }) => {
        requireCronKey(input.key);
        const result = await runAutoOnboardingReminders();
        return { success: true, ...result };
      }),

    /* ============================
       Inquiries lists
    ============================ */
    getDriverApplications: adminProcedure
      .input(
        z.object({ limit: z.number().min(1).max(500).optional() }).optional()
      )
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
          message:
            typeof r.message === "string" ? r.message.slice(0, 5000) : r.message,
          status: r.status,
          assignedTo: r.assignedTo,

          assignedToEmail: r.assignedToEmail ?? null,
          assignedToAdminId: r.assignedToAdminId ?? null,
          lastTouchedAt: r.lastTouchedAt ?? null,
          lastTouchedByEmail: r.lastTouchedByEmail ?? null,

          internalNotes:
            typeof r.internalNotes === "string"
              ? r.internalNotes.slice(0, 5000)
              : r.internalNotes,
          createdAt: r.createdAt,

          documents: Array.isArray(r.documents) ? r.documents : [],
        }));
      }),

    updateDriverStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(DRIVER_APP_STATUSES),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateDriverApplicationStatus(
          input.id,
          input.status as any,
          adminEmail
        );
        return { success: true };
      }),

    updateDriverNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateDriverApplicationNotes(input.id, input.notes, adminEmail);
        return { success: true };
      }),

    updateDriverAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateDriverApplicationAssignment(
          input.id,
          input.assignedTo,
          adminEmail
        );
        return { success: true };
      }),

    getCorporateInquiries: adminProcedure
      .input(
        z.object({ limit: z.number().min(1).max(500).optional() }).optional()
      )
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
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateCorporateInquiryStatus(input.id, input.status, adminEmail);
        return { success: true };
      }),

    updateCorporateNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateCorporateInquiryNotes(input.id, input.notes, adminEmail);
        return { success: true };
      }),

    updateCorporateAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateCorporateInquiryAssignment(
          input.id,
          input.assignedTo,
          adminEmail
        );
        return { success: true };
      }),

    getContactMessages: adminProcedure
      .input(
        z.object({ limit: z.number().min(1).max(500).optional() }).optional()
      )
      .query(async ({ input }) => {
        const rows: any[] = await getAllContactMessages();
        const limit = input?.limit ?? 200;

        return rows.slice(0, limit).map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          subject: r.subject,
          message:
            typeof r.message === "string" ? r.message.slice(0, 5000) : r.message,
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
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await markContactMessageAsRead(input.id, adminEmail);
        return { success: true };
      }),

    updateContactNotes: adminProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateContactMessageNotes(input.id, input.notes, adminEmail);
        return { success: true };
      }),

    updateContactAssignment: adminProcedure
      .input(z.object({ id: z.number(), assignedTo: z.string().nullable() }))
      .mutation(async ({ input, ctx }) => {
        const adminEmail = getAdminEmail(ctx);
        await updateContactMessageAssignment(
          input.id,
          input.assignedTo,
          adminEmail
        );
        return { success: true };
      }),

    /* ============================
       Admin activity timeline
    ============================ */
    getActivity: adminProcedure
      .input(
        z.object({
          entityType: z.enum([
            "driver_application",
            "corporate_inquiry",
            "contact_message",
          ]),
          entityId: z.number(),
          limit: z.number().min(1).max(200).optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAdminActivityForEntity({
          entityType: input.entityType,
          entityId: input.entityId,
          limit: input.limit ?? 50,
        });
      }),

    /* ============================
       Email tools
    ============================ */
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

    /* ============================
       Team
    ============================ */
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
        await updateTeamMember(id, data as any);
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
      .mutation(async ({ input, ctx }) => {
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
        const adminEmail = getAdminEmail(ctx);

        await createDriverOnboardingToken({
          driverApplicationId: Number(app.id),
          rawToken,
          expiresAt,
          sentNow: true,
          adminEmail,
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

        if (!ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Mailgun failed to send onboarding email. Check Railway variables.",
          });
        }

        return { success: true, link };
      }),

    resendDriverOnboardingLink: adminProcedure
      .input(
        z.object({
          driverApplicationId: z.number(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
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

        const adminEmail = getAdminEmail(ctx);

        const rawToken = nanoid(32);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await resendDriverOnboardingToken({
          driverApplicationId: Number(app.id),
          rawToken,
          expiresAt,
          adminEmail,
        });

        const link = `${getPublicBaseUrl()}/driver/onboarding?token=${rawToken}`;

        const html = `
          <p>Hi ${app.fullName || "Driver"},</p>
          <p>Here is your updated secure onboarding link (this replaces any previous link):</p>
          <p><a href="${link}">${link}</a></p>
          <p>This link expires in 7 days.</p>
          ${
            input.message
              ? `<p>${String(input.message).replace(/\n/g, "<br/>")}</p>`
              : ""
          }
          <p>Cloud Cars</p>
        `;

        const ok = await sendEmail({
          to: app.email,
          subject: "Your updated driver onboarding link",
          html,
        });

        if (!ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Failed to send onboarding email. Check Railway Mailgun variables.",
          });
        }

        return { success: true, link };
      }),

    sendDriverOnboardingReminder: adminProcedure
      .input(
        z.object({
          driverApplicationId: z.number(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
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

        const adminEmail = getAdminEmail(ctx);

        await logDriverOnboardingReminder({
          driverApplicationId: Number(app.id),
          adminEmail,
          channel: "email",
        });

        const html = `
          <p>Hi ${app.fullName || "Driver"},</p>
          <p>This is a quick reminder to complete your driver onboarding documents.</p>
          ${
            input.message
              ? `<p>${String(input.message).replace(/\n/g, "<br/>")}</p>`
              : ""
          }
          <p>Cloud Cars</p>
        `;

        const ok = await sendEmail({
          to: app.email,
          subject: "Reminder: complete your driver onboarding",
          html,
        });

        if (!ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send reminder email.",
          });
        }

        return { success: true };
      }),

    getDriverOnboardingProfile: adminProcedure
      .input(z.object({ driverApplicationId: z.number() }))
      .query(async ({ input }) => {
        // ✅ Refresh doc urls for admin UI too
        const profile = await getDriverOnboardingProfile(input.driverApplicationId);

        const documents = await Promise.all(
          (profile?.documents ?? []).map(async (d: any) => ({
            ...d,
            fileUrl: await refreshUrlFromStored(d?.fileUrl ?? null),
          }))
        );

        return { ...profile, documents };
      }),

    reviewDriverDocument: adminProcedure
      .input(
        z
          .object({
            docId: z.number().optional(),
            driverApplicationId: z.number().optional(),
            type: z.enum(DRIVER_DOC_TYPES).optional(),
            status: z.enum(["approved", "rejected"]),
            rejectionReason: z.string().optional(),
          })
          .refine(
            (v) =>
              typeof v.docId === "number" ||
              (typeof v.driverApplicationId === "number" && !!v.type),
            {
              message:
                "Provide either docId OR (driverApplicationId + type) to review a document.",
            }
          )
      )
      .mutation(async ({ input, ctx }) => {
        const reviewedBy = getAdminEmail(ctx) || "admin";

        if (input.status === "rejected") {
          const reason = (input.rejectionReason ?? "").trim();
          if (!reason) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Rejection reason is required when rejecting a document.",
            });
          }
        }

        if (typeof input.docId === "number") {
          await setDriverDocumentReview({
            docId: input.docId,
            status: input.status,
            reviewedBy,
            rejectionReason: input.rejectionReason ?? null,
          } as any);
          return { success: true };
        }

        await reviewDriverDocumentByAppAndType({
          driverApplicationId: Number(input.driverApplicationId),
          type: input.type as any,
          status: input.status,
          reviewedBy,
          rejectionReason: input.rejectionReason ?? null,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
