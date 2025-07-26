import { create } from 'zustand';

interface TutorialState {
  isTutorialVisible: boolean;
  setIsTutorialVisible: (visible: boolean) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  isTutorialVisible: false,
  setIsTutorialVisible: (isTutorialVisible) => set({ isTutorialVisible }),
}));
