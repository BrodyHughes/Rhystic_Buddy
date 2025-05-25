import {create} from 'zustand';

export interface PlayerCounters {
  storm: number;
  poison: number;
  mana: number;
}

type CounterMatrix = Record<number, PlayerCounters>;

interface CounterStore {
  counters: CounterMatrix;

  incStorm: (defender: number, delta?: number) => void;
  incPoison: (defender: number, delta?: number) => void;
  incMana: (defender: number, delta?: number) => void;

  get: (defender: number) => PlayerCounters;

  resetPlayer: (defender: number) => void;
  resetAll: () => void;
}

const emptyRow = (): PlayerCounters => ({storm: 0, poison: 0, mana: 0});

export const useCounterStore = create<CounterStore>()((set, get) => ({
  counters: {},

  incStorm: (d, Δ = 1) =>
    set(s => {
      const row = {...(s.counters[d] ?? emptyRow())};
      row.storm = Math.max(row.storm + Δ, 0);
      return {counters: {...s.counters, [d]: row}};
    }),

  incPoison: (d, Δ = 1) =>
    set(s => {
      const row = {...(s.counters[d] ?? emptyRow())};
      row.poison = Math.max(row.poison + Δ, 0);
      return {counters: {...s.counters, [d]: row}};
    }),

  incMana: (d, Δ = 1) =>
    set(s => {
      const row = {...(s.counters[d] ?? emptyRow())};
      row.mana = Math.max(row.mana + Δ, 0);
      return {counters: {...s.counters, [d]: row}};
    }),

  get: defender => get().counters[defender] ?? emptyRow(),

  resetPlayer: defender =>
    set(s => {
      const nxt = {...s.counters};
      delete nxt[defender];
      return {counters: nxt};
    }),

  resetAll: () => set({counters: {}}),
}));
