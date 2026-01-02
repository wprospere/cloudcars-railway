import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "../../server/routers"; // adjust path

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientOptions = {
  links: [
    httpLink({
      url: "/trpc",
      // if you use cookies auth, keep credentials:
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
};
