/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLifeStore } from '@/store/useLifeStore';
import CommanderDamageButtons from './CommanderDamageButtons';
import CommanderDamageEditor from './CommanderDamageEditor';
import { OFF_WHITE } from '@/consts/consts';

interface Props {
  defenderId: number;
  isEvenPlayerIndexNumber: boolean;
  appliedRot: string;
}

export default function CommanderDamageMenu({ defenderId, isEvenPlayerIndexNumber }: Props) {
  const [hasMounted, setHasMounted] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const totalPlayers = useLifeStore((s) => s.players.length);
  const sources = Array.from({ length: totalPlayers }, (_, i) => i);

  const rows = totalPlayers <= 4 ? 2 : 3;
  const cols = Math.ceil(sources.length / rows);

  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const handleOpenEditor = (sourceId: number) => {
    setEditingSourceId(sourceId);
  };

  const handleCloseEditor = () => {
    setEditingSourceId(null);
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.grid,
          {
            transform: [{ rotate: hasMounted && !isEvenPlayerIndexNumber ? '180deg' : '0deg' }],
            paddingTop: isEvenPlayerIndexNumber ? 0 : 30,
            paddingBottom: isEvenPlayerIndexNumber ? 30 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              transform: [{ rotate: hasMounted && !isEvenPlayerIndexNumber ? '180deg' : '0deg' }],
              top: isEvenPlayerIndexNumber ? null : 0,
              bottom: isEvenPlayerIndexNumber ? 5 : 0,
              marginBottom: isEvenPlayerIndexNumber ? 0 : 10,
            },
          ]}
        >
          Damage received from:
        </Text>
        {sources.map((src) => (
          <CommanderDamageButtons
            isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            key={src}
            defenderId={defenderId}
            sourceId={src}
            cellW={cellW}
            cellH={cellH}
            onPress={() => handleOpenEditor(src)}
          />
        ))}
      </View>
      {editingSourceId !== null && (
        <CommanderDamageEditor
          defenderId={defenderId}
          sourceId={editingSourceId}
          onClose={handleCloseEditor}
        />
      )}
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
    fontFamily: 'Comfortaa-SemiBold',
    width: '100%',
    fontWeight: '700',
    textAlign: 'center',
    position: 'absolute',
    height: 30,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
  },
});
