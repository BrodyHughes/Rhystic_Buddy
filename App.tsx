/* it all starts here, baby!!
 *
 * ...kinda. everything is rendered at the root in index.js
 * but this is the main entry point into the app.
 * the idea is to render the player panels then a
 * menu on top and make it all from there.
 */

import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import PlayerPanel from '@/components/PlayerPanel';
import CentralMenuButton from '@/components/CentralMenuButton';
import { useLifeStore } from '@/store/useLifeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GAP, APP_BACKGROUND } from '@/consts/consts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
  const players = useLifeStore((s) => s.players);
  const totalPlayersCount = players.length;

  // Configuration for columns and rows based on player count
  const layoutConfigurations: { [count: number]: { columns: number; rows: number } } = {
    2: { columns: 1, rows: 2 },
    3: { columns: 2, rows: 2 },
    4: { columns: 2, rows: 2 },
    5: { columns: 2, rows: 3 },
    6: { columns: 2, rows: 3 },
  };

  const currentLayout = layoutConfigurations[totalPlayersCount];
  const { columns, rows } = currentLayout;

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const usableW = W - 3 * GAP;
  const usableH = H - top - bottom - 3 * GAP;
  const panelW = usableW / columns;
  const panelH = usableH / rows;

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.grid}>
          {players.map((player, playerIndexNumber) => (
            <PlayerPanel
              key={player.id}
              player={player}
              index={playerIndexNumber}
              cols={columns}
              rows={rows}
              isEvenPlayerIndexNumber={playerIndexNumber % 2 === 0}
            />
          ))}
          {/* a blank panel for odd number of players to fill the last row lol this is kinda dumb and hacky */}
          {players.length % 2 === 1 && (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                height: panelH,
                width: panelW,
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />
          )}
        </View>
        <CentralMenuButton />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/* ── Styles ────────────────────────────────────────────── */

// simple and keeps it all on page.
// also should move styling outside components at some point lol
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: APP_BACKGROUND },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: GAP,
    justifyContent: 'center',
  },
});
