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
  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const totalPlayersCount = players.length;

  const layouts = useMemo(() => {
    const layoutMap: {
      [playerId: number]: { style: any; rot: string; isEven: boolean };
    } = {};
    if (!totalPlayersCount) return layoutMap;

    const currentLayout = layoutConfigurations[totalPlayersCount] || layoutConfigurations[4];
    const { columns, rows } = currentLayout;
    const usableW = W - (columns + 1) * gap;
    const usableH = H - top - bottom - (rows + 1) * gap;
    const regularPanelW = usableW / columns;
    const regularPanelH = usableH / rows;

    switch (totalPlayersCount) {
      case 3:
      case 5: {
        const widePanelW = usableH / rows; // Pre-rotation height
        const widePanelH = W - gap * 2; // Pre-rotation width

        players.forEach((player, index) => {
          const isLastPlayerOddLayout =
            (totalPlayersCount === 3 && index === 2) || (totalPlayersCount === 5 && index === 4);

          const panelW = isLastPlayerOddLayout ? widePanelW : regularPanelW;
          const panelH = isLastPlayerOddLayout ? widePanelH : regularPanelH;
          const isEven = isLastPlayerOddLayout ? false : index % 2 === 0;

          const rot = isEven ? '0deg' : '180deg';
          const containerRot = isLastPlayerOddLayout ? '180deg' : '90deg';

          let gridCellTop: number;
          let gridCellLeft: number;
          let cellH: number;
          let cellW: number;

          if (isLastPlayerOddLayout) {
            const rowIndex = Math.floor(index / 2);
            gridCellTop = rowIndex * (regularPanelH + gap) + gap + top;
            gridCellLeft = gap;
            cellH = regularPanelH;
            cellW = W - 2 * gap;
          } else {
            gridCellTop = Math.floor(index / columns) * (regularPanelH + gap) + gap + top;
            gridCellLeft = (index % columns) * (regularPanelW + gap) + gap;
            cellH = regularPanelH;
            cellW = regularPanelW;
          }

          const style = {
            position: 'absolute' as const,
            width: panelH,
            height: panelW,
            top: gridCellTop + (cellH - panelW) / 2,
            left: gridCellLeft + (cellW - panelH) / 2,
            transform: [{ rotate: containerRot }],
          };
          layoutMap[player.id] = { style, rot, isEven };
        });
        break;
      }
      default:
        players.forEach((player, index) => {
          const isEven = index % 2 === 0;
          const panelRot = isEven ? '0deg' : '180deg';
          const twoPlayerPanelRot = isEven ? '90deg' : '270deg';
          const rot = totalPlayersCount === 2 ? twoPlayerPanelRot : panelRot;
          const gridCellTop = Math.floor(index / columns) * (regularPanelH + gap) + gap + top;
          const gridCellLeft = (index % columns) * (regularPanelW + gap) + gap;

          const style = {
            position: 'absolute' as const,
            width: regularPanelH,
            height: regularPanelW,
            top: gridCellTop + (regularPanelH - regularPanelW) / 2,
            left: gridCellLeft + (regularPanelW - regularPanelH) / 2,
            transform: [{ rotate: '90deg' }],
          };
          layoutMap[player.id] = { style, rot, isEven };
        });
    }
    return layoutMap;
  }, [players, totalPlayersCount, layoutConfigurations, W, H, top, bottom, gap]);

  return (
    <Animated.View
      style={styles.overlayManagerContainer}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
    >
      {Object.entries(layouts).map(([playerId, { style, rot, isEven }]) => {
        if (Number(playerId) === defenderId) {
          return null;
        }

        return (
          <View key={playerId} style={style}>
            <DamageIncrementer
              dealerId={Number(playerId)}
              appliedRot={rot}
              isEvenPlayerIndexNumber={isEven}
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
