// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { typography, pickerStyles } from '@/styles/global';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

interface StartingLifeSelectorProps {
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PRESET_VALUES = [20, 25, 30, 40];

const StartingLifeSelector: React.FC<StartingLifeSelectorProps> = ({ onClose }) => {
  const startingLife2Players = useLifeStore((s) => s.startingLife2Players);
  const startingLifeMultiPlayers = useLifeStore((s) => s.startingLifeMultiPlayers);
  const setStartingLifeTwoPlayers = useLifeStore((s) => s.setStartingLifeTwoPlayers);
  const setStartingLifeMultiPlayers = useLifeStore((s) => s.setStartingLifeMultiPlayers);

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <BlurBackdrop />
      <SafeAreaView style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Starting Life</Text>
          <CloseButton onPress={onClose} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionHeader}>Two-Player Games</Text>
          <View style={styles.pickerContainer}>
            {PRESET_VALUES.map((value) => (
              <TouchableOpacity
                key={`2p-${value}`}
                style={[
                  pickerStyles.selectItem,
                  value === startingLife2Players && pickerStyles.selectedItem,
                ]}
                onPress={() => setStartingLifeTwoPlayers(value)}
              >
                <Text
                  style={[
                    pickerStyles.selectItemText,
                    value === startingLife2Players && pickerStyles.selectedText,
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
                  pickerStyles.selectItem,
                  value === startingLifeMultiPlayers && pickerStyles.selectedItem,
                ]}
                onPress={() => setStartingLifeMultiPlayers(value)}
              >
                <Text
                  style={[
                    pickerStyles.selectItemText,
                    value === startingLifeMultiPlayers && pickerStyles.selectedText,
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
    width: '80%',
    alignItems: 'center',
  },
  sectionHeader: {
    ...typography.body,
    marginVertical: 10,
    fontWeight: 600,
  },
  title: {
    ...typography.heading2,
    textAlign: 'left',
    flex: 1,
  },
});

export default React.memo(StartingLifeSelector);
