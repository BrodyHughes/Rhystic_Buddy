import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { CARD_BACKGROUND_TRANSPARENT, LIGHT_GREY, PRESSED_BUTTON_COLOR } from '@/consts/consts';
import { radius, typography } from '@/styles/global';

type CounterKey = string;

interface Props {
  defenderId: number;
  counter: CounterKey;
  cellW: number;
  cellH: number;
  backgroundColor?: string;
}

export default function CountersMenuButtons({
  defenderId,
  counter,
  cellW,
  cellH,
  backgroundColor,
}: Props) {
  const value = useCounterStore((s) => s.counters[defenderId]?.[counter] ?? 0);
  const changeCounter = useCounterStore((s) => s.changeCounter);

  return (
    <View
      style={[
        styles.square,
        {
          width: cellW,
          height: cellH,
          backgroundColor: backgroundColor ?? CARD_BACKGROUND_TRANSPARENT,
        },
      ]}
    >
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
    borderRadius: radius.md,
    margin: 6,
    overflow: 'hidden',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  total: {
    ...typography.heading2,
    fontFamily: 'Comfortaa',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 9,
    zIndex: 1,
    pointerEvents: 'box-none',
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
  btnTxt: { ...typography.button, color: LIGHT_GREY, fontSize: 22 },
});
