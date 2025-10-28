/**
 * Spacing and Sizing System
 * Based on 4px base unit for consistent spacing throughout the app
 */

const BASE_UNIT = 4;

// Spacing Scale (4px base)
export const spacing = {
  xs: BASE_UNIT, // 4px
  sm: BASE_UNIT * 2, // 8px
  md: BASE_UNIT * 3, // 12px
  lg: BASE_UNIT * 4, // 16px
  xl: BASE_UNIT * 5, // 20px
  '2xl': BASE_UNIT * 6, // 24px
  '3xl': BASE_UNIT * 8, // 32px
  '4xl': BASE_UNIT * 10, // 40px
  '5xl': BASE_UNIT * 12, // 48px
  '6xl': BASE_UNIT * 16, // 64px
} as const;

// Component Sizes
export const componentSizes = {
  // Button Heights
  button: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },
  
  // Input Heights
  input: {
    sm: 32,
    md: 40,
    lg: 48,
  },
  
  // Icon Sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  
  // Avatar Sizes
  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80,
  },
  
  // Card Sizes
  card: {
    sm: 120,
    md: 160,
    lg: 200,
    xl: 240,
  },
} as const;

// Border Radius
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Border Width
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

// Shadow/Elevation Presets
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
} as const;

// Layout Sizes
export const layout = {
  // Screen Padding
  screenPadding: spacing.xl, // 20px
  screenPaddingHorizontal: spacing.xl, // 20px
  screenPaddingVertical: spacing.lg, // 16px
  
  // Container Max Width
  containerMaxWidth: 1200,
  
  // Tab Bar
  tabBarHeight: 65,
  
  // Header
  headerHeight: 56,
  
  // Bottom Sheet
  bottomSheetHandleHeight: 4,
  bottomSheetHandleWidth: 40,
} as const;

// Export all sizes
export const sizes = {
  spacing,
  components: componentSizes,
  borderRadius,
  borderWidth,
  shadows,
  layout,
  
  // Alias for backward compatibility
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
