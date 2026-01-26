import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  json,
  mysqlEnum,
  timestamp,
  boolean,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/* ============================================================================
 * Admin audit log (request-level audit trail)
 * NOTE: Optional legacy table (not required by db.ts timeline feature)
 * ========================================================================== */
export const adminAuditLog = mysqlTable(
  "admin_audit_log",
  {
    id: int("id").autoincrement().primaryKey(),

    // If you don't always have an admin user, consider making nullable later.
    adminUserId: int("admin_user_id").notNull(),

    // e.g. "DRIVER_APP:STATUS_UPDATE", "CONTACT:MARK_READ"
    action: varchar("action", { length: 80 }).notNull(),

    // target entity info (optional but very useful)
    entityType: varchar("entity_type", { length: 40 }).notNull(),
    entityId: int("entity_id"),

    // store extra details (old/new values etc.)
    metadata: json("metadata"),

    // request context
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),

    createdAt: datetime("created_at", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    createdIdx: index("ix_admin_audit_created").on(t.createdAt),
    entityIdx: index("ix_admin_audit_entity").on(t.entityType, t.entityId),
    adminIdx: index("ix_admin_audit_admin").on(t.adminUserId),
  })
);

/* ============================================================================
 * Team members (admin dashboard staff)
 * ========================================================================== */
export const teamMembers = mysqlTable(
  "team_members",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    role: varchar("role", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    activeIdx: index("ix_team_members_active").on(t.isActive),
    emailIdx: index("ix_team_members_email").on(t.email),
  })
);

/* ============================================================================
 * Public users (auth)
 * ========================================================================== */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: index("ix_users_email").on(t.email),
    roleIdx: index("ix_users_role").on(t.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ============================================================================
 * Bookings
 * ========================================================================== */
export const bookings = mysqlTable(
  "bookings",
  {
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
  },
  (t) => ({
    statusIdx: index("ix_bookings_status").on(t.status),
    createdIdx: index("ix_bookings_created").on(t.createdAt),
    emailIdx: index("ix_bookings_email").on(t.customerEmail),
  })
);

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/* ============================================================================
 * Driver applications (matches your updated db.ts)
 * - status includes link_sent + docs_received
 * - ownership fields: assignedToAdminId / assignedToEmail
 * - last touched fields: lastTouchedAt / lastTouchedByEmail
 * - legacy assignedTo/internalNotes retained
 * - ✅ archive fields: archivedAt / archivedByEmail
 * ========================================================================== */
export const driverApplications = mysqlTable(
  "driver_applications",
  {
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

    // legacy (keep)
    internalNotes: text("internalNotes"),
    assignedTo: varchar("assignedTo", { length: 255 }),

    // ✅ new ownership (optional)
    assignedToAdminId: int("assignedToAdminId"),
    assignedToEmail: varchar("assignedToEmail", { length: 320 }),

    // ✅ upgraded status pipeline
    status: mysqlEnum("status", [
      "pending",
      "reviewing",
      "link_sent",
      "docs_received",
      "approved",
      "rejected",
    ])
      .default("pending")
      .notNull(),

    // ✅ last touched
    lastTouchedAt: timestamp("lastTouchedAt"),
    lastTouchedByEmail: varchar("lastTouchedByEmail", { length: 320 }),

    // ✅ archive controls (soft delete)
    archivedAt: timestamp("archivedAt"),
    archivedByEmail: varchar("archivedByEmail", { length: 320 }),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    statusIdx: index("ix_driver_app_status").on(t.status),
    createdIdx: index("ix_driver_app_created").on(t.createdAt),

    // legacy assignment index
    assignedIdx: index("ix_driver_app_assigned").on(t.assignedTo),

    // new ownership + queue indices
    assignedAdminIdx: index("ix_driver_app_assigned_admin").on(
      t.assignedToAdminId
    ),
    assignedEmailIdx: index("ix_driver_app_assigned_email").on(t.assignedToEmail),
    lastTouchedIdx: index("ix_driver_app_last_touched").on(t.lastTouchedAt),

    // ✅ archive filter index
    archivedIdx: index("ix_driver_app_archived").on(t.archivedAt),

    emailIdx: index("ix_driver_app_email").on(t.email),
    phoneIdx: index("ix_driver_app_phone").on(t.phone),
    licenseIdx: index("ix_driver_app_license").on(t.licenseNumber),
  })
);

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

/* ============================================================================
 * Corporate inquiries
 * ========================================================================== */
export const corporateInquiries = mysqlTable(
  "corporate_inquiries",
  {
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
    ])
      .default("pending")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    statusIdx: index("ix_corp_status").on(t.status),
    createdIdx: index("ix_corp_created").on(t.createdAt),
    assignedIdx: index("ix_corp_assigned").on(t.assignedTo),
    emailIdx: index("ix_corp_email").on(t.email),
    phoneIdx: index("ix_corp_phone").on(t.phone),
  })
);

export type CorporateInquiry = typeof corporateInquiries.$inferSelect;
export type InsertCorporateInquiry = typeof corporateInquiries.$inferInsert;

