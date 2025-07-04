import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { BORDER_COLOR } from '@/consts/consts';

interface Props {
  defenderId: number;
  sourceId: number;
  cellW: number;
  cellH: number;
  isEvenPlayerIndexNumber: boolean;
  onPress: () => void;
}

export default function CommanderDamageButtons({
  defenderId,
  sourceId,
  cellW,
  cellH,
  isEvenPlayerIndexNumber,
  onPress,
}: Props) {
  const damage = useCommanderDamageStore((s) => s.get(defenderId, sourceId));

  return (
    <TouchableOpacity
      style={[
        styles.square,
        { width: `${cellH - 3}%`, height: `${cellW - 6}%` },
        { transform: [{ rotate: isEvenPlayerIndexNumber ? '0deg' : '180deg' }] },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.total}>{damage}</Text>
    </TouchableOpacity>
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
    backgroundColor: 'rgba(214, 214, 214, 0.13)',
  },
  total: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'Comfortaa-Bold',
    zIndex: 1,
    pointerEvents: 'box-none',
  },
});
