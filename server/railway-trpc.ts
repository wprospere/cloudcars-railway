import { initTRPC, TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import superjson from "superjson";
import { eq } from "drizzle-orm";

import { db } from "./db"; // adjust path if needed
import { adminUsers } from "../drizzle/schema"; // adjust path if needed
import { readAdminIdFromCookie } from "./auth/session"; // adjust path if needed

export async function createContext({ req, res }: { req: Request; res: Response }) {
  const adminId = readAdminIdFromCookie(req);

  let user: { role: "admin" | "user"; adminId?: number } | null = null;

  if (adminId) {
    const rows = await db
      .select({ id: adminUsers.id, role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.id, adminId))
      .limit(1);

    const admin = rows[0];
    if (admin) {
      // treat any admin_users record as admin access
      user = { role: "admin", adminId: admin.id };
    }
  }

  return { req, res, user };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// protected = must be logged in
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});
