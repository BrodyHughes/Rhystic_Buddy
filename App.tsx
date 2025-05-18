import React from 'react';
import {SafeAreaView, View, StatusBar, StyleSheet} from 'react-native';
import PlayerPanel from './components/PlayerPanel';
import CentralMenuButton from './components/CentralMenuButton';

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* 2×2 grid for the 4 players */}
      <View style={styles.grid}>
        {Array.from({length: 4}, (_, i) => (
          <PlayerPanel key={i} index={i} />
        ))}
      </View>

      <CentralMenuButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: 'palette.background'},
  grid: {
    // ✅ stays the same
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap', // allows wrapping after two items
  },
});
