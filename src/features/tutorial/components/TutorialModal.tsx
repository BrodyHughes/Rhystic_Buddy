import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  Linking,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

import {
  BACKGROUND_TRANSPARENT,
  LIGHT_GREY,
  MODAL_BACKGROUND,
  GITHUB_URL,
  PLAINS,
} from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import { useTutorialStore } from '../store/useTutorialStore';

const STORAGE_KEY = 'rb_seen_tutorial';

interface Slide {
  title: string;
  description: string;
  images?: number[]; // require() returns a number for RN static assets
  linkUrl?: string;
  linkLabel?: string;
}

// Static image requires (React-Native packager demands literal strings)
const IMG_TOP = require('../../../../assets/TOP.png');
const IMG_BOTTOM = require('../../../../assets/BOTTOM.png');
const IMG_SWIPE_H = require('../../../../assets/SWIPE_H.png');
const IMG_SWIPE_V = require('../../../../assets/SWIPE_V.png');
const IMG_MENU = require('../../../../assets/MENU.png');
const IMG_WELCOME = require('../../../../assets/ICON_NO_BCKGRND.png');

const slides: Slide[] = [
  {
    title: 'Welcome!',
    description:
      'This quick tutorial will walk you through the main features of Rhystic Buddy and how to access them.',
    images: [IMG_WELCOME],
  },
  {
    title: 'Life View',
    description:
      "Tap the upper or lower half of a player panel or counter to increment or decrement them. Long-press to increment by 5's.",
    images: [IMG_TOP, IMG_BOTTOM],
  },
  {
    title: 'Commander Damage',
    description:
      'Swipe horizontally on a player panel to enter commander damage mode. Track damage from each commander separately.',
    images: [IMG_SWIPE_H],
  },
  {
    title: 'Counters & Backgrounds',
    description:
      'Swipe vertically on a player panel to open the Counters & Background menu where you can add poison, mana & more.',
    images: [IMG_SWIPE_V],
  },
  {
    title: 'Central Menu',
    description:
      'Press the pentagon button in the centre to reset, set player count, open the More menu and other quick actions.',
    images: [IMG_MENU],
  },
  {
    title: 'Any Issues?',
    description:
      'If you run into any issues or have feature requests, please let me know on GitHub. \n\nThis is a solo-dev project and feedback is appreciated!',
    linkUrl: GITHUB_URL,
    linkLabel: 'GitHub',
  },
];

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TutorialModal() {
  const { isTutorialVisible, setIsTutorialVisible } = useTutorialStore();
  const [initialised, setInitialised] = useState(false);
  const { width: W } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // One-time launch check
  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(STORAGE_KEY);
        if (!seen) {
          setIsTutorialVisible(true);
          await AsyncStorage.setItem(STORAGE_KEY, '1');
        }
      } finally {
        setInitialised(true);
      }
    })();
  }, [setIsTutorialVisible]);

  // Reset slide index whenever modal becomes visible
  useEffect(() => {
    if (isTutorialVisible) {
      setCurrentIndex(0);
      // Ensure scroll position resets without animation
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }, 0);
    }
  }, [isTutorialVisible]);

  // Guard: wait until we have read AsyncStorage
  if (!initialised) return null;
  if (!isTutorialVisible) return null;

  const handleClose = () => {
    setIsTutorialVisible(false);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < slides.length) {
      setIsTransitioning(true);
      scrollRef.current?.scrollTo({ x: nextIndex * W, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setIsTransitioning(true);
      scrollRef.current?.scrollTo({ x: prevIndex * W, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    if (index !== currentIndex) setCurrentIndex(index);
    setIsTransitioning(false);
  };

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut} testID="tutorial">
      {/* Backdrop press */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      <SafeAreaView style={styles.flex} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleClose} style={styles.headerBtn} testID="tutorial-close">
            <X color={LIGHT_GREY} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tutorial</Text>
        </View>

        {/* Slides */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {slides.map((s) => (
            <View key={s.title} style={[styles.slide, { width: W - 40 }] /* account for padding */}>
              <Text style={styles.slideTitle}>{s.title}</Text>
              {s.images && (
                <View style={styles.imagesRow}>
                  {s.images.map((src, idx) => (
                    <Image
                      key={idx.toString()}
                      source={src}
                      style={styles.slideImage}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              )}
              <Text style={styles.slideDesc}>{s.description}</Text>
              {s.linkUrl && (
                <Text style={styles.link} onPress={() => Linking.openURL(s.linkUrl!)}>
                  {s.linkLabel ?? s.linkUrl}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Pagination */}
        <View style={styles.paginationRow}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={handlePrev}
            style={styles.navBtn}
          >
            <ChevronLeft
              color={currentIndex === 0 ? 'transparent' : BACKGROUND_TRANSPARENT}
              size={24}
            />
          </TouchableOpacity>
          <View style={styles.dotsRow}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentIndex ? styles.dotActive : null]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleNext} style={styles.navBtn} testID="tutorial-next">
            <ChevronRight color={BACKGROUND_TRANSPARENT} size={24} />
          </TouchableOpacity>
        </View>

        {/* Skip / Done button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>
            {currentIndex === slides.length - 1 ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, width: '100%' },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: BACKGROUND_TRANSPARENT,
    zIndex: 60,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerBtn: {
    padding: 10,
    marginRight: 10,
  },
  headerTitle: {
    ...typography.heading2,
  },
  slide: {
    backgroundColor: MODAL_BACKGROUND,
    borderRadius: radius.md,
    padding: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  slideTitle: {
    ...typography.heading2,
    color: LIGHT_GREY,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 24,
  },
  slideDesc: {
    ...typography.body,
    textAlign: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 20,
    gap: 12,
  },
  slideImage: {
    height: 80,
    width: 120,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
  },
  navBtn: {
    padding: 10,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: LIGHT_GREY,
  },
  primaryBtn: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: radius.md,
    alignSelf: 'center',
    marginTop: 25,
  },
  primaryBtnText: {
    ...typography.button,
    color: BACKGROUND_TRANSPARENT,
  },
  link: {
    ...typography.body,
    color: PLAINS,
    textDecorationLine: 'underline',
    marginTop: 8,
    textAlign: 'center',
  },
});
