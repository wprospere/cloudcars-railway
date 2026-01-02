import { trpc } from "@/lib/trpc"; // Ensure correct import for trpc client
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client"; // Use httpBatchLink for batching
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

// Redirect user to login if unauthorized
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized =
    error.message === UNAUTHED_ERR_MSG || error.data?.code === "UNAUTHORIZED";

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

// Global query error handler
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

// Global mutation error handler
queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

// Create trpc client with httpBatchLink
const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    // Use httpBatchLink instead of httpLink to optimize multiple requests in one go
    httpBatchLink({
      url: "/api/trpc",
      fetch(input, init) {
        return fetch(input, {
          ...(init ?? {}),
          credentials: "include", // Ensure cookies are included in the request
        });
      },
    }),
  ],
});

// Render the app with trpc and React Query providers
createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);