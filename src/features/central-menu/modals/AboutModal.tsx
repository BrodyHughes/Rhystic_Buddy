// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { radius, spacing, typography, buttonColors } from '@/styles/global';
import { BACKGROUND, GITHUB_URL, PLAINS } from '@/consts/consts';
import LicensesModal from './LicensesModal';
import CloseButton from '@/components/CloseButton';
import BlurBackdrop from '@/components/BlurBackdrop';

const APP_DESCRIPTION =
  'Rhystic Buddy is a simple yet feature-rich companion for MTG games.\n\nKey highlights:\n\n\u2022   Multi-player life & commander-damage tracking\n\u2022   Board-state utilities (counters, turn order, backgrounds)\n\u2022   Smooth, gesture-driven interface designed for the tabletop.';

interface AboutProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutProps> = ({ onClose }) => {
  const [licensesVisible, setLicensesVisible] = useState(false);

  const handleOpenGithub = () => {
    Linking.openURL(GITHUB_URL);
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <BlurBackdrop />
      {/* backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>About</Text>
            <CloseButton onPress={onClose} />
          </View>
          <ScrollView style={styles.content} nestedScrollEnabled={true}>
            <Text style={styles.sectionText}>{APP_DESCRIPTION}</Text>
            <Text style={styles.sectionTitle}>GitHub</Text>
            <TouchableOpacity onPress={handleOpenGithub}>
              <Text style={styles.linkText}>View on GitHub</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Contributing</Text>
            <Text style={styles.sectionText}>
              This project is open source and developed by a single developer. Contributions are
              very welcome! Feel free to open issues or submit pull requests on GitHub.
            </Text>
            <Text style={styles.sectionTitle}>App Version</Text>
            <Text style={styles.sectionText}>0.0.1</Text>

            <Text style={styles.sectionTitle}>Copyright</Text>
            <Text style={styles.sectionText}>Copyright 2025 Brody Hughes</Text>

            <TouchableOpacity
              style={styles.licensesButton}
              onPress={() => setLicensesVisible(true)}
            >
              <Text style={styles.licensesButtonText}>View Open Source Licenses</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
      {licensesVisible && <LicensesModal onClose={() => setLicensesVisible(false)} />}
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
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...typography.heading2,
    marginTop: spacing.md,
  },
  sectionText: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: 'left',
    lineHeight: 24,
  },
  licensesButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    ...buttonColors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 20,
  },
  licensesButtonText: {
    ...typography.button,
    ...buttonColors.onPrimary,
  },
  linkText: {
    ...typography.body,
    textDecorationLine: 'underline',
    marginTop: spacing.xs,
    color: PLAINS,
    textAlign: 'left',
  },
});

export default AboutModal;
