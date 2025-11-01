/**
 * Ad Services
 * 
 * Centralized module for managing all advertisement functionality.
 * Exports configuration, utilities, and managers for Google Mobile Ads.
 * 
 * @module services/ads
 */

// Configuration
export {
  AD_UNIT_IDS,
  DEFAULT_AD_REQUEST_OPTIONS,
  AD_CONFIG,
  getAdUnitId
} from './adConfig';

// Rewarded Ads
export {
  rewardedAdManager,
  showRewardedAd,
  isRewardedAdReady,
  preloadRewardedAd
} from './rewardedAd';

export type {
  RewardedAdCallbacks
} from './rewardedAd';

// Banner Ads
export {
  BANNER_SIZES,
  BANNER_CONFIG,
  getBannerAdUnitId,
  getRecommendedBannerSize
} from './bannerAd';
