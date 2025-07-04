/**
 * CentralMenuButton Component
 *
 * This component renders a Floating Action Button (FAB) that, when pressed,
 * transforms into a full-screen circular menu with animated items.
 *
 * Features:
 * - A central pentagon-shaped button that serves as the menu trigger.
 * - The button animates (rotates and expands) to become the menu background.
 * - A hamburger icon on the button cross-fades into an 'X' icon when the menu is open.
 * - Menu items are displayed as icons arranged in a circle.
 * - All animations are powered by `react-native-reanimated` for high performance.
 * - The pentagon's border width remains visually consistent during the animation.
 * - The opening/closing animation uses a spring effect for a natural, bouncy feel.
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
import { useTurnStore } from '@/store/useTurnStore';
import { BookText, Dice6, Image, RotateCcw, Users } from 'lucide-react-native';
import PlayerCountSelector from '@/components/centralMenu/PlayerCountSelector';
import BackgroundSearch from '@/components/centralMenu/BackgroundSearch';
import { useRulingsStore } from '@/store/useRulingsStore';

// --- Animated Components --- //
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

// --- Constants --- //
const FAB_SIZE = 90;
const MENU_LAYOUT_RADIUS_FACTOR = 3.9;
const PENTAGON_SIDES = 5;
const PENTAGON_RADIUS = 45;
const PENTAGON_CENTER = 50;
const PENTAGON_START_ANGLE = -90;

// --- Geometry Helpers --- //
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
  { id: 'players', Icon: Users, label: 'Players', color: SWAMP },
  { id: 'turn', Icon: Dice6, label: 'Turn Order', color: PLAINS },
  { id: 'reset', Icon: RotateCcw, label: 'Reset', color: ISLAND },
  { id: 'background', Icon: Image, label: 'Background', color: MOUNTAIN },
  { id: 'rulings', Icon: BookText, label: 'Rulings', color: FOREST },
];

// --- Sub-Components --- //
const CircularMenuItem = ({
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

// --- Main Component --- //
export default React.memo(function CentralMenuButton() {
  // --- State --- //
  const [open, setOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isPlayerCountSelectorVisible, setPlayerCountSelectorVisible] = useState(false);

  // --- Hooks --- //
  const players = useLifeStore((state) => state.players);
  const setTotalPlayers = useLifeStore((state) => state.setTotalPlayers);
  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  // --- Memoized Values --- //
  const menuItemRadius = W / MENU_LAYOUT_RADIUS_FACTOR;
  const finalFabDiameter = W + menuItemRadius / 2 - 30;

  // --- Animated Values --- //
  const progress = useSharedValue(0);

  // --- Animated Styles --- //
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
    return {
      strokeWidth: 7 / scaleFactor,
    };
  });

  const hamburgerIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const xIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  // --- Handlers --- //
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

  const handleReset = () => {
    useLifeStore.setState(() => ({
      players: players.map((p) => ({ ...p, life: 40, delta: 0 })),
    }));
    useCommanderDamageStore.setState({ damage: {} });
    useCounterStore.setState({ counters: {} });
    handlePress();
  };

  const handleTurnOrder = () => {
    handlePress();
    const { startSpin, set, finishSpin } = useTurnStore.getState();
    setTimeout(() => {
      if (players.length === 0) return;

      startSpin();

      const playersArray = Array.from({ length: players.length }, (_, i) => i);
      for (let i = playersArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersArray[i], playersArray[j]] = [playersArray[j], playersArray[i]];
      }
      const order = playersArray;
      const winner = order[order.length - 1];
      const loops = 3;
      const flashDelay = 100;
      let tick = 0;
      const spin = setInterval(() => {
        set(order[tick % order.length]);
        tick++;
        if (tick === order.length * loops + 1) {
          clearInterval(spin);
          finishSpin(winner);
        }
      }, flashDelay);
    }, 500);
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

  // --- Render --- //
  return (
    <View style={[styles.container, { width: W, height: H }]}>
      <AnimatedTouchable
        style={[styles.fab, { top: H / 2 + (top - bottom) / 2, left: W / 2 }, fabAnimatedStyle]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <AnimatedPath
            d={PENTAGON_PATH}
            fill={BACKGROUND}
            stroke={'rgb(74, 74, 78)'}
            strokeLinejoin="round"
            animatedProps={animatedStrokeProps}
          />
        </Svg>
        <Animated.View style={[styles.iconContainer, hamburgerIconStyle]}>
          <Svg height="30" width="30" viewBox="0 0 100 100">
            <Path
              d="M20,30 L80,30 M20,50 L80,50 M20,70 L80,70"
              stroke={OFF_WHITE}
              strokeWidth="10"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.iconContainer, xIconStyle]}>
          <Svg height="30" width="30" viewBox="0 0 100 100">
            <Path d="M20,20 L80,80 M20,80 L80,20" stroke={OFF_WHITE} strokeWidth="10" />
          </Svg>
        </Animated.View>
      </AnimatedTouchable>

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
            <CircularMenuItem
              key={item.id}
              index={index}
              progress={progress}
              onPress={getActionFor(item.id)}
              radius={menuItemRadius}
              label={item.label}
              color={item.color}
            >
              <item.Icon color={BACKGROUND} size={30} />
            </CircularMenuItem>
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
