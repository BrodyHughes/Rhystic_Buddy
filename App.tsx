import React from 'react';
import {SafeAreaView, View, StatusBar, StyleSheet} from 'react-native';
import PlayerPanel from './components/PlayerPanel';
import CentralMenuButton from './components/CentralMenuButton';
import {useLifeStore} from './store/useLifeStore';

export default function App() {
  const players = useLifeStore(s => s.players);
  console.log('players', players);
  console.log('players.length', players.length);
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.grid}>
        {Array.from({length: players.length}, (_, i) => (
          <PlayerPanel key={i} index={i} />
        ))}
      </View>
      <CentralMenuButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'palette.background',
    padding: 0,
    margin: 0,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
