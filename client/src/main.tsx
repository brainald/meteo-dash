import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { App } from "./App.tsx";

const HIGHLIGHT_CACHE_TIME = 2 * 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: HIGHLIGHT_CACHE_TIME, gcTime: HIGHLIGHT_CACHE_TIME },
  },
});

// TypeScript only:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      | import("@tanstack/query-core").QueryClient
      | undefined;
  }
}
console.log();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

window.__TANSTACK_QUERY_CLIENT__ = !import.meta.env.PROD
  ? queryClient
  : undefined;
