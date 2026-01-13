import { db } from "../db";
import { adminAuditLog } from "../drizzle/schema";

type AuditEntityType =
  | "driver_application"
  | "corporate_inquiry"
  | "contact_message"
  | "team_member"
  | "site_content"
  | "site_image"
  | "booking"
  | "other";

export async function logAdminAudit(params: {
  adminUserId: number;
  action: string;
  entityType: AuditEntityType;
  entityId?: number | null;
  metadata?: any;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const {
    adminUserId,
    action,
    entityType,
    entityId = null,
    metadata = null,
    ip = null,
    userAgent = null,
  } = params;

  await db.insert(adminAuditLog).values({
    adminUserId,
    action,
    entityType,
    entityId,
    metadata,
    ip,
    userAgent,
  });
}
