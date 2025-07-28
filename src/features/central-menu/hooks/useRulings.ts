import { useQuery } from '@tanstack/react-query';
import { fetchRulingsByName } from '@/helpers/scryfallFetch';

export const useRulings = (cardName: string) => {
  return useQuery({
    queryKey: ['rulings', cardName],
    queryFn: () => fetchRulingsByName(cardName),
    enabled: !!cardName,
    retry: false,
    refetchOnWindowFocus: false,
    // Aggressive GC for rulings as well.
    gcTime: 30 * 1000,
    staleTime: 30 * 1000,
  });
};
