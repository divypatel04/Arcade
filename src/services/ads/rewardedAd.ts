/**
 * Rewarded Ad Manager
 * Handles loading, displaying, and managing rewarded video ads
 */

import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { getAdUnitId, DEFAULT_AD_REQUEST_OPTIONS, AD_CONFIG, ADS_ENABLED } from './adConfig';
import { logger } from '../../utils/logger';

// Create scoped logger for rewarded ads
const log = logger.scope('RewardedAd');

/**
 * Reward callback type
 * Called when user earns a reward from watching an ad
 */
export type RewardCallback = (reward: { type: string; amount: number }) => void;

/**
 * Ad event callbacks
 */
export interface RewardedAdCallbacks {
  /** Called when user earns the reward */
  onRewarded?: RewardCallback;
  /** Called when ad is dismissed (with or without reward) */
  onAdDismissed?: () => void;
  /** Called when ad fails to load */
  onAdFailedToLoad?: (error: Error) => void;
  /** Called when ad fails to show */
  onAdFailedToShow?: (error: Error) => void;
}

/**
 * Rewarded Ad Manager Class
 * Singleton pattern for managing rewarded ads throughout the app
 */
class RewardedAdManager {
  private rewardedAd: RewardedAd | null = null;
  private isLoaded = false;
  private isLoading = false;
  private lastAdShownTime = 0;
  private retryAttempts = 0;

  /**
   * Initialize and load a new rewarded ad
   * @returns Promise that resolves when ad is loaded
   */
  public async loadAd(): Promise<void> {
    // Check if ads are enabled
    if (!ADS_ENABLED) {
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ads are disabled via ENABLE_ADS flag');
      }
      return;
    }

    if (this.isLoading || this.isLoaded) {
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ad already loading or loaded');
      }
      return;
    }

    this.isLoading = true;
    this.isLoaded = false;

    try {
      // Create new rewarded ad instance
      this.rewardedAd = RewardedAd.createForAdRequest(
        getAdUnitId('rewarded'),
        DEFAULT_AD_REQUEST_OPTIONS
      );

      // Set up event listeners
      this.setupEventListeners();

      // Load the ad
      this.rewardedAd.load();

      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Started loading ad');
      }
    } catch (error) {
      this.isLoading = false;
      this.retryAttempts++;
      
      if (AD_CONFIG.DEBUG_MODE) {
        log.error('Error creating ad:', error);
      }

      // Retry if within retry limits
      if (this.retryAttempts < AD_CONFIG.MAX_RETRY_ATTEMPTS) {
        setTimeout(() => this.loadAd(), AD_CONFIG.RETRY_DELAY);
      }
      
      throw error;
    }
  }

  /**
   * Set up event listeners for the rewarded ad
   */
  private setupEventListeners(): void {
    if (!this.rewardedAd) return;

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isLoaded = true;
      this.isLoading = false;
      this.retryAttempts = 0;
      
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ad loaded successfully');
      }
    });
  }

  /**
   * Show the rewarded ad to the user
   * @param callbacks - Event callbacks for ad lifecycle
   * @returns Promise that resolves when ad interaction completes
   */
  public async showAd(callbacks: RewardedAdCallbacks = {}): Promise<void> {
    const { onRewarded, onAdDismissed, onAdFailedToShow } = callbacks;

    // Check if ads are enabled
    if (!ADS_ENABLED) {
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ads are disabled via ENABLE_ADS flag - simulating reward');
      }
      // Simulate reward for testing when ads are disabled
      onRewarded?.({ type: 'test', amount: 1 });
      onAdDismissed?.();
      return;
    }

    // Check cooldown period
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdShownTime;
    
    if (timeSinceLastAd < AD_CONFIG.REWARDED_AD_COOLDOWN) {
      const waitTime = Math.ceil((AD_CONFIG.REWARDED_AD_COOLDOWN - timeSinceLastAd) / 1000);
      const error = new Error(`Please wait ${waitTime} seconds before watching another ad`);
      onAdFailedToShow?.(error);
      throw error;
    }

    // Check if ad is ready
    if (!this.rewardedAd || !this.isLoaded) {
      const error = new Error('Rewarded ad not ready yet');
      
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ad not ready');
      }
      
      onAdFailedToShow?.(error);
      
      // Try to load a new ad for next time
      this.loadAd();
      
      throw error;
    }

    try {
      // Set up reward listener
      const unsubscribeEarned = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          if (AD_CONFIG.DEBUG_MODE) {
            log.debug('User earned reward:', reward);
          }
          onRewarded?.(reward);
        }
      );

      // Show the ad
      await this.rewardedAd.show();
      
      this.lastAdShownTime = Date.now();
      
      if (AD_CONFIG.DEBUG_MODE) {
        log.debug('Ad shown successfully');
      }

      // Clean up
      unsubscribeEarned();
      this.isLoaded = false;
      this.rewardedAd = null;

      // Load next ad
      setTimeout(() => this.loadAd(), 500);

      onAdDismissed?.();
    } catch (error) {
      if (AD_CONFIG.DEBUG_MODE) {
        log.error('Error showing ad:', error);
      }
      
      onAdFailedToShow?.(error as Error);
      throw error;
    }
  }

  /**
   * Check if a rewarded ad is ready to show
   * @returns True if ad is loaded and ready, or if ads are disabled (for testing)
   */
  public isAdReady(): boolean {
    // If ads are disabled, always return true for testing
    if (!ADS_ENABLED) {
      return true;
    }
    return this.isLoaded && this.rewardedAd !== null;
  }

  /**
   * Get remaining cooldown time in seconds
   * @returns Seconds until next ad can be shown (0 if ready)
   */
  public getCooldownRemaining(): number {
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdShownTime;
    const remaining = AD_CONFIG.REWARDED_AD_COOLDOWN - timeSinceLastAd;
    
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  /**
   * Preload an ad for faster display
   * Should be called when app starts or when user navigates to a screen with rewards
   */
  public preload(): void {
    if (!this.isLoaded && !this.isLoading) {
      this.loadAd();
    }
  }
}

// Export singleton instance
export const rewardedAdManager = new RewardedAdManager();

/**
 * Convenience function to show a rewarded ad
 * @param callbacks - Event callbacks
 * @returns Promise that resolves when ad interaction completes
 * 
 * @example
 * try {
 *   await showRewardedAd({
 *     onRewarded: (reward) => {
 *       console.log('User earned:', reward.amount);
 *       grantUserReward();
 *     },
 *     onAdDismissed: () => {
 *       console.log('Ad closed');
 *     }
 *   });
 * } catch (error) {
 *   console.error('Ad failed:', error);
 * }
 */
export async function showRewardedAd(callbacks?: RewardedAdCallbacks): Promise<void> {
  return rewardedAdManager.showAd(callbacks);
}

/**
 * Check if rewarded ad is ready
 * @returns True if ad can be shown
 * 
 * @example
 * if (isRewardedAdReady()) {
 *   // Show button to watch ad
 * }
 */
export function isRewardedAdReady(): boolean {
  return rewardedAdManager.isAdReady();
}

/**
 * Preload a rewarded ad
 * Call this when app starts or when navigating to screens with rewards
 * 
 * @example
 * useEffect(() => {
 *   preloadRewardedAd();
 * }, []);
 */
export function preloadRewardedAd(): void {
  rewardedAdManager.preload();
}
