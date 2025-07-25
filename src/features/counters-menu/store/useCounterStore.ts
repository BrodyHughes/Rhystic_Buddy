import { create } from 'zustand';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

type CounterValueMap = Record<string, number>;
type CounterMatrix = Record<number, CounterValueMap>;

interface CounterStore {
  counters: CounterMatrix;
  changeCounter: (defender: number, counter: string, amount?: number) => void;
  addCounter: (defender: number, counter: string) => void;
  removeCounter: (defender: number, counter: string) => void;
  get: (defender: number) => CounterValueMap;
  resetPlayer: (defender: number) => void;
  resetAll: () => void;
}

const emptyRow = (): CounterValueMap => ({});

export const useCounterStore = create<CounterStore>()((set, get) => ({
  counters: {},

  changeCounter: (defender, counter, amount = 1) =>
    set((state) => {
      if (amount > 100) return { counters: state.counters };
      const newCounters = { ...state.counters };
      const currentCounters = newCounters[defender] ?? emptyRow();
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
      const currentCounters = newCounters[defender] ?? emptyRow();
      if (currentCounters[counter] !== undefined) return { counters: state.counters };
      newCounters[defender] = { ...currentCounters, [counter]: 0 };
      return { counters: newCounters };
    }),

  removeCounter: (defender, counter) =>
    set((state) => {
      const newCounters = { ...state.counters };
      const currentCounters = { ...(newCounters[defender] ?? emptyRow()) };
      if (currentCounters[counter] === undefined) return { counters: state.counters };
      delete currentCounters[counter];
      newCounters[defender] = currentCounters;
      return { counters: newCounters };
    }),

  get: (defender) => get().counters[defender] ?? emptyRow(),

  resetPlayer: (defender) =>
    set((state) => {
      const newCounters = { ...state.counters };
      delete newCounters[defender];
      return { counters: newCounters };
    }),

  resetAll: () =>
    set(() => {
      const players = useLifeStore.getState().players;
      const newCounters = players.reduce<CounterMatrix>((acc, player) => {
        acc[player.id] = { tax: 0, charge: 0 };
        return acc;
      }, {});
      return { counters: newCounters };
    }),
}));
