import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Skull } from 'lucide-react-native';

import { typography } from '@/styles/global';
import { LIGHT_GREY, TEXT_SHADOW_COLOR } from '@/consts/consts';

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

  // Stable callbacks
  const triggerIncFeedback = useCallback(() => triggerFeedback(incOpacity), [incOpacity]);
  const triggerDecFeedback = useCallback(() => triggerFeedback(decOpacity), [decOpacity]);

  // Memoised gesture objects so they are not recreated every render
  const incGesture = useMemo(() => {
    const tap = Gesture.Tap().onEnd((_e, success) => {
      'worklet';
      if (success && !isDead) {
        runOnJS(changeLifeByAmount)(1);
        runOnJS(triggerIncFeedback)();
      }
    });

    const longPress = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {
        'worklet';
        if (!isDead) {
          runOnJS(handleLongPressStart)('inc');
          runOnJS(triggerIncFeedback)();
        }
      })
      .onEnd(() => {
        'worklet';
        if (!isDead) {
          runOnJS(handlePressOut)();
        }
      });

    return Gesture.Race(longPress, tap);
  }, [isDead, changeLifeByAmount, handleLongPressStart, handlePressOut, triggerIncFeedback]);

  const decGesture = useMemo(() => {
    const tap = Gesture.Tap().onEnd((_e, success) => {
      'worklet';
      if (success && !isDead) {
        runOnJS(changeLifeByAmount)(-1);
        runOnJS(triggerDecFeedback)();
      }
    });

    const longPress = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {
        'worklet';
        if (!isDead) {
          runOnJS(handleLongPressStart)('dec');
          runOnJS(triggerDecFeedback)();
        }
      })
      .onEnd(() => {
        'worklet';
        if (!isDead) {
          runOnJS(handlePressOut)();
        }
      });

    return Gesture.Race(longPress, tap);
  }, [isDead, changeLifeByAmount, handleLongPressStart, handlePressOut, triggerDecFeedback]);

  return (
    <>
      {/* Central life / delta display */}
      <View style={[styles.lifeBlock, { width: panelWidth }, rotateStyle]}>
        {isDead ? (
          <Skull color={LIGHT_GREY} size={100} style={styles.deadSkull} />
        ) : (
          <View style={styles.lifeWrapper}>
            {/* Left spacer to balance the delta on the right, ensuring life total stays centered */}
            <View style={{ width: '20%' }} />
            <View style={styles.lifeContainer}>
              <Text
                style={styles.life}
                adjustsFontSizeToFit
                numberOfLines={1}
                minimumFontScale={0.5}
              >
                {life}
              </Text>
            </View>
            <View style={[styles.deltaContainer, { width: '20%' }]}>
              {delta !== 0 && (
                <Text
                  style={[styles.delta, { color: delta > 0 ? green : red }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {delta > 0 ? `+${delta}` : delta}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Increment half */}
      <GestureDetector gesture={incGesture}>
        <View style={[styles.button, styles.inc]}>
          <Animated.View style={[{ marginLeft: 30 }, rotateStyle, { opacity: incOpacity }]}>
            <Text style={styles.feedbackTextBase}>+</Text>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Decrement half */}
      <GestureDetector gesture={decGesture}>
        <View style={[styles.button, styles.dec]}>
          <Animated.View style={[{ marginRight: 30 }, rotateStyle, { opacity: decOpacity }]}>
            <Text style={styles.feedbackTextBase}>-</Text>
          </Animated.View>
        </View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  lifeBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    flex: 1,
  },
  lifeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lifeContainer: {
    width: '60%',
  },
  deltaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
  life: {
    ...typography.heading1,
    color: LIGHT_GREY,
    textAlign: 'center',
    textShadowColor: TEXT_SHADOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
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
