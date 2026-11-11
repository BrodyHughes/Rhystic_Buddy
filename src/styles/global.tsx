import { BACKGROUND, LIGHT_GREY, OFF_WHITE } from '@/consts/consts';
import { StyleSheet, TextStyle } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 2,
  md: 8,
  lg: 16,
  pill: 999,
  full: '100%',
};

type TypographyVariant =
  'heading1' | 'heading2' | 'body' | 'caption' | 'button' | 'miniCaption' | 'label';

export const typography: Record<TypographyVariant, TextStyle> = {
  heading1: {
    marginTop: 10,
    // fontFamily: 'Asap',
    fontWeight: 900,
    fontSize: 95,
    color: LIGHT_GREY,
  },
  heading2: {
    // fontFamily: 'Asap',
    fontWeight: 900,
    fontSize: 28,
    color: LIGHT_GREY,
    letterSpacing: 1.5,
  },
  body: {
    // fontFamily: 'Asap',
    letterSpacing: 1,
    color: LIGHT_GREY,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 20,
  },
  caption: {
    // fontFamily: 'Asap',
    fontWeight: 600,
    fontSize: 30,
    color: LIGHT_GREY,
  },
  miniCaption: {
    // fontFamily: 'Asap',
    fontWeight: 500,
    fontSize: 16,
    color: LIGHT_GREY,
  },
  button: {
    // fontFamily: 'Asap',
    fontWeight: 600,
    fontSize: 16,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 0.5,
    color: LIGHT_GREY,
  },
};

export const icon = {
  size: 26,
  closeSize: 28,
  strokeWidth: 2.25,
};

// OFF_WHITE marks a selected or primary control; text on it uses BACKGROUND.
export const buttonColors = {
  primary: { backgroundColor: OFF_WHITE },
  onPrimary: { color: BACKGROUND },
};

export const pickerStyles = StyleSheet.create({
  selectItem: {
    backgroundColor: BACKGROUND,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedItem: buttonColors.primary,
  selectItemText: {
    ...typography.body,
    marginBottom: 0,
    fontWeight: 600,
    fontSize: 20,
  },
  selectedText: {
    ...buttonColors.onPrimary,
    fontWeight: 900,
  },
});
