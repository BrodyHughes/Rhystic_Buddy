import { create } from 'zustand';

interface RulingsState {
  isRulingsSearchVisible: boolean;
  setIsRulingsSearchVisible: (isVisible: boolean) => void;
}

export const useRulingsStore = create<RulingsState>((set) => ({
  isRulingsSearchVisible: false,
  setIsRulingsSearchVisible: (isRulingsSearchVisible) => set({ isRulingsSearchVisible }),
}));
