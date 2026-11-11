// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  withSpring,
  cancelAnimation,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLifeStore, PlayerCount } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageStore } from '@/features/commander-damage/store/useCommanderDamageStore';
import { SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST } from '@/consts/consts';
import { useCounterStore } from '@/features/counters-menu/store/useCounterStore';
import { Dice6, RotateCcw, Users, MoreHorizontal, Heart } from 'lucide-react-native';

import PlayerCountSelector from './PlayerCountSelector';
import BackgroundSearch from '../modals/BackgroundSearch';
import MoreMenu from '../modals/MoreMenu';
import { useRulingsStore } from '../store/useRulingsStore';
import { useTableStatusStore } from '../store/useTableStatusStore';
import { useTurnOrder } from '../hooks/useTurnOrder';
import { MenuLayout } from './MenuLayout';
import { MenuItem } from './MenuItem';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';
import AboutModal from '../modals/AboutModal';
import SettingsModal from '../modals/SettingsModal';
import StartingLifeSelector from './StartingLifeSelector';
import { useTutorialStore } from '@/features/tutorial/store/useTutorialStore';
import BlurBackdrop from '@/components/BlurBackdrop';
import { icon, radius } from '@/styles/global';

const FAB_SIZE = 90;
const MENU_LAYOUT_RADIUS_FACTOR = 3.9;
const PENTAGON_SIDES = 5;
const PENTAGON_RADIUS = 45;
const PENTAGON_CENTER = 50;
const PENTAGON_START_ANGLE = -90;
const PENTAGON_CORNER_RADIUS = radius.md;

