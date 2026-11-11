import { create } from 'zustand';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { DEFAULT_COUNTERS } from '@/consts/counters';

type CounterValueMap = Record<string, number>;
type CounterMatrix = Record<number, CounterValueMap>;

interface CounterStore {
  counters: CounterMatrix;
  changeCounter: (defender: number, counter: string, amount?: number) => void;
  addCounter: (defender: number, counter: string) => void;
  removeCounter: (defender: number, counter: string) => void;
  resetAll: () => void;
}

export const useCounterStore = create<CounterStore>()((set) => ({
  counters: {},

  changeCounter: (defender, counter, amount = 1) =>
    set((state) => {
      if (amount > 100) return state;
      const newCounters = { ...state.counters };
      const currentCounters = newCounters[defender] ?? {};
      const updated = (currentCounters[counter] ?? 0) + amount;
      newCounters[defender] = {
        ...currentCounters,
        [counter]: Math.min(100, Math.max(0, updated)),
      };
      return { counters: newCounters };
    }),

  addCounter: (defender, counter) =>
    set((state) => {
      const newCounters = { ...state.counters };
      const currentCounters = newCounters[defender] ?? {};
      if (currentCounters[counter] !== undefined) return state;
      newCounters[defender] = { ...currentCounters, [counter]: 0 };
      return { counters: newCounters };
    }),

  removeCounter: (defender, counter) =>
    set((state) => {
      const newCounters = { ...state.counters };
      const currentCounters = { ...(newCounters[defender] ?? {}) };
      if (currentCounters[counter] === undefined) return state;
      delete currentCounters[counter];
      newCounters[defender] = currentCounters;
      return { counters: newCounters };
    }),

  resetAll: () =>
    set(() => {
      const players = useLifeStore.getState().players;
      const newCounters = players.reduce<CounterMatrix>((acc, player) => {
        acc[player.id] = Object.fromEntries(DEFAULT_COUNTERS.map((c) => [c, 0]));
        return acc;
      }, {});
      return { counters: newCounters };
    }),
}));
