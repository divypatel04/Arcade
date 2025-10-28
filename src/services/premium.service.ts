import Purchases, { PurchasesOffering, PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import ENV from '@config/env';
import { Platform } from 'react-native';

// RevenueCat Configuration
const REVENUECAT_API_KEY = Platform.select({
  ios: ENV.REVENUECAT_IOS_KEY,
  android: ENV.REVENUECAT_ANDROID_KEY,
}) || '';

export type SubscriptionTier = 'free' | 'premium_monthly' | 'premium_yearly';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  freeTier: boolean;
  premiumTier: boolean;
}

class PremiumService {
  private initialized = false;

  /**
   * Initialize RevenueCat SDK
   */
  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: userId,
      });

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('RevenueCat initialization error:', error);
      throw error;
    }
  }

  /**
   * Get available subscription offerings
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a subscription package
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      if (error.userCancelled) {
        return {
          success: false,
          error: 'Purchase cancelled by user',
        };
      }
      
      console.error('Purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Restore purchases error:', error);
      return {
        success: false,
        error: error.message || 'Restore failed',
      };
    }
  }

  /**
   * Get customer info and check entitlements
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error fetching customer info:', error);
      return null;
    }
  }

  /**
   * Check if user has premium entitlement
   */
  async isPremium(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      // Check if user has active premium entitlement
      const premiumEntitlement = customerInfo.entitlements.active['premium'];
      return premiumEntitlement !== undefined;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Get subscription expiration date
   */
  async getExpirationDate(): Promise<Date | null> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return null;

      const premiumEntitlement = customerInfo.entitlements.active['premium'];
      if (!premiumEntitlement) return null;

      return premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : null;
    } catch (error) {
      console.error('Error fetching expiration date:', error);
      return null;
    }
  }

  /**
   * Get premium features list
   */
  getPremiumFeatures(): PremiumFeature[] {
    return [
      {
        id: 'detailed_stats',
        name: 'Detailed Statistics',
        description: 'Access comprehensive performance analytics and insights',
        icon: 'chart-line',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'match_history',
        name: 'Unlimited Match History',
        description: 'View your entire competitive journey without limits',
        icon: 'history',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'agent_insights',
        name: 'Advanced Agent Insights',
        description: 'Deep dive into agent-specific performance metrics',
        icon: 'account-details',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'map_analytics',
        name: 'Map Analytics',
        description: 'Analyze your performance on every map with heatmaps',
        icon: 'map-marker',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'weapon_mastery',
        name: 'Weapon Mastery Tracking',
        description: 'Track your accuracy and kills with every weapon',
        icon: 'pistol',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'no_ads',
        name: 'Ad-Free Experience',
        description: 'Enjoy the app without any advertisements',
        icon: 'block-helper',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'export_data',
        name: 'Export Statistics',
        description: 'Download your stats as CSV or share them easily',
        icon: 'download',
        freeTier: false,
        premiumTier: true,
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: 'Get faster response times for your questions',
        icon: 'headset',
        freeTier: false,
        premiumTier: true,
      },
    ];
  }
}

export const premiumService = new PremiumService();
export default premiumService;
