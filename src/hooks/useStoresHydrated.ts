import { useEffect, useState } from 'react';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { usePlayerBackgroundStore } from '@/features/central-menu/store/usePlayerBackgroundStore';

const persistedStores = [
  useLifeStore.persist,
  useCommanderDamageStore.persist,
  usePlayerBackgroundStore.persist,
];

const allHydrated = () => persistedStores.every((p) => p.hasHydrated());

/**
 * Returns `true` once all persisted Zustand stores have finished hydrating from AsyncStorage.
 */
export default function useStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    if (hydrated) return;
    if (allHydrated()) {
      setHydrated(true);
      return;
    }
    const unsubs = persistedStores.map((p) =>
      p.onFinishHydration(() => {
        if (allHydrated()) setHydrated(true);
      }),
    );
    return () => unsubs.forEach((unsub) => unsub());
  }, [hydrated]);

  return hydrated;
}
