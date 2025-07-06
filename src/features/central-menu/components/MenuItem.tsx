// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { OFF_WHITE } from '@/consts/consts';

const AnimatedView = Animated.createAnimatedComponent(View);

// Pentagon geometry helpers
const PENTAGON_SIDES = 5;
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

const MENU_ITEM_ANGLES_DEG = getMenuItemAngles();

interface MenuItemProps {
  index: number;
  progress: Animated.SharedValue<number>;
  children: React.ReactNode;
  onPress: () => void;
  radius: number;
  label: string;
  color: string;
}

// Circular menu item
export const MenuItem = React.memo(
  ({ index, progress, children, onPress, radius, label, color }: MenuItemProps) => {
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
  },
);

const styles = StyleSheet.create({
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
