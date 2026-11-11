import { useEffect, useState } from 'react';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { usePlayerBackgroundStore } from '@/features/central-menu/store/usePlayerBackgroundStore';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { useTableStatusStore } from '@/features/central-menu/store/useTableStatusStore';
import { useSettingsStore } from '@/features/central-menu/store/useSettingsStore';

const persistedStores = [
  useLifeStore.persist,
  useCommanderDamageStore.persist,
  usePlayerBackgroundStore.persist,
  useCounterStore.persist,
  useTableStatusStore.persist,
  useSettingsStore.persist,
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
