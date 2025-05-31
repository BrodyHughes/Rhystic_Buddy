import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { SURFACE } from '@/consts/consts';

interface Props {
  defenderId: number;
  sourceId: number;
  cellW: number;
  cellH: number;
  isEven: boolean;
}

export default function CommanderDamageButtons({
  defenderId,
  sourceId,
  cellW,
  cellH,
  isEven,
}: Props) {
  const damage = useCommanderDamageStore((s) => s.get(defenderId, sourceId));
  const change = useCommanderDamageStore((s) => s.change);

  const inc = () => change(defenderId, sourceId, +1);
  const dec = () => damage > 0 && change(defenderId, sourceId, -1);

  return (
    <View
      style={[
        // width is cellH - 2 to account for margin
        // height is cellW - 4 to account for margin
        // margin is set in styles.square
        styles.square,
        { width: `${cellH - 2}%`, height: `${cellW - 4}%` },
        { transform: [{ rotate: isEven ? '0deg' : '180deg' }] },
      ]}
    >
      <Text style={styles.total}>{damage}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={dec} activeOpacity={0.8}>
          <Text style={styles.btnTxt}>‑</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={inc} activeOpacity={0.8}>
          <Text style={styles.btnTxt}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
    overflow: 'hidden',
  },
  total: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    zIndex: 1,
    pointerEvents: 'box-none',
  },
  btnRow: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btn: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE,
  },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
