// https://api.scryfall.com
import { ScryfallApiResponse } from '@/types/scryfall';

export async function fetchCardByName(cardName: string): Promise<string | undefined> {
  try {
    const res = await fetch(
        `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const imageUrl = data.image_uris?.art_crop || data.card_faces?.[0]?.image_uris?.art_crop;

    return imageUrl;
  } catch (err) {
    console.error('fetchCardByName failed:', err);
  }
}



