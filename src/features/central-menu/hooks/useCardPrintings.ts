import { useQuery } from '@tanstack/react-query';
import { fetchCardPrintings } from '@/helpers/scryfallFetch';

export const useCardPrintings = (cardName: string) => {
  return useQuery({
    queryKey: ['cardPrintings', cardName],
    queryFn: () => fetchCardPrintings(cardName),
    enabled: !!cardName,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
