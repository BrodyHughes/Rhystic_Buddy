import {
  Image as ImageIcon,
  Crown,
  Zap,
  Skull,
  Droplet,
  Flame,
  Leaf,
  Sun,
  Moon,
  CloudLightning,
  LucideIcon,
} from 'lucide-react-native';

import {
  TRANSPARENT_PLAINS,
  TRANSPARENT_ISLAND,
  TRANSPARENT_SWAMP,
  TRANSPARENT_MOUNTAIN,
  TRANSPARENT_FOREST,
  CARD_BACKGROUND_TRANSPARENT,
} from './consts';

export type CounterType =
  | 'tax'
  | 'charge'
  | 'poison'
  | 'storm'
  | 'manaWhite'
  | 'manaBlue'
  | 'manaBlack'
  | 'manaRed'
  | 'manaGreen';

export const DEFAULT_COUNTERS: readonly CounterType[] = ['tax', 'charge'] as const;

export const EXTRA_COUNTERS: readonly CounterType[] = [
  'poison',
  'storm',
  'manaWhite',
  'manaBlue',
  'manaBlack',
  'manaRed',
  'manaGreen',
] as const;

export const ALL_COUNTER_TYPES = [...DEFAULT_COUNTERS, ...EXTRA_COUNTERS] as const;

export const COUNTER_ICONS: Record<CounterType | 'background', LucideIcon> = {
  background: ImageIcon,
  tax: Crown,
  charge: Zap,
  poison: Skull,
  storm: CloudLightning,
  manaWhite: Sun,
  manaBlue: Droplet,
  manaBlack: Moon,
  manaRed: Flame,
  manaGreen: Leaf,
};

export const COUNTER_COLORS: Record<CounterType, string> = {
  tax: CARD_BACKGROUND_TRANSPARENT,
  charge: CARD_BACKGROUND_TRANSPARENT,
  poison: CARD_BACKGROUND_TRANSPARENT,
  storm: CARD_BACKGROUND_TRANSPARENT,
  manaWhite: TRANSPARENT_PLAINS,
  manaBlue: TRANSPARENT_ISLAND,
  manaBlack: TRANSPARENT_SWAMP,
  manaRed: TRANSPARENT_MOUNTAIN,
  manaGreen: TRANSPARENT_FOREST,
};
