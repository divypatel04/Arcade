/**
 * Subscription Manager
 * 
 * Manages RevenueCat subscription lifecycle including initialization,
 * purchase flow, and entitlement checking.
 */

import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL
} from 'react-native-purchases';
import {
  getRevenueCatApiKey,
  ENTITLEMENTS,
  REVENUECAT_CONFIG
} from './revenueCatConfig';

/**
 * Subscription manager singleton class
 * Handles all RevenueCat operations
 */
class SubscriptionManager {
  private static instance: SubscriptionManager;
  private isInitialized = false;
  private currentOfferings: PurchasesOfferings | null = null;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called once when the app starts
   * 
   * @param userId - Optional user ID to identify the user
   * @throws Error if initialization fails
   * 
   * @example
   * ```ts
   * await subscriptionManager.initialize('user_123');
   * ```
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log('[SubscriptionManager] Already initialized');
      return;
    }

    try {
      // Configure SDK
      Purchases.setLogLevel(
        REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED 
          ? LOG_LEVEL.DEBUG 
          : LOG_LEVEL.INFO
      );

      // Initialize with API key
      await Purchases.configure({
        apiKey: getRevenueCatApiKey(),
        appUserID: userId
      });

      this.isInitialized = true;
      
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        console.log('[SubscriptionManager] Initialized successfully');
      }
    } catch (error) {
      console.error('[SubscriptionManager] Initialization failed:', error);
      throw new Error('Failed to initialize subscription manager');
    }
  }

  /**
   * Get available subscription offerings
   * 
   * @returns Available offerings with packages
   * @throws Error if SDK is not initialized or fetch fails
   * 
   * @example
   * ```ts
   * const offerings = await subscriptionManager.getOfferings();
   * const packages = offerings.current?.availablePackages || [];
   * ```
   */
  async getOfferings(): Promise<PurchasesOfferings> {
    this.ensureInitialized();

    try {
      this.currentOfferings = await Purchases.getOfferings();
      return this.currentOfferings;
    } catch (error) {
      console.error('[SubscriptionManager] Failed to get offerings:', error);
      throw new Error('Failed to fetch subscription offerings');
    }
  }

  /**
   * Purchase a subscription package
   * 
   * @param pkg - The package to purchase
   * @returns Customer info after purchase
   * @throws Error if purchase fails or is cancelled
   * 
   * @example
   * ```ts
   * try {
   *   const customerInfo = await subscriptionManager.purchasePackage(package);
   *   if (customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM]) {
   *     console.log('Purchase successful!');
   *   }
   * } catch (error) {
   *   console.error('Purchase failed:', error);
   * }
   * ```
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
    this.ensureInitialized();

    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        console.log('[SubscriptionManager] Purchase completed');
      }
      
      return customerInfo;
    } catch (error: any) {
      // User cancelled purchase
      if (error.userCancelled) {
        throw new Error('Purchase cancelled by user');
      }
      
      console.error('[SubscriptionManager] Purchase failed:', error);
      throw new Error('Purchase failed. Please try again.');
    }
  }

  /**
   * Restore previous purchases
   * 
   * @returns Restored customer info
   * @throws Error if restore fails
   * 
   * @example
   * ```ts
   * const customerInfo = await subscriptionManager.restorePurchases();
   * ```
   */
  async restorePurchases(): Promise<CustomerInfo> {
    this.ensureInitialized();

    try {
      const customerInfo = await Purchases.restorePurchases();
      
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        console.log('[SubscriptionManager] Purchases restored');
      }
      
      return customerInfo;
    } catch (error) {
      console.error('[SubscriptionManager] Restore failed:', error);
      throw new Error('Failed to restore purchases');
    }
  }

  /**
   * Get current customer info
   * 
   * @returns Current customer info including entitlements
   * @throws Error if SDK is not initialized
   * 
   * @example
   * ```ts
   * const customerInfo = await subscriptionManager.getCustomerInfo();
   * const isPremium = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] != null;
   * ```
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    this.ensureInitialized();

    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('[SubscriptionManager] Failed to get customer info:', error);
      throw new Error('Failed to get customer information');
    }
  }

  /**
   * Check if user has active premium entitlement
   * 
   * @returns True if user has active premium subscription
   * 
   * @example
   * ```ts
   * const isPremium = await subscriptionManager.isPremiumActive();
   * if (isPremium) {
   *   // Show premium features
   * }
   * ```
   */
  async isPremiumActive(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] != null;
    } catch (error) {
      console.error('[SubscriptionManager] Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Set user ID for RevenueCat
   * 
   * @param userId - The user ID to identify the user
   * 
   * @example
   * ```ts
   * await subscriptionManager.setUserId('user_123');
   * ```
   */
  async setUserId(userId: string): Promise<void> {
    this.ensureInitialized();

    try {
      await Purchases.logIn(userId);
      
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        console.log('[SubscriptionManager] User ID set:', userId);
      }
    } catch (error) {
      console.error('[SubscriptionManager] Failed to set user ID:', error);
      throw new Error('Failed to set user ID');
    }
  }

  /**
   * Log out current user
   * 
   * @example
   * ```ts
   * await subscriptionManager.logout();
   * ```
   */
  async logout(): Promise<void> {
    this.ensureInitialized();

    try {
      await Purchases.logOut();
      
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        console.log('[SubscriptionManager] User logged out');
      }
    } catch (error) {
      console.error('[SubscriptionManager] Failed to logout:', error);
      throw new Error('Failed to logout');
    }
  }

  /**
   * Ensure SDK is initialized before making calls
   * @throws Error if SDK is not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('SubscriptionManager not initialized. Call initialize() first.');
    }
  }

  /**
   * Reset the singleton instance (for testing)
   * @internal
   */
  static resetInstance(): void {
    if (SubscriptionManager.instance) {
      SubscriptionManager.instance.isInitialized = false;
      SubscriptionManager.instance.currentOfferings = null;
    }
  }
}

/**
 * Singleton instance of SubscriptionManager
 * Use this to access all subscription functionality
 * 
 * @example
 * ```ts
 * import { subscriptionManager } from '@/services/purchases';
 * 
 * // Initialize
 * await subscriptionManager.initialize();
 * 
 * // Get offerings
 * const offerings = await subscriptionManager.getOfferings();
 * 
 * // Purchase
 * await subscriptionManager.purchasePackage(package);
 * 
 * // Check premium status
 * const isPremium = await subscriptionManager.isPremiumActive();
 * ```
 */
export const subscriptionManager = SubscriptionManager.getInstance();

/**
 * Type exports
 */
export type {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage
} from 'react-native-purchases';
