/* idk about the styling for this tbh but the functionality is in place atm
 * TODO:
 * [ ] make it look nice
 * [ ] fix the '+' and '-' they are rotating wrong sometimes
 * [ ] add a long press on the cards to bring up an individual menu
 * for commander damage etc
 * [ ] add a 'who goes first' randomizer
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import {useLifeStore} from '../store/useLifeStore';
import {useTurnStore} from '../store/useTurnStore';
import {typography, spacing, radius} from '../styles/global';
import PlayerPanelMenu from './PlayerPanelMenu';
import {GAP, SURFACE} from '../consts/consts';
interface Props {
  index: number;
  cols: number;
  rows: number;
  isEven: boolean;
}

enum PanelView {
  PANEL = 'panel',
  MENU1 = 'menu1',
  MENU2 = 'menu2',
}

export default function PlayerPanel({index, cols, rows, isEven}: Props) {
  const {width: W, height: H} = useWindowDimensions();
  const {top, bottom} = useSafeAreaInsets();
  const green = 'rgb(100, 200, 100)';
  const red = 'rgb(200, 100, 100)';
  const {life, delta} = useLifeStore(s => s.players[index]);
  const changeLife = useLifeStore(s => s.changeLife);
  const totalPlayers = useLifeStore(s => s.players.length);
  const currentTurn = useTurnStore(s => s.current);

  const [view, setView] = useState<PanelView>(PanelView.PANEL);

  const cycleView = (direction: 'left' | 'right') => {
    setView(currentView => {
      const views = [PanelView.PANEL, PanelView.MENU1, PanelView.MENU2];
      let currentIndex = views.indexOf(currentView);
      if (direction === 'left') {
        currentIndex = (currentIndex + 1) % views.length;
      } else {
        currentIndex = (currentIndex - 1 + views.length) % views.length;
      }
      return views[currentIndex];
    });
  };

  const swipeGesture = Gesture.Pan().onEnd(e => {
    const {translationX} = e;

    if (translationX > 50) runOnJS(cycleView)('right');
    else if (translationX < -50) runOnJS(cycleView)('left');
  });

  /* lets nest some ternaries! */
  const rot = isEven ? '0deg' : '180deg';
  const rot2 = isEven ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;

  /* size minus gaps & insets */
  const usableW = W - 2 * GAP - GAP * (cols - 1);
  const usableH = H - top - bottom - 2 * GAP - GAP * (rows - 1);
  const panelW = usableW / cols;
  const panelH = usableH / rows;

  return (
    <GestureDetector gesture={swipeGesture}>
      <View
        style={[
          styles.shadowWrap,
          {width: panelW, height: panelH, transform: [{rotate: appliedRot}]},
        ]}>
        {currentTurn === index && <View style={styles.turnOrderOverlay} />}
        <View style={styles.roundedClip}>
          {view !== PanelView.PANEL && (
            <PlayerPanelMenu
              // @ts-ignore. error is fine. uncomment to see it if u want to debug but its okay.
              menuVisible={view !== PanelView.PANEL}
              menuType={view}
              index={index}
            />
          )}
          <View style={styles.content}>
            <View style={styles.lifeBlock}>
              <Text style={styles.life}>{life}</Text>
              {delta !== 0 && (
                <Text style={[styles.delta, {color: delta > 0 ? green : red}]}>
                  {delta > 0 ? `+${delta}` : delta}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.inc]}
              onPress={() => changeLife(index, +1)}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.dec]}
              onPress={() => changeLife(index, -1)}
            />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

/* ── Styles ────────────────────────────────────────────── */

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 0},
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
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE,
  },
  lifeBlock: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    transform: [{rotate: '90deg'}],
    zIndex: 1,
    pointerEvents: 'box-none',
  },
  life: {...typography.heading1, color: '#fff'},
  delta: {
    ...typography.caption,
    color: '#fff',
    marginTop: 2,
    position: 'absolute',
    bottom: 30,
    right: -100,
    transform: [{translateX: -67}],
  },
  button: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE,
  },
  inc: {bottom: 0},
  dec: {top: 0},
  btnText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    transform: [{rotate: '90deg'}],
  },
});
