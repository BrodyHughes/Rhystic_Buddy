/* idk about the styling for this tbh but the functionality is in place atm
 * TODO:
 * [ ] make it look nice
 * [ ] fix the '+' and '-' they are rotating wrong sometimes
 * [ ] add a long press on the cards to bring up an individual menu
 * for commander damage etc
 * [ ] add a 'who goes first' randomizer
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

import {useLifeStore} from '../store/useLifeStore';
import {typography, spacing, radius} from '../styles/global';
import {GAP} from '../App';

interface Props {
  index: number;
  cols: number;
  rows: number;
  isEven: boolean;
}

export default function PlayerPanel({index, cols, rows, isEven}: Props) {
  const {width: W, height: H} = useWindowDimensions();
  const {top, bottom} = useSafeAreaInsets();

  const {life, delta} = useLifeStore(s => s.players[index]);
  const changeLife = useLifeStore(s => s.changeLife);
  const totalPlayers = useLifeStore(s => s.players.length);

  /* lets nest some ternaries! */
  const rot = isEven ? '0deg' : '180deg';
  const rot2 = isEven ? '90deg' : '270deg';
  const appliedRot = totalPlayers === 2 ? rot2 : rot;

  /* size minus gaps & insets */
  const usableW = W - 2 * GAP - GAP * (cols - 1);
  const usableH = H - top - bottom - 2 * GAP - GAP * (rows - 1);
  const panelW = usableW / cols;
  const panelH = usableH / rows;

  /* blur amount: lighter for dark mode, tweak as desired */
  const blurAmount = 20;

  return (
    <View
      style={[
        styles.wrapper,
        {width: panelW, height: panelH, transform: [{rotate: appliedRot}]},
      ]}>
      {/** Frosted glass layer */}
      {Platform.OS === 'android' && Platform.Version < 31 ? (
        // Older Android: fallback to translucent overlay
        <View style={styles.fallbackGlass} />
      ) : (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.15)"
        />
      )}

      {/** Inner content */}
      <View style={styles.content}>
        <View style={styles.lifeBlock}>
          <Text style={styles.life}>{life}</Text>
          {delta !== 0 && (
            <Text style={styles.delta}>{delta > 0 ? `+${delta}` : delta}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.inc]}
          onPress={() => changeLife(index, +1)}>
          <Text style={styles.btnText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dec]}
          onPress={() => changeLife(index, -1)}>
          <Text style={styles.btnText}>－</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Styles ────────────────────────────────────────────── */

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden', // clip blur to panel bounds
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)', // subtle inner stroke
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
  },
  fallbackGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeBlock: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    transform: [{rotate: '90deg'}],
  },
  life: {...typography.heading1, color: '#fff'},
  delta: {
    ...typography.caption,
    color: '#fff',
    marginTop: 2,
    position: 'absolute',
    bottom: 13,
    right: -20,
    transform: [{translateX: -67}],
  },
  /* ± buttons */
  button: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inc: {right: 0},
  dec: {left: 0},
  btnText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    transform: [{rotate: '90deg'}],
  },
});
