/**
 * Purchase Services
 * 
 * Centralized module for managing subscription and purchase functionality.
 * Exports configuration and managers for RevenueCat integration.
 * 
 * @module services/purchases
 */

// Configuration
export {
  SUBSCRIPTIONS_ENABLED,
  REVENUECAT_API_KEYS,
  ENTITLEMENTS,
  PRODUCT_IDS,
  OFFERINGS,
  REVENUECAT_CONFIG,
  SUBSCRIPTION_TIERS,
  getRevenueCatApiKey
} from './revenueCatConfig';

// Subscription Manager
export {
  subscriptionManager
} from './subscriptionManager';

export type {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage
} from './subscriptionManager';
