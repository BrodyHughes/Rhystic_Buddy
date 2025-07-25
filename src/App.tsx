// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import PlayerPanel from '@/features/player-panel/components/PlayerPanel';
import CentralMenuButton from '@/features/central-menu/components/CentralMenuButton';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageModeStore } from '@/features/commander-damage/store/useCommanderDamageModeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BACKGROUND, GAP } from '@/consts/consts';
import RulingsSearch from '@/features/central-menu/modals/RulingsSearch';
import GlobalDamageOverlays from '@/features/commander-damage/components/GlobalDamageOverlays';
import { useTurnStore } from '@/features/central-menu/store/useTurnStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStoresHydrated from '@/hooks/useStoresHydrated';

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

  const usableH = H - top - bottom - (rows + 1) * currentGap;
  const panelRowHeight = usableH / rows;

  const renderPlayerPanels = () => {
    switch (totalPlayersCount) {
      case 3:
        return (
          <View style={styles.flex}>
            <View style={styles.row}>
              <PlayerPanel
                index={0}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber
                W={W}
                currentGap={currentGap}
              />
              <PlayerPanel
                index={1}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber={false}
                W={W}
                currentGap={currentGap}
              />
            </View>
            <View style={[styles.centeredRow, { height: panelRowHeight, alignItems: 'center' }]}>
              <PlayerPanel
                index={2}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber={false}
                isLastPlayerOddLayout
                W={W}
                currentGap={currentGap}
              />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.flex}>
            <View style={styles.row}>
              <PlayerPanel
                index={0}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber
                W={W}
                currentGap={currentGap}
              />
              <PlayerPanel
                index={1}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber={false}
                W={W}
                currentGap={currentGap}
              />
            </View>
            <View style={styles.row}>
              <PlayerPanel
                index={2}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber
                W={W}
                currentGap={currentGap}
              />
              <PlayerPanel
                index={3}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber={false}
                W={W}
                currentGap={currentGap}
              />
            </View>
            <View style={[styles.centeredRow, { height: panelRowHeight, alignItems: 'center' }]}>
              <PlayerPanel
                index={4}
                cols={columns}
                rows={rows}
                isEvenPlayerIndexNumber={false}
                isLastPlayerOddLayout
                W={W}
                currentGap={currentGap}
              />
            </View>
          </View>
        );
      default:
        return [...Array(totalPlayersCount).keys()].map((index) => (
          <PlayerPanel
            key={index}
            index={index}
            cols={columns}
            rows={rows}
            isEvenPlayerIndexNumber={index % 2 === 0}
            W={W}
            currentGap={currentGap}
          />
        ));
    }
  };

  const storesHydrated = useStoresHydrated();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.screen}>
          <StatusBar barStyle="light-content" />
          {storesHydrated ? (
            <>
              <View style={[styles.grid, { gap: currentGap, padding: currentGap }]}>
                {renderPlayerPanels()}
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
                <Pressable
                  onPress={reset}
                  style={styles.fullscreenPressable}
                  testID="winner-dismiss"
                />
              )}
            </>
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
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
  flex: {
    flex: 1,
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  centeredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: GAP,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
