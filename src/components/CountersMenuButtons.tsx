import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCounterStore } from '@/store/useCounterStore';

type CounterKey = 'storm' | 'poison' | 'mana';

interface Props {
  defenderId: number; // ← new
  counter: CounterKey;
  cellW: number;
  cellH: number;
}

export default function CountersMenuButtons({ defenderId, counter, cellW, cellH }: Props) {
  /* current value */
  const value = useCounterStore((s) => {
    const row = s.get(defenderId);
    return counter === 'storm' ? row.storm : counter === 'poison' ? row.poison : row.mana;
  });

  /* increment / decrement handlers */
  const inc = useCounterStore(
    counter === 'storm'
      ? (s) => s.incStorm
      : counter === 'poison'
        ? (s) => s.incPoison
        : (s) => s.incMana,
  );

  const dec = () => inc(defenderId, -1);

  return (
    <View style={[styles.square, { width: `${cellW - 2}%`, height: `${cellH - 4}%` }]}>
      <Text style={styles.total}>{value}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={dec} activeOpacity={0.8}>
          <Text style={styles.btnTxt}>‑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => inc(defenderId, +1)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTxt}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    backgroundColor: 'rgb(96,96,96)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    margin: -40,
  },
  iconTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  total: { color: '#fff', fontSize: 32, fontWeight: '700' },

  btnRow: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(180, 180, 180, 0.4)',
  },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
