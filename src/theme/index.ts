/**
 * Theme System
 * Central export for all theme constants
 */

export { colors } from './colors';
export { fonts, fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing, textStyles } from './fonts';
export { sizes, spacing, borderRadius, borderWidth, shadows } from './sizes';

export type { ColorKey, ColorValue } from './colors';
export type { FontFamily, FontSize, FontWeight } from './fonts';
export type { SpacingKey, BorderRadiusKey, ShadowKey } from './sizes';

// Theme object for easier imports
import { colors } from './colors';
import { fonts } from './fonts';
import { sizes } from './sizes';

export const theme = {
  colors,
  fonts,
  sizes,
} as const;

export default theme;
