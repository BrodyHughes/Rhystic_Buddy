import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { typography, spacing } from '@/styles/global';
import { OFF_WHITE, TEXT } from '@/consts/consts';

interface LifeViewProps {
  life: number;
  delta: number;
  changeLifeByAmount: (amount: number) => void;
  handleLongPressStart: (direction: 'inc' | 'dec') => void;
  handlePressOut: () => void;
}

const LifeView: React.FC<LifeViewProps> = ({
  life,
  delta,
  changeLifeByAmount,
  handleLongPressStart,
  handlePressOut,
}) => {
  const green = 'rgb(150, 255, 129)';
  const red = 'rgb(255, 140, 140)';

  return (
    <>
      <View style={styles.lifeBlock}>
        <Text style={styles.life}>{life}</Text>
        {delta !== 0 && (
          <Text style={[styles.delta, { color: delta > 0 ? green : red }]}>
            {delta > 0 ? `+${delta}` : delta}
          </Text>
        )}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.inc,
          pressed && { backgroundColor: 'rgba(200, 200, 200, 0.05)' },
        ]}
        onPress={() => changeLifeByAmount(1)}
        onLongPress={() => handleLongPressStart('inc')}
        onPressOut={handlePressOut}
        delayLongPress={1000}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.dec,
          pressed && { backgroundColor: 'rgba(200, 200, 200, 0.05)' },
        ]}
        onPress={() => changeLifeByAmount(-1)}
        onLongPress={() => handleLongPressStart('dec')}
        onPressOut={handlePressOut}
        delayLongPress={1000}
      />
    </>
  );
};

const styles = StyleSheet.create({
  lifeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
    zIndex: 1,
    pointerEvents: 'none',
  },
  life: {
    ...typography.heading1,
    color: OFF_WHITE,
    marginRight: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  delta: {
    ...typography.caption,
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 5, height: 1 },
    textShadowRadius: 20,
  },
  button: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(131, 131, 131, 0)',
  },
  inc: { right: 0 },
  dec: { left: 0 },
  btnText: {
    fontSize: 32,
    fontFamily: 'Comfortaa-Bold',
    color: TEXT,
    transform: [{ rotate: '90deg' }],
  },
});

export default LifeView;
