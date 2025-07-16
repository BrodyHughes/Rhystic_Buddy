import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ViewMode } from '@/features/player-panel/components/PlayerPanel';
import { useCommanderDamageModeStore } from '@/features/commander-damage/store/useCommanderDamageModeStore';
import { useCallback, useEffect } from 'react';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

interface UseCarouselParams {
  numRealViews: number;
  totalPlayers: number;
  isEvenPlayerIndexNumber: boolean;
  isLastPlayerOddLayout?: boolean;
  panelW: number;
  views: { type: ViewMode }[];
  playerId: number;
}

export const useCarousel = ({
  numRealViews,
  totalPlayers,
  isEvenPlayerIndexNumber,
  isLastPlayerOddLayout,
  panelW,
  views,
  playerId,
}: UseCarouselParams) => {
  const activeViewIndex = useSharedValue(1);
  const { startReceiving, stopReceiving } = useCommanderDamageModeStore();

  const reset = useCallback(() => {
    'worklet';
    if (views[activeViewIndex.value].type === ViewMode.COMMANDER) {
      runOnJS(stopReceiving)();
    }
    activeViewIndex.value = withSpring(1, {
      damping: 12,
      stiffness: 120,
    });
  }, [activeViewIndex, stopReceiving, views]);

  useEffect(() => {
    const { register, unregister } = PlayerCarouselManager;
    register(playerId, reset);
    return () => unregister(playerId);
  }, [playerId, reset]);

  const cycleView = (direction: 'left' | 'right') => {
    'worklet';

    const newIndex = direction === 'left' ? activeViewIndex.value + 1 : activeViewIndex.value - 1;

    const nextViewIndexClamped =
      newIndex === 0 ? numRealViews : newIndex === numRealViews + 1 ? 1 : newIndex;
    const nextViewType = views[nextViewIndexClamped].type;
    const currentViewType = views[activeViewIndex.value].type;

    if (nextViewType === ViewMode.COMMANDER && currentViewType !== ViewMode.COMMANDER) {
      runOnJS(startReceiving)(playerId);
    }

    activeViewIndex.value = withSpring(
      newIndex,
      {
        damping: 15,
        stiffness: 100,
      },
      (finished) => {
        'worklet';
        if (finished) {
          if (nextViewType !== ViewMode.COMMANDER && currentViewType === ViewMode.COMMANDER) {
            runOnJS(stopReceiving)();
          }

          if (newIndex === numRealViews + 1) {
            activeViewIndex.value = 1;
          } else if (newIndex === 0) {
            activeViewIndex.value = numRealViews;
          }
        }
      },
    );
  };

  const horizontalSwipeGesture = Gesture.Pan()
    .cancelsTouchesInView(false)
    .onEnd((e) => {
      const { translationX } = e;
      if (translationX > 50) cycleView('right');
      else if (translationX < -50) cycleView('left');
    });

  const flippedHorizontalSwipeGesture = Gesture.Pan()
    .cancelsTouchesInView(false)
    .onEnd((e) => {
      const { translationX } = e;
      if (translationX > 50) cycleView('left');
      else if (translationX < -50) cycleView('right');
    });

  const verticalSwipeGesture = Gesture.Pan()
    .cancelsTouchesInView(false)
    .onEnd((e) => {
      'worklet';
      const { translationY } = e;
      if (translationY < -50) cycleView('left');
      else if (translationY > 50) cycleView('right');
    });

  const flippedVerticalSwipeGesture = Gesture.Pan()
    .cancelsTouchesInView(false)
    .onEnd((e) => {
      'worklet';
      const { translationY } = e;
      if (translationY < -50) cycleView('right');
      else if (translationY > 50) cycleView('left');
    });

  const gesture =
    totalPlayers === 2 || isLastPlayerOddLayout
      ? isEvenPlayerIndexNumber
        ? verticalSwipeGesture
        : flippedVerticalSwipeGesture
      : isEvenPlayerIndexNumber
        ? horizontalSwipeGesture
        : flippedHorizontalSwipeGesture;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flexDirection: 'row',
    transform: [{ translateX: -activeViewIndex.value * panelW }],
  }));

  return { activeViewIndex, cycleView, reset, gesture, containerAnimatedStyle };
};
