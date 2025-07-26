// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { typography, radius, palette } from '@/styles/global';
import ConfettiParticle from '@/features/central-menu/components/ConfettiParticle';
import { TEXT_SHADOW_COLOR, TURN_WINNER_OVERLAY_BORDER_COLOR } from '@/consts/consts';

const confettiCount = 70;

interface Props {
  panelW: number;
  panelH: number;
}

export default function TurnWinnerOverlay({ panelW, panelH }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      100,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      }),
    );
    opacity.value = withDelay(100, withSpring(1));
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '90deg' }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={styles.container} exiting={FadeOut.duration(150)}>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
      <Animated.View style={[styles.rotatedContainer, animatedStyle]}>
        {Array.from({ length: confettiCount }).map((_, i) => (
          <ConfettiParticle key={i} index={i} width={panelH} height={panelW} />
        ))}
        <View style={[styles.textWrapper, { width: panelH }]}>
          <Text style={styles.text}>You Win!</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: TURN_WINNER_OVERLAY_BORDER_COLOR,
  },
  rotatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textWrapper: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.heading2,
    color: palette.textPrimary,
    textAlign: 'center',
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
