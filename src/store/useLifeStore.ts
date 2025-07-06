import { create } from 'zustand';
import { SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST } from '@/consts/consts';

/* ── Types ───────────────────────────────────────── */
export interface PlayerState {
  id: number;
  life: number;
  delta: number;
  timer?: NodeJS.Timeout;
  backgroundColor: string;
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6;

export interface LifeStore {
  totalPlayers: PlayerCount;
  players: PlayerState[];

  changeLife: (index: number, amount: number) => void;
  setTotalPlayers: (total: PlayerCount) => void;
  resetLife: () => void;
}

/* ── Helpers ───────────────────────────────────────── */

const createPlayers = (total: PlayerCount): PlayerState[] => {
  const panelColors = [SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST];
  // Fisher-Yates shuffle
  for (let i = panelColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [panelColors[i], panelColors[j]] = [panelColors[j], panelColors[i]];
  }

  return Array.from({ length: total }, (_, i) => ({
    id: i,
    life: 40,
    delta: 0,
    backgroundColor: panelColors[i % panelColors.length], // Use modulo to loop if more players than colors
  }));
};

/* ── Store ───────────────────────────────────────── */
export const useLifeStore = create<LifeStore>((set) => ({
  totalPlayers: 4,
  players: createPlayers(4),

  changeLife: (index, amount) => {
    set((state) => {
      const player = state.players[index];
      if (player.timer) {
        clearTimeout(player.timer);
      }

      const newPlayers = [...state.players];
      newPlayers[index] = {
        ...player,
        life: player.life + amount,
        delta: player.delta + amount,
        timer: undefined,
      };

      return { players: newPlayers };
    });

    const timer = setTimeout(() => {
      set((state) => {
        const newPlayers = [...state.players];
        newPlayers[index] = { ...newPlayers[index], delta: 0, timer: undefined };
        return { players: newPlayers };
      });
    }, 3000);

    set((state) => {
      const newPlayers = [...state.players];
      newPlayers[index] = { ...newPlayers[index], timer };
      return { players: newPlayers };
    });
  },

  setTotalPlayers: (total) =>
    set((state) => {
      if (total < 2 || total > 6) return state;
      return { totalPlayers: total, players: createPlayers(total) };
    }),

  resetLife: () =>
    set((state) => ({
      players: state.players.map((p) => ({ ...p, life: 40, delta: 0 })),
    })),
}));
