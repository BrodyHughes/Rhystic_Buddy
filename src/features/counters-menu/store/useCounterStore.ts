import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CounterType } from '@/consts/counters';

type CounterValueMap = Partial<Record<CounterType, number>>;
type CounterMatrix = Record<number, CounterValueMap>;

interface CounterStore {
  counters: CounterMatrix;
  changeCounter: (defender: number, counter: CounterType, amount: number) => void;
  addCounter: (defender: number, counter: CounterType) => void;
  removeCounter: (defender: number, counter: CounterType) => void;
  resetAll: () => void;
}

const MAX_COUNTER = 100;

export const useCounterStore = create<CounterStore>()(
  persist(
    (set) => ({
      counters: {},

      changeCounter: (defender, counter, amount) =>
        set((state) => {
          const current = state.counters[defender] ?? {};
          const updated = Math.min(MAX_COUNTER, Math.max(0, (current[counter] ?? 0) + amount));
          return {
            counters: { ...state.counters, [defender]: { ...current, [counter]: updated } },
          };
        }),

      addCounter: (defender, counter) =>
        set((state) => {
          const current = state.counters[defender] ?? {};
          if (current[counter] !== undefined) return state;
          return { counters: { ...state.counters, [defender]: { ...current, [counter]: 0 } } };
        }),

      removeCounter: (defender, counter) =>
        set((state) => {
          const current = { ...(state.counters[defender] ?? {}) };
          if (current[counter] === undefined) return state;
          delete current[counter];
          return { counters: { ...state.counters, [defender]: current } };
        }),

      resetAll: () => set({ counters: {} }),
    }),
    {
      name: 'rb_counters',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
