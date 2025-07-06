const resetFunctions = new Map<number, () => void>();

export const PlayerCarouselManager = {
  register: (id: number, resetFn: () => void) => {
    resetFunctions.set(id, resetFn);
  },
  unregister: (id: number) => {
    resetFunctions.delete(id);
  },
  resetAll: () => {
    resetFunctions.forEach((resetFn) => resetFn());
  },
};
