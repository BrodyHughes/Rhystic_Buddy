// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { X } from 'lucide-react-native';

import { radius, spacing, typography } from '@/styles/global';
import { BACKGROUND, OFF_WHITE } from '@/consts/consts';
import LicensesModal from './LicensesModal';

interface AboutProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutProps> = ({ onClose }) => {
  const [licensesVisible, setLicensesVisible] = useState(false);

  if (licensesVisible) {
    return <LicensesModal onClose={() => setLicensesVisible(false)} />;
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>About</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={OFF_WHITE} size={32} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>App Version</Text>
          <Text style={styles.sectionText}>0.0.1</Text>

          <Text style={styles.sectionTitle}>Copyright</Text>
          <Text style={styles.sectionText}>Copyright 2025 Brody Hughes</Text>

          <TouchableOpacity style={styles.licensesButton} onPress={() => setLicensesVisible(true)}>
            <Text style={styles.licensesButtonText}>View Open Source Licenses</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  safeArea: {
    width: '90%',
    maxHeight: '80%',
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
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    ...typography.heading2,
    fontSize: 24,
    color: OFF_WHITE,
    marginTop: spacing.md,
  },
  sectionText: {
    ...typography.body,
    color: OFF_WHITE,
    marginTop: spacing.xs,
  },
  licensesButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: OFF_WHITE,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  licensesButtonText: {
    ...typography.button,
    color: BACKGROUND,
  },
});

export default AboutModal;
