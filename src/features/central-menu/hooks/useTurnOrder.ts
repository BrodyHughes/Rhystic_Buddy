import { useEffect, useRef } from 'react';
import { useTurnStore } from '../store/useTurnStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';

// ============ ANIMATION SETTINGS - ADJUST THESE ============
const TOTAL_STEPS = 50; // How many times it changes player
const START_DELAY_MS = 10; // Start: 0.01 seconds per step
const END_DELAY_MS = 500; // End: 0.5 seconds per step
const EASING_POWER = 2; // Slowdown curve (2 = quadratic, 3 = cubic, etc.)
// ===========================================================

export const useTurnOrder = () => {
  const { startSpin, set, finishSpin, reset: resetTurnOrder } = useTurnStore.getState();

  const animationRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const shuffle = (length: number): number[] => {
    const arr = Array.from({ length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const start = () => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const players = useLifeStore.getState().players;
    if (players.length === 0) return;

    startSpin();
    isRunningRef.current = true;

    // Shuffle to get random order and winner
    const order = shuffle(players.length);
    const winner = order[order.length - 1];

    let currentIndex = 0;
    let stepCount = 0;
    let lastStepTime = performance.now();

    // Calculate initial delay
    const getDelay = (step: number): number => {
      const progress = step / TOTAL_STEPS;
      return START_DELAY_MS + Math.pow(progress, EASING_POWER) * (END_DELAY_MS - START_DELAY_MS);
    };

    let nextStepDelay = getDelay(0);

    const animate = (currentTime: number) => {
      if (!isRunningRef.current) return;

      const elapsed = currentTime - lastStepTime;

      // Time to show next step?
      if (elapsed >= nextStepDelay) {
        set(order[currentIndex]);

        currentIndex = (currentIndex + 1) % order.length;
        stepCount++;
        lastStepTime = currentTime;

        if (stepCount >= TOTAL_STEPS) {
          finishSpin(winner);
          return;
        }

        // Calculate delay for next step
        nextStepDelay = getDelay(stepCount);
      }

      animationRef.current = requestAnimationFrame(animate);
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
      isRunningRef.current = false;
    };
  }, []);

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isRunningRef.current = false;
    resetTurnOrder();
  };

  return { start, stop };
};
