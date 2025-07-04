import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CommanderDamageMenu from '@/components/commanderDamage/CommanderDamageMenu';
import CountersMenu from '@/components/countersMenu/CountersMenu';

type Props = {
  menuVisible: boolean;
  menuType: string | null;
  index: number;
  isEvenPlayerIndexNumber: boolean;
  appliedRot: string;
};

export default function PlayerPanelMenu({
  menuVisible,
  menuType,
  index,
  isEvenPlayerIndexNumber,
  appliedRot,
}: Props) {
  /* hold the panel's run-time size */
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  if (!menuVisible) return null;

  return (
    <View
      style={styles.overlay}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!dims || dims.w !== width || dims.h !== height) {
          setDims({ w: width, h: height });
        }
      }}
    >
      <View
        style={[
          styles.content,
          dims && {
            width: dims.h,
            height: dims.w,
            transform: [{ rotate: '90deg' }],
          },
        ]}
      >
        {menuType === 'commander' && (
          <CommanderDamageMenu
            isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            defenderId={index}
            appliedRot={appliedRot}
          />
        )}
        {menuType === 'counters' && <CountersMenu defenderId={index} />}
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
  text: { color: '#fff', fontSize: 24, fontFamily: 'Comfortaa-Bold', marginBottom: 20 },
});
