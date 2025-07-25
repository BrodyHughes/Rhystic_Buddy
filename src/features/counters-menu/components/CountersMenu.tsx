import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  Image as ImageIcon,
  Crown,
  Zap,
  Skull,
  Droplet,
  Flame,
  Leaf,
  Sun,
  Moon,
  CloudLightning,
  Skull as SkullIcon,
} from 'lucide-react-native';

import CountersMenuButtons from './CountersMenuButtons';
import BackgroundSearch from '@/features/central-menu/modals/BackgroundSearch';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import {
  OFF_WHITE,
  SWAMP,
  ISLAND,
  MOUNTAIN,
  PLAINS,
  FOREST,
  TRANSPARENT_SWAMP,
  TRANSPARENT_ISLAND,
  TRANSPARENT_MOUNTAIN,
  TRANSPARENT_PLAINS,
  TRANSPARENT_FOREST,
  TRANSPARENT_OFF_WHITE,
} from '@/consts/consts';
import { typography } from '@/styles/global';

interface Props {
  defenderId: number;
}

const DEFAULT_COUNTERS = ['tax', 'charge'] as const;

const EXTRA_COUNTERS = [
  'poison',
  'storm',
  'manaWhite',
  'manaBlue',
  'manaBlack',
  'manaRed',
  'manaGreen',
] as const;

const ICON_MAP: Record<string, React.ElementType> = {
  background: ImageIcon,
  tax: Crown,
  charge: Zap,
  poison: Skull,
  storm: CloudLightning,
  manaWhite: Sun,
  manaBlue: Droplet,
  manaBlack: Moon,
  manaRed: Flame,
  manaGreen: Leaf,
};

// Color map for mana counters
const COLOR_MAP: Record<string, string> = {
  manaWhite: TRANSPARENT_PLAINS,
  manaBlue: TRANSPARENT_ISLAND,
  manaBlack: TRANSPARENT_SWAMP,
  manaRed: TRANSPARENT_MOUNTAIN,
  manaGreen: TRANSPARENT_FOREST,
  poison: TRANSPARENT_OFF_WHITE,
  storm: TRANSPARENT_OFF_WHITE,
};

export default function CountersMenu({ defenderId }: Props) {
  const [bgSearchVisible, setBgSearchVisible] = useState(false);
  // Extra add menu state removed; icons are always visible

  const counters = useCounterStore((s) => s.counters[defenderId] ?? {});
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

  // All possible counters (always mounted)
  const ALL_COUNTER_KEYS = ['tax', 'charge', ...EXTRA_COUNTERS];

  const renderBackgroundColumn = () => {
    const Icon = ICON_MAP.background;
    return (
      <View style={styles.backgroundSection}>
        <Pressable
          style={({ pressed }) => [styles.backgroundCard, pressed && styles.backgroundCardPressed]}
          onPress={() => setBgSearchVisible(true)}
        >
          <Icon color={OFF_WHITE} size={48} />
          <Text style={styles.backgroundLabel}>Background</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.backgroundCard,
            isDead && styles.deadCardActive,
            pressed && styles.backgroundCardPressed,
          ]}
          onPress={() => toggleDead(defenderId)}
        >
          <SkullIcon color={isDead ? 'red' : OFF_WHITE} size={48} />
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
          const IconComponent = (ICON_MAP[key] ?? Crown) as React.ElementType;
          const SOLID_COLOR_MAP: Record<string, string> = {
            manaWhite: PLAINS,
            manaBlue: ISLAND,
            manaBlack: SWAMP,
            manaRed: MOUNTAIN,
            manaGreen: FOREST,
            poison: OFF_WHITE,
            storm: OFF_WHITE,
          };
          const baseColor = SOLID_COLOR_MAP[key] ?? OFF_WHITE;
          const transparentColor = COLOR_MAP[key] ?? TRANSPARENT_OFF_WHITE;
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
              <IconComponent color={added ? 'rgba(0, 0, 0, 0.7)' : OFF_WHITE} size={24} />
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
          {ALL_COUNTER_KEYS.map((key) => {
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
  const counterColor = COLOR_MAP[counterKey] || 'rgba(255, 255, 255, 0.15)';
  const IconComponent = counterKey === 'tax' ? null : (ICON_MAP[counterKey] ?? Crown);

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
          IconComponent && <IconComponent color={OFF_WHITE} size={32} />
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
    color: OFF_WHITE,
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
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 90,
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundCardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.95 }],
  },
  deadCardActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderColor: 'rgba(255, 0, 0, 0.4)',
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
    borderRadius: 15,
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
    color: OFF_WHITE,
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
    color: OFF_WHITE,
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
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  divider: {
    width: 2,
    height: '70%',
    backgroundColor: OFF_WHITE,
    opacity: 0.3,
    marginHorizontal: 35,
  },
});
