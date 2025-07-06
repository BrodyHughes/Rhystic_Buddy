import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import PlayerPanel from '@/features/player-panel/components/PlayerPanel';
import CentralMenuButton from '@/features/central-menu/components/CentralMenuButton';
import { useLifeStore } from '@/store/useLifeStore';
import { useCommanderDamageModeStore } from '@/store/useCommanderDamageModeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BACKGROUND, GAP } from '@/consts/consts';
import RulingsSearch from '@/features/central-menu/modals/RulingsSearch';
import GlobalDamageOverlays from '@/features/commander-damage/components/GlobalDamageOverlays';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTurnStore } from '@/store/useTurnStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function App() {
  const totalPlayersCount = useLifeStore((s) => s.players.length);
  const { isReceiving, defenderId } = useCommanderDamageModeStore();
  const { isFinished, reset } = useTurnStore();
  const currentGap = totalPlayersCount === 2 ? GAP * 1.5 : GAP;

  const layoutConfigurations: { [count: number]: { columns: number; rows: number } } = {
    2: { columns: 1, rows: 2 },
    3: { columns: 2, rows: 2 },
    4: { columns: 2, rows: 2 },
    5: { columns: 2, rows: 3 },
    6: { columns: 2, rows: 3 },
  };

  const currentLayout = layoutConfigurations[totalPlayersCount] || layoutConfigurations[4];
  const { columns, rows } = currentLayout;

  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const usableW = W - (columns + 1) * currentGap;
  const usableH = H - top - bottom - (rows + 1) * currentGap;
  const panelW = usableW / columns;
  const panelH = usableH / rows;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.screen}>
          <StatusBar barStyle="light-content" />
          <View style={[styles.grid, { gap: currentGap, padding: currentGap }]}>
            {[...Array(totalPlayersCount).keys()].map((index) => {
              return (
                <PlayerPanel
                  key={index}
                  index={index}
                  cols={columns}
                  rows={rows}
                  isEvenPlayerIndexNumber={index % 2 === 0}
                />
              );
            })}
            {/* a blank panel for odd number of players to fill the last row lol this is kinda dumb and hacky */}
            {totalPlayersCount % 2 === 1 && (
              <View
                style={{
                  height: panelH,
                  width: panelW,
                  backgroundColor: 'transparent',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
            )}
          </View>
          <CentralMenuButton />
          {isReceiving && defenderId !== null && (
            <GlobalDamageOverlays
              defenderId={defenderId}
              layoutConfigurations={layoutConfigurations}
              gap={currentGap}
            />
          )}
          {isFinished && (
            <Pressable onPress={reset} style={styles.fullscreenPressable} testID="winner-dismiss" />
          )}
        </SafeAreaView>
        <RulingsSearch />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fullscreenPressable: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});
