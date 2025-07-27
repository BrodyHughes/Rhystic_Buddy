import { useTurnStore } from '../store/useTurnStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

// Spinning settings – tweak here for global effect
const LOOPS = 3; // number of full rotations before stopping
const INTERVAL_MS = 30; // shorter delay (30ms) -> visibly faster spin

export const useTurnOrder = () => {
  const { startSpin, set, finishSpin } = useTurnStore.getState();

  const shuffle = (length: number): number[] => {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const start = () => {
    const players = useLifeStore.getState().players;
    if (players.length === 0) return;

    startSpin();

    const order = shuffle(players.length);
    const winner = order[order.length - 1];

    const totalTicks = order.length * LOOPS;
    let tick = 0;

    const spin = setInterval(() => {
      set(order[tick % order.length]);
      tick++;
      if (tick > totalTicks) {
        clearInterval(spin);
        finishSpin(winner);
      }
    }, INTERVAL_MS);
  };

  return { start };
};
