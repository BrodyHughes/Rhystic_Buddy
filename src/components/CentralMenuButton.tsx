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

import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';

import { radius } from '@/styles/global';
import { useLifeStore } from '@/store/useLifeStore';
import PlayerPicker from '@/components/playerPicker';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { SURFACE } from '@/consts/consts';
import { useCounterStore } from '@/store/useCounterStore';
import { useTurnStore } from '@/store/useTurnStore';
import { fetchItems } from '@/helpers/scryfallFetch';

export default React.memo(function CentralMenuButton() {
  const [open, setOpen] = useState(false);
  const { width: W, height: H } = useWindowDimensions();

  const handleReset = () => {
    useLifeStore.setState(({ players }) => ({
      players: players.map((p) => ({ ...p, life: 40, delta: 0 })),
      life: 40,
      delta: 0,
    }));
    useCommanderDamageStore.setState({ damage: {} });
    useCounterStore.setState({ counters: {} });
  };

  const handleTurnOrder = () => {
    setOpen(false);

    const total = useLifeStore.getState().players.length;
    const order = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);

    const loops = 3;
    const flashDelay = 100;
    let tick = 0;

    const spin = setInterval(() => {
      useTurnStore.getState().set(order[tick % total]);
      tick++;

      if (tick === total * loops + 1) {
        clearInterval(spin);

        setTimeout(() => {
          useTurnStore.getState().reset();
        }, 2000);
      }
    }, flashDelay);
  };

  const handleFetch = () => {
    fetchItems();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { top: H / 2, left: W / 2 }]}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.fabText}>×</Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.menuWrapper}>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>

              <PlayerPicker />
              <TouchableOpacity style={styles.menuItem} onPress={handleTurnOrder}>
                <Text style={styles.menuItemText}>Turn Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
                <Text style={styles.menuItemText}>Reset Game</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleFetch}>
                <Text style={styles.menuItemText}>Fetch API</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

/* ── styles ────────────────────────────────────────────── */

const FAB_SIZE = 70;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginLeft: -FAB_SIZE / 2,
    marginTop: -FAB_SIZE / 2 + 12,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 9,
    borderColor: 'rgb(32, 32, 32)',
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 2 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(41, 41, 44, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuWrapper: {
    width: '80%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
    backgroundColor: SURFACE,
  },

  menuContent: {
    padding: 24,
  },

  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },

  menuItem: { marginTop: 16 },
  menuItemText: { fontSize: 18, color: '#fff' },

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
  closeButtonText: { fontSize: 18, color: '#fff' },
});
