/**
 * This is the player panel that will be used to display the player's life.
 *
 * TODO:
 * - add poison counter
 * - add commander damage
 * - add other counters
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useLifeStore} from '../store/useLifeStore';
import {palette, typography, spacing, radius} from '../styles/global';
interface Props {
  index: number;
}

export default function PlayerPanel({index}: Props) {
  const {life, delta} = useLifeStore((s: {players: any[]}) => s.players[index]);
  const changeLife = useLifeStore((s: {changeLife: any}) => s.changeLife);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLife(index, +1)}>
        <Text style={styles.btnText}>＋</Text>
      </TouchableOpacity>

      <View style={styles.lifeBlock}>
        <Text style={styles.life}>{life}</Text>
        {delta !== 0 && (
          <Text
            style={[
              styles.delta,
              {color: delta > 0 ? palette.success : palette.danger},
            ]}>
            {delta > 0 ? `+${delta}` : delta}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => changeLife(index, -1)}>
        <Text style={styles.btnText}>－</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%', // ← half the screen width
    height: '50%', // ← half the screen height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.surface,
    padding: spacing.md,
  },
  lifeBlock: {alignItems: 'center', marginVertical: spacing.sm},
  life: {...typography.heading1},
  delta: {...typography.caption, marginTop: 2},
  button: {
    backgroundColor: palette.primary,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontSize: 32, fontWeight: '600'},
});
