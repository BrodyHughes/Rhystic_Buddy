/* it all starts here, baby!!
 *
 * ...kinda. everything is rendered at the root in index.js
 * but this is the main entry point into the app.
 * the idea is to render the player panels then a
 * menu on top and make it all from there.
 */

import React from 'react';
import {SafeAreaView, View, StatusBar, StyleSheet} from 'react-native';
import PlayerPanel from './components/PlayerPanel';
import CentralMenuButton from './components/CentralMenuButton';
import {useLifeStore} from './store/useLifeStore';

export const GAP = 10;
export const SURFACE = '#777777'; // idk man don't worry about the styling rn

export default function App() {
  const players = useLifeStore(s => s.players);
  const totalPlayers = players.length;

  const rows = totalPlayers <= 4 ? 2 : 3; // 2 rows for ≤4, else 3
  const cols = Math.ceil(totalPlayers / rows);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.grid}>
        {players.map((_, i) => (
          <PlayerPanel
            key={i}
            index={i}
            cols={cols}
            rows={rows}
            isEven={i % 2 === 0}
          />
        ))}
      </View>
      <CentralMenuButton />
    </SafeAreaView>
  );
}

/* ── Styles ────────────────────────────────────────────── */

// simple and keeps it all on page.
// also should move styling outside components at some point lol
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: SURFACE},
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: GAP,
  },
});
