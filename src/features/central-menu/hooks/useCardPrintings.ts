import { useQuery } from '@tanstack/react-query';
import { fetchCardPrintings } from '@/helpers/scryfallFetch';

export const useCardPrintings = (cardName: string) => {
  return useQuery({
    queryKey: ['cardPrintings', cardName],
    queryFn: () => fetchCardPrintings(cardName),
    enabled: !!cardName,
    retry: false,
    refetchOnWindowFocus: false,
    // Aggressive GC: purge after 30 s of inactivity; mark stale after 30 s.
    gcTime: 30 * 1000,
    staleTime: 30 * 1000,
  });
};
