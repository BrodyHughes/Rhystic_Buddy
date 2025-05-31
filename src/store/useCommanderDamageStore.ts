// store/useCommanderDamageStore.ts
import { create } from 'zustand';
import { useLifeStore } from '@/store/useLifeStore';

/* defenderId → { sourceId → damage } */
export type CommanderMatrix = Record<number, Record<number, number>>;

interface CommanderDamageStore {
  damage: CommanderMatrix;

  /**
   * Update one square.
   * @param defender  player taking the damage (panel owner)
   * @param source    0‑3, which commander square
   * @param amount    +1 / ‑1 (or any integer)
   */
  change: (defender: number, source: number, amount: number) => void;

  /** Selector helper (safe 0 fallback). */
  get: (defender: number, source: number) => number;

  /** Wipe all squares for a single defender. */
  resetDefender: (defender: number) => void;

  /** Wipe the entire matrix. */
  resetAll: () => void;
}

/* ── Store ───────────────────────────────────────────── */
export const useCommanderDamageStore = create<CommanderDamageStore>((set, get) => ({
  damage: {},

  change: (defender, source, amount) =>
    set((state) => {
      /* immutably update the matrix */
      const dmg = { ...state.damage };
      const row = { ...(dmg[defender] ?? {}) };
      row[source] = Math.max((row[source] ?? 0) + amount, 0);
      dmg[defender] = row;

      /* sync life ( +damage → −life, −damage → +life ) */
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
