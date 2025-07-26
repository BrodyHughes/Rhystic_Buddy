import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

import { LifeStore, useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useTurnStore } from '@/features/central-menu/store/useTurnStore';
import { typography, spacing, radius } from '@/styles/global';
import CountersView from './CountersView';
import LifeView from './LifeView';
import BackgroundImage from './BackgroundImage';
import PanelOverlays from './PanelOverlays';
import { ViewMode } from '@/types/app';
import { BORDER_COLOR, OFF_WHITE, TEXT_SHADOW_COLOR } from '@/consts/consts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PlayerBackgroundState,
  usePlayerBackgroundStore,
} from '@/features/central-menu/store/usePlayerBackgroundStore';
import { useCarousel } from '@/hooks/useCarousel';

interface Props {
  index: number;
  cols: number;
  rows: number;
  isEvenPlayerIndexNumber: boolean;
  isLastPlayerOddLayout?: boolean;
  W: number;
  currentGap: number;
}

function PlayerPanelComponent({
  index,
  cols,
  rows,
  isEvenPlayerIndexNumber,
  isLastPlayerOddLayout,
  W,
  currentGap,
}: Props) {
  const playerSelector = useCallback((s: LifeStore) => s.players[index], [index]);
  const player = useLifeStore(playerSelector);

  const totalPlayers = useLifeStore((s) => s.players.length);

  const { height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const changeLife = useLifeStore((s) => s.changeLife);
  const { current: currentTurn, isSpinning, isFinished } = useTurnStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LIFE);

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

  const usableW = W - (cols + 1) * currentGap;
  const usableH = H - top - bottom - (rows + 1) * currentGap;
  const panelW = isLastPlayerOddLayout ? usableH / rows : usableW / cols;
  const panelH = isLastPlayerOddLayout ? W - currentGap * 2 : usableH / rows;

  const { gesture, containerAnimatedStyle } = useCarousel({
    totalPlayers,
    panelW,
    panelH,
    playerId: player?.id ?? -1,
    isLastPlayerOddLayout,
    isEvenPlayerIndexNumber,
    onViewChange: setCurrentView,
  });

  if (!player) {
    return null;
  }

  const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';
  const rot2 = isEvenPlayerIndexNumber ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;
  const finalRot = isLastPlayerOddLayout ? '270deg' : appliedRot;

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

  // For hub-and-spoke model, we arrange views differently
  const hasCommanderView = totalPlayers > 2;

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.shadowWrap,
          {
            width: panelW,
            height: panelH,
            transform: [{ rotate: finalRot }],
          },
        ]}
      >
        <BackgroundImage
          background={background || null}
          panelW={panelW}
          panelH={panelH}
          isDead={player.isDead || false}
        />
        <PanelOverlays
          isSpinning={isSpinning}
          isFinished={isFinished}
          isCurrentTurn={currentTurn === index}
          panelW={panelW}
          panelH={panelH}
        />
        <View style={styles.roundedClip}>
          <Animated.View
            style={[
              styles.viewsContainer,
              containerAnimatedStyle,
              { width: panelW * 4, height: panelH * 4 },
              // { backgroundColor: 'red' },
            ]}
          >
            {/* --- HORIZONTAL TRACK --- */}
            {/* Dummy Counters (for looping left from Life) */}
            <View
              style={[
                styles.viewPanel,
                styles.panelBorder,
                {
                  width: panelW,
                  height: panelH,
                  left: 0,
                  top: panelH,
                  backgroundColor: panelBackgroundColor,
                },
              ]}
            >
              <CountersView
                menuVisible
                menuType={ViewMode.COUNTERS}
                index={index}
                panelHeight={panelH}
                panelWidth={panelW}
                active={currentView === ViewMode.COUNTERS}
              />
            </View>

            {/* Real Life */}
            <View
              style={[
                styles.viewPanel,
                styles.panelBorder,
                {
                  width: panelW,
                  height: panelH,
                  left: panelW,
                  top: panelH,
                  backgroundColor: panelBackgroundColor,
                },
              ]}
            >
              <LifeView
                life={player.life}
                delta={player.delta}
                panelWidth={panelH}
                isDead={player.isDead}
                changeLifeByAmount={changeLifeByAmount}
                handleLongPressStart={handleLongPressStart}
                handlePressOut={handlePressOut}
              />
            </View>

            {/* Real Counters */}
            <View
              style={[
                styles.viewPanel,
                styles.panelBorder,
                {
                  width: panelW,
                  height: panelH,
                  left: 2 * panelW,
                  top: panelH,
                  backgroundColor: panelBackgroundColor,
                },
              ]}
            >
              <CountersView
                menuVisible
                menuType={ViewMode.COUNTERS}
                index={index}
                panelHeight={panelH}
                panelWidth={panelW}
                active={currentView === ViewMode.COUNTERS}
              />
            </View>

            {/* Dummy Life (for looping left from Counters) */}
            <View
              style={[
                styles.viewPanel,
                styles.panelBorder,
                {
                  width: panelW,
                  height: panelH,
                  left: 3 * panelW,
                  top: panelH,
                  backgroundColor: panelBackgroundColor,
                },
              ]}
            >
              <LifeView
                life={player.life}
                delta={player.delta}
                panelWidth={panelH}
                isDead={player.isDead}
                changeLifeByAmount={changeLifeByAmount}
                handleLongPressStart={handleLongPressStart}
                handlePressOut={handlePressOut}
              />
            </View>

            {/* --- VERTICAL TRACK --- */}
            {/* Dummy Commander (for looping up from Life) */}
            {hasCommanderView && (
              <View
                style={[
                  styles.viewPanel,
                  styles.panelBorder,
                  {
                    width: panelW,
                    height: panelH,
                    left: panelW,
                    top: 0,
                    backgroundColor: panelBackgroundColor,
                  },
                ]}
              >
                <View style={{ width: panelH, transform: [{ rotate: '90deg' }] }}>
                  <Text style={styles.panelText}>Damage Received</Text>
                </View>
              </View>
            )}

            {/* Real Life (at the intersection) is already rendered above */}

            {/* Real Commander */}
            {hasCommanderView && (
              <View
                style={[
                  styles.viewPanel,
                  styles.panelBorder,
                  {
                    width: panelW,
                    height: panelH,
                    left: panelW,
                    top: 2 * panelH,
                    backgroundColor: panelBackgroundColor,
                  },
                ]}
              >
                <View style={{ width: panelH, transform: [{ rotate: '90deg' }] }}>
                  <Text style={styles.panelText}>Damage Received</Text>
                </View>
              </View>
            )}

            {/* Dummy Life (for looping up from Commander) */}
            <View
              style={[
                styles.viewPanel,
                styles.panelBorder,
                {
                  width: panelW,
                  height: panelH,
                  left: panelW,
                  top: 3 * panelH,
                  backgroundColor: panelBackgroundColor,
                },
              ]}
            >
              <LifeView
                life={player.life}
                delta={player.delta}
                panelWidth={panelH}
                isDead={player.isDead}
                changeLifeByAmount={changeLifeByAmount}
                handleLongPressStart={handleLongPressStart}
                handlePressOut={handlePressOut}
              />
            </View>
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
    position: 'absolute',
    width: '200%',
    height: '200%',
  },
  viewPanel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
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
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20,
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
    transform: [{ rotate: '90deg' }],
  },
  panelBorder: {
    borderWidth: 7,
    borderColor: BORDER_COLOR,
  },
  lifeTxt: {
    ...typography.heading1,
    color: OFF_WHITE,
  },
  btnTxt: {
    ...typography.body,
    color: '#fff',
  },
  panelText: {
    ...typography.heading2,
    textAlign: 'center',
    padding: spacing.md,
  },
  placeholderView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
