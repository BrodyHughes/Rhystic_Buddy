// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { useCommanderDamageModeStore } from '@/features/commander-damage/store/useCommanderDamageModeStore';
import {
  BORDER_WIDTH,
  DAMAGE_INCREMENTER_BUTTON_COLOR,
  LIGHT_GREY,
  TURN_WINNER_OVERLAY_BORDER_COLOR,
} from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import { BlurView } from '@react-native-community/blur';

interface Props {
  dealerId: number;
  appliedRot: string;
  isEvenPlayerIndexNumber: boolean;
}

export default function DamageIncrementer({
  dealerId,
  appliedRot,
  isEvenPlayerIndexNumber,
}: Props) {
  const defenderId = useCommanderDamageModeStore((s) => s.defenderId);
  const damage = useCommanderDamageStore((s) => s.get(defenderId as number, dealerId));
  const change = useCommanderDamageStore((s) => s.change);

  const inc = () => change(defenderId as number, dealerId, 1);
  const dec = () => (damage > 0 ? change(defenderId as number, dealerId, -1) : null);

  // Counter-rotate the content to make it readable
  const counterRotation = appliedRot.includes('180')
    ? '180deg'
    : appliedRot.includes('270')
      ? '90deg'
      : appliedRot.includes('90')
        ? '270deg'
        : '0deg';

  const incStyle = isEvenPlayerIndexNumber ? styles.topButton : styles.bottomButton;
  const decStyle = isEvenPlayerIndexNumber ? styles.bottomButton : styles.topButton;

  return (
    <View style={styles.container}>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
      <View style={[styles.damageBlock, { transform: [{ rotate: counterRotation }] }]}>
        <Text style={styles.damageText}>{damage}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.1} style={[styles.button, incStyle]} onPress={inc} />
      <TouchableOpacity activeOpacity={0.1} style={[styles.button, decStyle]} onPress={dec} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: BORDER_WIDTH,
    borderColor: TURN_WINNER_OVERLAY_BORDER_COLOR,
  },
  damageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  damageText: {
    ...typography.heading1,
    color: LIGHT_GREY,
  },
  button: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButton: {
    top: 0,
    backgroundColor: DAMAGE_INCREMENTER_BUTTON_COLOR,
    borderRadius: radius.sm,
  },
  bottomButton: {
    bottom: 0,
    backgroundColor: DAMAGE_INCREMENTER_BUTTON_COLOR,
    borderRadius: radius.sm,
  },
});
