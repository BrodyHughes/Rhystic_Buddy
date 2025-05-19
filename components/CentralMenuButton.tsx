/**
 * This is the central menu button that will be used to open the menu.
 * It will be a small circle in the middle of the screen that will
 * pop open a menu when you tap it.
 *
 * TODO:
 * - add player count selector
 * - settings
 * - background selector
 */

import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {radius} from '../styles/global';
import {useLifeStore} from '../store/useLifeStore';

export default function CentralMenuButton() {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    useLifeStore.setState(({players}) => ({
      players: players.map(p => ({...p, life: 40, delta: 0})),
    }));
  };

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
        <Text style={styles.fabText}>☰</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Settings</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text>Players (todo)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
              <Text>Reset Life</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={(styles.menuItem, styles.closeButton)}
              onPress={() => setOpen(false)}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const FAB_SIZE = 50;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: '58%',
    left: '49%',
    marginLeft: -FAB_SIZE / 2,
    marginTop: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: '#b0b0b0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    transform: [{rotate: '90deg'}],
  },
  fabText: {color: '#fff', fontSize: 28, fontWeight: '700'},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 24,
    minWidth: '50%',
  },
  menuItem: {fontSize: 18, marginVertical: 6},
  closeButton: {
    borderRadius: radius.pill,
    position: 'absolute',
    top: 0,
    right: 0,
    height: 30,
    width: 30,
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '400',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
});
