import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { BORDER_COLOR, OFF_WHITE } from '@/consts/consts';
import { typography } from '@/styles/global';

interface Props {
  defenderId: number;
  sourceId: number;
  onClose: () => void;
}

export default function CommanderDamageEditor({ defenderId, sourceId, onClose }: Props) {
  const damage = useCommanderDamageStore((s) => s.get(defenderId, sourceId));
  const change = useCommanderDamageStore((s) => s.change);

  const inc = () => change(defenderId, sourceId, +1);
  const dec = () => (damage > 0 ? change(defenderId, sourceId, -1) : null);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X color={OFF_WHITE} size={36} />
      </TouchableOpacity>
      <View style={styles.modal}>
        <Text style={styles.total}>{damage}</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btn} onPress={inc}>
            <Text style={[styles.btnTxt, { marginBottom: 15 }]}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={dec}>
            <Text style={[styles.btnTxt, { marginTop: 15 }]}>‑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: 100,
    height: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 7,
    borderColor: BORDER_COLOR,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
  },
  total: {
    ...typography.heading1,
    color: '#fff',
    fontSize: 50,
    marginTop: 10,
    textAlign: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  btnRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  btn: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 200,
    fontFamily: 'Comfortaa-Bold',
  },
});
