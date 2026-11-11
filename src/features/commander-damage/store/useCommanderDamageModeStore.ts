// SPDX-License-Identifier: Apache-2.0

import { create } from 'zustand';

export interface CommanderDamageModeState {
  isReceiving: boolean;
  defenderId: number | null;
  startReceiving: (defenderId: number) => void;
  stopReceiving: (defenderId: number) => void;
}

export const useCommanderDamageModeStore = create<CommanderDamageModeState>((set) => ({
  isReceiving: false,
  defenderId: null,
  startReceiving: (defenderId: number) => set({ isReceiving: true, defenderId }),
  stopReceiving: (defenderId: number) =>
    set((s) => (s.defenderId === defenderId ? { isReceiving: false, defenderId: null } : s)),
}));
