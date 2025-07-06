import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PlayerCount, useLifeStore } from '@/store/useLifeStore';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

export default function PlayerPicker() {
  const totalPlayers = useLifeStore((s) => s.totalPlayers);
  const setTotalPlayers = useLifeStore((s) => s.setTotalPlayers);
  const resetCarousels = PlayerCarouselManager.resetAll;

  /* keep editable text locally so the user can type freely */
  const [draft, setDraft] = useState(totalPlayers.toString());
  const isInitialMount = useRef(true);

  const commit = () => {
    const num = Number(draft);
    if (num >= 2 && num <= 6) {
      setTotalPlayers(num as PlayerCount);
      if (num === 2) {
        setTotalPlayers(num as PlayerCount);
        useLifeStore.setState(({ players }) => ({
          players: players.map((p) => ({ ...p, life: 20, delta: 0 })),
          life: 20,
          delta: 0,
        }));
      }
    } else {
      // revert to store value on invalid entry
      setDraft(totalPlayers.toString());
    }
  };

  useEffect(() => setDraft(totalPlayers.toString()), [totalPlayers]);

  useEffect(() => {
    // On subsequent renders (not the initial one), when totalPlayers changes,
    // we reset the carousels. This runs after the new player panels have mounted
    // and registered their reset functions.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    resetCarousels();
  }, [totalPlayers, resetCarousels]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Players</Text>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        onEndEditing={commit}
        keyboardType="number-pad"
        maxLength={1}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  label: { marginRight: 8, fontSize: 18, color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 6,
    minWidth: 40,
    textAlign: 'center',
    color: '#fff',
  },
});
