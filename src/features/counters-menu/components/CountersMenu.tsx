import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Skull } from 'lucide-react-native';

import CountersMenuButtons from './CountersMenuButtons';
import BackgroundSearch from '@/features/central-menu/modals/BackgroundSearch';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import {
  LIGHT_GREY,
  SWAMP,
  ISLAND,
  MOUNTAIN,
  PLAINS,
  FOREST,
  CARD_BACKGROUND_TRANSPARENT,
  DEAD_CARD_BACKGROUND,
  DEAD_CARD_BORDER,
  COUNTERS_DIVIDER_COLOR,
} from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import {
  COUNTER_ICONS,
  COUNTER_COLORS,
  DEFAULT_COUNTERS,
  EXTRA_COUNTERS,
  ALL_COUNTER_TYPES,
  CounterType,
} from '@/consts/counters';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

// Stable fallback object for empty counters to keep React's useSyncExternalStore happy
const EMPTY_COUNTERS: Record<string, number> = Object.freeze({});

interface Props {
  defenderId: number;
}

export default function CountersMenu({ defenderId }: Props) {
  const [bgSearchVisible, setBgSearchVisible] = useState(false);
  // Extra add menu state removed; icons are always visible

  const counters = useCounterStore((s) => s.counters[defenderId] || EMPTY_COUNTERS);
  const addCounter = useCounterStore((s) => s.addCounter);
  const removeCounter = useCounterStore((s) => s.removeCounter);
  const toggleDead = useLifeStore((s) => s.toggleDead);
  const isDead = useLifeStore((s) => s.players[defenderId]?.isDead ?? false);

  // Ensure default counters exist
  useEffect(() => {
    DEFAULT_COUNTERS.forEach((k) => {
      if (counters[k] === undefined) addCounter(defenderId, k);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defenderId]);

  const existingKeys = Object.keys(counters);

  const renderBackgroundColumn = () => {
    const Icon = COUNTER_ICONS.background;
    return (
      <View style={styles.backgroundSection}>
        <Pressable
          style={({ pressed }) => [styles.backgroundCard, pressed && styles.backgroundCardPressed]}
          onPress={() => setBgSearchVisible(true)}
        >
          <Icon color={LIGHT_GREY} size={40} />
          <Text style={styles.backgroundLabel}>Background</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.backgroundCard,
            isDead && styles.deadCardActive,
            pressed && styles.backgroundCardPressed,
          ]}
          onPress={() => {
            toggleDead(defenderId);
            setTimeout(() => PlayerCarouselManager.resetPlayer(defenderId), 250);
          }}
        >
          <Skull color={isDead ? 'red' : LIGHT_GREY} size={40} />
          <Text style={styles.backgroundLabel}>Dead</Text>
        </Pressable>
      </View>
    );
  };

  const renderExtraIcons = () => (
    <View style={styles.extraSection}>
      <Text style={styles.extraSectionTitle}>Add Counters</Text>
      <View style={styles.extraIconsContainer}>
        {EXTRA_COUNTERS.map((key) => {
          const added = existingKeys.includes(key);
          const IconComponent = COUNTER_ICONS[key];
          const SOLID_COLOR_MAP: Record<CounterType, string> = {
            tax: LIGHT_GREY,
            charge: LIGHT_GREY,
            manaWhite: PLAINS,
            manaBlue: ISLAND,
            manaBlack: SWAMP,
            manaRed: MOUNTAIN,
            manaGreen: FOREST,
            poison: LIGHT_GREY,
            storm: LIGHT_GREY,
          };
          const baseColor = SOLID_COLOR_MAP[key];
          const transparentColor = COUNTER_COLORS[key];
          return (
            <Pressable
              key={key}
              style={[styles.iconCircle, { backgroundColor: added ? baseColor : transparentColor }]}
              onPress={() => {
                if (added) {
                  removeCounter(defenderId, key);
                } else {
                  addCounter(defenderId, key);
                }
              }}
            >
              <IconComponent color={added ? 'rgba(0, 0, 0, 0.7)' : LIGHT_GREY} size={24} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {renderBackgroundColumn()}

        <View style={styles.divider} />
        <View style={styles.counterContainer}>
          {ALL_COUNTER_TYPES.map((key) => {
            return (
              <CounterColumn
                key={key}
                counterKey={key}
                defenderId={defenderId}
                existingKeys={existingKeys}
              />
            );
          })}
        </View>
        {renderExtraIcons()}
      </View>

      {bgSearchVisible && (
        <BackgroundSearch playerId={defenderId} onClose={() => setBgSearchVisible(false)} />
      )}
    </>
  );
}

// Individual counter component with its own animation
const CounterColumn: React.FC<{
  counterKey: string;
  defenderId: number;
  existingKeys: string[];
}> = ({ counterKey, defenderId, existingKeys }) => {
  const isActive = existingKeys.includes(counterKey);
  const counterColor = COUNTER_COLORS[counterKey as CounterType] || 'rgba(255, 255, 255, 0.15)';
  const IconComponent = counterKey === 'tax' ? null : COUNTER_ICONS[counterKey as CounterType];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 110 : 0, { duration: 400 }),
      opacity: withTiming(isActive ? 1 : 0, { duration: 400 }),
      marginLeft: withTiming(isActive ? 4 : 0, { duration: 400 }),
      marginRight: withTiming(isActive ? 4 : 0, { duration: 400 }),
    };
  });

  return (
    <Animated.View style={[styles.columnBase, animatedStyle]}>
      <View style={styles.iconWrap}>
        {counterKey === 'tax' ? (
          <Text style={styles.taxLabel}>Tax</Text>
        ) : (
          IconComponent && <IconComponent color={LIGHT_GREY} size={32} />
        )}
      </View>
      <CountersMenuButtons
        defenderId={defenderId}
        counter={counterKey}
        cellW={95}
        cellH={95}
        backgroundColor={counterColor}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  backgroundLabel: {
    ...typography.button,
    color: LIGHT_GREY,
    fontSize: 12,
    marginTop: 4,
  },
  backgroundSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 15,
    gap: 6,
  },
  backgroundCard: {
    alignItems: 'center',
    padding: 6,
    borderRadius: radius.md,
    backgroundColor: CARD_BACKGROUND_TRANSPARENT,
    minWidth: 80,
    width: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundCardPressed: {
    backgroundColor: CARD_BACKGROUND_TRANSPARENT,
    transform: [{ scale: 0.95 }],
  },
  deadCardActive: {
    backgroundColor: DEAD_CARD_BACKGROUND,
    borderColor: DEAD_CARD_BORDER,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  columnBase: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
  counterWrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  iconWrap: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxLabel: {
    ...typography.button,
    color: LIGHT_GREY,
    fontSize: 25,
    fontWeight: 900,
  },
  extraSection: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  extraSectionTitle: {
    ...typography.button,
    fontSize: 24,
    fontWeight: 900,
    color: LIGHT_GREY,
    marginBottom: 8,
    opacity: 0.8,
  },
  extraIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  divider: {
    width: 2,
    height: '70%',
    backgroundColor: COUNTERS_DIVIDER_COLOR,
    marginHorizontal: 35,
  },
});
