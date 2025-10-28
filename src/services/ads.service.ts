import { Platform } from 'react-native';
import MobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import ENV from '@config/env';

// Ad Unit IDs (use test IDs in development)
const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : Platform.select({
    ios: ENV.ADMOB_BANNER_IOS,
    android: ENV.ADMOB_BANNER_ANDROID,
  }) || '',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : Platform.select({
    ios: ENV.ADMOB_INTERSTITIAL_IOS,
    android: ENV.ADMOB_INTERSTITIAL_ANDROID,
  }) || '',
  rewarded: __DEV__ ? TestIds.REWARDED : Platform.select({
    ios: ENV.ADMOB_REWARDED_IOS,
    android: ENV.ADMOB_REWARDED_ANDROID,
  }) || '',
};

class AdsService {
  private initialized = false;
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private isPremium = false;

  /**
   * Initialize Google Mobile Ads SDK
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await MobileAds().initialize();
      this.initialized = true;
      console.log('AdMob initialized successfully');

      // Pre-load interstitial and rewarded ads
      this.loadInterstitialAd();
      this.loadRewardedAd();
    } catch (error) {
      console.error('AdMob initialization error:', error);
      throw error;
    }
  }

  /**
   * Set premium status to control ad display
   */
  setPremiumStatus(premium: boolean): void {
    this.isPremium = premium;
  }

  /**
   * Check if ads should be shown
   */
  shouldShowAds(): boolean {
    return !this.isPremium;
  }

  /**
   * Get banner ad unit ID
   */
  getBannerAdUnitId(): string {
    return AD_UNIT_IDS.banner;
  }

  /**
   * Load interstitial ad
   */
  private loadInterstitialAd(): void {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);
      
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        // Pre-load next ad
        this.loadInterstitialAd();
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
    }
  }

  /**
   * Show interstitial ad
   */
  async showInterstitialAd(): Promise<boolean> {
    if (!this.shouldShowAds()) {
      console.log('User is premium, skipping interstitial ad');
      return false;
    }

    try {
      if (this.interstitialAd?.loaded) {
        await this.interstitialAd.show();
        return true;
      } else {
        console.log('Interstitial ad not loaded yet');
        this.loadInterstitialAd();
        return false;
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }

  /**
   * Load rewarded ad
   */
  private loadRewardedAd(): void {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);
      
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error('Error loading rewarded ad:', error);
    }
  }

  /**
   * Show rewarded ad
   */
  async showRewardedAd(): Promise<{
    success: boolean;
    rewarded: boolean;
  }> {
    try {
      if (!this.rewardedAd?.loaded) {
        console.log('Rewarded ad not loaded yet');
        this.loadRewardedAd();
        return { success: false, rewarded: false };
      }

      return new Promise((resolve) => {
        let rewarded = false;

        this.rewardedAd!.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
          rewarded = true;
        });

        this.rewardedAd!.addAdEventListener(AdEventType.CLOSED, () => {
          // Pre-load next ad
          this.loadRewardedAd();
          resolve({ success: true, rewarded });
        });

        this.rewardedAd!.show();
      });
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return { success: false, rewarded: false };
    }
  }

  /**
   * Check if rewarded ad is ready
   */
  isRewardedAdReady(): boolean {
    return this.rewardedAd?.loaded || false;
  }

  /**
   * Get banner ad size
   */
  getBannerAdSize(): BannerAdSize {
    return BannerAdSize.BANNER;
  }
}

export const adsService = new AdsService();
export default adsService;
