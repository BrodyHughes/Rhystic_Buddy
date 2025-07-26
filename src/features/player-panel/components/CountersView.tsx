import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ViewMode } from '@/types/app';
import CountersMenu from '@/features/counters-menu/components/CountersMenu';

interface Props {
  menuVisible: boolean;
  menuType: ViewMode;
  index: number;
  panelHeight: number;
  panelWidth: number;
  active?: boolean;
}

export default function CountersView({
  menuVisible,
  menuType,
  index,
  panelHeight,
  panelWidth,
  active = false,
}: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const [scrollKey, setScrollKey] = useState(0);

  useEffect(() => {
    if (active) {
      // force remount of ScrollView -> fresh offset at 0, no snap
      setScrollKey((k) => k + 1);
    }
  }, [active]);

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
            key={`${index}-${scrollKey}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: 0, y: 0 }}
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
