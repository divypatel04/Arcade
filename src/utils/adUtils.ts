/**
 * @deprecated This file has been replaced by the new ad services.
 * Use the following imports instead:
 * 
 * For ad configuration:
 * ```ts
 * import { AD_UNIT_IDS, DEFAULT_AD_REQUEST_OPTIONS } from '@/services/ads';
 * ```
 * 
 * For rewarded ads:
 * ```ts
 * import { showRewardedAd, isRewardedAdReady, preloadRewardedAd } from '@/services/ads';
 * ```
 * 
 * For banner ads:
 * ```ts
 * import { getBannerAdUnitId, BANNER_SIZES } from '@/services/ads';
 * ```
 * 
 * This file is kept for backward compatibility only and will be removed in a future version.
 * 
 * ⚠️ IMPORTANT: iOS ad unit IDs below are PLACEHOLDERS and must be replaced before production!
 */

import { RewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Use test IDs during development
// ⚠️ TODO: Replace iOS placeholders with real ad unit IDs from AdMob dashboard
const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
    ? 'ca-app-pub-xxxxxxxx/yyyyyyyy' // ⚠️ PLACEHOLDER - Replace with real iOS ad unit ID!
    : 'ca-app-pub-8137963668346387/1075077787';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
    ? 'ca-app-pub-xxxxxxxx/yyyyyyyy' // ⚠️ PLACEHOLDER - Replace with real iOS ad unit ID!
    : 'ca-app-pub-8137963668346387/4976703898';

/**
 * @deprecated Use `showRewardedAd()` from '@/services/ads' instead
 */
export const loadRewardedAd = () => {
  // Create and load a rewarded ad
  const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['gaming', 'valorant'],
  });

  return rewarded;
};

/**
 * @deprecated Use `getBannerAdUnitId()` or `AD_UNIT_IDS` from '@/services/ads' instead
 */
export const getAdUnitId = (adType: 'banner' | 'rewarded') => {
  if (adType === 'banner') {
    return bannerAdUnitId;
  }
  return rewardedAdUnitId;
};
