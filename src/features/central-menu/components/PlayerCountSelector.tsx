// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PlayerCount } from '@/features/player-panel/store/useLifeStore';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { radius, typography } from '@/styles/global';
import {
  BACKGROUND_TRANSPARENT,
  BUTTON_BACKGROUND,
  LIGHT_GREY,
  BACKGROUND,
  BORDER_COLOR,
} from '@/consts/consts';
import { useResetAllCarousels } from '@/hooks/useResetAllCarousels';

interface PlayerCountSelectorProps {
  onSelect: (count: PlayerCount) => void;
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({ onSelect, onClose }) => {
  const currentTotal = useLifeStore((s) => s.totalPlayers);
  const { resetAll } = useResetAllCarousels();

  const handleSelect = (count: PlayerCount) => {
    onSelect(count);
    setTimeout(() => resetAll(), 500);
  };

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Select Player Count</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.pickerContainer}>
            {[2, 3, 4, 5, 6].map((count) => {
              const selected = count === currentTotal;
              return (
                <TouchableOpacity
                  key={count}
                  style={[styles.selectItem, selected && styles.selectedItem]}
                  onPress={() => handleSelect(count as PlayerCount)}
                >
                  <Text style={[styles.selectItemText, selected && styles.selectedText]}>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_TRANSPARENT,
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
  selectItem: {
    backgroundColor: BUTTON_BACKGROUND,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: BACKGROUND,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
  },
  selectItemText: {
    ...typography.body,
    color: '#000',
    marginBottom: 0,
    fontWeight: '600',
    fontSize: 20,
  },
  selectedText: {
    color: LIGHT_GREY,
    fontWeight: '900',
  },
  closeButton: {
    paddingHorizontal: 5,
  },
  closeButtonText: {
    color: LIGHT_GREY,
    fontFamily: 'Dosis',
    ...typography.heading2,
    lineHeight: 45,
    fontSize: 45, // okay to use here bc its a different sized 'x' for close
  },
});

export default React.memo(PlayerCountSelector);
