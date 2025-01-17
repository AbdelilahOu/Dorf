import { QueryClient } from "@tanstack/react-query";
import { LazyStore } from "@tauri-apps/plugin-store";

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 3,
        retryDelay: (failureCount, error) => failureCount * 500,
      },
    },
  });
}
