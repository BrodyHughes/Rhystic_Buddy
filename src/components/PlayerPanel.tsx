/* idk about the styling for this tbh but the functionality is in place atm
 * TODO:
 * [ ] make it look nice
 * [ ] fix the '+' and '-' they are rotating wrong sometimes
 * [ ] add a long press on the cards to bring up an individual menu
 * for commander damage etc
 * [ ] add a 'who goes first' randomizer
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useLifeStore, PlayerState } from '@/store/useLifeStore';
import { useTurnStore } from '@/store/useTurnStore';
import { typography, spacing, radius } from '@/styles/global';
import PlayerPanelMenu from '@/components/PlayerPanelMenu';
import { GAP, BACKGROUND, TEXT, BORDER } from '@/consts/consts';

import { fetchCardByName } from '@/helpers/scryfallFetch.ts';
import PlayerPanelPlayerSettings from './PlayerPanelPlayerSettings';






interface Props {
  player: PlayerState;
  index: number;
  cols: number;
  rows: number;
  isEvenPlayerIndexNumber: boolean;
}

enum PanelView {
  PANEL = 'panel',
  COMMANDER_DAMAGE = 'commanderDamage',
  COUNTERS = 'counters',
  SETTINGS = 'settings',
}

function PlayerPanelComponent({ player, index, cols, rows, isEvenPlayerIndexNumber }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const green = 'rgb(255, 255, 255)';
  const red = 'rgb(255, 255, 255)';
  const { life, delta } = player;
  const changeLife = useLifeStore((s) => s.changeLife);
  const totalPlayers = useLifeStore((s) => s.players.length);
  const currentTurn = useTurnStore((s) => s.current);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [view, setView] = useState<PanelView>(PanelView.PANEL);

  const [cardName, setCardName] = useState('');
  const [cardImageUrl, setCardImageUrl] = useState<string | undefined>(undefined);

  const handleCardSearch = async () => {
    if (!cardName.trim()) return;

    try {
      const imageUrl = await fetchCardByName(cardName);
      if (imageUrl) {
        setCardImageUrl(imageUrl);
      } else {
        setCardImageUrl(undefined);
        // optionally show a "not found" message here
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  };


  const cycleView = (direction: 'left' | 'right') => {
    setView((currentView) => {
      const views = [
        PanelView.PANEL,
        PanelView.COMMANDER_DAMAGE,
        PanelView.COUNTERS,
        PanelView.SETTINGS,
      ];
      let currentIndex = views.indexOf(currentView);
      if (direction === 'left') {
        currentIndex = (currentIndex + 1) % views.length;
      } else {
        currentIndex = (currentIndex - 1 + views.length) % views.length;
      }
      return views[currentIndex];
    });
  };

  // swipe gestuers to handle menu navigation
  const swipeGesture = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;

    if (translationX > 50) runOnJS(cycleView)('right');
    else if (translationX < -50) runOnJS(cycleView)('left');
  });

  // flipped swipe gesture to handle menu navigation on the other side
  const flippedSwipeGesture = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;

    if (translationX > 50) runOnJS(cycleView)('left');
    else if (translationX < -50) runOnJS(cycleView)('right');
  });

  /* lets nest some ternaries! */
  const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';
  const rot2 = isEvenPlayerIndexNumber ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;

  /* size minus gaps & insets */
  const usableW = W - 3 * GAP;
  const usableH = H - top - bottom - 3 * GAP;
  const panelW = usableW / cols;
  const panelH = usableH / rows;

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
    <GestureDetector gesture={isEvenPlayerIndexNumber ? swipeGesture : flippedSwipeGesture}>
      <View
        style={[
          styles.shadowWrap,
          { width: panelW, height: panelH, transform: [{ rotate: appliedRot }] },
        ]}
      >
        {currentTurn === index && <View style={styles.turnOrderOverlay} />}
        <View style={styles.roundedClip}>
          {view !== PanelView.PANEL && (
            <PlayerPanelMenu
              // @ts-ignore. error is fine. uncomment to see it if u want to debug.
              menuVisible={view !== PanelView.PANEL}
              menuType={view}
              index={index}
              isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            />
          )}
          <View style={styles.content}>
            <View style={styles.lifeBlock}>
              <Text style={styles.life}>{life}</Text>
              {delta !== 0 && (
                <Text style={[styles.delta, { color: delta > 0 ? green : red }]}>
                  {delta > 0 ? `+${delta}` : delta}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.1}
              style={[styles.button, styles.inc]}
              onPress={() => changeLifeByAmount(1)}
              onLongPress={() => handleLongPressStart('inc')}
              onPressOut={handlePressOut}
              delayLongPress={1000}
            />

            <TouchableOpacity
              activeOpacity={0.1}
              style={[styles.button, styles.dec]}
              onPress={() => changeLifeByAmount(-1)}
              onLongPress={() => handleLongPressStart('dec')}
              onPressOut={handlePressOut}
              delayLongPress={1000}
            />
          </View>
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
  turnOrderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  roundedClip: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: BORDER,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND,
  },
  lifeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
    zIndex: 1,
    pointerEvents: 'none',
  },
  life: { ...typography.heading1, color: TEXT, marginRight: spacing.xs },
  delta: {
    ...typography.caption,
    color: TEXT,
  },
  button: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND,
  },
  inc: { right: 0 },
  dec: { left: 0 },
  btnText: {
    fontSize: 32,
    fontWeight: '600',
    color: TEXT,
    transform: [{ rotate: '90deg' }],
  },
});
