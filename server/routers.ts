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
  resendDriverOnboardingToken, // ✅ NEW (fresh secure link)
  getDriverOnboardingByToken,
  markDriverOnboardingTokenUsed,
  upsertDriverVehicle,
  upsertDriverDocument,
  getDriverOnboardingProfile,
  setDriverDocumentReview,
  reviewDriverDocumentByAppAndType,

  // ✅ NEW: reminder event (no token re-issue)
  logDriverOnboardingReminder,
} from "./db";

import { storagePut } from "./storage";
import { sendEmail, notifyOwner } from "./railway-email";
import { emailTemplates, EmailTemplateType } from "./emailTemplates";

/* ----------------------------------------
   ✅ CRON helpers (INLINE)
   Why: Railway/Linux build is case-sensitive and your repo currently
   doesn't include ./onboarding/autoReminders or ./auth/cronKey.
   This unblocks deploy immediately.
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
 * Replace later with real reminder logic (query pending onboardings,
 * send reminder emails, log reminder events).
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
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.VITE_PUBLIC_BASE_URL ||
    "https://www.cloudcarsltd.com"
  );
}

/**
 * ✅ Pull best-available admin identifier for audit attribution.
 */
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
        } as any);
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
        } as any);

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
        const filename = `drivers/${(tokenRow as any).driverApplicationId}/${
          input.type
        }-${nanoid(10)}.${ext}`;

        const { url } = await storagePut(filename, buffer, input.mimeType);

        await upsertDriverDocument({
          driverApplicationId: (tokenRow as any).driverApplicationId,
          type: input.type as any,
          fileUrl: url,
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        } as any);

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

    // ... the rest of your admin router stays the same ...

  }),
});

export type AppRouter = typeof appRouter;
