import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
 * Booking requests from customers
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
  ])
    .default("pending")
    .notNull(),
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
  availability: mysqlEnum("availability", ["fulltime", "parttime", "weekends"])
    .notNull(),
  message: text("message"),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

/**
 * Corporate account inquiries
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
  status: mysqlEnum("status", ["pending", "contacted", "converted", "declined"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorporateInquiry = typeof corporateInquiries.$inferSelect;
export type InsertCorporateInquiry = typeof corporateInquiries.$inferInsert;

/**
 * Contact form messages
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
 * Site content for CMS - editable text sections
 * IMPORTANT: map JS camelCase -> DB snake_case columns
 */
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),

  // DB: section_key
  sectionKey: varchar("section_key", { length: 128 }).notNull().unique(),

  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),

  // DB: button_text, button_link, extra_data
  buttonText: varchar("button_text", { length: 128 }),
  buttonLink: varchar("button_link", { length: 255 }),
  extraData: text("extra_data"), // JSON string for additional flexible content

  // DB: updated_at
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

/**
 * Site images for CMS - uploadable images
 * IMPORTANT: map JS camelCase -> DB snake_case columns
 */
export const siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),

  // DB: image_key
  imageKey: varchar("image_key", { length: 128 }).notNull().unique(),

  url: text("url").notNull(),

  // DB: alt_text
  altText: varchar("alt_text", { length: 255 }),
  caption: text("caption"),

  // DB: updated_at
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SiteImage = typeof siteImages.$inferSelect;
export type InsertSiteImage = typeof siteImages.$inferInsert;

/**
 * Admin/staff users (email + password)
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

// Keep one marker export if you want it
export const __schemaVersion = "schema-has-adminUsers";
