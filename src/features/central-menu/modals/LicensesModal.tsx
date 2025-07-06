// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { X } from 'lucide-react-native';

import { radius, spacing, typography } from '@/styles/global';
import { BACKGROUND, OFF_WHITE } from '@/consts/consts';
import { licenses } from '@/consts/licenses';

interface LicensesModalProps {
  onClose: () => void;
}

const LicensesModal: React.FC<LicensesModalProps> = ({ onClose }) => {
  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Open Source Licenses</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={OFF_WHITE} size={32} />
          </TouchableOpacity>
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
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  safeArea: {
    width: '90%',
    height: '80%',
    backgroundColor: BACKGROUND,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: OFF_WHITE,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    padding: 20,
  },
  title: {
    ...typography.heading2,
    color: OFF_WHITE,
    fontSize: 22,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  licenseItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  libName: {
    ...typography.button,
    color: OFF_WHITE,
  },
  libLicense: {
    ...typography.body,
    color: OFF_WHITE,
    opacity: 0.7,
    marginTop: spacing.xs,
  },
});

export default LicensesModal;
