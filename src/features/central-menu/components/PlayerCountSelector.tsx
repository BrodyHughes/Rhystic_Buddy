import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PlayerCount } from '@/features/player-panel/store/useLifeStore';

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
    backgroundColor: 'rgba(0,0,0,0.85)',
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
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
    color: '#fff',
  },
  selectItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectItemText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Comfortaa-SemiBold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
  },
});

export default React.memo(PlayerCountSelector);
