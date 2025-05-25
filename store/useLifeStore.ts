import {create} from 'zustand';

/* ── Types ───────────────────────────────────────── */
export interface PlayerState {
  id: number;
  life: number;
  delta: number;
  timer?: NodeJS.Timeout;
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6;

interface LifeStore {
  totalPlayers: PlayerCount;
  players: PlayerState[];

  changeLife: (index: number, amount: number) => void;
  setTotalPlayers: (total: PlayerCount) => void;
}

/* helper */
const makePlayer = (id: number): PlayerState => ({
  id,
  life: 40,
  delta: 0,
});

/* ── Store ───────────────────────────────────────── */
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
          const upd = [...cur.players];
          upd[index] = {...upd[index], delta: 0, timer: undefined};
          return {players: upd};
        });
      }, 1000);

      next[index] = p;
      return {players: next};
    }),

  setTotalPlayers: total =>
    set(state => {
      if (total < 2 || total > 6) return state;

      let players = [...state.players];
      if (total < players.length) players = players.slice(0, total);
      else
        while (players.length < total) players.push(makePlayer(players.length));

      return {totalPlayers: total, players};
    }),
}));
