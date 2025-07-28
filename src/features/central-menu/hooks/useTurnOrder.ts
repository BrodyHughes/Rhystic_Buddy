import { useEffect, useRef } from 'react';
import { useTurnStore } from '../store/useTurnStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

// Spinning settings – tweak here for global effect
const LOOPS = 3; // number of full rotations before stopping
const INTERVAL_MS = 30; // shorter delay (30ms) -> visibly faster spin

export const useTurnOrder = () => {
  const { startSpin, set, finishSpin, reset: resetTurnOrder } = useTurnStore.getState();

  // Keep track of the active interval so we can clean it up if the
  // component that invoked this hook unmounts or if start() is called again.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shuffle = (length: number): number[] => {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const start = () => {
    // If a spin is already happening, reset it first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const players = useLifeStore.getState().players;
    if (players.length === 0) return;

    startSpin();

    const order = shuffle(players.length);
    const winner = order[order.length - 1];

    const totalTicks = order.length * LOOPS;
    let tick = 0;

    intervalRef.current = setInterval(() => {
      set(order[tick % order.length]);
      tick++;
      if (tick > totalTicks) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        finishSpin(winner);
      }
    }, INTERVAL_MS);
  };

  // Ensure we don’t leave timers running if the invoking component unmounts.
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    resetTurnOrder();
  };

  return { start, stop };
};
