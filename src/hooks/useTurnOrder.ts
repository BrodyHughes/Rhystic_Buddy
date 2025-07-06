import { useTurnStore } from '@/store/useTurnStore';
import { useLifeStore } from '@/store/useLifeStore';

export const useTurnOrder = () => {
  const { startSpin, set, finishSpin } = useTurnStore.getState();
  const players = useLifeStore.getState().players;

  const start = () => {
    if (players.length === 0) return;

    startSpin();

    const playersArray = Array.from({ length: players.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = playersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playersArray[i], playersArray[j]] = [playersArray[j], playersArray[i]];
    }
    const order = playersArray;
    const winner = order[order.length - 1];
    const loops = 3;
    const flashDelay = 100;
    let tick = 0;
    const spin = setInterval(() => {
      set(order[tick % order.length]);
      tick++;
      if (tick === order.length * loops + 1) {
        clearInterval(spin);
        finishSpin(winner);
      }
    }, flashDelay);
  };

  return { start };
};
