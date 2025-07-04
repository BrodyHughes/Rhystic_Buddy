/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLifeStore } from '@/store/useLifeStore';
import CommanderDamageButtons from './CommanderDamageButtons';
import { OFF_WHITE } from '@/consts/consts';

interface Props {
  defenderId: number;
  isEvenPlayerIndexNumber: boolean;
}

export default function CommanderDamageMenu({ defenderId, isEvenPlayerIndexNumber }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const totalPlayers = useLifeStore((s) => s.totalPlayers);
  const sources = Array.from({ length: totalPlayers }, (_, i) => i);

  const rows = totalPlayers <= 4 ? 2 : 3;
  const cols = Math.ceil(totalPlayers / rows);

  const cellW = 100 / cols;
  const cellH = 100 / rows;

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.grid,
          {
            transform: [{ rotate: hasMounted && !isEvenPlayerIndexNumber ? '180deg' : '0deg' }],
            paddingTop: isEvenPlayerIndexNumber ? 30 : 0,
            paddingBottom: isEvenPlayerIndexNumber ? 0 : 30,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              transform: [{ rotate: hasMounted && !isEvenPlayerIndexNumber ? '180deg' : '0deg' }],
              top: isEvenPlayerIndexNumber ? 5 : 0,
              bottom: isEvenPlayerIndexNumber ? 0 : 5,
              marginBottom: isEvenPlayerIndexNumber ? 10 : 0,
            },
          ]}
        >
          Damage Received
        </Text>
        {sources.map((src) => (
          <CommanderDamageButtons
            isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            key={src}
            defenderId={defenderId}
            sourceId={src}
            cellW={cellW}
            cellH={cellH}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    color: OFF_WHITE,
    fontSize: 18,
    fontFamily: 'Comfortaa-Bold',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    paddingHorizontal: 5,
  },
});
