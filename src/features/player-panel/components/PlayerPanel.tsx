import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Image, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

import { LifeStore, useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useTurnStore } from '@/features/central-menu/store/useTurnStore';
import { typography, spacing, radius } from '@/styles/global';
import CountersView from './CountersView';
import { GAP, OFF_WHITE, TEXT } from '@/consts/consts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PlayerBackgroundState,
  usePlayerBackgroundStore,
} from '@/features/central-menu/store/usePlayerBackgroundStore';
import LifeView from './LifeView';
import TurnWinnerOverlay from '../../central-menu/components/TurnWinnerOverlay';
import { useCarousel } from '@/hooks/useCarousel';

export enum ViewMode {
  LIFE = 'life',
  COMMANDER = 'commander',
  COUNTERS = 'counters',
}
interface Props {
  index: number;
  cols: number;
  rows: number;
  isEvenPlayerIndexNumber: boolean;
}

function PlayerPanelComponent({ index, cols, rows, isEvenPlayerIndexNumber }: Props) {
  const playerSelector = useCallback((s: LifeStore) => s.players[index], [index]);
  const player = useLifeStore(playerSelector);

  const totalPlayers = useLifeStore((s) => s.players.length);

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const changeLife = useLifeStore((s) => s.changeLife);
  const { current: currentTurn, isSpinning, isFinished } = useTurnStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const backgroundSelector = useCallback(
    (s: PlayerBackgroundState) => (player ? s.backgrounds[player.id] : undefined),
    [player],
  );
  const background = usePlayerBackgroundStore(backgroundSelector);

  const { views, numRealViews } = useMemo(() => {
    const baseViews = [
      { type: ViewMode.LIFE },
      { type: ViewMode.COMMANDER },
      { type: ViewMode.COUNTERS },
    ];
    const realViews =
      totalPlayers === 2 ? baseViews.filter((v) => v.type !== ViewMode.COMMANDER) : baseViews;
    const finalViews = [
      realViews[realViews.length - 1], // Cloned last item
      ...realViews,
      realViews[0], // Cloned first item
    ];
    return { views: finalViews, numRealViews: realViews.length };
  }, [totalPlayers]);

  const usableW = W - (cols + 1) * GAP;
  const usableH = H - top - bottom - (rows + 1) * GAP;
  const panelW = usableW / cols;
  const panelH = usableH / rows;

  const { gesture, containerAnimatedStyle } = useCarousel({
    numRealViews,
    totalPlayers,
    isEvenPlayerIndexNumber,
    panelW,
    views,
    playerId: player?.id ?? -1,
  });

  if (!player) {
    return null;
  }

  const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';
  const rot2 = isEvenPlayerIndexNumber ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;

  const imageNode = background ? (
    <Image
      source={typeof background.url === 'string' ? { uri: background.url } : background.url}
      style={[
        styles.imageStyle,
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

  const panelBackgroundColor = background ? 'transparent' : player.backgroundColor;

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
        {isSpinning && currentTurn === index && (
          <View style={styles.turnOrderOverlay}>
            <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
          </View>
        )}
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
                {view.type === ViewMode.LIFE && (
                  <LifeView
                    life={player.life}
                    delta={player.delta}
                    changeLifeByAmount={changeLifeByAmount}
                    handleLongPressStart={handleLongPressStart}
                    handlePressOut={handlePressOut}
                  />
                )}
                {view.type === ViewMode.COMMANDER && (
                  <View style={{ width: panelH, transform: [{ rotate: '90deg' }] }}>
                    <Text style={styles.panelText}>Damage Received</Text>
                  </View>
                )}
                {view.type === ViewMode.COUNTERS && (
                  <CountersView menuVisible menuType={ViewMode.COUNTERS} index={index} />
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: 'rgba(0, 0, 0, 0.55)',
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
  panelText: {
    ...typography.heading2,
    color: OFF_WHITE,
    textAlign: 'center',
    padding: spacing.md,
  },
  placeholderView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
