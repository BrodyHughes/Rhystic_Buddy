import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Zap, Droplet, Skull } from 'lucide-react-native';

import CountersMenuButtons from './CountersMenuButtons';
import { OFF_WHITE } from '@/consts/consts';

interface Props {
  defenderId: number;
}

const COUNTERS = [
  { key: 'storm', Icon: Zap },
  { key: 'poison', Icon: Skull },
  { key: 'mana', Icon: Droplet },
] as const;

export default function CountersMenu({ defenderId }: Props) {
  return (
    <View style={styles.container}>
      {COUNTERS.map(({ key, Icon }) => (
        <View key={key} style={styles.column}>
          <View style={styles.iconWrap}>
            <Icon color={OFF_WHITE} size={32} />
          </View>
          <CountersMenuButtons defenderId={defenderId} counter={key} cellW={100} cellH={100} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  column: {
    width: 140,
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  iconWrap: {
    marginBottom: 10,
  },
});
