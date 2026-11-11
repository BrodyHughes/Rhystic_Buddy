import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { CHIP_BACKGROUND, LIGHT_GREY, PRESSED_BUTTON_COLOR } from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import type { CounterType } from '@/consts/counters';

interface Props {
  defenderId: number;
  counter: CounterType;
  step: number;
  size: number;
}

export default function CountersMenuButtons({ defenderId, counter, step, size }: Props) {
  const value = useCounterStore((s) => s.counters[defenderId]?.[counter] ?? 0);
  const changeCounter = useCounterStore((s) => s.changeCounter);

  return (
    <View style={[styles.square, { width: size, height: size }]}>
      <Pressable
        style={({ pressed }) => [styles.half, pressed && styles.pressed]}
        onPress={() => changeCounter(defenderId, counter, step)}
      />
      <Pressable
        style={({ pressed }) => [styles.half, pressed && styles.pressed]}
        onPress={() => changeCounter(defenderId, counter, -step)}
      />
      <View style={styles.content} pointerEvents="none">
        <Plus color={LIGHT_GREY} size={14} strokeWidth={3} />
        <Text style={styles.total}>{value}</Text>
        <Minus color={LIGHT_GREY} size={14} strokeWidth={3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: CHIP_BACKGROUND,
  },
  half: {
    flex: 1,
  },
  pressed: {
    backgroundColor: PRESSED_BUTTON_COLOR,
  },
  content: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  total: {
    ...typography.heading2,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
