// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import DamageIncrementer from './DamageIncrementer';

interface Props {
  defenderId: number;
  layoutConfigurations: { [count: number]: { columns: number; rows: number } };
  gap: number;
}

function GlobalDamageOverlays({ defenderId, layoutConfigurations, gap }: Props) {
  const players = useLifeStore((s) => s.players);
  const playerIds = useMemo(() => players.map((p) => p.id), [players]);

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const totalPlayersCount = players.length;
  const currentLayout = layoutConfigurations[totalPlayersCount] || layoutConfigurations[4];
  const { columns, rows } = currentLayout;

  const usableW = W - (columns + 1) * gap;
  const usableH = H - top - bottom - (rows + 1) * gap;
  const panelW = usableW / columns;
  const panelH = usableH / rows;

  return (
    <Animated.View
      style={styles.overlayManagerContainer}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
    >
      {playerIds.map((playerId, index) => {
        if (playerId === defenderId) {
          return null;
        }

        // The original panel is rotated 0 or 180. The DamageIncrementer needs this value to counter-rotate its content.
        const isEvenPlayerIndexNumber = index % 2 === 0;
        const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';

        // The overlay itself is rotated 90deg to match the panel's internal content flow.
        const gridCellTop = Math.floor(index / columns) * (panelH + gap) + gap + top;
        const gridCellLeft = (index % columns) * (panelW + gap) + gap;

        const panelStyle = {
          position: 'absolute' as const,
          width: panelH, // Swapped with height bc its rotated 90deg
          height: panelW, // Swapped with width bc its rotated 90deg
          top: gridCellTop + (panelH - panelW) / 2, // Center vertically
          left: gridCellLeft + (panelW - panelH) / 2, // Center horizontally
          transform: [{ rotate: '90deg' }],
        };

        return (
          <View key={playerId} style={panelStyle}>
            <DamageIncrementer
              dealerId={playerId}
              appliedRot={rot}
              isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            />
          </View>
        );
      })}
    </Animated.View>
  );
}

export default React.memo(GlobalDamageOverlays);

const styles = StyleSheet.create({
  overlayManagerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    pointerEvents: 'box-none',
  },
});
