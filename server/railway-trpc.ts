import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import superjson from 'superjson';

// Simple context without Manus OAuth
export const createContext = ({ req, res }: { req: Request; res: Response }) => {
  return {
    req,
    res,
    // For Railway, we'll use a simple admin check based on a header or env variable
    // In production, you'd implement proper authentication
    user: null as { role: 'admin' | 'user' } | null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Simple protected procedure - for Railway, we'll skip auth for now
// You can add proper auth later
export const protectedProcedure = t.procedure;