// Each corner is cut `cornerRadius` along both edges and joined with a quadratic curve through the vertex.
function getRoundedPolygonPath(
  sides = PENTAGON_SIDES,
  cx = PENTAGON_CENTER,
  cy = PENTAGON_CENTER,
  r = PENTAGON_RADIUS,
  startAngleDeg = PENTAGON_START_ANGLE,
  cornerRadius = PENTAGON_CORNER_RADIUS,
) {
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = ((startAngleDeg + (i * 360) / sides) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const toward = ([x, y]: number[], [tx, ty]: number[]) => {
    const len = Math.hypot(tx - x, ty - y);
    return [x + ((tx - x) * cornerRadius) / len, y + ((ty - y) * cornerRadius) / len];
  };
  const segments = pts.map((p, i) => {
    const prev = pts[(i + sides - 1) % sides];
    const next = pts[(i + 1) % sides];
    const [ax, ay] = toward(p, prev);
    const [bx, by] = toward(p, next);
    return `${i === 0 ? 'M' : 'L'}${ax} ${ay} Q${p[0]} ${p[1]} ${bx} ${by}`;
  });
  return `${segments.join(' ')} Z`;
}

const PENTAGON_PATH = getRoundedPolygonPath();

export default React.memo(function CentralMenuButton() {
  const [open, setOpen] = useState(false);
  const [isBackgroundSearchVisible, setBackgroundSearchVisible] = useState(false);
  const [isPlayerCountSelectorVisible, setPlayerCountSelectorVisible] = useState(false);
  const [isAboutVisible, setAboutVisible] = useState(false);
  const [isStartingLifeVisible, setStartingLifeVisible] = useState(false);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const isRulingsSearchVisible = useRulingsStore((s) => s.isRulingsSearchVisible);
  const setIsRulingsSearchVisible = useRulingsStore((s) => s.setIsRulingsSearchVisible);
  const setIsTutorialVisible = useTutorialStore((s) => s.setIsTutorialVisible);

  const setTotalPlayers = useLifeStore((state) => state.setTotalPlayers);
  const resetLife = useLifeStore((state) => state.resetLife);
  // starting life setters now handled inside selector
  const resetCommanderDamage = useCommanderDamageStore((state) => state.resetAll);
  const resetCounters = useCounterStore((state) => state.resetAll);
  const resetTableStatus = useTableStatusStore((state) => state.reset);

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const menuItemRadius = W / MENU_LAYOUT_RADIUS_FACTOR;
  const finalFabDiameter = W + menuItemRadius / 2 - 30;

  const closedScale = FAB_SIZE / finalFabDiameter;

  const progress = useSharedValue(0);
  // The FAB is laid out once at its open size and scaled, so the animation never triggers layout.
  const fabScale = useDerivedValue(() => closedScale + progress.value * (1 - closedScale));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }, { rotate: `${progress.value * 180}deg` }],
  }));

  const animatedPathProps = useAnimatedProps(() => {
    const currentSize = FAB_SIZE + progress.value * (finalFabDiameter - FAB_SIZE);
    const scaleFactor = currentSize / FAB_SIZE;
    const baseStrokeWidth = 10;
    const minStrokeWidth = 8;
    const strokeWidth =
      baseStrokeWidth / scaleFactor < minStrokeWidth
        ? baseStrokeWidth / scaleFactor
        : minStrokeWidth;
    return {
      strokeWidth,
      fillOpacity: interpolate(progress.value, [0, 1], [1, 0.7], Extrapolation.CLAMP),
    };
  });

  // Icons are counter-scaled so they keep their size while the FAB scales.
  const hamburgerIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 / fabScale.value }],
  }));

  const xIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 1 / fabScale.value }],
  }));

  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);

  const handlePress = useCallback(() => {
    const next = !openRef.current;
    openRef.current = next;
    cancelAnimation(progress);
    progress.value = withSpring(next ? 1 : 0, {
      damping: 11,
      stiffness: 140,
      mass: 0.5,
    });
    setOpen(next);
    // Clear any existing queued reset
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => PlayerCarouselManager.resetAll(), 250);
  }, [progress]);

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    },
    [],
  );

  const { start: startTurnOrder } = useTurnOrder();

  // Clears per-game state that isn't owned by the life store.
  const resetGameState = useCallback(() => {
    resetCommanderDamage();
    resetCounters();
    resetTableStatus();
  }, [resetCommanderDamage, resetCounters, resetTableStatus]);

  const handleReset = useCallback(() => {
    resetLife();
    resetGameState();
    handlePress();
  }, [resetLife, resetGameState, handlePress]);

  const closeMenuThen = useCallback(
    (action: () => void) => {
      handlePress();
      setTimeout(action, 500);
    },
    [handlePress],
  );

  const handleTurnOrder = useCallback(
    () => closeMenuThen(startTurnOrder),
    [closeMenuThen, startTurnOrder],
  );
  const handlePlayersPress = useCallback(
    () => closeMenuThen(() => setPlayerCountSelectorVisible(true)),
    [closeMenuThen],
  );
  const handleStartingLifePress = useCallback(
    () => closeMenuThen(() => setStartingLifeVisible(true)),
    [closeMenuThen],
  );
  const handleMorePress = useCallback(
    () => closeMenuThen(() => setMoreMenuVisible(true)),
    [closeMenuThen],
  );

  const handleTutorialPress = useCallback(() => {
    setIsTutorialVisible(true);
    setMoreMenuVisible(false);
  }, [setIsTutorialVisible]);

  const handlePlayerCountSelect = useCallback(
    (count: PlayerCount) => {
      setTotalPlayers(count);
      resetGameState();
      setPlayerCountSelectorVisible(false);
    },
    [setTotalPlayers, resetGameState],
  );

  const menuItems = useMemo(
    () => [
      { id: 'players', Icon: Users, label: 'Players', color: ISLAND, action: handlePlayersPress },
      { id: 'turn', Icon: Dice6, label: 'Turn Order', color: SWAMP, action: handleTurnOrder },
      { id: 'reset', Icon: RotateCcw, label: 'Reset', color: MOUNTAIN, action: handleReset },
      {
        id: 'startingLife',
        Icon: Heart,
        label: 'Life',
        color: FOREST,
        action: handleStartingLifePress,
      },
      { id: 'more', Icon: MoreHorizontal, label: 'More', color: PLAINS, action: handleMorePress },
    ],
    [handlePlayersPress, handleTurnOrder, handleReset, handleStartingLifePress, handleMorePress],
  );

  const fabStyle = useMemo(
    () => [
      styles.fab,
      {
        width: finalFabDiameter,
        height: finalFabDiameter,
        marginLeft: -finalFabDiameter / 2,
        marginTop: -finalFabDiameter / 2,
        top: H / 2 + (top - bottom) / 2,
        left: W / 2,
      },
      fabAnimatedStyle,
    ],
    [finalFabDiameter, H, W, top, bottom, fabAnimatedStyle],
  );

  const hitAreaStyle = useMemo(
    () => [styles.hitArea, { top: H / 2 + (top - bottom) / 2, left: W / 2 }],
    [H, W, top, bottom],
  );

  return (
    <View style={[styles.container, { width: W, height: H }]} pointerEvents="box-none">
      {open && (
        <Animated.View
          style={StyleSheet.absoluteFill}
          entering={FadeIn}
          exiting={FadeOut}
          pointerEvents="none"
        >
          <BlurBackdrop />
        </Animated.View>
      )}
      {/* Backdrop press when menu is open */}
      {open && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handlePress}
          testID="centralmenu-backdrop"
        />
      )}
      <MenuLayout
        fabAnimatedStyle={fabStyle}
        hitAreaStyle={hitAreaStyle}
        animatedPathProps={animatedPathProps}
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
                interactive={open}
                onPress={item.action}
                menuRadius={menuItemRadius}
                label={item.label}
                color={item.color}
              >
                <item.Icon color={item.color} size={icon.size} strokeWidth={icon.strokeWidth} />
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
      {isSettingsVisible && <SettingsModal onClose={() => setSettingsVisible(false)} />}
      {isMoreMenuVisible && (
        <MoreMenu
          onClose={() => setMoreMenuVisible(false)}
          onRulingsPress={() => {
            setMoreMenuVisible(false);
            setIsRulingsSearchVisible(true);
          }}
          onAboutPress={() => {
            setMoreMenuVisible(false);
            setAboutVisible(true);
          }}
          onSettingsPress={() => {
            setMoreMenuVisible(false);
            setSettingsVisible(true);
          }}
          onTutorialPress={handleTutorialPress}
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
    ...StyleSheet.absoluteFill,
  },
  fab: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    // shadow... disabled it for now
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 10,
    // elevation: 8,
  },
  hitArea: {
    position: 'absolute',
    width: FAB_SIZE,
    height: FAB_SIZE,
    marginLeft: -FAB_SIZE / 2,
    marginTop: -FAB_SIZE / 2,
    zIndex: 11,
  },
  menuItemsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },
});
