import { create } from 'zustand';

export interface PlayerBackground {
  url: string | number;
  artist: string;
}

export interface PlayerBackgroundState {
  backgrounds: Record<number, PlayerBackground | null>;
  setBackground: (playerId: number, background: PlayerBackground | null) => void;
  removeBackground: (playerId: number) => void;
}

const stockImages = [
  {
    url: require('../../assets/art-institute-of-chicago-wPoRl5TbjZ4-unsplash.jpg'),
    artist: 'Art Institute of Chicago',
  },
  {
    url: require('../../assets/birmingham-museums-trust-0xa0OVutd_A-unsplash.jpg'),
    artist: 'Birmingham Museums Trust',
  },
  {
    url: require('../../assets/birmingham-museums-trust-m8hTQlLH2Lg-unsplash.jpg'),
    artist: 'Birmingham Museums Trust',
  },
  {
    url: require('../../assets/catherine-kay-greenup-l5EaYAbV1X4-unsplash.jpg'),
    artist: 'Catherine Kay Greenup',
  },
  {
    url: require('../../assets/the-cleveland-museum-of-art-ruUOEdmS1Mw-unsplash.jpg'),
    artist: 'The Cleveland Museum of Art',
  },
];

export const usePlayerBackgroundStore = create<PlayerBackgroundState>((set) => {
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
});
