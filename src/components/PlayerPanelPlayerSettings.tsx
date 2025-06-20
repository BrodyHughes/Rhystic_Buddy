/**
 * OKAY basic fetching is in place. right now it fetches a single card lol
 * TODO:
 * [ ] add a 'choose your background' search input with scryfall api
 * [ ] add a 'choose your background' button that lets you set background to the art
 * [ ] figure out where tf to put this menu
 */
import { fetchCardByName } from '@/helpers/scryfallFetch';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { ScryfallApiResponse } from '@/types/scryfall';
import { ImageBackground, TextInput } from 'react-native';

interface Props {
  isEvenPlayerIndexNumber: boolean;
}

export default function PlayerPanelPlayerSettings({ isEvenPlayerIndexNumber }: Props) {
  
  const [cardImageUrl, setCardImageUrl] = useState<string | undefined>(undefined);
  const [cardName, setCardName] = useState('');
  const handleFetch = async () => {
    const image = await fetchCardByName(cardName);
      if (!image) {
        Alert.alert('Card not found. Try another name.');
          return;
      }
      setCardImageUrl(image);
  };


  return (
      <ImageBackground
          source={cardImageUrl ? { uri: cardImageUrl } : undefined}
          resizeMode="cover"
          style={styles.overlay}
          imageStyle={{ opacity: 0.15 }} // optional: faint background
      >
        <View
            style={[
              styles.grid,
              { transform: [{ rotate: isEvenPlayerIndexNumber ? '0deg' : '180deg' }] },
            ]}
        >
          <TextInput
              placeholder="Search card by name"
              value={cardName}
              onChangeText={setCardName}
              onSubmitEditing={handleFetch}
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                margin: 10,
                paddingHorizontal: 8,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              returnKeyType="search"
          />
          <TouchableOpacity style={styles.menuItem} onPress={handleFetch}>
            <Text style={styles.menuItemText}>Set Background</Text>
          </TouchableOpacity>



          {/* ... your TouchableOpacity, TextInput, etc. go here */}
        </View>
      </ImageBackground>
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
