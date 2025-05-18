/**
 * Life‑total store (with auto‑clearing delta)
 * ------------------------------------------
 * TODO (next): poison, commander damage, etc.
 */

import {create} from 'zustand';

interface PlayerState {
  life: number;
  delta: number;
  timer?: NodeJS.Timeout;
}

interface LifeStore {
  players: PlayerState[];
  changeLife: (index: number, amount: number) => void;
  resetDeltas: () => void;
}

export const useLifeStore = create<LifeStore>(set => ({
  players: Array.from({length: 4}, () => ({life: 40, delta: 0})),

  changeLife: (index, amount) =>
    set(state => {
      /** clone the array so the reference changes */
      const nextPlayers = [...state.players];
      const current = {...nextPlayers[index]};

      // clear previous timer if it exists
      if (current.timer) clearTimeout(current.timer);

      current.life += amount;
      current.delta += amount;

      // schedule delta reset
      current.timer = setTimeout(() => {
        set(cur => {
          const updated = [...cur.players];
          updated[index] = {...updated[index], delta: 0, timer: undefined};
          return {players: updated};
        });
      }, 1000);

      nextPlayers[index] = current;
      return {players: nextPlayers};
    }),

  resetDeltas: () =>
    set(state => ({
      players: state.players.map(p => ({...p, delta: 0})),
    })),
}));
