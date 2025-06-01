/**
 * OKAY basic fetching is in place. right now it fetches a single card lol
 * TODO:
 * [ ] add a 'choose your background' search input with scryfall api
 * [ ] add a 'choose your background' button that lets you set background to the art
 * [ ] figure out where tf to put this menu
 */
import { fetchItems } from '@/helpers/scryfallFetch';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ScryfallApiResponse } from '@/types/scryfall';

interface Props {
  isEvenPlayerIndexNumber: boolean;
}

export default function PlayerPanelPlayerSettings({ isEvenPlayerIndexNumber }: Props) {
  const [data, setData] = useState<ScryfallApiResponse | null>(null);
  const handleFetch = async () => {
    const items = await fetchItems();
    if (items) {
      setData(items);
    }
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.grid,
          { transform: [{ rotate: isEvenPlayerIndexNumber ? '0deg' : '180deg' }] },
        ]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={handleFetch}>
          <Text style={styles.menuItemText}>Fetch API</Text>
        </TouchableOpacity>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        {data && <Text style={{ color: 'white' }}>{data.data[0].name}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    width: '100%',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    height: '70%',
    paddingHorizontal: 5,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  menuItemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
