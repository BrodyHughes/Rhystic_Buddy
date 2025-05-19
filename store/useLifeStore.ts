// store/useLifeStore.ts
import {create} from 'zustand';
import randomColor from '../helpers/colorRandomizer';

/** one player’s local prefs */
export interface PlayerTheme {
  bg: string; // panel background
  plus: string; // + button colour
  minus: string; // – button colour
}

interface PlayerState {
  life: number;
  delta: number;
  theme: PlayerTheme;
  timer?: NodeJS.Timeout;
}

interface LifeStore {
  players: PlayerState[];
  changeLife: (index: number, amount: number) => void;
  /** update just the theme for a single player */
  setPlayerTheme: (index: number, theme: Partial<PlayerTheme>) => void;
}

const randomTheme = (): PlayerTheme => {
  const base = randomColor();
  return {bg: base, plus: '#FFFFFF', minus: '#FFFFFF'};
};

export const useLifeStore = create<LifeStore>(set => ({
  // initialise four players with random colours & 40 life
  players: Array.from({length: 4}, (_, i) => ({
    id: i,
    life: 40,
    delta: 0,
    theme: randomTheme(),
  })),

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
}));
