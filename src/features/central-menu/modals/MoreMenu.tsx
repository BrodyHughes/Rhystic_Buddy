// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronRight, BookOpen, Info, GraduationCap, Settings } from 'lucide-react-native';
import {
  BORDER_COLOR,
  SWAMP,
  PLAINS,
  ISLAND,
  FOREST,
  LIGHT_GREY,
  BACKGROUND,
} from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

interface MoreMenuProps {
  onClose: () => void;
  onRulingsPress: () => void;
  onAboutPress: () => void;
  onTutorialPress: () => void;
  onSettingsPress: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const MoreMenu: React.FC<MoreMenuProps> = ({
  onClose,
  onRulingsPress,
  onAboutPress,
  onTutorialPress,
  onSettingsPress,
}) => {
  const menuItems = [
    {
      id: 'settings',
      label: 'Settings',
      Icon: Settings,
      color: SWAMP,
      action: onSettingsPress,
    },
    {
      id: 'rulings',
      label: 'Rulings Search',
      Icon: BookOpen,
      color: PLAINS,
      action: onRulingsPress,
    },
    {
      id: 'about',
      label: 'About',
      Icon: Info,
      color: ISLAND,
      action: onAboutPress,
    },
    {
      id: 'tutorial',
      label: 'Tutorial',
      Icon: GraduationCap,
      color: FOREST,
      action: onTutorialPress,
    },
    // Future items can be pushed here
  ];

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <BlurBackdrop />
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.flex} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>More</Text>
          <CloseButton onPress={onClose} testID="more-close-btn" />
        </View>

        {/* Card */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.itemRow} onPress={item.action}>
                <View style={[styles.itemIconRounded, { backgroundColor: item.color }]}>
                  <item.Icon color={LIGHT_GREY} size={22} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <ChevronRight color={LIGHT_GREY} size={18} style={styles.chevron} />
              </TouchableOpacity>
              {index !== menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>
    </AnimatedView>
  );
};

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
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  itemIconRounded: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemLabel: {
    flex: 1,
    ...typography.body,
    marginBottom: 0,
  },
  chevron: {
    marginLeft: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_COLOR,
  },
});

export default MoreMenu;
