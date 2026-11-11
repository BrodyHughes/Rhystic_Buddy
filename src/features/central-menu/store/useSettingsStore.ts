import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  showCommanderDamageMap: boolean;
  showCounterChips: boolean;
  setShowCommanderDamageMap: (value: boolean) => void;
  setShowCounterChips: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      showCommanderDamageMap: true,
      showCounterChips: true,
      setShowCommanderDamageMap: (showCommanderDamageMap) => set({ showCommanderDamageMap }),
      setShowCounterChips: (showCounterChips) => set({ showCounterChips }),
    }),
    {
      name: 'rb_settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
