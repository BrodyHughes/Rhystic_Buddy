import { BACKGROUND, OFF_WHITE } from '@/consts/consts';
import { StyleSheet, Platform, TextStyle } from 'react-native';

/**
 * Design tokens
 * ------------------------------------------------------------------
 */
export const palette = {
  primary: '#5E60CE',
  primaryDark: OFF_WHITE,
  secondary: OFF_WHITE,
  accent: OFF_WHITE,
  background: BACKGROUND,
  surface: OFF_WHITE,
  textPrimary: OFF_WHITE,
  textSecondary: OFF_WHITE,
  border: '#E0E6ED',
  danger: '#EF476F',
  success: '#06D6A0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
  full: '100%',
};

export type TypographyVariant =
  | 'heading1'
  | 'heading2'
  | 'body'
  | 'caption'
  | 'button'
  | 'miniCaption';

export const typography: Record<TypographyVariant, TextStyle> = {
  heading1: {
    fontFamily: 'Dosis',
    fontWeight: 600,
    fontSize: 110,
    color: palette.textPrimary,
  },
  heading2: {
    fontFamily: 'Dosis',
    fontWeight: 900,
    fontSize: 30,
    color: palette.textPrimary,
  },
  body: {
    fontFamily: 'Dosis',
    fontWeight: 600,
    fontSize: 22,
    color: palette.textSecondary,
  },
  caption: {
    fontFamily: 'Dosis',
    fontWeight: 600,
    fontSize: 30,
    color: palette.textSecondary,
  },
  miniCaption: {
    fontFamily: 'Dosis',
    fontWeight: 500,
    fontSize: 16,
    color: palette.textSecondary,
  },
  button: {
    fontFamily: 'Dosis',
    fontWeight: 600,
    fontSize: 16,
  },
};

export const shadows = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  android: {
    elevation: 3,
  },
  default: {},
});

/**
 * Global styles
 * ------------------------------------------------------------------
 */
export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: palette.background,
  },

  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows,
  },

  title: {
    ...typography.heading2,
    marginBottom: spacing.sm,
  },

  text: {
    ...typography.body,
  },

  button: {
    backgroundColor: OFF_WHITE,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows,
  },

  buttonText: {
    ...typography.button,
    color: palette.surface,
  },

  input: {
    backgroundColor: palette.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.sm,
    fontSize: typography.body.fontSize,
    color: palette.textPrimary,
    ...shadows,
  },
});

export type GlobalStyles = typeof globalStyles;
