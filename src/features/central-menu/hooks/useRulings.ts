import { useQuery } from '@tanstack/react-query';
import { fetchRulingsByName } from '@/helpers/scryfallFetch';

export const useRulings = (cardName: string) => {
  return useQuery({
    queryKey: ['rulings', cardName],
    queryFn: () => fetchRulingsByName(cardName),
    enabled: !!cardName, // Only run the query if cardName is not an empty string
    retry: false, // Optional: disable retries for 404s etc.
    refetchOnWindowFocus: false, // Optional: disable refetching on window focus
  });
};
