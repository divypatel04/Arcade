/**
 * Type definitions for react-native-dotenv
 * This file provides TypeScript types for environment variables loaded from .env
 */

declare module '@env' {
  // Supabase (using existing variable names from codebase)
  export const REACT_NATIVE_PUBLIC_SUPABASE_URL: string;
  export const REACT_NATIVE_SUPABASE_ANON_KEY: string;

  // RevenueCat
  export const REVENUECAT_IOS_API_KEY: string;
  export const REVENUECAT_ANDROID_API_KEY: string;

  // AdMob
  export const ADMOB_IOS_REWARDED_AD_ID: string;
  export const ADMOB_IOS_BANNER_AD_ID: string;
  export const ADMOB_ANDROID_REWARDED_AD_ID: string;
  export const ADMOB_ANDROID_BANNER_AD_ID: string;

  // App Configuration
  export const APP_ENV: 'development' | 'staging' | 'production';
  export const DEBUG_LOGGING: string;

  // Feature Flags
  export const ENABLE_ADS: string;
  export const ENABLE_SUBSCRIPTIONS: string;
  export const ENABLE_ANALYTICS: string;
}
