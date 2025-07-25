import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { Skull } from 'lucide-react-native';

import { typography, spacing } from '@/styles/global';
import { OFF_WHITE, PRESSED_BUTTON_COLOR, TEXT_SHADOW_COLOR } from '@/consts/consts';

interface LifeViewProps {
  life: number;
  delta: number;
  panelWidth: number; // width of panel for responsive font sizing
  isDead?: boolean;
  changeLifeByAmount: (amount: number) => void;
  handleLongPressStart: (direction: 'inc' | 'dec') => void;
  handlePressOut: () => void;
}

const LifeView: React.FC<LifeViewProps> = ({
  life,
  delta,
  panelWidth,
  isDead,
  changeLifeByAmount,
  handleLongPressStart,
  handlePressOut,
}) => {
  const green = 'rgb(150, 255, 129)';
  const red = 'rgb(255, 140, 140)';

  // Animated feedback opacities
  const incOpacity = useRef(new Animated.Value(0)).current;
  const decOpacity = useRef(new Animated.Value(0)).current;

  const triggerFeedback = (ref: Animated.Value) => {
    ref.setValue(1);
    Animated.timing(ref, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const rotateStyle = { transform: [{ rotate: '90deg' }] } as const;

  return (
    <>
      <View style={[styles.lifeBlock, { width: panelWidth }, rotateStyle]}>
        {isDead ? (
          <Skull color={OFF_WHITE} size={100} style={styles.deadSkull} />
        ) : (
          <>
            <Text style={styles.life} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
              {life}
            </Text>
            {delta !== 0 && (
              <Text style={[styles.delta, { color: delta > 0 ? green : red }]}>
                {delta > 0 ? `+${delta}` : delta}
              </Text>
            )}
          </>
        )}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.inc,
          pressed && !isDead && { backgroundColor: PRESSED_BUTTON_COLOR },
        ]}
        onPress={() => {
          if (isDead) return;
          changeLifeByAmount(1);
          triggerFeedback(incOpacity);
        }}
        onLongPress={() => {
          if (isDead) return;
          handleLongPressStart('inc');
          triggerFeedback(incOpacity);
        }}
        onPressOut={handlePressOut}
        delayLongPress={1000}
        disabled={isDead}
      >
        <Animated.View style={[{ marginLeft: 30 }, rotateStyle, { opacity: incOpacity }]}>
          <Text style={[styles.feedbackTextBase]}>+</Text>
        </Animated.View>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.dec,
          pressed && !isDead && { backgroundColor: PRESSED_BUTTON_COLOR },
        ]}
        onPress={() => {
          if (isDead) return;
          changeLifeByAmount(-1);
          triggerFeedback(decOpacity);
        }}
        onLongPress={() => {
          if (isDead) return;
          handleLongPressStart('dec');
          triggerFeedback(decOpacity);
        }}
        onPressOut={handlePressOut}
        delayLongPress={1000}
        disabled={isDead}
      >
        <Animated.View style={[{ marginRight: 30 }, rotateStyle, { opacity: decOpacity }]}>
          <Text style={[styles.feedbackTextBase]}>-</Text>
        </Animated.View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  lifeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    flex: 1,
  },
  life: {
    ...typography.heading1,
    color: OFF_WHITE,
    marginRight: spacing.xs,
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  delta: {
    ...typography.caption,
    fontFamily: 'Comfortaa',
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 5, height: 1 },
    textShadowRadius: 20,
  },
  button: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inc: { right: 0 },
  dec: { left: 0 },
  btnText: {
    ...typography.caption,
  },
  feedbackTextBase: {
    ...typography.caption,
    fontSize: 40,
  },
  deadSkull: {
    shadowColor: 'rgb(0, 0, 0)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default LifeView;
