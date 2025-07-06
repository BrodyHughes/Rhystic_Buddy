// SPDX-License-Identifier: Apache-2.0

import { create } from 'zustand';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
export type CommanderMatrix = Record<number, Record<number, number>>;

export interface CommanderDamageStore {
  damage: CommanderMatrix;

  /**
   * Update one square.
   * @param defender  player taking the damage (panel owner)
   * @param source    0‑3, which commander square
   * @param amount    +1 / ‑1 (or any integer)
   */
  change: (defender: number, source: number, amount: number) => void;

  get: (defender: number, source: number) => number;
  resetDefender: (defender: number) => void;
  resetAll: () => void;
}

export const useCommanderDamageStore = create<CommanderDamageStore>((set, get) => ({
  damage: {},

  change: (defender, source, amount) =>
    set((state) => {
      const dmg = { ...state.damage };
      const row = { ...(dmg[defender] ?? {}) };
      row[source] = Math.max((row[source] ?? 0) + amount, 0);
      dmg[defender] = row;

      useLifeStore.getState().changeLife(defender, -amount);

      return { damage: dmg };
    }),

  get: (defender, source) => get().damage[defender]?.[source] ?? 0,

  resetDefender: (defender) =>
    set((state) => {
      const dmg = { ...state.damage };
      delete dmg[defender];
      return { damage: dmg };
    }),

  resetAll: () => set({ damage: {} }),
}));
