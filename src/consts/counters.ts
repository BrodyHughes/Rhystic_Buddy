import { Biohazard, Coins, LucideIcon, Sparkles, Zap } from 'lucide-react-native';

export type CounterType = 'tax' | 'poison' | 'energy' | 'experience';

export const COUNTERS: Record<CounterType, { label: string; Icon: LucideIcon; step: number }> = {
  tax: { label: 'Tax', Icon: Coins, step: 2 },
  poison: { label: 'Poison', Icon: Biohazard, step: 1 },
  energy: { label: 'Energy', Icon: Zap, step: 1 },
  experience: { label: 'Experience', Icon: Sparkles, step: 1 },
};

export const DEFAULT_COUNTERS: readonly CounterType[] = ['tax'];

export const ADDABLE_COUNTERS: readonly CounterType[] = ['poison', 'energy', 'experience'];

export const COUNTER_ORDER = [...DEFAULT_COUNTERS, ...ADDABLE_COUNTERS];

export const LETHAL_POISON = 10;
export const LETHAL_COMMANDER_DAMAGE = 21;

export const CHIP_ICON_SIZE = 16;
export const TILE_ICON_SIZE = 28;
