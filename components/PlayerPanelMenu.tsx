import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import CommanderDamageMenu from './CommanderDamageMenu';
import CountersMenu from './CountersMenu';
import {BACKGROUND} from '../consts/consts';

type Props = {
  menuVisible: boolean;
  menuType: string | null;
  index: number;
};

export default function PlayerPanelMenu({menuVisible, menuType, index}: Props) {
  /* hold the panel’s run‑time size */
  const [dims, setDims] = useState<{w: number; h: number} | null>(null);

  if (!menuVisible) return null;

  return (
    <View
      style={styles.overlay}
      onLayout={e => {
        const {width, height} = e.nativeEvent.layout;
        if (!dims || dims.w !== width || dims.h !== height) {
          setDims({w: width, h: height});
        }
      }}>
      <View
        style={[
          styles.content,
          dims && {
            width: dims.h,
            height: dims.w,
            transform: [{rotate: '90deg'}],
          },
        ]}>
        {menuType === 'menu1' && <CommanderDamageMenu defenderId={index} />}
        {menuType === 'menu2' && <CountersMenu defenderId={index} />}
      </View>
    </View>
  );
}

/* ── static styles ── */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 20},
});
