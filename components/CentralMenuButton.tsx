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
import {palette, radius} from '../styles/global';

export default function CentralMenuButton() {
  const [open, setOpen] = useState(false);

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
            <Text style={styles.menuItem}>⚙️ Settings (placeholder)</Text>
            <Text style={styles.menuItem}>➕ Add Player (todo)</Text>
            <Text style={styles.menuItem}>❌ Close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const FAB_SIZE = 64;
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: '55%',
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
    marginTop: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: palette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
    minWidth: 220,
  },
  menuItem: {fontSize: 18, marginVertical: 6},
});
