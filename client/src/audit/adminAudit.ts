// server/auth/adminAudit.ts
import { db, schema } from "../db";

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
  adminUserId?: number | null;
  action: string;
  entityType: AuditEntityType;
  entityId?: number | null;
  metadata?: any;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const {
    adminUserId = null,
    action,
    entityType,
    entityId = null,
    metadata = null,
    ip = null,
    userAgent = null,
  } = params;

  // ⚠️ Your drizzle table uses snake_case column names:
  // admin_user_id, entity_type, entity_id, user_agent, created_at
  await db.insert(schema.adminAuditLog).values({
    adminUserId, // maps to admin_user_id
    action,
    entityType, // maps to entity_type
    entityId, // maps to entity_id
    metadata,
    ip,
    userAgent, // maps to user_agent
    // createdAt is default CURRENT_TIMESTAMP in schema
  } as any);

  return { success: true };
}
