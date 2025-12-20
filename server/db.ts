import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  InsertBooking, bookings,
  InsertDriverApplication, driverApplications,
  InsertCorporateInquiry, corporateInquiries,
  InsertContactMessage, contactMessages,
  InsertSiteContent, siteContent,
  InsertSiteImage, siteImages,
  teamMembers
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// User functions
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Booking functions
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bookings).values(booking);
  return { id: result[0].insertId };
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Driver application functions
export async function createDriverApplication(application: InsertDriverApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(driverApplications).values(application);
  return { id: result[0].insertId };
}

// Corporate inquiry functions
export async function createCorporateInquiry(inquiry: InsertCorporateInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(corporateInquiries).values(inquiry);
  return { id: result[0].insertId };
}

// Contact message functions
export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contactMessages).values(message);
  return { id: result[0].insertId };
}

// CMS Site Content functions
export async function getSiteContent(sectionKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(siteContent).where(eq(siteContent.sectionKey, sectionKey)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSiteContent() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(siteContent);
}

export async function upsertSiteContent(content: InsertSiteContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(siteContent).values(content).onDuplicateKeyUpdate({
    set: {
      title: content.title,
      subtitle: content.subtitle,
      description: content.description,
      buttonText: content.buttonText,
      buttonLink: content.buttonLink,
      extraData: content.extraData,
    },
  });
}

// CMS Site Images functions
export async function getSiteImage(imageKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(siteImages).where(eq(siteImages.imageKey, imageKey)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSiteImages() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(siteImages);
}

export async function upsertSiteImage(image: InsertSiteImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(siteImages).values(image).onDuplicateKeyUpdate({
    set: {
      url: image.url,
      altText: image.altText,
      caption: image.caption,
    },
  });
}

export async function deleteSiteImage(imageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(siteImages).where(eq(siteImages.imageKey, imageKey));
}

// Driver application management functions
export async function getAllDriverApplications() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(driverApplications).orderBy(desc(driverApplications.createdAt));
}

export async function updateDriverApplicationStatus(id: number, status: "pending" | "reviewing" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(driverApplications).set({ status }).where(eq(driverApplications.id, id));
}

export async function updateDriverApplicationNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(driverApplications).set({ internalNotes: notes }).where(eq(driverApplications.id, id));
}

export async function updateDriverApplicationAssignment(id: number, assignedTo: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(driverApplications).set({ assignedTo }).where(eq(driverApplications.id, id));
}

// Corporate inquiry management functions
export async function getAllCorporateInquiries() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(corporateInquiries).orderBy(desc(corporateInquiries.createdAt));
}

export async function updateCorporateInquiryStatus(id: number, status: "pending" | "contacted" | "converted" | "declined") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(corporateInquiries).set({ status }).where(eq(corporateInquiries.id, id));
}

export async function updateCorporateInquiryNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(corporateInquiries).set({ internalNotes: notes }).where(eq(corporateInquiries.id, id));
}

export async function updateCorporateInquiryAssignment(id: number, assignedTo: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(corporateInquiries).set({ assignedTo }).where(eq(corporateInquiries.id, id));
}

// Contact message management functions
export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markContactMessageAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
}

export async function updateContactMessageNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactMessages).set({ internalNotes: notes }).where(eq(contactMessages.id, id));
}

export async function updateContactMessageAssignment(id: number, assignedTo: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactMessages).set({ assignedTo }).where(eq(contactMessages.id, id));
}

// ============================================================================
// Team Members Management
// ============================================================================

export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(teamMembers.name);
}

export async function createTeamMember(name: string, email?: string, role?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [member] = await db.insert(teamMembers).values({ name, email, role }).$returningId();
  return member;
}

export async function updateTeamMember(id: number, data: { name?: string; email?: string; role?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Soft delete by setting isActive to false
  await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, id));
}
