// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

import { radius, spacing, typography } from '@/styles/global';
import {
  BACKGROUND_TRANSPARENT,
  MODAL_BACKGROUND,
  OFF_WHITE,
  TRANSPARENT_OFF_WHITE,
  ISLAND,
  GITHUB_URL,
} from '@/consts/consts';
import LicensesModal from './LicensesModal';

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
      {/* backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.panel}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ChevronLeft color={OFF_WHITE} size={28} />
            </TouchableOpacity>
            <Text style={styles.title}>About</Text>
          </View>
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>About Rhystic Buddy</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_TRANSPARENT,
    zIndex: 50,
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
  sectionTitle: {
    ...typography.heading2,
    marginTop: spacing.md,
    color: OFF_WHITE,
  },
  sectionText: {
    ...typography.body,
    marginTop: spacing.xs,
    color: TRANSPARENT_OFF_WHITE,
  },
  licensesButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: OFF_WHITE,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 20,
  },
  licensesButtonText: {
    ...typography.button,
    color: MODAL_BACKGROUND,
  },
  linkText: {
    ...typography.body,
    textDecorationLine: 'underline',
    marginTop: spacing.xs,
    color: ISLAND,
  },
});

export default AboutModal;
