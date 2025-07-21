import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  startingLife2Players: number;
  startingLifeMultiPlayers: number;
  players: PlayerState[];

  changeLife: (index: number, amount: number) => void;
  setTotalPlayers: (total: PlayerCount) => void;
  setStartingLifeTwoPlayers: (life: number) => void;
  setStartingLifeMultiPlayers: (life: number) => void;
  resetLife: () => void;
}

/* ── Helpers ───────────────────────────────────────── */

const createPlayers = (
  total: PlayerCount,
  startingLife2: number,
  startingLifeMulti: number,
): PlayerState[] => {
  const startingLife = total === 2 ? startingLife2 : startingLifeMulti;
  const panelColors = [SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST];
  // Fisher-Yates shuffle
  for (let i = panelColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [panelColors[i], panelColors[j]] = [panelColors[j], panelColors[i]];
  }

  return Array.from({ length: total }, (_, i) => ({
    id: i,
    life: startingLife,
    delta: 0,
    backgroundColor: panelColors[i % panelColors.length], // Use modulo to loop if more players than colors
  }));
};

/* ── Storage Backend (AsyncStorage) ───────────────── */
const storageBackend = {
  setItem: AsyncStorage.setItem,
  getItem: AsyncStorage.getItem,
  removeItem: AsyncStorage.removeItem,
};

/* ── Store ───────────────────────────────────────── */
export const useLifeStore = create<LifeStore>()(
  persist(
    (set, _get) => ({
      totalPlayers: 4,
      startingLife2Players: 20,
      startingLifeMultiPlayers: 40,
      players: createPlayers(4, 20, 40),

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
          return {
            totalPlayers: total,
            players: createPlayers(
              total,
              state.startingLife2Players,
              state.startingLifeMultiPlayers,
            ),
          };
        }),

      setStartingLifeTwoPlayers: (life) =>
        set((state) => {
          const players =
            state.totalPlayers === 2
              ? state.players.map((p) => ({ ...p, life, delta: 0 }))
              : state.players;
          return {
            startingLife2Players: life,
            players,
          };
        }),

      setStartingLifeMultiPlayers: (life) =>
        set((state) => {
          const players =
            state.totalPlayers > 2
              ? state.players.map((p) => ({ ...p, life, delta: 0 }))
              : state.players;
          return {
            startingLifeMultiPlayers: life,
            players,
          };
        }),

      resetLife: () =>
        set((state) => ({
          players: state.players.map((p) => ({
            ...p,
            life:
              state.totalPlayers === 2
                ? state.startingLife2Players
                : state.startingLifeMultiPlayers,
            delta: 0,
          })),
        })),
    }),
    {
      name: 'rb_life_store',
      storage: createJSONStorage(() => storageBackend),
      partialize: (state) => ({
        totalPlayers: state.totalPlayers,
        startingLife2Players: state.startingLife2Players,
        startingLifeMultiPlayers: state.startingLifeMultiPlayers,
        players: state.players.map(({ timer: _t, ...rest }) => rest),
      }),
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          const state = persistedState as any;
          if (state.totalPlayers < 2) {
            state.totalPlayers = 4;
            state.players = createPlayers(
              4,
              state.startingLife2Players,
              state.startingLifeMultiPlayers,
            );
          }
        }
        return persistedState as LifeStore;
      },
    },
  ),
);
