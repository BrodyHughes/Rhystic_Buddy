/* idk about the styling for this tbh but the functionality is in place atm
 * TODO:
 * [ ] make it look nice
 * [ ] fix the '+' and '-' they are rotating wrong sometimes
 * [ ] add a long press on the cards to bring up an individual menu
 * for commander damage etc
 * [ ] add a 'who goes first' randomizer
 */
import React, { useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { useLifeStore, PlayerState } from '@/store/useLifeStore';
import { useTurnStore } from '@/store/useTurnStore';
import { typography, spacing, radius } from '@/styles/global';
import PlayerPanelMenu from '@/components/PlayerPanelMenu';
import { GAP, OFF_WHITE, TEXT, TURN_ORDER_OVERLAY_COLOR } from '@/consts/consts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerBackgroundStore } from '@/store/usePlayerBackgroundStore';
import LifeView from './playerPanel/LifeView';
import TurnWinnerOverlay from './playerPanel/TurnWinnerOverlay';

export enum ViewMode {
  LIFE = 'life',
  COMMANDER = 'commander',
  COUNTERS = 'counters',
}
interface Props {
  player: PlayerState;
  index: number;
  cols: number;
  rows: number;
  isEvenPlayerIndexNumber: boolean;
}

function PlayerPanelComponent({ player, index, cols, rows, isEvenPlayerIndexNumber }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const changeLife = useLifeStore((s) => s.changeLife);
  const totalPlayers = useLifeStore((s) => s.players.length);
  const { current: currentTurn, isSpinning, isFinished } = useTurnStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundImage = usePlayerBackgroundStore((state) => state.backgrounds[player.id]);

  // Determine the set of views based on player count
  const baseViews = [
    { type: ViewMode.LIFE },
    { type: ViewMode.COMMANDER },
    { type: ViewMode.COUNTERS },
  ];

  const realViews =
    totalPlayers === 2 ? baseViews.filter((v) => v.type !== ViewMode.COMMANDER) : baseViews;
  const numRealViews = realViews.length;

  // Define the views for the carousel with cloned items for infinite looping
  const views = [
    realViews[numRealViews - 1], // Cloned last item
    ...realViews,
    realViews[0], // Cloned first item
  ];

  // Use a shared value for the active view index. Start at 1 for the infinite carousel.
  const activeViewIndex = useSharedValue(1);

  const cycleView = (direction: 'left' | 'right') => {
    'worklet';

    const newIndex = direction === 'left' ? activeViewIndex.value + 1 : activeViewIndex.value - 1;

    activeViewIndex.value = withSpring(
      newIndex,
      {
        damping: 15,
        stiffness: 100,
      },
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (isFinished) => {
        if (isFinished) {
          if (newIndex === numRealViews + 1) {
            // Instantly jump from the cloned last item to the first real item
            activeViewIndex.value = 1;
          } else if (newIndex === 0) {
            // Instantly jump from the cloned first item to the last real item
            activeViewIndex.value = numRealViews;
          }
        }
      },
    );
  };

  // swipe gestuers to handle menu navigation
  const horizontalSwipeGesture = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;

    if (translationX > 50) {
      cycleView('right');
    } else if (translationX < -50) {
      cycleView('left');
    }
  });

  // flipped swipe gesture to handle menu navigation on the other side
  const flippedHorizontalSwipeGesture = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;

    if (translationX > 50) {
      cycleView('left');
    } else if (translationX < -50) {
      cycleView('right');
    }
  });

  // Vertical swipe gesture for 2-player mode
  const verticalSwipeGesture = Gesture.Pan().onEnd((e) => {
    'worklet';
    const { translationY } = e;
    // For 90deg rotation (top panel): swiping up should move content up.
    if (translationY < -50) {
      cycleView('left'); // Moves content up
    } else if (translationY > 50) {
      cycleView('right'); // Moves content down
    }
  });

  // Flipped vertical gesture for the bottom panel in 2-player mode
  const flippedVerticalSwipeGesture = Gesture.Pan().onEnd((e) => {
    'worklet';
    const { translationY } = e;
    // For 270deg rotation (bottom panel): swiping up should move content up.
    if (translationY < -50) {
      cycleView('right'); // Moves content up
    } else if (translationY > 50) {
      cycleView('left'); // Moves content down
    }
  });

  const gesture =
    totalPlayers === 2
      ? isEvenPlayerIndexNumber
        ? verticalSwipeGesture
        : flippedVerticalSwipeGesture
      : isEvenPlayerIndexNumber
        ? horizontalSwipeGesture
        : flippedHorizontalSwipeGesture;

  /* lets nest some ternaries! */
  const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';
  const rot2 = isEvenPlayerIndexNumber ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;

  /* size minus gaps & insets */
  const usableW = W - 3 * GAP;
  const usableH = H - top - bottom - 3 * GAP;
  const panelW = usableW / cols;
  const panelH = usableH / rows;

  const imageNode = backgroundImage ? (
    <Image
      source={{ uri: backgroundImage }}
      style={[
        styles.imageStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          position: 'absolute',
          width: panelH,
          height: panelW,
          top: (panelH - panelW) / 2,
          left: (panelW - panelH) / 2,
          transform: [{ rotate: '90deg' }],
        },
      ]}
      resizeMode="cover"
    />
  ) : null;

  const panelBackgroundColor = backgroundImage ? 'transparent' : player.backgroundColor;

  // This animated style will slide the entire container of views.
  // When the panel is rotated (e.g., in 2-player mode), an X-axis translation
  // visually becomes a Y-axis translation on the screen.
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flexDirection: 'row',
    transform: [{ translateX: -activeViewIndex.value * panelW }],
  }));

  const changeLifeByAmount = (amount: number) => {
    changeLife(index, amount);
  };

  const handleContinuousChange = (direction: 'inc' | 'dec') => {
    const amount = direction === 'inc' ? 5 : -5;
    runOnJS(changeLifeByAmount)(amount);
  };

  const handleLongPressStart = (direction: 'inc' | 'dec') => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Initial change
    handleContinuousChange(direction);
    // Start interval for continuous change
    intervalRef.current = setInterval(() => {
      handleContinuousChange(direction);
    }, 400);
  };

  const handlePressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.shadowWrap,
          { width: panelW, height: panelH, transform: [{ rotate: appliedRot }] },
        ]}
      >
        {imageNode}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0)']}
          style={styles.shine}
          useAngle={true}
          angle={195}
        />
        {isSpinning && currentTurn === index && <View style={styles.turnOrderOverlay} />}
        {isFinished && currentTurn === index && (
          <TurnWinnerOverlay panelW={panelW} panelH={panelH} />
        )}
        <View style={styles.roundedClip}>
          <Animated.View style={[styles.viewsContainer, containerAnimatedStyle]}>
            {views.map((view, i) => (
              <View
                key={i}
                style={[
                  styles.viewPanel,
                  styles.panelBorder,
                  { width: panelW, height: panelH, backgroundColor: panelBackgroundColor },
                ]}
              >
                {view.type === ViewMode.LIFE ? (
                  <LifeView
                    player={player}
                    changeLifeByAmount={changeLifeByAmount}
                    handleLongPressStart={handleLongPressStart}
                    handlePressOut={handlePressOut}
                  />
                ) : (
                  <PlayerPanelMenu
                    menuVisible
                    menuType={view.type}
                    index={index}
                    isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
                    appliedRot={appliedRot}
                  />
                )}
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

export default React.memo(PlayerPanelComponent);

/* ── Styles ────────────────────────────────────────────── */

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  shine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  imageStyle: {
    opacity: 0.35,
    borderRadius: radius.sm,
  },
  turnOrderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
    borderRadius: radius.sm,
    backgroundColor: TURN_ORDER_OVERLAY_COLOR,
  },
  roundedClip: {
    flex: 1,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewsContainer: {
    flex: 1,
  },
  viewPanel: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lifeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
    zIndex: 1,
    pointerEvents: 'none',
  },
  life: {
    ...typography.heading1,
    color: OFF_WHITE,
    marginRight: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20,
    fontVariant: ['tabular-nums'],
  },
  delta: {
    ...typography.caption,
    color: OFF_WHITE,
  },
  button: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inc: { right: 0 },
  dec: { left: 0 },
  btnText: {
    ...typography.heading2,
    fontSize: 32,
    color: TEXT,
    transform: [{ rotate: '90deg' }],
  },
  panelBorder: {
    borderWidth: 7,
    borderColor: 'rgba(223, 223, 223, 0.2)',
  },
  lifeTxt: {
    ...typography.heading1,
    fontSize: 88,
    color: OFF_WHITE,
    fontVariant: ['tabular-nums'],
  },
  btnTxt: {
    ...typography.body,
    fontSize: 28,
    color: '#fff',
  },
});
