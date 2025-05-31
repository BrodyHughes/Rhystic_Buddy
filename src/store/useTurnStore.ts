import { create } from 'zustand';

interface TurnStore {
  current: number | null;
  set: (idx: number | null) => void;
  reset: () => void;
}

export const useTurnStore = create<TurnStore>((set) => ({
  current: null,
  set: (idx) => set({ current: idx }),
  reset: () => set({ current: null }),
}));
