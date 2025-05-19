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
  const {life, delta, id, theme} = useLifeStore(
    (s: {players: any[]}) => s.players[index],
  );
  const isEven = id % 2 === 0;
  const changeLife = useLifeStore((s: {changeLife: any}) => s.changeLife);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          transform: [{rotate: !isEven ? '180deg' : '0deg'}],
        },
      ]}>
      <View style={styles.lifeBlock}>
        <Text style={styles.life}>{life}</Text>
        {delta !== 0 && (
          // eslint-disable-next-line react-native/no-inline-styles
          <Text style={[styles.delta, {color: delta > 0 ? '#000' : '#000'}]}>
            {delta > 0 ? `+${delta}` : delta}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, styles.increment]}
        onPress={() => changeLife(index, +1)}>
        <Text style={styles.btnText}>＋</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.decrement]}
        onPress={() => changeLife(index, -1)}>
        <Text style={styles.btnText}>－</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '49%',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    padding: spacing.md,
    borderRadius: radius.md,
    margin: spacing.xs,
  },
  lifeBlock: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    // backgroundColor: 'red',
    transform: [{rotate: '90deg'}],
  },
  life: {...typography.heading1},
  delta: {
    ...typography.caption,
    marginTop: 2,
    position: 'absolute',
    bottom: -12,
    left: '53%',
    transform: [{translateX: -67}],
  },
  button: {
    // backgroundColor: palette.primary,
    borderRadius: 0,
    position: 'absolute',
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  increment: {
    right: 0,
  },
  decrement: {
    left: 0,
  },
  btnText: {
    color: palette.textPrimary,
    transform: [{rotate: '90deg'}],
  },
});
