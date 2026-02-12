// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerPanel from '@/features/player-panel/components/PlayerPanel';
import CentralMenuButton from '@/features/central-menu/components/CentralMenuButton';
import { useLifeStore } from '@/features/player-panel/store/useLifeStore';
import { useCommanderDamageModeStore } from '@/features/commander-damage/store/useCommanderDamageModeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { APP_BACKGROUND, GAP } from '@/consts/consts';
import RulingsSearch from '@/features/central-menu/modals/RulingsSearch';
import TutorialModal from '@/features/tutorial/components/TutorialModal';
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
  const currentGap = totalPlayersCount === 2 ? (Platform.OS === 'android' ? GAP : GAP * 1.1) : GAP;

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

  // DEBUG: Calculate what the panel dimensions would be
  const debugPanelW = W - (columns + 1) * currentGap;
  const debugPanelH = usableH / rows;
  const debugTotalHeight = debugPanelH * rows + currentGap * (rows + 1); // panels + gaps + padding
  const debugExpectedHeight = H - top - bottom;

  const twoPlayerStyle = {
    flexDirection: 'column' as const,
    gap: currentGap,
  };

  const playerIndexes = useMemo(() => [...Array(totalPlayersCount).keys()], [totalPlayersCount]);

  const renderPlayerPanels = () => {
    switch (totalPlayersCount) {
      case 2:
        return (
          <View style={twoPlayerStyle}>
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
        );
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
        return playerIndexes.map((index) => (
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
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
              <TutorialModal />
              {/* DEBUG OVERLAY - REMOVE BEFORE RELEASE */}
              {__DEV__ && totalPlayersCount === 2 && (
                <View style={styles.debugOverlay}>
                  <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
                  <Text style={styles.debugText}>
                    Window: {W.toFixed(0)} x {H.toFixed(0)}
                  </Text>
                  <Text style={styles.debugText}>
                    Insets: top={top.toFixed(0)}, bottom={bottom.toFixed(0)}
                  </Text>
                  <Text style={styles.debugText}>Gap: {currentGap}</Text>
                  <Text style={styles.debugText}>UsableH: {usableH.toFixed(0)}</Text>
                  <Text style={styles.debugText}>PanelH: {debugPanelH.toFixed(0)}</Text>
                  <Text style={styles.debugText}>PanelW: {debugPanelW.toFixed(0)}</Text>
                  <Text style={styles.debugText}>Total calc: {debugTotalHeight.toFixed(0)}</Text>
                  <Text style={styles.debugText}>Expected: {debugExpectedHeight.toFixed(0)}</Text>
                  <Text style={styles.debugText}>
                    Diff: {(debugExpectedHeight - debugTotalHeight).toFixed(0)}
                  </Text>
                </View>
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
  screen: { flex: 1, backgroundColor: APP_BACKGROUND },
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
  debugOverlay: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  debugText: {
    color: '#0f0',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
