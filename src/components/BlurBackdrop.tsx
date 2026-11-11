import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { SCRIM } from '@/consts/consts';

/** Dark iOS blur; Android gets a flat translucent fill instead. */
export default function BlurBackdrop() {
  return Platform.OS === 'ios' ? (
    <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
  ) : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: SCRIM }]} />
  );
}
