import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { radius } from '@/styles/global';
import { PlayerBackground } from '@/features/central-menu/store/usePlayerBackgroundStore';

interface Props {
  background: PlayerBackground | null;
  panelW: number;
  panelH: number;
  isDead: boolean;
}

export default function BackgroundImage({ background, panelW, panelH, isDead }: Props) {
  if (!background) return null;

  return (
    <View
      style={[
        styles.imageWrapper,
        {
          position: 'absolute',
          width: panelH,
          height: panelW,
          top: (panelH - panelW) / 2,
          left: (panelW - panelH) / 2,
          transform: [{ rotate: '90deg' }],
        },
      ]}
    >
      <Image
        source={typeof background.url === 'string' ? { uri: background.url } : background.url}
        style={styles.imageCrop}
        resizeMode="cover"
      />
      {isDead && <View style={styles.grayscaleOverlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  imageCrop: {
    width: '100%',
    height: '140%',
    opacity: 0.3,
  },
  grayscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
