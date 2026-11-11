// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { radius, spacing, typography } from '@/styles/global';
import { BACKGROUND, MUTED_TEXT } from '@/consts/consts';
import { licenses } from '@/consts/licenses';
import CloseButton from '@/components/CloseButton';

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
            <Text style={styles.title}>Open Source Licenses</Text>
            <CloseButton onPress={onClose} />
          </View>
          <ScrollView style={styles.content} nestedScrollEnabled={true}>
            {licenses.map((lib) => (
              <View key={lib.name} style={styles.licenseItem}>
                <Text style={styles.libName}>{lib.name}</Text>
                <Text style={styles.libLicense}>{lib.version}</Text>
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
    ...StyleSheet.absoluteFill,
    zIndex: 50,
  },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  panel: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: BACKGROUND,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    ...typography.heading2,
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  licenseItem: {
    paddingVertical: 0,
  },
  libName: {
    ...typography.body,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  libLicense: {
    ...typography.body,
    marginTop: 0,
    marginBottom: spacing.xs,
    fontSize: 14,
    color: MUTED_TEXT,
  },
});

export default LicensesModal;
