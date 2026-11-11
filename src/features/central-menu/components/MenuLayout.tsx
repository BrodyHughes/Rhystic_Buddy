// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import Svg, { Path, Defs, Stop, RadialGradient, PathProps } from 'react-native-svg';
import { Menu, X } from 'lucide-react-native';
import { APP_BACKGROUND, LIGHT_GREY } from '@/consts/consts';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface MenuLayoutProps {
  fabAnimatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  hitAreaStyle: StyleProp<ViewStyle>;
  animatedStrokeProps: Partial<PathProps>;
  hamburgerIconStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  xIconStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onPress: () => void;
  pentagonPath: string;
}

export const MenuLayout = React.memo(
  ({
    fabAnimatedStyle,
    hitAreaStyle,
    animatedStrokeProps,
    hamburgerIconStyle,
    xIconStyle,
    onPress,
    pentagonPath,
  }: MenuLayoutProps) => {
    // The visual is laid out at its open size and scaled, and hit-testing ignores the scale, so
    // touches go to a separate closed-size Pressable. When open, the backdrop handles outside taps.
    return (
      <>
        <Animated.View style={fabAnimatedStyle} pointerEvents="none">
          <Svg height="100%" width="100%" viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
                <Stop offset="1" stopColor="rgb(20, 20, 20)" stopOpacity="1" />
                <Stop offset="0" stopColor="rgb(35, 35, 36)" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <AnimatedPath
              d={pentagonPath}
              fill="url(#grad)"
              stroke={APP_BACKGROUND}
              strokeLinejoin="bevel"
              animatedProps={animatedStrokeProps}
            />
          </Svg>
          <Animated.View style={[styles.iconContainer, hamburgerIconStyle]}>
            <Menu color={LIGHT_GREY} size={40} strokeWidth={3} />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, xIconStyle]}>
            <X color={LIGHT_GREY} size={50} strokeWidth={3} />
          </Animated.View>
        </Animated.View>
        <Pressable
          style={[hitAreaStyle, styles.hitArea]}
          onPress={onPress}
          testID="centralmenu-fab"
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  hitArea: {
    backgroundColor: 'rgba(0,0,0,0.01)', // Slightly opaque to block touches on Android
  },
  iconContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
