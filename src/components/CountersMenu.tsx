import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CountersMenuButtons from '@/components/CountersMenuButtons';

interface Props {
  defenderId: number;
}

const COUNTERS = [
  { key: 'storm', label: '⚡' }, // ⚡ or any icon font / image you prefer
  { key: 'poison', label: '☠' },
  { key: 'mana', label: '🌊' },
] as const;

export default function CountersMenu({ defenderId }: Props) {
  /* 2 rows (icon + square) × 3 columns */
  const rows = 2,
    cols = 3;
  const cellW = 100 / cols - 2;
  const cellH = 100 / rows;

  return (
    <View style={styles.overlay}>
      <View style={[styles.grid]}>
        {COUNTERS.map(({ key, label }) => (
          <View
            key={key}
            style={[
              styles.column,
              { width: `${cellW}%`, height: `${cellH}%` }, // two cells tall
            ]}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.iconTxt}>{label}</Text>
            </View>

            <CountersMenuButtons defenderId={defenderId} counter={key} cellW={100} cellH={100} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 40,
    width: '100%',
    height: '100%',
  },

  /* column wrapper */
  column: {
    alignItems: 'center',
    margin: 2,
  },

  /* icon styles */
  iconWrap: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
