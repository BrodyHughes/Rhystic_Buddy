// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PlayerCount } from '@/features/player-panel/store/useLifeStore';
import { typography } from '@/styles/global';
import { BACKGROUND_TRANSPARENT, BUTTON_BACKGROUND } from '@/consts/consts';

interface PlayerCountSelectorProps {
  onSelect: (count: PlayerCount) => void;
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Select Player Count</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.pickerContainer}>
            {[2, 3, 4, 5, 6].map((count) => (
              <TouchableOpacity
                key={count}
                style={styles.selectItem}
                onPress={() => onSelect(count as PlayerCount)}
              >
                <Text style={styles.selectItemText}>{count} Players</Text>
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
    zIndex: 30,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  title: {
    ...typography.heading2,
    color: '#fff',
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
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    ...typography.heading2,
    fontSize: 45, // okay to use here bc its a different sized 'x' for close
  },
});

export default React.memo(PlayerCountSelector);
