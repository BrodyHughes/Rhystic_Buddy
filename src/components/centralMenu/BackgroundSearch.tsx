import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Linking,
  Keyboard,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useLifeStore } from '@/store/useLifeStore';
import { PlayerBackground, usePlayerBackgroundStore } from '@/store/usePlayerBackgroundStore';
import { fetchCardPrintings } from '@/helpers/scryfallFetch';

interface BackgroundSearchProps {
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const BackgroundSearch: React.FC<BackgroundSearchProps> = ({ onClose }) => {
  const [cardName, setCardName] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [fetchedCards, setFetchedCards] = useState<PlayerBackground[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const players = useLifeStore((state) => state.players);
  const setPlayerBackground = usePlayerBackgroundStore((state) => state.setBackground);
  const removePlayerBackground = usePlayerBackgroundStore((state) => state.removeBackground);
  const backgrounds = usePlayerBackgroundStore((state) => state.backgrounds);

  const handleSearch = async (searchTerm: string) => {
    Keyboard.dismiss();
    if (!searchTerm) {
      setFetchedCards(null);
      return;
    }
    setIsSearching(true);
    const images = await fetchCardPrintings(searchTerm);
    if (!images) {
      // Do not alert if the user is just typing
      // Alert.alert('Card not found', 'Please try another card name.');
    } else {
      setFetchedCards(images);
    }
    setIsSearching(false);
  };

  const handleRemoveBackground = () => {
    if (selectedPlayerId === null) return;
    removePlayerBackground(selectedPlayerId);
    // Reset state and close
    setCardName('');
    setSelectedPlayerId(null);
    setFetchedCards(null);
    onClose();
  };

  const handleSetBackground = (background: PlayerBackground) => {
    if (selectedPlayerId === null) return;
    setPlayerBackground(selectedPlayerId, background);
    // Reset state and close
    setCardName('');
    setSelectedPlayerId(null);
    setFetchedCards(null);
    onClose();
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  // Determine the number of columns for the grid layout.
  // This logic mirrors the main app layout for consistency.
  const numColumns = players.length > 2 ? 2 : players.length;
  const hasBackground = selectedPlayerId !== null && backgrounds[selectedPlayerId];

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.title}>
            {selectedPlayerId === null ? 'Select a Player' : 'Search for a Background'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSelectedPlayerId(null);
              setFetchedCards(null); // Also clear image on close
              onClose();
            }}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {selectedPlayerId === null ? (
          // Player Picker
          <View style={styles.pickerContainer}>
            <View style={[styles.gridContainer, { maxWidth: numColumns * 150 }]}>
              {players.map((player, index) => (
                <TouchableOpacity
                  key={player.id}
                  style={[styles.selectItem]}
                  onPress={() => setSelectedPlayerId(player.id)}
                >
                  <Text style={styles.selectItemText}>Player {index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          // Search Input & Image Preview
          <View style={styles.searchContainer}>
            <View style={styles.searchRow}>
              <TextInput
                placeholder={`Card name for Player ${
                  players.findIndex((p) => p.id === selectedPlayerId) + 1
                }`}
                placeholderTextColor="#999"
                value={cardName}
                onChangeText={setCardName}
                onSubmitEditing={() => handleSearch(cardName)}
                style={styles.searchInput}
                returnKeyType="search"
                autoFocus
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(cardName)}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            {hasBackground && (
              <TouchableOpacity style={styles.actionButton} onPress={handleRemoveBackground}>
                <Text style={styles.searchButtonText}>Remove Background</Text>
              </TouchableOpacity>
            )}

            <View style={styles.listContainer}>
              {isSearching && <Text style={styles.artistText}>Searching...</Text>}
              {!isSearching && fetchedCards && (
                <FlatList
                  data={fetchedCards}
                  keyExtractor={(item) => String(item.url)}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.imagePreviewContainer}
                      onPress={() => handleSetBackground(item)}
                    >
                      <Image source={{ uri: item.url as string }} style={styles.imagePreview} />
                      <Text style={styles.artistText} numberOfLines={1}>
                        Art by: {item.artist}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.emptyText}>No printings found.</Text>}
                />
              )}
            </View>
          </View>
        )}
        <View style={styles.scryfallCredit}>
          <Text style={styles.scryfallCreditText}>
            Search powered by{' '}
            <Text style={styles.scryfallCreditTextLink} onPress={handleLinkToScryfall}>
              Scryfall
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 30,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
    color: '#fff',
    fontWeight: 900,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
    height: 60,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectItemText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Comfortaa-SemiBold',
  },
  searchRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Comfortaa-Bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Comfortaa-Bold',
  },
  imagePreviewContainer: {
    margin: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 210,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePreviewText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Comfortaa-Bold',
    textAlign: 'center',
  },
  artistText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Comfortaa-Regular',
    textAlign: 'center',
    marginTop: 4,
    width: 150,
  },
  scryfallCredit: {
    paddingTop: 20,
    alignSelf: 'center',
  },
  scryfallCreditText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
  },
  scryfallCreditTextLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
    textDecorationLine: 'underline',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BackgroundSearch;
