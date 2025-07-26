// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

import { radius, spacing, typography } from '@/styles/global';
import {
  BACKGROUND_TRANSPARENT,
  MODAL_BACKGROUND,
  OFF_WHITE,
  TRANSPARENT_OFF_WHITE,
} from '@/consts/consts';
import { licenses } from '@/consts/licenses';

interface LicensesModalProps {
  onClose: () => void;
}

const LicensesModal: React.FC<LicensesModalProps> = ({ onClose }) => {
  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.panel}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ChevronLeft color={OFF_WHITE} size={28} />
            </TouchableOpacity>
            <Text style={styles.title}>Open Source Licenses</Text>
          </View>
          <ScrollView style={styles.content}>
            {licenses.map((lib) => (
              <View key={lib.name} style={styles.licenseItem}>
                <Text style={styles.libName}>
                  {lib.name} ({lib.version})
                </Text>
                <Text style={styles.libLicense}>{lib.license}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_TRANSPARENT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60, // Higher zIndex to ensure it's on top
  },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  panel: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: MODAL_BACKGROUND,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    ...typography.heading2,
    marginLeft: 10,
  },
  backButton: {
    padding: spacing.xs,
  },
  content: {
    paddingHorizontal: 20,
  },
  licenseItem: {
    paddingVertical: spacing.sm,
  },
  libName: {
    ...typography.body,
    color: OFF_WHITE,
  },
  libLicense: {
    ...typography.body,
    marginTop: spacing.xs,
    fontSize: 14,
    color: TRANSPARENT_OFF_WHITE,
  },
});

export default LicensesModal;
