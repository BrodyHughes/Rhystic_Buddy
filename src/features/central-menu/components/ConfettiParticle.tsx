// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import { SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST } from '@/consts/consts';

const CONFETTI_COLORS = [SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST, '#fde132', '#ffffff'];

interface Props {
  index: number;
  width: number;
  height: number;
}

export const ConfettiParticle = ({ index, width, height }: Props) => {
  const { fallDuration, spinDuration, initialX, startY, endY, spinDirection, randomShape } =
    React.useMemo(() => {
      const _fallDuration = 3000 + Math.random() * 2000;
      const _spinDuration = 700 + Math.random() * 600;
      const _initialX = Math.random() * width;
      const _startY = -height / 2;
      const _endY = height / 2;
      const _spinDirection = Math.random() > 0.5 ? 1 : -1;
      const _randomShape = Math.random();
      return {
        fallDuration: _fallDuration,
        spinDuration: _spinDuration,
        initialX: _initialX,
        startY: _startY,
        endY: _endY,
        spinDirection: _spinDirection,
        randomShape: _randomShape,
      } as const;
    }, [width, height]);

  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(initialX - width / 2);
  const rotate = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = Math.random() * 4000;

    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));

    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(endY, { duration: fallDuration, easing: Easing.linear }), -1, false),
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(rotate.value + spinDirection * 360, {
          duration: spinDuration,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  let shapeStyle;
  if (randomShape > 0.66) {
    // Circle
    shapeStyle = { height: 10, borderRadius: 5 };
  } else if (randomShape > 0.33) {
    // Rectangle
    shapeStyle = { height: 20, borderRadius: 0 };
  } else {
    // Triangle
    shapeStyle = styles.triangle;
  }

  const finalColor = randomShape <= 0.33 ? {} : { backgroundColor: color };
  const triangleColor = randomShape <= 0.33 ? { borderBottomColor: color } : {};

  return (
    <Animated.View
      style={[styles.confetti, shapeStyle, finalColor, triangleColor, animatedStyle]}
    />
  );
};

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    width: 10,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default React.memo(ConfettiParticle);
