import { useCallback } from 'react';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

export const useResetAllCarousels = () => {
  const resetAll = useCallback(() => {
    PlayerCarouselManager.resetAll();
  }, []);

  return { resetAll };
};
