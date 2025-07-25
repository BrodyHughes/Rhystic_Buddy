import { useEffect, useState } from 'react';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

/**
 * Returns `true` once all persisted Zustand stores have finished hydrating from AsyncStorage.
 * Currently we only track `useLifeStore`, but you can add additional stores here when you
 * introduce more persisted ones.
 */
export default function useStoresHydrated(): boolean {
  // `persist.hasHydrated()` might not exist until after the first call, so we
  // lazily access it.
  const lifeStorePersist = useLifeStore.persist as unknown as {
    hasHydrated: () => boolean;
    onFinishHydration: (cb: () => void) => () => void;
  };

  const [hydrated, setHydrated] = useState<boolean>(lifeStorePersist?.hasHydrated?.() ?? false);

  useEffect(() => {
    if (hydrated) return;

    const unsub = lifeStorePersist?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    return () => {
      if (unsub) unsub();
    };
  }, [hydrated, lifeStorePersist]);

  return hydrated;
}
