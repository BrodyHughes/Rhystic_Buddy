/**
 * Okay this menu sucks rn but i think the functionality is there.
 * I like the look of Moxfield's menu so may look at making something similar in the future.
 * Lets just keep adding the functionality we need for now.
 * TODO:
 * [ ] add a 'who goes first' randomizer here actually probably
 * [ ] add a 'choose your background' thing with scryfall api
 * [ ] themes????
 * [ ] light / dark mode???
 */

import React, {useState} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';

import {radius} from '../styles/global';
import {useLifeStore} from '../store/useLifeStore';
import PlayerPicker from './playerPicker';

export default function CentralMenuButton() {
  const [open, setOpen] = useState(false);
  const {width: W, height: H} = useWindowDimensions();

  const handleReset = () =>
    useLifeStore.setState(({players}) => ({
      players: players.map(p => ({...p, life: 40, delta: 0})),
    }));

  return (
    <>
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, {top: H / 2, left: W / 2}]}
        onPress={() => setOpen(true)}>
        <Text style={styles.fabText}>☰</Text>
      </TouchableOpacity>

      {/* Modal menu */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        {/* Dark overlay */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}>
          {/* Glass panel */}
          <View style={styles.menuWrapper}>
            {Platform.OS === 'android' && Platform.Version < 31 ? (
              <View style={styles.fallbackGlass} />
            ) : (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={20}
                reducedTransparencyFallbackColor="rgba(255,255,255,0.12)"
              />
            )}

            {/* Actual content */}
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>

              {/* Players selector */}
              <PlayerPicker />

              {/* Reset life */}
              <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
                <Text style={styles.menuItemText}>Reset Life</Text>
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setOpen(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

/* ── styles ────────────────────────────────────────────── */

const FAB_SIZE = 50;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginLeft: -FAB_SIZE / 2,
    marginTop: -FAB_SIZE / 2 + 12,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    transform: [{rotate: '90deg'}],
  },
  fabText: {color: '#fff', fontSize: 28, fontWeight: '700'},

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  /* glass card outer wrapper */
  menuWrapper: {
    width: '80%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 10,
  },
  fallbackGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  /* inner content padding */
  menuContent: {
    padding: 24,
  },

  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },

  menuItem: {marginTop: 16},
  menuItemText: {fontSize: 18, color: '#fff'},

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {fontSize: 18, color: '#fff'},
});
