import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ViewMode } from './PlayerPanel';
import CountersMenu from '@/features/counters-menu/components/CountersMenu';

interface Props {
  menuVisible: boolean;
  menuType: ViewMode;
  index: number;
  panelHeight: number;
  panelWidth: number;
}

export default function CountersView({
  menuVisible,
  menuType,
  index,
  panelHeight,
  panelWidth,
}: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  if (!menuVisible) {
    return null;
  }

  return (
    <View
      style={styles.overlay}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!dims || dims.w !== width || dims.h !== height) {
          setDims({ w: width, h: height });
        }
      }}
    >
      {menuType === ViewMode.COUNTERS && (
        <View
          style={[
            styles.content,
            {
              width: panelHeight, // rotated: width becomes original height
              maxHeight: panelWidth, // height becomes original width
              transform: [{ rotate: '90deg' }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
          >
            <CountersMenu defenderId={index} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
