import { useEffect, useState } from 'react';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { usePlayerBackgroundStore } from '@/features/central-menu/store/usePlayerBackgroundStore';

type PersistedStore = {
  hasHydrated: () => boolean;
  onFinishHydration: (cb: () => void) => () => void;
};

/**
 * Returns `true` once all persisted Zustand stores have finished hydrating from AsyncStorage.
 */
export default function useStoresHydrated(): boolean {
  const lifeStorePersist = useLifeStore.persist as unknown as PersistedStore;
  const commanderDamageStorePersist = useCommanderDamageStore.persist as unknown as PersistedStore;
  const playerBackgroundStorePersist =
    usePlayerBackgroundStore.persist as unknown as PersistedStore;

  const [hydrated, setHydrated] = useState<boolean>(() => {
    return (
      (lifeStorePersist?.hasHydrated?.() ?? false) &&
      (commanderDamageStorePersist?.hasHydrated?.() ?? false) &&
      (playerBackgroundStorePersist?.hasHydrated?.() ?? false)
    );
  });

  useEffect(() => {
    if (hydrated) return;

    let lifeHydrated = lifeStorePersist?.hasHydrated?.() ?? false;
    let commanderDamageHydrated = commanderDamageStorePersist?.hasHydrated?.() ?? false;
    let playerBackgroundHydrated = playerBackgroundStorePersist?.hasHydrated?.() ?? false;

    const checkAllHydrated = () => {
      if (lifeHydrated && commanderDamageHydrated && playerBackgroundHydrated) {
        setHydrated(true);
      }
    };

    // Check immediately in case stores already hydrated before effect ran
    checkAllHydrated();

    const unsubLife = lifeStorePersist?.onFinishHydration?.(() => {
      lifeHydrated = true;
      checkAllHydrated();
    });

    const unsubCommanderDamage = commanderDamageStorePersist?.onFinishHydration?.(() => {
      commanderDamageHydrated = true;
      checkAllHydrated();
    });

    const unsubPlayerBackground = playerBackgroundStorePersist?.onFinishHydration?.(() => {
      playerBackgroundHydrated = true;
      checkAllHydrated();
    });

    return () => {
      unsubLife?.();
      unsubCommanderDamage?.();
      unsubPlayerBackground?.();
    };
  }, [hydrated, lifeStorePersist, commanderDamageStorePersist, playerBackgroundStorePersist]);

  return hydrated;
}
