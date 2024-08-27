import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function QueryProvider(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 2,

      retry: 1,
      retryDelay(attemptIndex) {
        return Math.min(1000 * 2 ** attemptIndex, 1000 * 8);
      },
    },
  },
});
