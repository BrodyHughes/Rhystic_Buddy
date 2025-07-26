import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { radius } from '@/styles/global';
import { TURN_WINNER_OVERLAY_BORDER_COLOR } from '@/consts/consts';
import TurnWinnerOverlay from '../../central-menu/components/TurnWinnerOverlay';

interface Props {
  isSpinning: boolean;
  isFinished: boolean;
  isCurrentTurn: boolean;
  panelW: number;
  panelH: number;
}

export default function PanelOverlays({
  isSpinning,
  isFinished,
  isCurrentTurn,
  panelW,
  panelH,
}: Props) {
  return (
    <>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0)']}
        style={styles.shine}
        useAngle={true}
        angle={195}
      />
      {isSpinning && isCurrentTurn && (
        <View style={styles.turnOrderOverlay}>
          <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
        </View>
      )}
      {isFinished && isCurrentTurn && <TurnWinnerOverlay panelW={panelW} panelH={panelH} />}
    </>
  );
}

const styles = StyleSheet.create({
  shine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  turnOrderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: TURN_WINNER_OVERLAY_BORDER_COLOR,
  },
});
