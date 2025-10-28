/**
 * Color Palette
 * Defines all colors used throughout the application
 */

export const colors = {
  // Primary Brand Colors
  primary: '#FF4655', // Valorant Red
  primaryDark: '#DC2F40',
  primaryLight: '#FF6B77',
  
  // Secondary Colors
  secondary: '#0F1923', // Valorant Dark Blue
  secondaryDark: '#000000',
  secondaryLight: '#1A2733',
  
  // Valorant Accent Colors
  accent: '#FD4556',
  accentGold: '#ECE8E1',
  accentBlue: '#00C7FF',
  
  // Semantic Colors
  success: '#00FF88',
  error: '#FF4655',
  warning: '#FFB800',
  info: '#00C7FF',
  
  // Match Result Colors
  win: '#00FF88',
  loss: '#FF4655',
  draw: '#FFB800',
  
  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Text Colors
  textPrimary: '#0F1923',
  textSecondary: '#616161',
  textTertiary: '#9E9E9E',
  textLight: '#FFFFFF',
  textDark: '#000000',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundDark: '#0F1923',
  backgroundLight: '#F5F5F5',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Surface Colors
  surface: '#FFFFFF',
  surfaceDark: '#1A2733',
  surfaceLight: '#F5F5F5',
  
  // Border Colors
  border: '#E0E0E0',
  borderDark: '#424242',
  borderLight: '#F5F5F5',
  
  // Premium Colors
  premium: '#FFB800',
  premiumGradientStart: '#FFD700',
  premiumGradientEnd: '#FFA500',
  
  // Agent Role Colors
  duelist: '#FF4655',
  controller: '#7B68EE',
  initiator: '#00C7FF',
  sentinel: '#00FF88',
  
  // Transparent Colors
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = typeof colors[ColorKey];
