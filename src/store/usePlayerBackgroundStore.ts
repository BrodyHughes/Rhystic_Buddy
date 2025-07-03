import { create } from 'zustand';
import { produce } from 'immer';

interface PlayerBackgroundState {
  backgrounds: { [playerId: number]: string | null };
  setBackground: (playerId: number, url: string | null) => void;
}

export const usePlayerBackgroundStore = create<PlayerBackgroundState>((set) => ({
  backgrounds: {},
  setBackground: (playerId, url) => {
    set(
      produce((draft) => {
        draft.backgrounds[playerId] = url;
      }),
    );
  },
}));
