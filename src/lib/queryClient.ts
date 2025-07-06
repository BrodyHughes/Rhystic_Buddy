import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configure default options for all queries here
      // For example, you can set a default staleTime or cacheTime
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2, // Retry failed requests 2 times
    },
  },
});
