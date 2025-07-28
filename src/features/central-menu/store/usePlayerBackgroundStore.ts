import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

export interface PlayerBackground {
  url: string | number;
  artist: string;
}

export interface PlayerBackgroundState {
  backgrounds: Record<number, PlayerBackground | null>;
  setBackground: (playerId: number, background: PlayerBackground | null) => void;
  removeBackground: (playerId: number) => void;
}

const artChicago = require('@/../assets/art-institute-of-chicago-wPoRl5TbjZ4-unsplash.jpg');
const birmingham1 = require('@/../assets/birmingham-museums-trust-0xa0OVutd_A-unsplash.jpg');
const birmingham2 = require('@/../assets/birmingham-museums-trust-m8hTQlLH2Lg-unsplash.jpg');
const catherine = require('@/../assets/catherine-kay-greenup-l5EaYAbV1X4-unsplash.jpg');
const cleveland = require('@/../assets/the-cleveland-museum-of-art-ruUOEdmS1Mw-unsplash.jpg');

const stockImages = [
  {
    url: Image.resolveAssetSource(artChicago).uri,
    artist: 'Art Institute of Chicago',
  },
  {
    url: Image.resolveAssetSource(birmingham1).uri,
    artist: 'Birmingham Museums Trust',
  },
  {
    url: Image.resolveAssetSource(birmingham2).uri,
    artist: 'Birmingham Museums Trust',
  },
  {
    url: Image.resolveAssetSource(catherine).uri,
    artist: 'Catherine Kay Greenup',
  },
  {
    url: Image.resolveAssetSource(cleveland).uri,
    artist: 'The Cleveland Museum of Art',
  },
];

export const usePlayerBackgroundStore = create<PlayerBackgroundState>()(
  persist(
    (set, _get) => {
      const shuffledImages = [...stockImages].sort(() => Math.random() - 0.5);
      const initialBackgrounds: Record<number, PlayerBackground> = {};
      for (let i = 0; i < 6; i++) {
        initialBackgrounds[i] = shuffledImages[i % shuffledImages.length];
      }

      return {
        backgrounds: initialBackgrounds,
        setBackground: (playerId, background) => {
          set((state) => ({
            backgrounds: {
              ...state.backgrounds,
              [playerId]: background,
            },
          }));
        },
        removeBackground: (playerId) => {
          set((state) => ({
            backgrounds: {
              ...state.backgrounds,
              [playerId]: null,
            },
          }));
        },
      };
    },
    {
      name: 'rb_player_backgrounds',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return persistedState;
        if (version < 2) {
          const shuffledImages = [...stockImages].sort(() => Math.random() - 0.5);
          let imageIndex = 0;
          const newBackgrounds: Record<number, PlayerBackground | null> = {};

          Object.keys(persistedState.backgrounds).forEach((key) => {
            const index = Number(key);
            const bg = persistedState.backgrounds[index];
            if (bg && typeof bg.url === 'number') {
              // Replace unstable numeric asset id with a deterministic stock image
              newBackgrounds[index] = shuffledImages[imageIndex % shuffledImages.length];
              imageIndex += 1;
            } else {
              newBackgrounds[index] = bg;
            }
          });

          return {
            ...persistedState,
            backgrounds: newBackgrounds,
          } as typeof persistedState;
        }
        return persistedState;
      },
    },
  ),
);
