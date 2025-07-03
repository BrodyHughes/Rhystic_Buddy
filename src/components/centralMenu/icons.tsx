import Svg, { Path, Rect, Circle } from 'react-native-svg';

import { SWAMP, PLAINS, ISLAND, MOUNTAIN, FOREST } from '@/consts/consts';
import React from 'react';

export const PlayersIcon = () => (
  <Svg height="60" width="60" viewBox="0 0 24 24">
    <Path
      fill={SWAMP}
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    />
  </Svg>
);

export const TurnOrderIcon = () => (
  <Svg height="60" width="60" viewBox="0 0 24 24">
    <Rect x="5" y="5" width="14" height="14" rx="2" fill={PLAINS} />
    <Circle cx="8.5" cy="8.5" r="1.5" fill="black" />
    <Circle cx="15.5" cy="8.5" r="1.5" fill="black" />
    <Circle cx="12" cy="12" r="1.5" fill="black" />
    <Circle cx="8.5" cy="15.5" r="1.5" fill="black" />
    <Circle cx="15.5" cy="15.5" r="1.5" fill="black" />
  </Svg>
);

export const ResetIcon = () => (
  <>
    <Svg height="60" width="60" viewBox="0 0 24 24">
      <Path
        fill={ISLAND}
        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
      />
    </Svg>
  </>
);

export const BackgroundIcon = () => (
  <Svg height="60" width="60" viewBox="0 0 24 24">
    <Path
      fill={MOUNTAIN}
      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
    />
  </Svg>
);

export const RulingsIcon = () => (
  <Svg height="60" width="60" viewBox="0 0 24 24">
    <Path
      fill={FOREST}
      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L21.5,20L20,21.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
    />
  </Svg>
);
