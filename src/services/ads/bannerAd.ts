/**
 * Banner Ad Service
 * 
 * Provides utilities for managing banner advertisements.
 * This module handles banner ad configuration and unit ID retrieval
 * for different screen sizes.
 */

import { Platform } from 'react-native';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, ADS_ENABLED } from './adConfig';

export { ADS_ENABLED };

/**
 * Banner ad size configurations
 * Maps descriptive names to Google Mobile Ads banner sizes
 */
export const BANNER_SIZES = {
  /**
   * Standard banner - 320x50 on phones, 468x60 on tablets
   */
  STANDARD: BannerAdSize.BANNER,
  
  /**
   * Large banner - 320x100
   */
  LARGE: BannerAdSize.LARGE_BANNER,
  
  /**
   * Medium rectangle - 300x250
   */
  MEDIUM_RECTANGLE: BannerAdSize.MEDIUM_RECTANGLE,
  
  /**
   * Full banner - 468x60
   */
  FULL: BannerAdSize.FULL_BANNER,
  
  /**
   * Leaderboard - 728x90 (tablets)
   */
  LEADERBOARD: BannerAdSize.LEADERBOARD,
  
  /**
   * Adaptive banner - adjusts to screen width
   */
  ADAPTIVE: BannerAdSize.ANCHORED_ADAPTIVE_BANNER
} as const;

/**
 * Get the appropriate banner ad unit ID for the current platform
 * 
 * @returns The banner ad unit ID (test ID in dev, production ID in release)
 * 
 * @example
 * ```tsx
 * import { getBannerAdUnitId } from '@/services/ads/bannerAd';
 * 
 * <BannerAd unitId={getBannerAdUnitId()} />
 * ```
 */
export function getBannerAdUnitId(): string {
  return Platform.select({
    ios: AD_UNIT_IDS.banner.ios,
    android: AD_UNIT_IDS.banner.android,
    default: AD_UNIT_IDS.banner.android
  }) || AD_UNIT_IDS.banner.android;
}

/**
 * Get recommended banner size based on screen width
 * 
 * @param screenWidth - The width of the screen in pixels
 * @returns Recommended banner size
 * 
 * @example
 * ```tsx
 * import { Dimensions } from 'react-native';
 * import { getRecommendedBannerSize } from '@/services/ads/bannerAd';
 * 
 * const { width } = Dimensions.get('window');
 * const bannerSize = getRecommendedBannerSize(width);
 * ```
 */
export function getRecommendedBannerSize(screenWidth: number) {
  // Tablets and large screens (>= 728px) - use leaderboard
  if (screenWidth >= 728) {
    return BANNER_SIZES.LEADERBOARD;
  }
  
  // Medium screens (>= 468px) - use full banner
  if (screenWidth >= 468) {
    return BANNER_SIZES.FULL;
  }
  
  // Small screens - use standard banner
  return BANNER_SIZES.STANDARD;
}

/**
 * Configuration for banner ad display
 */
export const BANNER_CONFIG = {
  /**
   * Auto-refresh interval in seconds
   * Set to 0 to disable auto-refresh
   */
  AUTO_REFRESH_INTERVAL: 60,
  
  /**
   * Whether to show banner at the top or bottom of screen
   */
  DEFAULT_POSITION: 'bottom' as 'top' | 'bottom',
  
  /**
   * Default banner size
   */
  DEFAULT_SIZE: BANNER_SIZES.ADAPTIVE
} as const;
