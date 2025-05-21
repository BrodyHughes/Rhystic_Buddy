import {create} from 'zustand';
import randomColor from '../helpers/colorRandomizer';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface PlayerTheme {
  bg: string;
  plus: string;
  minus: string;
}

export interface PlayerState {
  id: number;
  life: number;
  delta: number;
  theme: PlayerTheme;
  timer?: NodeJS.Timeout;
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6;

interface LifeStore {
  totalPlayers: PlayerCount;
  players: PlayerState[];

  changeLife: (index: number, amount: number) => void;
  setPlayerTheme: (index: number, theme: Partial<PlayerTheme>) => void;
  setTotalPlayers: (total: PlayerCount) => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const makeTheme = (): PlayerTheme => ({
  bg: randomColor(),
  plus: '#FFFFFF',
  minus: '#FFFFFF',
});

const makePlayer = (id: number): PlayerState => ({
  id,
  life: 40,
  delta: 0,
  theme: makeTheme(),
});

/* ─── Store ──────────────────────────────────────────────────────────────── */
export const useLifeStore = create<LifeStore>(set => ({
  totalPlayers: 4,
  players: Array.from({length: 4}, (_, i) => makePlayer(i)),

  changeLife: (index, amount) =>
    set(state => {
      const next = [...state.players];
      const p = {...next[index]};

      if (p.timer) clearTimeout(p.timer);
      p.life += amount;
      p.delta += amount;

      p.timer = setTimeout(() => {
        set(cur => {
          const updated = [...cur.players];
          updated[index] = {...updated[index], delta: 0, timer: undefined};
          return {players: updated};
        });
      }, 5000);

      next[index] = p;
      return {players: next};
    }),

  setPlayerTheme: (index, theme) =>
    set(state => {
      const next = [...state.players];
      next[index] = {...next[index], theme: {...next[index].theme, ...theme}};
      return {players: next};
    }),
  setTotalPlayers: (total: PlayerCount) =>
    set(state => {
      if (total < 2 || total > 6) return state; // ignore invalid values

      let players = [...state.players];

      if (total < players.length) {
        players = players.slice(0, total); // trim extras
      } else if (total > players.length) {
        const startId = players.length;
        for (let i = startId; i < total; i++) players.push(makePlayer(i));
      }

      return {totalPlayers: total, players};
    }),
}));
