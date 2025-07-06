// https://api.scryfall.com
// import { ScryfallApiResponse } from '@/types/scryfall';

import { ScryfallCard, ScryfallRuling, ScryfallApiList } from '@/types/scryfall';
import { apiFetch } from './api';

const SCRYFALL_API_BASE_URL = 'https://api.scryfall.com';

export async function fetchCardPrintings(
  cardName: string,
): Promise<{ url: string; artist: string }[] | undefined> {
  try {
    const url = `${SCRYFALL_API_BASE_URL}/cards/search?q=${encodeURIComponent(cardName)}&unique=prints`;
    const data = await apiFetch<ScryfallApiList<ScryfallCard>>(url);

    if (!data.data || data.data.length === 0) return undefined;

    return data.data
      .map((card) => {
        const artUrl = card.image_uris?.art_crop || card.card_faces?.[0]?.image_uris?.art_crop;
        if (!artUrl) return null;
        return { url: artUrl, artist: card.artist };
      })
      .filter((item): item is { url: string; artist: string } => item !== null);
  } catch (err) {
    console.error('fetchCardPrintings failed:', err);
    return undefined;
  }
}

export async function fetchCardByName(
  cardName: string,
): Promise<{ url: string; artist: string } | undefined> {
  try {
    const printings = await fetchCardPrintings(cardName);
    return printings?.[0];
  } catch (err) {
    console.error('fetchCardByName failed:', err);
    return undefined;
  }
}

export async function fetchRulingsByName(
  cardName: string,
): Promise<{ rulings: ScryfallRuling[]; cardName: string } | undefined> {
  try {
    const cardUrl = `${SCRYFALL_API_BASE_URL}/cards/named?fuzzy=${encodeURIComponent(cardName)}`;
    const cardData = await apiFetch<ScryfallCard>(cardUrl);
    const { rulings_uri, name } = cardData;

    if (!rulings_uri) return { rulings: [], cardName: name };

    const rulingsData = await apiFetch<ScryfallApiList<ScryfallRuling>>(rulings_uri);
    return { rulings: rulingsData.data, cardName: name };
  } catch (err) {
    console.error('fetchRulingsByName failed:', err);
    return undefined;
  }
}
