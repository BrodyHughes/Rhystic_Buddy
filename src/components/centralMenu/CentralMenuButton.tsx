import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLifeStore, PlayerCount } from '@/store/useLifeStore';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { BACKGROUND, OFF_WHITE, SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST } from '@/consts/consts';
import { useCounterStore } from '@/store/useCounterStore';
import { BookText, Dice6, Image, RotateCcw, Users } from 'lucide-react-native';
import PlayerCountSelector from '@/components/centralMenu/PlayerCountSelector';
import BackgroundSearch from '@/components/centralMenu/BackgroundSearch';
import { useRulingsStore } from '@/store/useRulingsStore';
import { useTurnOrder } from '@/hooks/useTurnOrder';
import { MenuLayout } from './MenuLayout';

const AnimatedView = Animated.createAnimatedComponent(View);

// Constants
const FAB_SIZE = 90;
const MENU_LAYOUT_RADIUS_FACTOR = 3.9;
const PENTAGON_SIDES = 5;
const PENTAGON_RADIUS = 45;
const PENTAGON_CENTER = 50;
const PENTAGON_START_ANGLE = -90;

// Pentagon geometry helpers
function getRegularPolygonPath(
  sides = PENTAGON_SIDES,
  cx = PENTAGON_CENTER,
  cy = PENTAGON_CENTER,
  r = PENTAGON_RADIUS,
  startAngleDeg = PENTAGON_START_ANGLE,
) {
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = ((startAngleDeg + (i * 360) / sides) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return `M${pts.map((p) => p.join(' ')).join(' L')} Z`;
}

function getMenuItemAngles(sides = PENTAGON_SIDES, startAngleDeg = 90) {
  const angleIncrement = 360 / sides;
  // This offset will shift each item from a vertex to the center of a side.
  const angleOffset = angleIncrement / 2;
  const angles = Array.from(
    { length: sides },
    (_, i) => startAngleDeg + i * angleIncrement + angleOffset,
  );
  // Maintain the same logical order of items around the circle.
  return [angles[2], angles[3], angles[4], angles[1], angles[0]];
}

const PENTAGON_PATH = getRegularPolygonPath();
const MENU_ITEM_ANGLES_DEG = getMenuItemAngles();

const menuItems = [
  { id: 'players', Icon: Users, label: 'Players', color: ISLAND },
  { id: 'turn', Icon: Dice6, label: 'Turn Order', color: SWAMP },
  { id: 'reset', Icon: RotateCcw, label: 'Reset', color: MOUNTAIN },
  { id: 'background', Icon: Image, label: 'Background', color: FOREST },
  { id: 'rulings', Icon: BookText, label: 'Rulings', color: PLAINS },
];

// Circular menu item
const MenuItem = ({
  index,
  progress,
  children,
  onPress,
  radius,
  label,
  color,
}: {
  index: number;
  progress: Animated.SharedValue<number>;
  children: React.ReactNode;
  onPress: () => void;
  radius: number;
  label: string;
  color: string;
}) => {
  const itemAngles = MENU_ITEM_ANGLES_DEG.map((angle) => (angle * Math.PI) / 180);
  const angle = itemAngles[index];

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = progress.value * radius * Math.cos(angle);
    const translateY = progress.value * radius * Math.sin(angle);
    const rotation = (angle * 180) / Math.PI - 90;

    return {
      opacity: progress.value,
      transform: [{ translateX }, { translateY }, { rotate: `${rotation}deg` }],
      display: progress.value === 0 ? 'none' : 'flex',
      pointerEvents: progress.value === 1 ? 'auto' : 'none',
    };
  });

  return (
    <AnimatedView style={[styles.menuItemContainer, animatedStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>{children}</View>
        <Text style={styles.menuItemText}>{label}</Text>
      </TouchableOpacity>
    </AnimatedView>
  );
};

// Main Component
export default React.memo(function CentralMenuButton() {
  const [open, setOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isPlayerCountSelectorVisible, setPlayerCountSelectorVisible] = useState(false);

  const setTotalPlayers = useLifeStore((state) => state.setTotalPlayers);
  const resetLife = useLifeStore((state) => state.resetLife);
  const resetCommanderDamage = useCommanderDamageStore((state) => state.resetAll);
  const resetCounters = useCounterStore((state) => state.resetAll);

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const menuItemRadius = W / MENU_LAYOUT_RADIUS_FACTOR;
  const finalFabDiameter = W + menuItemRadius / 2 - 30;

  const progress = useSharedValue(0);

  const fabAnimatedStyle = useAnimatedStyle(() => {
    const size = FAB_SIZE + progress.value * (finalFabDiameter - FAB_SIZE);
    const rotation = progress.value * 180;
    return {
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const animatedStrokeProps = useAnimatedProps(() => {
    const currentSize = FAB_SIZE + progress.value * (finalFabDiameter - FAB_SIZE);
    const scaleFactor = currentSize / FAB_SIZE;
    const baseStrokeWidth = 7;
    const minStrokeWidth = 3;
    const strokeWidth =
      baseStrokeWidth / scaleFactor > minStrokeWidth
        ? baseStrokeWidth / scaleFactor
        : minStrokeWidth;
    return {
      strokeWidth,
    };
  });

  const hamburgerIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const xIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  // Handlers
  const handlePress = () => {
    cancelAnimation(progress);
    const toValue = open ? 0 : 1;
    progress.value = withSpring(toValue, {
      damping: 11,
      stiffness: 140,
      mass: 0.5,
    });
    setOpen(!open);
  };

  const { start: startTurnOrder } = useTurnOrder();

  const handleReset = () => {
    resetLife();
    resetCommanderDamage();
    resetCounters();
    handlePress();
  };

  const handleTurnOrder = () => {
    handlePress();
    setTimeout(startTurnOrder, 500);
  };

  const handleBackgroundPress = () => {
    handlePress();
    setTimeout(() => setSearchVisible(true), 500);
  };

  const handlePlayersPress = () => {
    handlePress();
    setTimeout(() => setPlayerCountSelectorVisible(true), 500);
  };

  const handleRulingsPress = () => {
    handlePress();
    setTimeout(() => setIsSearchVisible(true), 500);
  };

  const handlePlayerCountSelect = (count: PlayerCount) => {
    setTotalPlayers(count);
    setPlayerCountSelectorVisible(false);
  };

  const setIsSearchVisible = useRulingsStore((s) => s.setIsSearchVisible);

  const getActionFor = (id: string) => {
    const actions: { [key: string]: () => void } = {
      reset: handleReset,
      turn: handleTurnOrder,
      background: handleBackgroundPress,
      players: handlePlayersPress,
      rulings: handleRulingsPress,
    };
    return actions[id] || (() => {});
  };

  return (
    <View style={[styles.container, { width: W, height: H }]}>
      <MenuLayout
        fabAnimatedStyle={[
          styles.fab,
          { top: H / 2 + (top - bottom) / 2, left: W / 2 },
          fabAnimatedStyle,
        ]}
        animatedStrokeProps={animatedStrokeProps}
        hamburgerIconStyle={hamburgerIconStyle}
        xIconStyle={xIconStyle}
        onPress={handlePress}
        pentagonPath={PENTAGON_PATH}
      />

      {!isSearchVisible && !isPlayerCountSelectorVisible && (
        <View
          style={[
            styles.menuItemsWrapper,
            {
              paddingTop: top - bottom,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              index={index}
              progress={progress}
              onPress={getActionFor(item.id)}
              radius={menuItemRadius}
              label={item.label}
              color={item.color}
            >
              <item.Icon color={BACKGROUND} size={30} />
            </MenuItem>
          ))}
        </View>
      )}

      {isPlayerCountSelectorVisible && (
        <PlayerCountSelector
          onSelect={handlePlayerCountSelect}
          onClose={() => setPlayerCountSelectorVisible(false)}
        />
      )}

      {isSearchVisible && <BackgroundSearch onClose={() => setSearchVisible(false)} />}
    </View>
  );
});

// --- Styles --- //
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    position: 'absolute',
    width: FAB_SIZE,
    height: FAB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },
  menuItemContainer: {
    position: 'absolute',
    zIndex: 20,
    alignItems: 'center',
  },
  menuItem: {
    padding: 0,
    alignItems: 'center',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemText: {
    color: OFF_WHITE,
    fontSize: 18,
    paddingBottom: 8,
    fontWeight: '700',
    fontFamily: 'Comfortaa-Regular',
  },
});
