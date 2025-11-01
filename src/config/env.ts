/**
 * Environment Configuration
 * 
 * Centralized access to environment variables with type safety and validation.
 * Uses react-native-dotenv for loading .env files.
 * 
 * @example
 * ```ts
 * import { ENV } from '@/config/env';
 * 
 * const supabaseUrl = ENV.SUPABASE_URL;
 * const isProduction = ENV.IS_PRODUCTION;
 * ```
 */

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_ANDROID_API_KEY,
  ADMOB_IOS_REWARDED_AD_ID,
  ADMOB_IOS_BANNER_AD_ID,
  ADMOB_ANDROID_REWARDED_AD_ID,
  ADMOB_ANDROID_BANNER_AD_ID,
  APP_ENV,
  DEBUG_LOGGING,
  ENABLE_ADS,
  ENABLE_SUBSCRIPTIONS,
  ENABLE_ANALYTICS,
} from '@env';

/**
 * Validate that a required environment variable is set
 * @param value - Environment variable value
 * @param name - Environment variable name
 * @throws Error if value is undefined or empty
 */
function requireEnv(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Please check your .env file and ensure ${name} is set.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
}

/**
 * Get boolean environment variable with default
 * @param value - Environment variable value
 * @param defaultValue - Default value if not set
 */
function getBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Environment configuration object
 * All environment variables accessible through this object
 */
export const ENV = {
  // ==========================================
  // APP ENVIRONMENT
  // ==========================================
  
  /**
   * Current environment (development, staging, production)
   */
  APP_ENV: APP_ENV || 'development',
  
  /**
   * Is this a production build?
   */
  IS_PRODUCTION: APP_ENV === 'production',
  
  /**
   * Is this a development build?
   */
  IS_DEVELOPMENT: APP_ENV === 'development' || !APP_ENV,
  
  /**
   * Enable debug logging?
   */
  DEBUG_LOGGING: getBooleanEnv(DEBUG_LOGGING, __DEV__),

  // ==========================================
  // SUPABASE
  // ==========================================
  
  /**
   * Supabase project URL
   */
  SUPABASE_URL: requireEnv(SUPABASE_URL, 'SUPABASE_URL'),
  
  /**
   * Supabase anonymous key
   */
  SUPABASE_ANON_KEY: requireEnv(SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY'),

  // ==========================================
  // REVENUECAT
  // ==========================================
  
  /**
   * RevenueCat iOS API key
   */
  REVENUECAT_IOS_API_KEY: requireEnv(REVENUECAT_IOS_API_KEY, 'REVENUECAT_IOS_API_KEY'),
  
  /**
   * RevenueCat Android API key
   */
  REVENUECAT_ANDROID_API_KEY: requireEnv(REVENUECAT_ANDROID_API_KEY, 'REVENUECAT_ANDROID_API_KEY'),

  // ==========================================
  // ADMOB
  // ==========================================
  
  /**
   * AdMob iOS Rewarded Ad Unit ID
   */
  ADMOB_IOS_REWARDED_AD_ID: requireEnv(ADMOB_IOS_REWARDED_AD_ID, 'ADMOB_IOS_REWARDED_AD_ID'),
  
  /**
   * AdMob iOS Banner Ad Unit ID
   */
  ADMOB_IOS_BANNER_AD_ID: requireEnv(ADMOB_IOS_BANNER_AD_ID, 'ADMOB_IOS_BANNER_AD_ID'),
  
  /**
   * AdMob Android Rewarded Ad Unit ID
   */
  ADMOB_ANDROID_REWARDED_AD_ID: requireEnv(ADMOB_ANDROID_REWARDED_AD_ID, 'ADMOB_ANDROID_REWARDED_AD_ID'),
  
  /**
   * AdMob Android Banner Ad Unit ID
   */
  ADMOB_ANDROID_BANNER_AD_ID: requireEnv(ADMOB_ANDROID_BANNER_AD_ID, 'ADMOB_ANDROID_BANNER_AD_ID'),

  // ==========================================
  // FEATURE FLAGS
  // ==========================================
  
  /**
   * Are ads enabled?
   */
  ENABLE_ADS: getBooleanEnv(ENABLE_ADS, true),
  
  /**
   * Are subscriptions enabled?
   */
  ENABLE_SUBSCRIPTIONS: getBooleanEnv(ENABLE_SUBSCRIPTIONS, true),
  
  /**
   * Is analytics enabled?
   */
  ENABLE_ANALYTICS: getBooleanEnv(ENABLE_ANALYTICS, true),
} as const;

/**
 * Validate all required environment variables on app startup
 * Call this early in your app initialization
 * 
 * @example
 * ```ts
 * // In App.tsx or index.js
 * import { validateEnv } from '@/config/env';
 * 
 * validateEnv();
 * ```
 */
export function validateEnv(): void {
  try {
    // Access all properties to trigger validation
    const _ = ENV.SUPABASE_URL;
    const __ = ENV.REVENUECAT_IOS_API_KEY;
    const ___ = ENV.ADMOB_IOS_REWARDED_AD_ID;
    
    if (__DEV__) {
      console.log('[ENV] ✅ All environment variables validated successfully');
      console.log('[ENV] Environment:', ENV.APP_ENV);
      console.log('[ENV] Debug logging:', ENV.DEBUG_LOGGING);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[ENV] ❌ Environment validation failed:', error);
    }
    throw error;
  }
}

/**
 * Default export
 */
export default ENV;
