import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { BORDER_COLOR, CHIP_BACKGROUND, LIGHT_GREY, TEXT_SHADOW_COLOR } from '@/consts/consts';
import { LETHAL_COMMANDER_DAMAGE } from '@/consts/counters';
import { radius, spacing, typography } from '@/styles/global';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { getTableSeats } from '@/lib/tableSeats';
import { useSettingsStore } from '@/features/central-menu/store/useSettingsStore';

// Screen-space cell size; the map is drawn in screen orientation so it mirrors the real table.
const CELL_W = 19;
const CELL_H = 23;
const CELL_GAP = 2;

const EMPTY_ROW: Record<number, number> = {};

interface Props {
  playerId: number;
}

function CommanderDamageMap({ playerId }: Props) {
  const totalPlayers = useLifeStore((s) => s.players.length);
  const damage = useCommanderDamageStore((s) => s.damage[playerId] ?? EMPTY_ROW);

  const enabled = useSettingsStore((s) => s.showCommanderDamageMap);
  const seats = useMemo(() => getTableSeats(totalPlayers), [totalPlayers]);
  const hasDamage = Object.values(damage).some((d) => d > 0);
  if (!enabled || seats.length < 3 || !hasDamage) return null;

  const rows = Math.ceil(seats.length / 2);
  const mapW = 2 * CELL_W + CELL_GAP;
  const mapH = rows * CELL_H + (rows - 1) * CELL_GAP;
  // Panel content is rotated a further 90° inside the panel (see LifeView).
  const ownSeat = seats[playerId];
  const contentRotation = (ownSeat.rotation + 90) % 360;
  const sideways = contentRotation % 180 !== 0;
  // The reader's top edge is the panel's inner screen edge (or its top edge for the full-width
  // odd last player). When that edge's midpoint is the screen centre, the central menu button
  // covers it, so shift the map to the reader's top-left corner instead.
  const topEdgeMidY = ownSeat.colSpan === 2 ? ownSeat.row : ownSeat.row + 0.5;
  const underMenuButton = topEdgeMidY === rows / 2;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.container, underMenuButton && styles.containerStart]}
      pointerEvents="none"
    >
      <View style={{ width: sideways ? mapH : mapW, height: sideways ? mapW : mapH }}>
        <View
          style={[
            styles.map,
            {
              width: mapW,
              height: mapH,
              left: sideways ? (mapH - mapW) / 2 : 0,
              top: sideways ? (mapW - mapH) / 2 : 0,
              transform: [{ rotate: `${-contentRotation}deg` }],
            },
          ]}
        >
          {seats.map((seat, id) => {
            const isSelf = id === playerId;
            const value = damage[id] ?? 0;
            return (
              <View
                key={id}
                style={[
                  styles.cell,
                  {
                    left: seat.col * (CELL_W + CELL_GAP),
                    top: seat.row * (CELL_H + CELL_GAP),
                    width: seat.colSpan * CELL_W + (seat.colSpan - 1) * CELL_GAP,
                  },
                  isSelf ? styles.selfCell : styles.opponentCell,
                ]}
              >
                {value >= LETHAL_COMMANDER_DAMAGE && <View style={styles.lethalRing} />}
                {!isSelf && value > 0 && (
                  <Text
                    style={[styles.value, { transform: [{ rotate: `${contentRotation}deg` }] }]}
                  >
                    {value}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  containerStart: {
    alignItems: 'flex-start',
    paddingLeft: spacing.md,
  },
  map: {
    position: 'absolute',
  },
  cell: {
    position: 'absolute',
    height: CELL_H,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentCell: {
    backgroundColor: CHIP_BACKGROUND,
  },
  selfCell: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  // Drawn as an overlay so the border doesn't shrink the box the value is centered in.
  lethalRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: LIGHT_GREY,
  },
  value: {
    ...typography.button,
    color: LIGHT_GREY,
    fontSize: 13,
    lineHeight: 15,
    fontWeight: 900,
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});

export default React.memo(CommanderDamageMap);
