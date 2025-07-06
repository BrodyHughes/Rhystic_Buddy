import { create } from 'zustand';

interface RulingsState {
  isSearchVisible: boolean;
  setIsSearchVisible: (isVisible: boolean) => void;
}

export const useRulingsStore = create<RulingsState>((set) => ({
  isSearchVisible: false,
  setIsSearchVisible: (isSearchVisible) => set({ isSearchVisible }),
}));
