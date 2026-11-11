import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TableStatusStore {
  monarch: number | null;
  toggleMonarch: (playerId: number) => void;
  reset: () => void;
}

export const useTableStatusStore = create<TableStatusStore>()(
  persist(
    (set) => ({
      monarch: null,
      toggleMonarch: (playerId) =>
        set((s) => ({ monarch: s.monarch === playerId ? null : playerId })),
      reset: () => set({ monarch: null }),
    }),
    {
      name: 'rb_table_status',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ monarch: s.monarch }),
    },
  ),
);
