// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BORDER_COLOR, FOREST, LIGHT_GREY, BACKGROUND } from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import { useSettingsStore } from '../store/useSettingsStore';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

interface Props {
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: BORDER_COLOR, true: FOREST }}
        thumbColor={LIGHT_GREY}
        ios_backgroundColor={BORDER_COLOR}
      />
    </View>
  );
}

export default function SettingsModal({ onClose }: Props) {
  const showCommanderDamageMap = useSettingsStore((s) => s.showCommanderDamageMap);
  const showCounterChips = useSettingsStore((s) => s.showCounterChips);
  const setShowCommanderDamageMap = useSettingsStore((s) => s.setShowCommanderDamageMap);
  const setShowCounterChips = useSettingsStore((s) => s.setShowCounterChips);

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <BlurBackdrop />
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.flex} pointerEvents="box-none">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Settings</Text>
          <CloseButton onPress={onClose} />
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Commander damage map"
            value={showCommanderDamageMap}
            onValueChange={setShowCommanderDamageMap}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Counters on life view"
            value={showCounterChips}
            onValueChange={setShowCounterChips}
          />
        </View>
      </SafeAreaView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, width: '100%' },
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 40,
    paddingTop: 20,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    ...typography.heading2,
  },
  card: {
    backgroundColor: BACKGROUND,
    width: '90%',
    borderRadius: radius.md,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemLabel: {
    flex: 1,
    ...typography.body,
    marginBottom: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_COLOR,
  },
});
