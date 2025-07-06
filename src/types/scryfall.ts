// SPDX-License-Identifier: Apache-2.0

export type Legality = 'legal' | 'not_legal' | 'restricted' | 'banned';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'special' | 'mythic' | 'bonus';

export type BorderColor = 'black' | 'white' | 'borderless' | 'silver' | 'gold';

export type ImageStatus = 'missing' | 'placeholder' | 'lowres' | 'highres_scan';

export type Finish = 'foil' | 'nonfoil' | 'etched';

export interface ScryfallRuling {
  object: 'ruling';
  oracle_id: string;
  source: string;
  published_at: string;
  comment: string;
}

export interface ScryfallCard {
  object: 'card';
  id: string;
  oracle_id: string;
  lang: string;
  uri: string;
  scryfall_uri: string;
  rulings_uri: string;
  multiverse_ids?: number[];
  mtgo_id?: number;
  mtgo_foil_id?: number;
  tcgplayer_id?: number;
  cardmarket_id?: number;
  name: string;
  layout: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: { [format: string]: Legality };
  reserved: boolean;
  games: string[];
  edhrec_rank?: number;
  penny_rank?: number;
  released_at: string;
  highres_image: boolean;
  image_status: ImageStatus;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  foil: boolean;
  nonfoil: boolean;
  finishes: Finish[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: Rarity;
  flavor_text?: string;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id?: string;
  border_color: BorderColor;
  frame: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  prices: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  related_uris: {
    gatherer?: string;
    tcgplayer_infinite_articles?: string;
    tcgplayer_infinite_decks?: string;
    edhrec?: string;
  };
  card_faces?: {
    image_uris?: {
      art_crop?: string;
    };
  }[];
}

export type ScryfallCardList = ScryfallApiList<ScryfallCard>;

export interface ScryfallApiList<T> {
  object: 'list';
  total_cards?: number;
  has_more: boolean;
  next_page?: string;
  data: T[];
}
