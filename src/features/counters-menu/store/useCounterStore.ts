import { create } from 'zustand';

export interface PlayerCounters {
  storm: number;
  poison: number;
  mana: number;
}

type CounterMatrix = Record<number, PlayerCounters>;

interface CounterStore {
  counters: CounterMatrix;
  changeCounter: (defender: number, counter: keyof PlayerCounters, amount?: number) => void;
  get: (defender: number) => PlayerCounters;
  resetPlayer: (defender: number) => void;
  resetAll: () => void;
}

const emptyRow = (): PlayerCounters => ({ storm: 0, poison: 0, mana: 0 });

export const useCounterStore = create<CounterStore>()((set, get) => ({
  counters: {},

  changeCounter: (defender, counter, amount = 1) =>
    set((state) => {
      if (amount > 100) return { counters: state.counters };
      const newCounters = { ...state.counters };
      const currentCounters = newCounters[defender] ?? emptyRow();
      const updated = currentCounters[counter] + amount;
      newCounters[defender] = {
        ...currentCounters,
        [counter]: Math.min(100, Math.max(0, updated)),
      };
      return { counters: newCounters };
    }),

  get: (defender) => get().counters[defender] ?? emptyRow(),

  resetPlayer: (defender) =>
    set((state) => {
      const newCounters = { ...state.counters };
      delete newCounters[defender];
      return { counters: newCounters };
    }),

  resetAll: () => set({ counters: {} }),
}));
