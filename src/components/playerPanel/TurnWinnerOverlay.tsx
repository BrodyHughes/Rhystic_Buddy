import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { typography } from '@/styles/global';
import ConfettiParticle from './ConfettiParticle';
import { useTurnStore } from '@/store/useTurnStore';
import { TURN_ORDER_OVERLAY_COLOR } from '@/consts/consts';

const confettiCount = 70;

interface Props {
  panelW: number;
  panelH: number;
}

export default function TurnWinnerOverlay({ panelW, panelH }: Props) {
  const reset = useTurnStore((s) => s.reset);
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
    <Pressable onPress={reset} style={styles.container}>
      <Animated.View style={[styles.rotatedContainer, animatedStyle]}>
        {Array.from({ length: confettiCount }).map((_, i) => (
          <ConfettiParticle key={i} index={i} width={panelH} height={panelW} />
        ))}
        <View style={[styles.textWrapper, { width: panelH }]}>
          <Text style={styles.text}>You go first!</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TURN_ORDER_OVERLAY_COLOR,
    zIndex: 110,
    justifyContent: 'center',
    alignItems: 'center',
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
    ...typography.heading1,
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    padding: 20,
  },
});
