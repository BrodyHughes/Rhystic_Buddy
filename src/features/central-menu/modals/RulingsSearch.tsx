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
import { useRulingsStore } from '../store/useRulingsStore';
import { useRulings } from '../hooks/useRulings';

const AnimatedView = Animated.createAnimatedComponent(View);

const RulingItem = React.memo(({ item }: { item: { published_at: string; comment: string } }) => (
  <View style={styles.rulingItem}>
    <Text style={styles.rulingDate}>{item.published_at}</Text>
    <Text style={styles.rulingText}>{item.comment}</Text>
  </View>
));
RulingItem.displayName = 'RulingItem';

const RulingsSearch: React.FC = () => {
  const { isSearchVisible, setIsSearchVisible } = useRulingsStore();
  const [cardName, setCardName] = useState('');
  const [submittedCardName, setSubmittedCardName] = useState('');

  const { data: rulingsData, isLoading, isError } = useRulings(submittedCardName);

  const handleSearch = () => {
    Keyboard.dismiss();
    setSubmittedCardName(cardName);
  };

  const handleClose = () => {
    setIsSearchVisible(false);
    setCardName('');
    setSubmittedCardName('');
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  if (!isSearchVisible) {
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
          <Text style={styles.modalTitle}>Card Rulings</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
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
              Rulings for <Text style={styles.cardName}>{searchedCard}</Text>
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
  flex: { flex: 1, width: '100%' },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 40,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
    color: '#fff',
    fontWeight: '900',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
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
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#000',
    fontSize: 16,
  },
  rulingsFoundTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardName: {
    fontStyle: 'italic',
  },
  rulingItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  rulingDate: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  rulingText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
  },
  scryfallCredit: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  scryfallCreditText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  scryfallCreditTextLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

export default RulingsSearch;
