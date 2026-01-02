import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "../../server/routers"; // ✅ FIXED PATH

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClientOptions() {
  return {
    links: [
      httpLink({
        url: "/trpc",
        fetch(url, options) {
          return fetch(url, { ...options, credentials: "include" });
        },
      }),
    ],
  };
}
