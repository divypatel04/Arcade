/**
 * RevenueCat Configuration
 * 
 * Centralized configuration for RevenueCat subscription management.
 * Contains API keys, entitlement identifiers, and SDK initialization settings.
 */

import { Platform } from 'react-native';
import { 
  ENABLE_SUBSCRIPTIONS,
  REVENUECAT_IOS_API_KEY, 
  REVENUECAT_ANDROID_API_KEY 
} from '@env';

/**
 * Check if subscriptions are enabled via environment variable
 * Returns true if ENABLE_SUBSCRIPTIONS is set to 'true' (case-insensitive)
 */
export const SUBSCRIPTIONS_ENABLED = ENABLE_SUBSCRIPTIONS?.toLowerCase() === 'true';

/**
 * RevenueCat API Keys
 * Loaded from environment variables for security
 */
export const REVENUECAT_API_KEYS = {
  /**
   * iOS API key from RevenueCat dashboard
   * Loaded from REVENUECAT_IOS_API_KEY environment variable
   */
  IOS: REVENUECAT_IOS_API_KEY,
  
  /**
   * Android API key from RevenueCat dashboard
   * Loaded from REVENUECAT_ANDROID_API_KEY environment variable
   */
  ANDROID: REVENUECAT_ANDROID_API_KEY
} as const;

/**
 * Get the appropriate API key for the current platform
 * 
 * @returns The RevenueCat API key for iOS or Android
 */
export function getRevenueCatApiKey(): string {
  return Platform.select({
    ios: REVENUECAT_API_KEYS.IOS,
    android: REVENUECAT_API_KEYS.ANDROID,
    default: REVENUECAT_API_KEYS.ANDROID
  }) || REVENUECAT_API_KEYS.ANDROID;
}

/**
 * Entitlement identifiers
 * These match the entitlement IDs configured in RevenueCat dashboard
 */
export const ENTITLEMENTS = {
  /**
   * Premium subscription entitlement
   * Grants access to all premium features
   */
  PREMIUM: 'Premium'
} as const;

/**
 * Product identifiers
 * These match the product IDs in App Store Connect and Google Play Console
 */
export const PRODUCT_IDS = {
  /**
   * Monthly subscription product ID
   */
  MONTHLY: 'monthly_subscription',
  
  /**
   * Yearly subscription product ID
   */
  YEARLY: 'yearly_subscription'
} as const;

/**
 * Offering identifiers
 * These match the offering IDs in RevenueCat dashboard
 */
export const OFFERINGS = {
  /**
   * Default offering containing all subscription options
   */
  DEFAULT: 'default'
} as const;

/**
 * RevenueCat SDK Configuration
 */
export const REVENUECAT_CONFIG = {
  /**
   * Enable debug logging in development
   */
  DEBUG_LOGS_ENABLED: __DEV__,
  
  /**
   * Enable observer mode
   * When true, RevenueCat won't make purchases but will observe them
   */
  OBSERVER_MODE: false,
  
  /**
   * User default suite name for iOS (optional)
   */
  USER_DEFAULTS_SUITE_NAME: undefined as string | undefined,
  
  /**
   * Whether to use Amazon platform instead of Google Play (Android only)
   */
  USE_AMAZON: false,
  
  /**
   * Whether to finish transactions automatically
   */
  SHOULD_FINISH_TRANSACTIONS: true
} as const;

/**
 * Subscription tier information
 * Maps product IDs to display information
 */
export const SUBSCRIPTION_TIERS = {
  [PRODUCT_IDS.MONTHLY]: {
    name: 'Monthly',
    description: 'Billed monthly',
    features: [
      'Ad-free experience',
      'Advanced statistics',
      'Detailed match analysis',
      'Premium agent insights',
      'Priority support'
    ]
  },
  [PRODUCT_IDS.YEARLY]: {
    name: 'Yearly',
    description: 'Billed annually - Save 40%',
    features: [
      'All monthly features',
      'Best value - Save 40%',
      'Ad-free experience',
      'Advanced statistics',
      'Detailed match analysis',
      'Premium agent insights',
      'Priority support'
    ],
    badge: '🔥 Best Value'
  }
} as const;
