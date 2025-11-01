/**
 * useRewardedAd Hook
 * 
 * React hook wrapper around the rewarded ad service.
 * This hook provides a simple interface for showing rewarded ads in React components.
 * 
 * @deprecated Consider using the service directly: `import { showRewardedAd, isRewardedAdReady } from '@/services/ads'`
 * 
 * @example
 * ```tsx
 * const { showRewardedAd, isRewardedAdReady } = useRewardedAd();
 * 
 * if (isRewardedAdReady) {
 *   showRewardedAd(
 *     (reward) => console.log('Rewarded!', reward),
 *     () => console.log('Ad dismissed')
 *   );
 * }
 * ```
 */

import { useState, useEffect } from 'react';
import { RewardedAdReward } from 'react-native-google-mobile-ads';
import {
  showRewardedAd as showRewardedAdService,
  isRewardedAdReady as checkRewardedAdReady,
  preloadRewardedAd
} from '../services/ads';

type RewardCallback = (reward: RewardedAdReward) => void;
type DismissCallback = () => void;

export const useRewardedAd = () => {
  const [isReady, setIsReady] = useState(false);

  // Poll the ad ready state
  useEffect(() => {
    const checkAdStatus = () => {
      setIsReady(checkRewardedAdReady());
    };

    // Check immediately
    checkAdStatus();

    // Preload ad if not ready
    if (!checkRewardedAdReady()) {
      preloadRewardedAd();
    }

    // Poll every second to update state
    const interval = setInterval(checkAdStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const showRewardedAd = (onRewarded?: RewardCallback, onAdDismissed?: DismissCallback) => {
    showRewardedAdService({
      onRewarded: (reward) => {
        onRewarded?.(reward);
        // Preload next ad
        setTimeout(() => preloadRewardedAd(), 100);
      },
      onAdDismissed: () => {
        onAdDismissed?.();
        // Update ready state
        setIsReady(checkRewardedAdReady());
      },
      onAdFailedToShow: (error) => {
        console.error('Failed to show rewarded ad:', error);
        onAdDismissed?.();
        setIsReady(false);
      }
    });
  };

  return { 
    showRewardedAd, 
    isRewardedAdReady: isReady 
  };
};
