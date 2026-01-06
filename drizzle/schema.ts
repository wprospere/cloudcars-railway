import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Team members (admin dashboard staff)
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Public users (auth)
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bookings
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }).notNull(),
  serviceType: mysqlEnum("serviceType", [
    "standard",
    "courier",
    "airport",
    "executive",
  ]).notNull(),
  pickupAddress: text("pickupAddress").notNull(),
  destinationAddress: text("destinationAddress").notNull(),
  pickupDate: varchar("pickupDate", { length: 32 }).notNull(),
  pickupTime: varchar("pickupTime", { length: 16 }).notNull(),
  passengers: int("passengers").default(1).notNull(),
  specialRequests: text("specialRequests"),
  estimatedPrice: int("estimatedPrice"),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Driver applications
 */
export const driverApplications = mysqlTable("driver_applications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 64 }).notNull(),
  yearsExperience: int("yearsExperience").notNull(),
  vehicleOwner: boolean("vehicleOwner").default(false).notNull(),
  vehicleType: varchar("vehicleType", { length: 128 }),
  availability: mysqlEnum("availability", [
    "fulltime",
    "parttime",
    "weekends",
  ]).notNull(),
  message: text("message"),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  status: mysqlEnum("status", [
    "pending",
    "reviewing",
    "approved",
    "rejected",
  ]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

/**
 * Corporate inquiries
 */
export const corporateInquiries = mysqlTable("corporate_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  estimatedMonthlyTrips: varchar("estimatedMonthlyTrips", { length: 64 }),
  requirements: text("requirements"),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  status: mysqlEnum("status", [
    "pending",
    "contacted",
    "converted",
    "declined",
  ]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorporateInquiry = typeof corporateInquiries.$inferSelect;
export type InsertCorporateInquiry = typeof corporateInquiries.$inferInsert;

/**
 * Contact messages
 */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * CMS site content (MATCHES Railway camelCase columns)
 */
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  sectionKey: varchar("sectionKey", { length: 128 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: varchar("buttonText", { length: 128 }),
  buttonLink: varchar("buttonLink", { length: 255 }),
  extraData: text("extraData"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

/**
 * CMS site images (MATCHES Railway camelCase columns)
 */
export const siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),
  imageKey: varchar("imageKey", { length: 128 }).notNull().unique(),
  url: text("url").notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteImage = typeof siteImages.$inferSelect;
export type InsertSiteImage = typeof siteImages.$inferInsert;

/**
 * Admin users
 */
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "staff"]).default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

export const __schemaVersion = "schema-aligned-with-railway";

/**
 * Driver onboarding tokens (Phase 1.5 - hardened secure link)
 *
 * ✅ Supports:
 * - Auto-expire (expiresAt)
 * - Lock after submit (usedAt)
 * - Prevent re-use (usedAt check)
 * - Resend link (revokedAt + lastSentAt + sendCount)
 *
 * NOTE:
 * - You store tokenHash (good). Your email link contains the RAW token.
 * - On validate/consume, hash(rawToken) and match tokenHash.
 */
export const driverOnboardingTokens = mysqlTable(
  "driver_onboarding_tokens",
  {
    id: int("id").autoincrement().primaryKey(),

    driverApplicationId: int("driverApplicationId").notNull(),

    // store hashed token (safer than raw token)
    tokenHash: varchar("tokenHash", { length: 128 }).notNull(),

    // ✅ hardening fields
    expiresAt: timestamp("expiresAt").notNull(),
    usedAt: timestamp("usedAt"),
    revokedAt: timestamp("revokedAt"),

    // ✅ resend tracking (optional but recommended)
    lastSentAt: timestamp("lastSentAt"),
    sendCount: int("sendCount").default(0).notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    // hashed token must be unique
    tokenHashUnique: uniqueIndex("ux_driver_onboarding_token_hash").on(t.tokenHash),

    // lookups by application are common in admin
    appIdx: index("ix_driver_onboarding_app").on(t.driverApplicationId),

    // optional: useful for cleanup jobs
    expiresIdx: index("ix_driver_onboarding_expires").on(t.expiresAt),
  })
);

export type DriverOnboardingToken = typeof driverOnboardingTokens.$inferSelect;
export type InsertDriverOnboardingToken = typeof driverOnboardingTokens.$inferInsert;

/**
 * Driver vehicle details (Phase 1)
 */
export const driverVehicles = mysqlTable("driver_vehicles", {
  id: int("id").autoincrement().primaryKey(),
  driverApplicationId: int("driverApplicationId").notNull(),

  registration: varchar("registration", { length: 32 }).notNull(),
  make: varchar("make", { length: 64 }).notNull(),
  model: varchar("model", { length: 64 }).notNull(),
  colour: varchar("colour", { length: 32 }).notNull(),

  year: varchar("year", { length: 8 }),
  plateNumber: varchar("plateNumber", { length: 64 }),
  capacity: varchar("capacity", { length: 8 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DriverVehicle = typeof driverVehicles.$inferSelect;
export type InsertDriverVehicle = typeof driverVehicles.$inferInsert;

/**
 * Driver documents (uploads + review + expiry)
 */
export const driverDocuments = mysqlTable("driver_documents", {
  id: int("id").autoincrement().primaryKey(),
  driverApplicationId: int("driverApplicationId").notNull(),

  type: mysqlEnum("type", [
    "LICENSE_FRONT",
    "LICENSE_BACK",
    "BADGE",
    "PLATING",
    "INSURANCE",
    "MOT",
  ]).notNull(),

  fileUrl: text("fileUrl").notNull(),

  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),

  // use DATE (not timestamp) for expiry clarity
  expiryDate: date("expiryDate"),

  rejectionReason: text("rejectionReason"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: varchar("reviewedBy", { length: 320 }),
});

export type DriverDocument = typeof driverDocuments.$inferSelect;
export type InsertDriverDocument = typeof driverDocuments.$inferInsert;
