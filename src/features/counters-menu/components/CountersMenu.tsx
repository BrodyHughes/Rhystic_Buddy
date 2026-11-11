import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ViewStyle, Alert } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { Check, Crown, Image as ImageIcon, LucideIcon, Plus, Skull, X } from 'lucide-react-native';

import CountersMenuButtons from './CountersMenuButtons';
import BackgroundSearch from '@/features/central-menu/modals/BackgroundSearch';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useTableStatusStore } from '@/features/central-menu/store/useTableStatusStore';
import {
  LIGHT_GREY,
  CHIP_BACKGROUND,
  DEAD_CARD_BACKGROUND,
  PLAINS,
  COUNTERS_DIVIDER_COLOR,
  BORDER_COLOR,
  MOUNTAIN,
} from '@/consts/consts';
import { radius, spacing, typography } from '@/styles/global';
import {
  ADDABLE_COUNTERS,
  CHIP_ICON_SIZE,
  COUNTER_ORDER,
  COUNTERS,
  CounterType,
  DEFAULT_COUNTERS,
  TILE_ICON_SIZE,
} from '@/consts/counters';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

const TILE_SIZE = 64;
const SETTING_ICON_SIZE = 20;

interface Props {
  defenderId: number;
}

export default function CountersMenu({ defenderId }: Props) {
  const [bgSearchVisible, setBgSearchVisible] = useState(false);
  const [adding, setAdding] = useState(false);

  const tracked = useCounterStore(
    useShallow((s) =>
      COUNTER_ORDER.filter(
        (k) => DEFAULT_COUNTERS.includes(k) || s.counters[defenderId]?.[k] !== undefined,
      ),
    ),
  );
  const addCounter = useCounterStore((s) => s.addCounter);
  const removeCounter = useCounterStore((s) => s.removeCounter);
  const toggleDead = useLifeStore((s) => s.toggleDead);
  const isDead = useLifeStore((s) => s.players[defenderId]?.isDead ?? false);
  const isMonarch = useTableStatusStore((s) => s.monarch === defenderId);
  const toggleMonarch = useTableStatusStore((s) => s.toggleMonarch);

  const allAdded = ADDABLE_COUNTERS.every((k) => tracked.includes(k));

  const confirmRemove = (key: CounterType) => {
    const value = useCounterStore.getState().counters[defenderId]?.[key] ?? 0;
    if (value === 0) {
      removeCounter(defenderId, key);
      return;
    }
    Alert.alert(`Remove ${COUNTERS[key].label}?`, `This clears its value of ${value}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCounter(defenderId, key) },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.settingsColumn}>
          <SettingCard
            Icon={ImageIcon}
            label="Background"
            onPress={() => setBgSearchVisible(true)}
          />
          <SettingCard
            Icon={Crown}
            label="Monarch"
            activeStyle={isMonarch && styles.monarchActive}
            onPress={() => toggleMonarch(defenderId)}
          />
          <SettingCard
            Icon={Skull}
            label="Dead"
            iconColor={isDead ? MOUNTAIN : LIGHT_GREY}
            activeStyle={isDead && styles.deadCardActive}
            onPress={() => {
              toggleDead(defenderId);
              setTimeout(() => PlayerCarouselManager.resetPlayer(defenderId), 250);
            }}
          />
        </View>

        <View style={styles.divider} />

        {adding ? (
          <Animated.View entering={FadeIn} style={styles.addList}>
            <Pressable
              style={styles.listClose}
              onPress={() => setAdding(false)}
              hitSlop={spacing.sm}
            >
              <X color={LIGHT_GREY} size={20} />
            </Pressable>
            {ADDABLE_COUNTERS.map((key) => {
              const { Icon, label } = COUNTERS[key];
              const added = tracked.includes(key);
              return (
                <React.Fragment key={key}>
                  <View style={styles.listDivider} />
                  <Pressable
                    style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
                    onPress={() => (added ? confirmRemove(key) : addCounter(defenderId, key))}
                  >
                    <Icon color={LIGHT_GREY} size={20} />
                    <Text style={styles.listLabel}>{label}</Text>
                    {added && <Check color={LIGHT_GREY} size={20} />}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </Animated.View>
        ) : (
          <View style={styles.tiles}>
            {tracked.map((key) => {
              const { Icon, label, step } = COUNTERS[key];
              return (
                <Animated.View key={key} entering={FadeIn} exiting={FadeOut} style={styles.tile}>
                  <Icon color={LIGHT_GREY} size={CHIP_ICON_SIZE} />
                  <Text style={styles.tileLabel} numberOfLines={1} adjustsFontSizeToFit>
                    {label}
                  </Text>
                  <CountersMenuButtons
                    defenderId={defenderId}
                    counter={key}
                    step={step}
                    size={TILE_SIZE}
                  />
                </Animated.View>
              );
            })}
            {!allAdded && (
              <Pressable
                style={({ pressed }) => [styles.addTile, pressed && styles.pressed]}
                onPress={() => setAdding(true)}
              >
                <Plus color={LIGHT_GREY} size={TILE_ICON_SIZE} />
                <Text style={styles.settingLabel} numberOfLines={1} adjustsFontSizeToFit>
                  Add
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {bgSearchVisible && (
        <BackgroundSearch playerId={defenderId} onClose={() => setBgSearchVisible(false)} />
      )}
    </>
  );
}

function SettingCard({
  Icon,
  label,
  onPress,
  iconColor = LIGHT_GREY,
  activeStyle,
}: {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  iconColor?: string;
  activeStyle?: false | ViewStyle;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingCard, activeStyle, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Icon color={iconColor} size={SETTING_ICON_SIZE} />
      <Text style={styles.settingLabel} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: spacing.sm,
  },
  settingsColumn: {
    gap: spacing.xs + 2,
  },
  settingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: CHIP_BACKGROUND,
    width: TILE_SIZE,
  },
  settingLabel: {
    ...typography.button,
    color: LIGHT_GREY,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  deadCardActive: {
    backgroundColor: DEAD_CARD_BACKGROUND,
  },
  monarchActive: {
    backgroundColor: PLAINS,
  },
  divider: {
    width: 2,
    height: '60%',
    backgroundColor: COUNTERS_DIVIDER_COLOR,
    marginHorizontal: spacing.sm + 4,
  },
  tiles: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs + 2,
  },
  tile: {
    width: TILE_SIZE,
    alignItems: 'center',
    gap: 2,
  },
  tileLabel: {
    ...typography.button,
    color: LIGHT_GREY,
    fontSize: 12,
    fontWeight: 900,
    textAlign: 'center',
  },
  addTile: {
    width: TILE_SIZE * 0.6,
    height: TILE_SIZE,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addList: {
    width: 200,
    borderRadius: radius.md,
    backgroundColor: CHIP_BACKGROUND,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  listLabel: {
    ...typography.button,
    color: LIGHT_GREY,
    flex: 1,
  },
  listDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_COLOR,
  },
  listClose: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
  },
});
