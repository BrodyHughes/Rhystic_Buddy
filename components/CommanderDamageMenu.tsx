import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useLifeStore} from '../store/useLifeStore';
import CommanderDamageButtons from './CommanderDamageButtons';

interface Props {
  defenderId: number;
}

export default function CommanderDamageMenu({defenderId}: Props) {
  const totalPlayers = useLifeStore(s => s.totalPlayers);
  const sources = Array.from({length: totalPlayers}, (_, i) => i);

  const rows = totalPlayers <= 4 ? 2 : 3;
  const cols = Math.ceil(totalPlayers / rows);

  const cellW = 100 / cols;
  const cellH = 100 / rows;

  return (
    <View style={styles.overlay}>
      <View style={styles.grid}>
        {sources.map(src => (
          <CommanderDamageButtons
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    width: '100%',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    height: '70%',
    paddingHorizontal: 5,
  },
});
