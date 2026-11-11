import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { Crown, LucideIcon, Skull } from 'lucide-react-native';

import {
  CHIP_ICON_SIZE,
  COUNTER_ORDER,
  COUNTERS,
  CounterType,
  LETHAL_COMMANDER_DAMAGE,
  LETHAL_POISON,
} from '@/consts/counters';
import { CHIP_BACKGROUND, LIGHT_GREY, TEXT_SHADOW_COLOR } from '@/consts/consts';
import { radius, spacing, typography } from '@/styles/global';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { useTableStatusStore } from '@/features/central-menu/store/useTableStatusStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import CommanderDamageMap from '@/features/commander-damage/components/CommanderDamageMap';
import { useSettingsStore } from '@/features/central-menu/store/useSettingsStore';

interface Props {
  playerId: number;
  isDead?: boolean;
  isLifeLethal: boolean;
}

function Chip({
  Icon,
  value,
  onPress,
}: {
  Icon: LucideIcon;
  value?: number;
  onPress?: () => void;
}) {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} pointerEvents={onPress ? 'auto' : 'none'}>
      <Pressable
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        onPress={onPress}
        hitSlop={spacing.xs}
      >
        <Icon color={LIGHT_GREY} size={CHIP_ICON_SIZE} />
        {value !== undefined && <Text style={styles.value}>{value}</Text>}
      </Pressable>
    </Animated.View>
  );
}

function CounterChip({ playerId, counter }: { playerId: number; counter: CounterType }) {
  const value = useCounterStore((s) => s.counters[playerId]?.[counter] ?? 0);
  return <Chip Icon={COUNTERS[counter].Icon} value={value} />;
}

function CounterChips({ playerId, isDead, isLifeLethal }: Props) {
  const showCounterChips = useSettingsStore((s) => s.showCounterChips);
  const activeCounters = useCounterStore(
    useShallow((s) => COUNTER_ORDER.filter((k) => (s.counters[playerId]?.[k] ?? 0) > 0)),
  );
  const isMonarch = useTableStatusStore((s) => s.monarch === playerId);
  const toggleDead = useLifeStore((s) => s.toggleDead);

  const poisonLethal = useCounterStore((s) => (s.counters[playerId]?.poison ?? 0) >= LETHAL_POISON);
  const commanderLethal = useCommanderDamageStore((s) => {
    const row = s.damage[playerId];
    for (const source in row) {
      if (row[source] >= LETHAL_COMMANDER_DAMAGE) return true;
    }
    return false;
  });
  const showLethal = !isDead && (isLifeLethal || poisonLethal || commanderLethal);

  return (
    <>
      <CommanderDamageMap playerId={playerId} />
      <View style={styles.lethal} pointerEvents="box-none">
        {showLethal && <Chip Icon={Skull} onPress={() => toggleDead(playerId)} />}
      </View>
      <View style={styles.row} pointerEvents="box-none">
        {isMonarch && <Chip Icon={Crown} />}
        {showCounterChips &&
          activeCounters.map((k) => <CounterChip key={k} playerId={playerId} counter={k} />)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  lethal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: spacing.md,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: CHIP_BACKGROUND,
  },
  pressed: {
    opacity: 0.6,
  },
  value: {
    ...typography.button,
    color: LIGHT_GREY,
    fontWeight: '900',
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

export default React.memo(CounterChips);
