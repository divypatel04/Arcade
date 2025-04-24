import { RewardedAd, BannerAd, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Use test IDs during development
const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
    ? 'ca-app-pub-xxxxxxxx/yyyyyyyy'  // Replace with your iOS rewarded ad unit ID
    : 'ca-app-pub-8137963668346387/yyyyyyyy'; // Replace with your Android rewarded ad unit ID

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
    ? 'ca-app-pub-xxxxxxxx/yyyyyyyy'  // Replace with your iOS banner ad unit ID
    : 'ca-app-pub-8137963668346387/yyyyyyyy'; // Replace with your Android banner ad unit ID

export const loadRewardedAd = () => {
  // Create and load a rewarded ad
  const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['gaming', 'valorant'],
  });

  return rewarded;
};

export const getAdUnitId = (adType: 'banner' | 'rewarded') => {
  if (adType === 'banner') {
    return bannerAdUnitId;
  }
  return rewardedAdUnitId;
};
