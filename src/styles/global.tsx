import { StyleSheet, Platform } from 'react-native';

/**
 * Design tokens
 * ------------------------------------------------------------------
 */
export const palette = {
  primary: '#5E60CE',
  primaryDark: '#4E52B6',
  secondary: '#48BFE3',
  accent: '#FFC300',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#5A5A5A',
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
};

export const typography = {
  heading1: {
    fontFamily: Platform.select({
      ios: 'Comfortaa-Bold',
      android: 'Comfortaa-Bold',
    }),
    fontSize: 76,
    color: palette.textPrimary,
  },
  heading2: {
    fontFamily: Platform.select({
      ios: 'Comfortaa-SemiBold',
      android: 'Comfortaa-SemiBold',
    }),
    fontSize: 24,
    color: palette.textPrimary,
  },
  body: {
    fontFamily: Platform.select({
      ios: 'Comfortaa-Regular',
      android: 'Comfortaa-Regular',
    }),
    fontSize: 16,
    color: palette.textSecondary,
  },
  caption: {
    fontFamily: Platform.select({
      ios: 'Comfortaa-Regular',
      android: 'Comfortaa-Regular',
    }),
    fontSize: 24,
    color: palette.textSecondary,
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
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows,
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Comfortaa-SemiBold',
      android: 'Comfortaa-SemiBold',
    }),
    fontSize: 16,
  },

  input: {
    backgroundColor: palette.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.sm,
    fontSize: 16,
    color: palette.textPrimary,
    ...shadows,
  },
});

export type GlobalStyles = typeof globalStyles;
