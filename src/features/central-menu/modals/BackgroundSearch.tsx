// SPDX-License-Identifier: Apache-2.0

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
  Modal,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import {
  PlayerBackground,
  usePlayerBackgroundStore,
} from '@/features/central-menu/store/usePlayerBackgroundStore';
import { useCardPrintings } from '../hooks/useCardPrintings';
import { BACKGROUND_TRANSPARENT, BUTTON_BACKGROUND, LIGHT_GREY, PLAINS } from '@/consts/consts';
import { typography } from '@/styles/global';

interface BackgroundSearchProps {
  onClose: () => void;
  playerId?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const CardImage = React.memo(
  ({ item, onPress }: { item: { url: string; artist: string }; onPress: () => void }) => (
    <TouchableOpacity style={styles.imagePreviewContainer} onPress={onPress}>
      <View style={styles.imageFrame}>
        <Image source={{ uri: item.url }} style={styles.imageTopCrop} resizeMode="cover" />
      </View>
      <Text style={styles.artistText} numberOfLines={1}>
        Art by: {item.artist}
      </Text>
    </TouchableOpacity>
  ),
);
CardImage.displayName = 'CardImage';

const BackgroundSearch: React.FC<BackgroundSearchProps> = ({ onClose, playerId }) => {
  const [cardName, setCardName] = useState('');
  const [submittedCardName, setSubmittedCardName] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(playerId ?? null);

  const { data: fetchedCards, isLoading, isError } = useCardPrintings(submittedCardName);

  const players = useLifeStore((state) => state.players);
  const setPlayerBackground = usePlayerBackgroundStore((state) => state.setBackground);
  // const removePlayerBackground = usePlayerBackgroundStore((state) => state.removeBackground);
  // const backgrounds = usePlayerBackgroundStore((state) => state.backgrounds);

  const handleSearch = () => {
    Keyboard.dismiss();
    setSubmittedCardName(cardName);
  };

  // const handleRemoveBackground = () => {
  //   if (selectedPlayerId === null) return;
  //   removePlayerBackground(selectedPlayerId);
  //   setCardName('');
  //   setSubmittedCardName('');
  //   setSelectedPlayerId(null);
  //   onClose();
  // };

  const handleSetBackground = (background: PlayerBackground) => {
    if (selectedPlayerId === null) return;
    setPlayerBackground(selectedPlayerId, background);
    setCardName('');
    setSubmittedCardName('');
    setSelectedPlayerId(null);
    onClose();
  };

  const handleClosePress = () => {
    setSelectedPlayerId(null);
    setSubmittedCardName('');
    onClose();
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  // Determine the number of columns for the grid layout.
  // This logic mirrors the main app layout for consistency.
  const numColumns = players.length > 2 ? 2 : players.length;
  // const hasBackground = selectedPlayerId !== null && backgrounds[selectedPlayerId];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>
              {selectedPlayerId === null ? 'Select a Player' : 'Search for a Background'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
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
                  onSubmitEditing={handleSearch}
                  style={styles.searchInput}
                  returnKeyType="search"
                  autoFocus
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>

              {/* {hasBackground && (
              <TouchableOpacity style={styles.actionButton} onPress={handleRemoveBackground}>
                <Text style={styles.searchButtonText}>Remove Background</Text>
              </TouchableOpacity>
            )} */}

              <View style={styles.listContainer}>
                {isLoading && <Text style={styles.emptyText}>Searching...</Text>}

                {!isLoading && isError && (
                  <Text style={styles.errorText}>Card not found. Please check for typos.</Text>
                )}

                {!isLoading && !isError && fetchedCards && (
                  <>
                    <Text style={styles.confirmText}>Tap card image to confirm</Text>
                    <FlatList
                      data={fetchedCards}
                      keyExtractor={(item) => String(item.url)}
                      numColumns={2}
                      renderItem={({ item }) => (
                        <CardImage item={item} onPress={() => handleSetBackground(item)} />
                      )}
                      initialNumToRender={4}
                      maxToRenderPerBatch={4}
                      windowSize={5}
                      ListEmptyComponent={<Text style={styles.emptyText}>No printings found.</Text>}
                    />
                  </>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_TRANSPARENT,
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
    justifyContent: 'flex-start',
  },
  title: {
    ...typography.heading2,
    color: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectItem: {
    backgroundColor: BUTTON_BACKGROUND,
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
    ...typography.body,
    color: '#000',
  },
  searchRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: BUTTON_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    ...typography.body,
    marginBottom: 0,
    color: '#000', // Okay to use here bc input color should be different
  },
  searchButton: {
    backgroundColor: BUTTON_BACKGROUND,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    ...typography.body,
    marginBottom: 0,
    color: '#000',
  },
  closeButton: {
    paddingHorizontal: 5,
  },
  closeButtonText: {
    color: LIGHT_GREY,
    fontFamily: 'Dosis',
    ...typography.heading2,
    lineHeight: 45,
    fontSize: 45, // okay to use here bc its a different sized 'x' for close
  },
  confirmText: {
    color: LIGHT_GREY,
    ...typography.body,
    textAlign: 'center',
    marginBottom: 10,
  },
  imagePreviewContainer: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFrame: {
    width: 160,
    height: 80,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 4,
  },
  imageTopCrop: {
    width: '100%',
    height: '120%',
  },
  artistText: {
    color: '#ccc',
    ...typography.miniCaption,
    textAlign: 'center',
    marginTop: 4,
    width: 160,
  },
  scryfallCredit: {
    paddingTop: 20,
    alignSelf: 'center',
  },
  scryfallCreditText: {
    color: LIGHT_GREY,
    ...typography.miniCaption,
  },
  scryfallCreditTextLink: {
    ...typography.miniCaption,
    textDecorationLine: 'underline',
    color: PLAINS,
  },
  emptyText: {
    ...typography.body,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    ...typography.body,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BackgroundSearch;
