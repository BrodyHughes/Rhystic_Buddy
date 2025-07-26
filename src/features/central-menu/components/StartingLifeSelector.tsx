// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { typography } from '@/styles/global';
import { BACKGROUND_TRANSPARENT, BUTTON_BACKGROUND, SWAMP, OFF_WHITE } from '@/consts/consts';

interface StartingLifeSelectorProps {
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PRESET_VALUES = [20, 25, 30, 40];

const StartingLifeSelector: React.FC<StartingLifeSelectorProps> = ({ onClose }) => {
  const {
    startingLife2Players,
    startingLifeMultiPlayers,
    setStartingLifeTwoPlayers,
    setStartingLifeMultiPlayers,
  } = useLifeStore();

  const handleSelect2 = (life: number) => {
    setStartingLifeTwoPlayers(life);
    onClose();
  };

  const handleSelectMulti = (life: number) => {
    setStartingLifeMultiPlayers(life);
    onClose();
  };

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Starting Life</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionHeader}>Two-Player Games</Text>
          <View style={styles.pickerContainer}>
            {PRESET_VALUES.map((value) => (
              <TouchableOpacity
                key={`2p-${value}`}
                style={[styles.selectItem, value === startingLife2Players && styles.selectedItem]}
                onPress={() => handleSelect2(value)}
              >
                <Text
                  style={[
                    styles.selectItemText,
                    value === startingLife2Players && styles.selectedText,
                  ]}
                >
                  {value} Life
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 24 }]}>3+ Player Games</Text>
          <View style={styles.pickerContainer}>
            {PRESET_VALUES.map((value) => (
              <TouchableOpacity
                key={`mp-${value}`}
                style={[
                  styles.selectItem,
                  value === startingLifeMultiPlayers && styles.selectedItem,
                ]}
                onPress={() => handleSelectMulti(value)}
              >
                <Text
                  style={[
                    styles.selectItemText,
                    value === startingLifeMultiPlayers && styles.selectedText,
                  ]}
                >
                  {value} Life
                </Text>
              </TouchableOpacity>
            ))}
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
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    ...typography.heading2,
    fontSize: 45,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '80%',
    alignItems: 'center',
  },
  sectionHeader: {
    ...typography.body,
    marginBottom: 8,
  },
  title: {
    ...typography.heading2,
    textAlign: 'left',
    flex: 1,
  },
  selectItem: {
    backgroundColor: BUTTON_BACKGROUND,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectItemText: {
    ...typography.body,
    color: '#000',
  },
  selectedText: {
    color: OFF_WHITE,
    fontWeight: '900',
  },
  selectedItem: {
    backgroundColor: SWAMP,
  },
});

export default React.memo(StartingLifeSelector);
