import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers"; // ✅ FIXED PATH

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClientOptions() {
  return {
    links: [
      httpLink({
        url: "/api/trpc", // ✅ match your server route
        fetch(url, options) {
          return fetch(url, { ...options, credentials: "include" });
        },
      }),
    ],
  };
}
