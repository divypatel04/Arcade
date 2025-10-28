import { Platform } from 'react-native';

/**
 * Typography System
 * Defines font families, sizes, weights, and text styles
 */

// Font Families
export const fontFamilies = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  black: Platform.select({
    ios: 'System',
    android: 'Roboto-Black',
    default: 'System',
  }),
} as const;

// Font Sizes
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
} as const;

// Font Weights
export const fontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

// Line Heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

// Letter Spacing
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Text Styles (Reusable combinations)
export const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
  },
  h5: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xl * lineHeights.normal,
  },
  h6: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  
  // Body Text
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  
  // Special Text
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  overline: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  
  // Stats Text
  statValue: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  statLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: letterSpacing.wide,
  },
} as const;

// Export individual values
export const fonts = {
  families: fontFamilies,
  sizes: fontSizes,
  weights: fontWeights,
  lineHeights,
  letterSpacing,
  styles: textStyles,
} as const;

export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
