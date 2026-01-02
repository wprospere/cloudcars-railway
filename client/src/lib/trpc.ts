import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/routers"; // adjust path

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: "/trpc",
      maxBatchSize: 1,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
};
