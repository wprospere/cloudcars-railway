import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./railway-trpc";

// auth.logout is a stub on this site: the website has no user sessions
// (admins sign in through /api/admin with their own cookie), so it just
// reports success and leaves cookies alone.
describe("auth.logout", () => {
  it("reports success without touching cookies", async () => {
    const clearCookie = vi.fn();
    const ctx = {
      user: null,
      req: { protocol: "https", headers: {} },
      res: { clearCookie },
    } as unknown as Context;

    const result = await appRouter.createCaller(ctx).auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearCookie).not.toHaveBeenCalled();
  });
});
