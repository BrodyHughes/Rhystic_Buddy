// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
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
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import {
  PlayerBackground,
  usePlayerBackgroundStore,
} from '@/features/central-menu/store/usePlayerBackgroundStore';
import { useCardPrintings } from '../hooks/useCardPrintings';
import {
  BACKGROUND,
  BORDER_COLOR,
  FOREST,
  ISLAND,
  LIGHT_GREY,
  MOUNTAIN,
  PLAINS,
  SWAMP,
  MUTED_TEXT,
} from '@/consts/consts';
import { radius, typography, buttonColors } from '@/styles/global';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

interface BackgroundSearchProps {
  onClose: () => void;
  playerId?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PANEL_COLORS = [PLAINS, ISLAND, SWAMP, MOUNTAIN, FOREST, BACKGROUND]; // WUBRG, then plain

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
  const insets = useSafeAreaInsets();
  const [cardName, setCardName] = useState('');
  const [submittedCardName, setSubmittedCardName] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(playerId ?? null);

  const { data: fetchedCards, isLoading, isError } = useCardPrintings(submittedCardName);

  const players = useLifeStore((state) => state.players);
  const setPlayerBackground = usePlayerBackgroundStore((state) => state.setBackground);
  const setPlayerColor = useLifeStore((state) => state.setPlayerColor);
  const hasImage = usePlayerBackgroundStore(
    (state) => selectedPlayerId !== null && !!state.backgrounds[selectedPlayerId],
  );
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

  const handleSetBackground = useCallback(
    (background: PlayerBackground) => {
      if (selectedPlayerId === null) return;
      setPlayerBackground(selectedPlayerId, background);
      setCardName('');
      setSubmittedCardName('');
      setSelectedPlayerId(null);
      onClose();
    },
    [selectedPlayerId, setPlayerBackground, onClose],
  );

  const handleSetColor = (color: string) => {
    if (selectedPlayerId === null) return;
    setPlayerBackground(selectedPlayerId, null);
    setPlayerColor(selectedPlayerId, color);
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
  const selectedPlayerIndex = players.findIndex((p) => p.id === selectedPlayerId);
  const selectedPlayer = players[selectedPlayerIndex];
  // const hasBackground = selectedPlayerId !== null && backgrounds[selectedPlayerId];

  const keyExtractor = useCallback((item: { url: string }) => String(item.url), []);

  const renderCardItem = useCallback(
    ({ item }: { item: { url: string; artist: string } }) => (
      <CardImage item={item} onPress={() => handleSetBackground(item)} />
    ),
    [handleSetBackground],
  );

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
        <BlurBackdrop />
        <View
          style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.title}>
              {selectedPlayerId === null ? 'Select a Player' : 'Background Search'}
            </Text>
            <CloseButton onPress={handleClosePress} />
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
                  placeholder={`Card name for Player ${selectedPlayerIndex + 1}`}
                  placeholderTextColor={MUTED_TEXT}
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

              {!submittedCardName && (
                <View style={styles.colorRow}>
                  {PANEL_COLORS.map((color) => {
                    const selected = !hasImage && selectedPlayer?.backgroundColor === color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: color },
                          selected && styles.colorSwatchSelected,
                        ]}
                        onPress={() => handleSetColor(color)}
                      />
                    );
                  })}
                </View>
              )}

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
                      keyExtractor={keyExtractor}
                      numColumns={2}
                      renderItem={renderCardItem}
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
        </View>
      </AnimatedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectItem: {
    backgroundColor: BACKGROUND,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    margin: 5,
    height: 60,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectItemText: {
    ...typography.body,
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
    backgroundColor: BACKGROUND,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    ...typography.body,
    marginBottom: 0,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
  },
  colorSwatchSelected: {
    borderColor: LIGHT_GREY,
    borderWidth: 3,
  },
  searchButton: {
    ...buttonColors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  searchButtonText: {
    ...typography.body,
    marginBottom: 0,
    ...buttonColors.onPrimary,
  },
  confirmText: {
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
    borderRadius: radius.md,
    marginBottom: 4,
  },
  imageTopCrop: {
    width: '100%',
    height: '120%',
  },
  artistText: {
    color: MUTED_TEXT,
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
    ...typography.miniCaption,
  },
  scryfallCreditTextLink: {
    ...typography.miniCaption,
    textDecorationLine: 'underline',
    color: PLAINS,
  },
  emptyText: {
    ...typography.body,
    color: MUTED_TEXT,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    ...typography.body,
    color: MOUNTAIN,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BackgroundSearch;
