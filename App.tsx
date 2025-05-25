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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BACKGROUND, GAP} from './consts/consts';

export default function App() {
  const players = useLifeStore(s => s.players);
  const totalPlayers = players.length;

  const rows = totalPlayers <= 4 ? 2 : 3;
  const cols = Math.ceil(totalPlayers / rows);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
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
    </GestureHandlerRootView>
  );
}

/* ── Styles ────────────────────────────────────────────── */

// simple and keeps it all on page.
// also should move styling outside components at some point lol
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: BACKGROUND},
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: GAP,
  },
});
