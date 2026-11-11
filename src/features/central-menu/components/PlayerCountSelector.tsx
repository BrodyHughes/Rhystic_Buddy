// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PlayerCount } from '@/features/player-panel/store/useLifeStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { typography, pickerStyles } from '@/styles/global';
import {} from '@/consts/consts';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

interface PlayerCountSelectorProps {
  onSelect: (count: PlayerCount) => void;
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({ onSelect, onClose }) => {
  const currentTotal = useLifeStore((s) => s.totalPlayers);

  const handleSelect = (count: PlayerCount) => {
    onSelect(count);
    setTimeout(PlayerCarouselManager.resetAll, 500);
  };

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <BlurBackdrop />
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Select Player Count</Text>
          <CloseButton onPress={onClose} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.pickerContainer}>
            {[2, 3, 4, 5, 6].map((count) => {
              const selected = count === currentTotal;
              return (
                <TouchableOpacity
                  key={count}
                  style={[pickerStyles.selectItem, selected && pickerStyles.selectedItem]}
                  onPress={() => handleSelect(count as PlayerCount)}
                >
                  <Text
                    style={[pickerStyles.selectItemText, selected && pickerStyles.selectedText]}
                  >
                    {count} Players
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pickerContainer: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    ...typography.heading2,
    textAlign: 'left',
    flex: 1,
  },
});

export default React.memo(PlayerCountSelector);
