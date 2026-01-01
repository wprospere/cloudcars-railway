import { initTRPC, TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import superjson from "superjson";
import { eq } from "drizzle-orm";

import { db } from "./db.js";
import { adminUsers } from "../drizzle/schema.js";
import { readAdminIdFromCookie } from "./auth/session.js";

export type AuthedUser = { id: number; role: "admin" | "staff" | "user" };

export const createContext = async ({ req, res }: { req: Request; res: Response }) => {
  let user: AuthedUser | null = null;

  try {
    const adminId = readAdminIdFromCookie(req);

    if (adminId) {
      const rows = await db
        .select({ id: adminUsers.id, role: adminUsers.role })
        .from(adminUsers)
        .where(eq(adminUsers.id, adminId))
        .limit(1);

      const admin = rows[0];
      if (admin) user = { id: admin.id, role: admin.role as any };
    }
  } catch (e) {
    // don't crash context
    user = null;
  }

  return { req, res, user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Requires a logged-in admin/staff user (cookie-based)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
  }
  return next({ ctx });
});
