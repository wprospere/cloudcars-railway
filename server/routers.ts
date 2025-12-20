import { publicProcedure, protectedProcedure, router } from "./railway-trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { 
  createBooking, 
  createDriverApplication, 
  createCorporateInquiry, 
  createContactMessage,
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
  getSiteContent,
  getAllSiteContent,
  upsertSiteContent,
  getSiteImage,
  getAllSiteImages,
  upsertSiteImage,
  deleteSiteImage,
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { sendEmail, notifyOwner } from "./railway-email";
import { emailTemplates, EmailTemplateType } from "./emailTemplates";

// Admin-only procedure middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Quote calculation helper
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
  
  const base = baseRates[serviceType] || 350;
  const perMile = perMileRates[serviceType] || 180;
  
  return base + Math.round(distance * perMile);
}

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),

  // Booking procedures
  booking: router({
    create: publicProcedure
      .input(z.object({
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
      }))
      .mutation(async ({ input }) => {
        const result = await createBooking({
          ...input,
          specialRequests: input.specialRequests || null,
          estimatedPrice: input.estimatedPrice || null,
        });
        return { success: true, bookingId: result.id };
      }),

    getQuote: publicProcedure
      .input(z.object({
        serviceType: z.enum(["standard", "courier", "airport", "executive"]),
        estimatedMiles: z.number().min(0),
      }))
      .query(({ input }) => {
        const quote = calculateQuote(input.serviceType, input.estimatedMiles);
        return { 
          estimatedPrice: quote,
          formattedPrice: `£${(quote / 100).toFixed(2)}`,
          serviceType: input.serviceType,
        };
      }),
  }),

  // Driver application procedures
  driver: router({
    submitApplication: publicProcedure
      .input(z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        licenseNumber: z.string().min(1),
        yearsExperience: z.number().min(0),
        vehicleOwner: z.boolean().default(false),
        vehicleType: z.string().optional(),
        availability: z.enum(["fulltime", "parttime", "weekends"]),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createDriverApplication({
          ...input,
          vehicleType: input.vehicleType || null,
          message: input.message || null,
          internalNotes: null,
          assignedTo: null,
        });
        
        // Send owner notification
        await notifyOwner({
          title: "New Driver Application",
          content: `${input.fullName} applied to be a driver. ${input.yearsExperience} years experience. Phone: ${input.phone}`
        });
        
        return { success: true, applicationId: result.id };
      }),
  }),

  // Corporate inquiry procedures
  corporate: router({
    inquire: publicProcedure
      .input(z.object({
        companyName: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        estimatedMonthlyTrips: z.string().optional(),
        requirements: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createCorporateInquiry({
          ...input,
          estimatedMonthlyTrips: input.estimatedMonthlyTrips || null,
          requirements: input.requirements || null,
          internalNotes: null,
          assignedTo: null,
        });
        
        // Send owner notification
        await notifyOwner({
          title: "New Corporate Inquiry",
          content: `${input.companyName} (${input.contactName}) inquired about corporate accounts. Email: ${input.email}`
        });
        
        return { success: true, inquiryId: result.id };
      }),
  }),

  // Contact procedures
  contact: router({
    send: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await createContactMessage({
          ...input,
          phone: input.phone || null,
          internalNotes: null,
          assignedTo: null,
        });
        
        // Send owner notification
        await notifyOwner({
          title: "New Contact Message",
          content: `${input.name} sent a message: ${input.subject}. Email: ${input.email}`
        });
        
        return { success: true, messageId: result.id };
      }),
  }),

  // CMS procedures - public read, admin write
  cms: router({
    // Public: Get content for a section
    getContent: publicProcedure
      .input(z.object({ sectionKey: z.string() }))
      .query(async ({ input }) => {
        const content = await getSiteContent(input.sectionKey);
        // Return default object if content doesn't exist to prevent undefined errors
        return content || {
          sectionKey: input.sectionKey,
          title: null,
          subtitle: null,
          description: null,
          buttonText: null,
          buttonLink: null,
          extraData: null,
        };
      }),

    // Public: Get all content (for frontend hydration)
    getAllContent: publicProcedure.query(async () => {
      return await getAllSiteContent();
    }),

    // Public: Get a single image
    getImage: publicProcedure
      .input(z.object({ imageKey: z.string() }))
      .query(async ({ input }) => {
        const image = await getSiteImage(input.imageKey);
        // Return default object if image doesn't exist to prevent undefined errors
        return image || {
          imageKey: input.imageKey,
          url: null,
          altText: null,
          caption: null,
        };
      }),

    // Public: Get all images
    getAllImages: publicProcedure.query(async () => {
      return await getAllSiteImages();
    }),

    // Admin: Update content
    updateContent: adminProcedure
      .input(z.object({
        sectionKey: z.string().min(1),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        extraData: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertSiteContent({
          sectionKey: input.sectionKey,
          title: input.title || null,
          subtitle: input.subtitle || null,
          description: input.description || null,
          buttonText: input.buttonText || null,
          buttonLink: input.buttonLink || null,
          extraData: input.extraData || null,
        });
        return { success: true };
      }),

    // Admin: Upload image
    uploadImage: adminProcedure
      .input(z.object({
        imageKey: z.string().min(1),
        base64Data: z.string().min(1),
        mimeType: z.string().default("image/png"),
        altText: z.string().optional(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.base64Data, 'base64');
        
        // Generate unique filename
        const extension = input.mimeType.split('/')[1] || 'png';
        const filename = `cms/${input.imageKey}-${nanoid(8)}.${extension}`;
        
        // Upload to S3
        const { url } = await storagePut(filename, buffer, input.mimeType);
        
        // Save to database
        await upsertSiteImage({
          imageKey: input.imageKey,
          url,
          altText: input.altText || null,
          caption: input.caption || null,
        });
        
        return { success: true, url };
      }),

    // Admin: Delete image
    deleteImage: adminProcedure
      .input(z.object({ imageKey: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await deleteSiteImage(input.imageKey);
        return { success: true };
      }),
  }),

  // Admin inquiry management procedures
  admin: router({
    // Get all driver applications
    getDriverApplications: adminProcedure.query(async () => {
      return await getAllDriverApplications();
    }),

    // Update driver application status
    updateDriverStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewing", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        await updateDriverApplicationStatus(input.id, input.status);
        return { success: true };
      }),

    // Update driver application notes
    updateDriverNotes: adminProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateDriverApplicationNotes(input.id, input.notes);
        return { success: true };
      }),

    // Update driver application assignment
    updateDriverAssignment: adminProcedure
      .input(z.object({
        id: z.number(),
        assignedTo: z.string().nullable(),
      }))
      .mutation(async ({ input }) => {
        await updateDriverApplicationAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    // Get all corporate inquiries
    getCorporateInquiries: adminProcedure.query(async () => {
      return await getAllCorporateInquiries();
    }),

    // Update corporate inquiry status
    updateCorporateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "contacted", "converted", "declined"]),
      }))
      .mutation(async ({ input }) => {
        await updateCorporateInquiryStatus(input.id, input.status);
        return { success: true };
      }),

    // Update corporate inquiry notes
    updateCorporateNotes: adminProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateCorporateInquiryNotes(input.id, input.notes);
        return { success: true };
      }),

    // Update corporate inquiry assignment
    updateCorporateAssignment: adminProcedure
      .input(z.object({
        id: z.number(),
        assignedTo: z.string().nullable(),
      }))
      .mutation(async ({ input }) => {
        await updateCorporateInquiryAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    // Get all contact messages
    getContactMessages: adminProcedure.query(async () => {
      return await getAllContactMessages();
    }),

    // Mark contact message as read
    markContactRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markContactMessageAsRead(input.id);
        return { success: true };
      }),

    // Update contact message notes
    updateContactNotes: adminProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateContactMessageNotes(input.id, input.notes);
        return { success: true };
      }),

    // Update contact message assignment
    updateContactAssignment: adminProcedure
      .input(z.object({
        id: z.number(),
        assignedTo: z.string().nullable(),
      }))
      .mutation(async ({ input }) => {
        await updateContactMessageAssignment(input.id, input.assignedTo);
        return { success: true };
      }),

    // Send email from dashboard
    sendEmail: adminProcedure
      .input(z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const success = await sendEmail({
          to: input.to,
          subject: input.subject,
          text: input.message,
        });
        return { success };
      }),

    // Send email with template
    sendTemplateEmail: adminProcedure
      .input(z.object({
        to: z.string().email(),
        templateType: z.string(),
        variables: z.record(z.string(), z.string()),
      }))
      .mutation(async ({ input }) => {
        const template = emailTemplates[input.templateType as EmailTemplateType];
        if (!template) {
          throw new Error("Invalid template type");
        }

        let subject = template.subject;
        let body = template.body;

        // Replace variables
        Object.entries(input.variables).forEach(([key, value]) => {
          const stringValue = String(value);
          subject = subject.replace(new RegExp(`\\{${key}\\}`, "g"), stringValue);
          body = body.replace(new RegExp(`\\{${key}\\}`, "g"), stringValue);
        });

        const success = await sendEmail({
          to: input.to,
          subject,
          text: body,
        });
        return { success };
      }),

    // Team members management
    getTeamMembers: adminProcedure.query(async () => {
      return await getAllTeamMembers();
    }),

    createTeamMember: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        role: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createTeamMember(input.name, input.email, input.role);
      }),

    updateTeamMember: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.string().optional(),
      }))
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
  }),
});

export type AppRouter = typeof appRouter;
