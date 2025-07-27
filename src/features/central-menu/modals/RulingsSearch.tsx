// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  Linking,
  Keyboard,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';
import { useRulingsStore } from '../store/useRulingsStore';
import { useRulings } from '../hooks/useRulings';
import { typography } from '@/styles/global';
import {
  BACKGROUND_TRANSPARENT,
  BUTTON_BACKGROUND,
  PLAINS,
  RULING_ITEM_BACKGROUND,
} from '@/consts/consts';

const AnimatedView = Animated.createAnimatedComponent(View);

const RulingItem = React.memo(({ item }: { item: { published_at: string; comment: string } }) => (
  <View style={styles.rulingItem}>
    <Text style={styles.rulingDate}>{item.published_at}</Text>
    <Text style={styles.rulingText}>{item.comment}</Text>
  </View>
));
RulingItem.displayName = 'RulingItem';

const RulingsSearch: React.FC = () => {
  const { isRulingsSearchVisible, setIsRulingsSearchVisible } = useRulingsStore();
  const [cardName, setCardName] = useState('');
  const [submittedCardName, setSubmittedCardName] = useState('');

  const { data: rulingsData, isLoading, isError } = useRulings(submittedCardName);

  const handleSearch = () => {
    Keyboard.dismiss();
    setSubmittedCardName(cardName);
  };

  const handleClose = () => {
    setIsRulingsSearchVisible(false);
    setCardName('');
    setSubmittedCardName('');
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  if (!isRulingsSearchVisible) {
    return null;
  }

  const rulings = rulingsData?.rulings;
  const searchedCard = rulingsData?.cardName;
  const noRulingsFound = !isLoading && rulings && rulings.length === 0;
  const cardNotFound = isError || (rulingsData === undefined && !!submittedCardName);

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleClose}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Card Rulings</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search Card Rulings"
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

        {cardNotFound && !isLoading && (
          <Text style={styles.errorText}>
            Card not found. Please enter the full card name and check for typos.
          </Text>
        )}
        {isError && !cardNotFound && (
          <Text style={styles.errorText}>An error occurred while fetching rulings.</Text>
        )}
        {isLoading && <Text style={styles.emptyText}>Searching...</Text>}

        {rulings && rulings.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.rulingsFoundTitle}>
              Rulings for: <Text style={styles.cardName}>{searchedCard}</Text>
            </Text>
            <FlatList
              data={rulings}
              keyExtractor={(item) => item.published_at + item.comment}
              renderItem={({ item }) => <RulingItem item={item} />}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={11}
            />
          </View>
        )}

        {noRulingsFound && (
          <Text style={styles.emptyText}>No rulings found for {searchedCard}.</Text>
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
  flex: { flex: 1, width: '100%', alignItems: 'center' },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: BACKGROUND_TRANSPARENT,
    zIndex: 50,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    ...typography.heading2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
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
  rulingsFoundTitle: {
    ...typography.heading2,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
  cardName: {
    fontWeight: 500, // to differentiate from the rest of the text
  },
  rulingItem: {
    backgroundColor: RULING_ITEM_BACKGROUND,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  rulingDate: {
    ...typography.miniCaption,
    color: '#aaa',
    marginBottom: 5,
  },
  rulingText: {
    ...typography.body,
    lineHeight: 22,
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
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  scryfallCredit: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  scryfallCreditText: {
    ...typography.miniCaption,
  },
  scryfallCreditTextLink: {
    ...typography.miniCaption,
    color: PLAINS,
    textDecorationLine: 'underline',
  },
});

export default RulingsSearch;
