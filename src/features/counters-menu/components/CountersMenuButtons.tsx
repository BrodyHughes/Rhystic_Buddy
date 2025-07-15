import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import {
  BORDER_COLOR,
  COUNTERS_MENU_BUTTON_COLOR,
  OFF_WHITE,
  PRESSED_BUTTON_COLOR,
} from '@/consts/consts';
import { typography } from '@/styles/global';

type CounterKey = 'storm' | 'poison' | 'mana';

interface Props {
  defenderId: number;
  counter: CounterKey;
  cellW: number;
  cellH: number;
}

export default function CountersMenuButtons({ defenderId, counter, cellW, cellH }: Props) {
  const value = useCounterStore((s) => s.counters[defenderId]?.[counter] ?? 0);
  const changeCounter = useCounterStore((s) => s.changeCounter);

  return (
    <View style={[styles.square, { width: `${cellW - 2}%`, height: `${cellH - 4}%` }]}>
      <Text style={styles.total}>{value}</Text>

      <View style={styles.btnRow}>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          onPress={() => changeCounter(defenderId, counter, 1)}
        >
          <Text style={[styles.btnTxt, { marginBottom: 9 }]}>+</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          onPress={() => changeCounter(defenderId, counter, -1)}
        >
          <Text style={[styles.btnTxt, { marginTop: 9 }]}>‑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 3,
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: BORDER_COLOR,
    backgroundColor: COUNTERS_MENU_BUTTON_COLOR,
  },
  total: {
    ...typography.heading2,
    fontSize: 40,
    zIndex: 1,
    pointerEvents: 'box-none',
    marginTop: 5,
  },
  btnRow: {
    position: 'absolute',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: PRESSED_BUTTON_COLOR,
  },
  btnTxt: { ...typography.button, color: OFF_WHITE, fontSize: 24 },
});
