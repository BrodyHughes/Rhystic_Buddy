// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronRight, BookOpen, Info, GraduationCap } from 'lucide-react-native';
import {
  BORDER_COLOR,
  PLAINS,
  ISLAND,
  FOREST,
  OFF_WHITE,
  BACKGROUND_TRANSPARENT,
  MODAL_BACKGROUND,
} from '@/consts/consts';
import { typography } from '@/styles/global';

interface MoreMenuProps {
  onClose: () => void;
  onRulingsPress: () => void;
  onAboutPress: () => void;
  onTutorialPress: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const MoreMenu: React.FC<MoreMenuProps> = ({
  onClose,
  onRulingsPress,
  onAboutPress,
  onTutorialPress,
}) => {
  const menuItems = [
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
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.flex} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>More</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="more-close-btn">
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.itemRow} onPress={item.action}>
                <View style={[styles.itemIconRounded, { backgroundColor: item.color }]}>
                  <item.Icon color={OFF_WHITE} size={22} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <ChevronRight color={OFF_WHITE} size={18} style={styles.chevron} />
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: BACKGROUND_TRANSPARENT,
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
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    ...typography.heading2,
    fontSize: 45, // okay to use here bc its a different sized 'x' for close
  },
  card: {
    backgroundColor: MODAL_BACKGROUND,
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemLabel: {
    flex: 1,
    ...typography.body,
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
