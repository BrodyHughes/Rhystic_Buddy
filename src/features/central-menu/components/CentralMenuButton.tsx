// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLifeStore, PlayerCount } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { BACKGROUND, SWAMP, ISLAND, MOUNTAIN, PLAINS } from '@/consts/consts';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { Dice6, RotateCcw, Users, MoreHorizontal } from 'lucide-react-native';

// Placeholder icon that renders nothing
const NullIcon = () => null;
import PlayerCountSelector from './PlayerCountSelector';
import BackgroundSearch from '../modals/BackgroundSearch';
import MoreMenu from '../modals/MoreMenu';
import { useRulingsStore } from '../store/useRulingsStore';
import { useTurnOrder } from '../hooks/useTurnOrder';
import { MenuLayout } from './MenuLayout';
import { MenuItem } from './MenuItem';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';
import AboutModal from '../modals/AboutModal';
import StartingLifeSelector from './StartingLifeSelector';

const FAB_SIZE = 90;
const MENU_LAYOUT_RADIUS_FACTOR = 3.9;
const PENTAGON_SIDES = 5;
const PENTAGON_RADIUS = 45;
const PENTAGON_CENTER = 50;
const PENTAGON_START_ANGLE = -90;

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

const PENTAGON_PATH = getRegularPolygonPath();

export default React.memo(function CentralMenuButton() {
  const [open, setOpen] = useState(false);
  const [isBackgroundSearchVisible, setBackgroundSearchVisible] = useState(false);
  const [isPlayerCountSelectorVisible, setPlayerCountSelectorVisible] = useState(false);
  const [isAboutVisible, setAboutVisible] = useState(false);
  const [isStartingLifeVisible, setStartingLifeVisible] = useState(false);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const { isRulingsSearchVisible, setIsRulingsSearchVisible } = useRulingsStore();

  const setTotalPlayers = useLifeStore((state) => state.setTotalPlayers);
  const resetLife = useLifeStore((state) => state.resetLife);
  // starting life setters now handled inside selector
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

  const handlePress = () => {
    cancelAnimation(progress);
    const toValue = open ? 0 : 1;
    progress.value = withSpring(toValue, {
      damping: 11,
      stiffness: 140,
      mass: 0.5,
    });
    setOpen(!open);
    setTimeout(() => PlayerCarouselManager.resetAll(), 250);
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

  const handlePlayersPress = () => {
    handlePress();
    setTimeout(() => setPlayerCountSelectorVisible(true), 500);
  };

  const handleMorePress = () => {
    handlePress();
    setTimeout(() => setMoreMenuVisible(true), 500);
  };

  const handlePlayerCountSelect = (count: PlayerCount) => {
    setTotalPlayers(count);
    setPlayerCountSelectorVisible(false);
  };

  const menuItems = [
    { id: 'players', Icon: Users, label: 'Players', color: ISLAND, action: handlePlayersPress },
    { id: 'turn', Icon: Dice6, label: 'Turn Order', color: SWAMP, action: handleTurnOrder },
    { id: 'reset', Icon: RotateCcw, label: 'Reset', color: MOUNTAIN, action: handleReset },
    { id: 'placeholder', Icon: NullIcon, label: '', color: 'transparent', action: () => {} },
    { id: 'more', Icon: MoreHorizontal, label: 'More', color: PLAINS, action: handleMorePress },
  ];

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

      {!isBackgroundSearchVisible &&
        !isPlayerCountSelectorVisible &&
        !isRulingsSearchVisible &&
        !isMoreMenuVisible && (
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
                onPress={item.action}
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

      {isBackgroundSearchVisible && (
        <BackgroundSearch onClose={() => setBackgroundSearchVisible(false)} />
      )}
      {isAboutVisible && <AboutModal onClose={() => setAboutVisible(false)} />}
      {isMoreMenuVisible && (
        <MoreMenu
          onClose={() => setMoreMenuVisible(false)}
          onRulingsPress={() => setIsRulingsSearchVisible(true)}
          onAboutPress={() => setAboutVisible(true)}
          onStartingLifePress={() => setStartingLifeVisible(true)}
        />
      )}

      {isStartingLifeVisible && (
        <StartingLifeSelector onClose={() => setStartingLifeVisible(false)} />
      )}
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
});
