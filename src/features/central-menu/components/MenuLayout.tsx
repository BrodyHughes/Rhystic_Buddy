import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path, Defs, Stop, RadialGradient } from 'react-native-svg';
import { Menu, X } from 'lucide-react-native';
import { OFF_WHITE } from '@/consts/consts';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface MenuLayoutProps {
  fabAnimatedStyle: StyleProp<ViewStyle>;
  animatedStrokeProps: any;
  hamburgerIconStyle: StyleProp<ViewStyle>;
  xIconStyle: StyleProp<ViewStyle>;
  onPress: () => void;
  pentagonPath: string;
}

export const MenuLayout = React.memo(
  ({
    fabAnimatedStyle,
    animatedStrokeProps,
    hamburgerIconStyle,
    xIconStyle,
    onPress,
    pentagonPath,
  }: MenuLayoutProps) => {
    return (
      <AnimatedTouchable style={fabAnimatedStyle} onPress={onPress} activeOpacity={1}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
              <Stop offset="1" stopColor="rgb(26, 26, 26)" stopOpacity="1" />
              <Stop offset="0" stopColor="rgb(49, 49, 49)" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <AnimatedPath
            d={pentagonPath}
            fill="url(#grad)"
            stroke={'rgb(74, 74, 78)'}
            strokeLinejoin="round"
            animatedProps={animatedStrokeProps}
          />
        </Svg>
        <Animated.View style={[styles.iconContainer, hamburgerIconStyle]}>
          <Menu color={OFF_WHITE} size={35} strokeWidth={2.5} />
        </Animated.View>
        <Animated.View style={[styles.iconContainer, xIconStyle]}>
          <X color={OFF_WHITE} size={35} strokeWidth={2.5} />
        </Animated.View>
      </AnimatedTouchable>
    );
  },
);

const styles = StyleSheet.create({
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
