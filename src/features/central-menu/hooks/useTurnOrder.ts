import { useEffect, useRef } from 'react';
import { useTurnStore } from '../store/useTurnStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

// Spinning settings – tweak here for global effect
const TOTAL_DURATION_MS = 3000; // Total duration of the spin in milliseconds
const UPDATES_PER_SECOND = 20; // How many times per second to update (smoother = higher number)

export const useTurnOrder = () => {
  const { startSpin, set, finishSpin, reset: resetTurnOrder } = useTurnStore.getState();

  // Keep track of the animation frame ID so we can cancel it
  const animationRef = useRef<number | null>(null);

  const shuffle = (length: number): number[] => {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const start = () => {
    // If a spin is already happening, cancel it first
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const players = useLifeStore.getState().players;
    if (players.length === 0) return;

    startSpin();

    const order = shuffle(players.length);
    const winner = order[order.length - 1];
    const startTime = Date.now();
    const updateInterval = 1000 / UPDATES_PER_SECOND;
    let lastUpdateTime = startTime;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // Only update if enough time has passed (throttle updates)
      if (now - lastUpdateTime >= updateInterval) {
        const progress = Math.min(elapsed / TOTAL_DURATION_MS, 1);
        const currentIndex = Math.floor(progress * order.length * 3) % order.length;
        set(order[currentIndex]);
        lastUpdateTime = now;
      }

      if (elapsed < TOTAL_DURATION_MS) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        finishSpin(winner);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Ensure we don't leave animations running if the invoking component unmounts.
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    resetTurnOrder();
  };

  return { start, stop };
};
