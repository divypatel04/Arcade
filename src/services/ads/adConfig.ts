/**
 * Google Mobile Ads Configuration
 * Centralized configuration for AdMob ad units and settings
 * 
 * ⚠️ PRODUCTION WARNING: iOS Ad Unit IDs must be configured!
 * 
 * Before releasing to production:
 * 1. Log into Google AdMob dashboard (https://apps.admob.com)
 * 2. Navigate to Apps > Your App > Ad units
 * 3. Copy the real iOS ad unit IDs
 * 4. Add them to your .env file:
 *    ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-XXXXXXXX/YYYYYYYYYY
 *    ADMOB_IOS_BANNER_AD_ID=ca-app-pub-XXXXXXXX/YYYYYYYYYY
 * 5. Test ads on a real iOS device
 */

import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import {
  ENABLE_ADS,
  ADMOB_IOS_REWARDED_AD_ID,
  ADMOB_IOS_BANNER_AD_ID,
  ADMOB_ANDROID_REWARDED_AD_ID,
  ADMOB_ANDROID_BANNER_AD_ID
} from '@env';

/**
 * Check if ads are enabled via environment variable
 * Returns true if ENABLE_ADS is set to 'true' (case-insensitive)
 */
export const ADS_ENABLED = ENABLE_ADS?.toLowerCase() === 'true';

/**
 * Ad unit IDs for different ad types and platforms
 * Uses test IDs in development, production IDs from environment variables in release builds
 */
export const AD_UNIT_IDS = {
  /**
   * Rewarded ad unit IDs
   * Used for giving users rewards after watching ads
   */
  rewarded: {
    ios: __DEV__ ? TestIds.REWARDED : ADMOB_IOS_REWARDED_AD_ID,
    android: __DEV__ ? TestIds.REWARDED : ADMOB_ANDROID_REWARDED_AD_ID
  },
  
  /**
   * Banner ad unit IDs
   * Used for display ads at top/bottom of screens
   */
  banner: {
    ios: __DEV__ ? TestIds.BANNER : ADMOB_IOS_BANNER_AD_ID,
    android: __DEV__ ? TestIds.BANNER : ADMOB_ANDROID_BANNER_AD_ID
  }
} as const;

/**
 * Default ad request options
 * Configures privacy and targeting settings for all ads
 */
export const DEFAULT_AD_REQUEST_OPTIONS = {
  /**
   * Request non-personalized ads for GDPR compliance
   * Set to false to enable personalized ads (requires user consent)
   */
  requestNonPersonalizedAdsOnly: true,
  
  /**
   * Keywords for contextual targeting
   * Helps show relevant ads without using personal data
   */
  keywords: ['gaming', 'valorant', 'esports', 'fps'] as string[]
};

/**
 * Get the appropriate ad unit ID for the current platform and ad type
 * @param adType - Type of ad (banner or rewarded)
 * @returns Platform-specific ad unit ID
 * 
 * @example
 * const bannerId = getAdUnitId('banner');
 * const rewardedId = getAdUnitId('rewarded');
 */
export function getAdUnitId(adType: 'banner' | 'rewarded'): string {
  const platform = Platform.OS as 'ios' | 'android';
  return AD_UNIT_IDS[adType][platform];
}

/**
 * Ad configuration constants
 */
export const AD_CONFIG = {
  /**
   * Minimum time between rewarded ads (milliseconds)
   * Prevents users from spamming rewarded ads
   */
  REWARDED_AD_COOLDOWN: 30000, // 30 seconds
  
  /**
   * Time to wait before retrying a failed ad load (milliseconds)
   */
  RETRY_DELAY: 3000, // 3 seconds
  
  /**
   * Maximum number of retry attempts for failed ad loads
   */
  MAX_RETRY_ATTEMPTS: 3,
  
  /**
   * Enable debug logging for ads
   */
  DEBUG_MODE: __DEV__
} as const;