/* ============================================================================
 * Contact messages
 * ========================================================================== */
export const contactMessages = mysqlTable(
  "contact_messages",
  {
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
  },
  (t) => ({
    createdIdx: index("ix_msg_created").on(t.createdAt),
    isReadIdx: index("ix_msg_isread").on(t.isRead),
    assignedIdx: index("ix_msg_assigned").on(t.assignedTo),
    emailIdx: index("ix_msg_email").on(t.email),
  })
);

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/* ============================================================================
 * CMS
 * ========================================================================== */
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

export const siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),
  imageKey: varchar("imageKey", { length: 128 }).notNull().unique(),
  url: text("url").notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/* ============================================================================
 * CMS Policy Docs (Terms / Privacy / Cookies)
 * ========================================================================== */
export const policyDocs = mysqlTable(
  "policy_docs",
  {
    id: int("id").autoincrement().primaryKey(),

    // e.g. "terms", "privacy", "cookies"
    slug: varchar("slug", { length: 64 }).notNull().unique(),

    title: varchar("title", { length: 255 }).notNull(),
    markdown: text("markdown").notNull(),

    // What shows on the public pages ("Last updated: ...")
    lastUpdated: datetime("last_updated", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("ux_policy_docs_slug").on(t.slug),
    updatedIdx: index("ix_policy_docs_updated").on(t.updatedAt),
  })
);

export type PolicyDoc = typeof policyDocs.$inferSelect;
export type InsertPolicyDoc = typeof policyDocs.$inferInsert;

/* ============================================================================
 * Admin users
 * ========================================================================== */
export const adminUsers = mysqlTable(
  "admin_users",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["admin", "staff"]).default("admin").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    roleIdx: index("ix_admin_users_role").on(t.role),
    emailIdx: index("ix_admin_users_email").on(t.email),
  })
);

/* ============================================================================
 * Driver onboarding tokens (Phase 1.5)
 * ========================================================================== */
export const driverOnboardingTokens = mysqlTable(
  "driver_onboarding_tokens",
  {
    id: int("id").autoincrement().primaryKey(),
    driverApplicationId: int("driverApplicationId").notNull(),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    usedAt: timestamp("usedAt"),
    revokedAt: timestamp("revokedAt"),
    lastSentAt: timestamp("lastSentAt"),
    sendCount: int("sendCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    tokenHashUnique: uniqueIndex("ux_driver_onboarding_token_hash").on(
      t.tokenHash
    ),
    appIdx: index("ix_driver_onboarding_app").on(t.driverApplicationId),
    expiresIdx: index("ix_driver_onboarding_expires").on(t.expiresAt),
    lastSentIdx: index("ix_driver_onboarding_last_sent").on(t.lastSentAt),
  })
);

/* ============================================================================
 * Driver vehicles
 * ========================================================================== */
export const driverVehicles = mysqlTable(
  "driver_vehicles",
  {
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
  },
  (t) => ({
    appIdx: index("ix_driver_vehicle_app").on(t.driverApplicationId),
    regIdx: index("ix_driver_vehicle_reg").on(t.registration),
  })
);

/* ============================================================================
 * Driver documents
 * ========================================================================== */
export const driverDocuments = mysqlTable(
  "driver_documents",
  {
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
    expiryDate: date("expiryDate"),
    rejectionReason: text("rejectionReason"),
    uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
    reviewedAt: timestamp("reviewedAt"),
    reviewedBy: varchar("reviewedBy", { length: 320 }),
  },
  (t) => ({
    appIdx: index("ix_driver_docs_app").on(t.driverApplicationId),
    typeIdx: index("ix_driver_docs_type").on(t.type),
    statusIdx: index("ix_driver_docs_status").on(t.status),
    uploadedIdx: index("ix_driver_docs_uploaded").on(t.uploadedAt),
  })
);

/* ============================================================================
 * Admin activity timeline (powers drawer timeline)
 * ========================================================================== */
export const adminActivity = mysqlTable(
  "admin_activity",
  {
    id: int("id").autoincrement().primaryKey(),

    entityType: mysqlEnum("entityType", [
      "driver_application",
      "corporate_inquiry",
      "contact_message",
    ]).notNull(),

    entityId: int("entityId").notNull(),

    action: mysqlEnum("action", [
      "CREATED",
      "STATUS_CHANGED",
      "ASSIGNED",
      "NOTE_ADDED",
      "LINK_SENT",
      "REMINDER_SENT",
      "DOC_REVIEWED",
    ]).notNull(),

    // JSON stored as text for max compatibility
    meta: text("meta"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),

    // keep as email to match reviewedBy usage
    adminEmail: varchar("adminEmail", { length: 320 }),
  },
  (t) => ({
    entityIdx: index("ix_admin_activity_entity").on(t.entityType, t.entityId),
    createdIdx: index("ix_admin_activity_created").on(t.createdAt),
    actionIdx: index("ix_admin_activity_action").on(t.action),
  })
);
