import { useState, useEffect, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, RewardedAdReward } from 'react-native-google-mobile-ads';
import { loadRewardedAd } from '../utils/adUtils';

type RewardCallback = (reward: RewardedAdReward) => void;
type DismissCallback = () => void;

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);

  // Load the rewarded ad
  useEffect(() => {
    const rewardedAd = loadRewardedAd();
    setRewarded(rewardedAd);

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeFailed = rewardedAd.addAdEventListener(
      RewardedAdEventType.ERROR,
      (error) => {
        console.error('Rewarded ad failed to load:', error);
        setLoaded(false);
      }
    );

    // Start loading the rewarded ad
    rewardedAd.load();

    // Clean up event listeners
    return () => {
      unsubscribeLoaded();
      unsubscribeFailed();
    };
  }, []);

  // Function to show the rewarded ad and handle the reward callback
  const showRewardedAd = useCallback((onRewarded?: RewardCallback, onAdDismissed?: DismissCallback) => {
    if (!rewarded || !loaded) {
      console.log('Rewarded ad not ready yet');
      onAdDismissed?.();
      return;
    }

    // Set up event listeners for rewarded and closed events
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward:', reward);
        if (onRewarded) onRewarded(reward);
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        console.log('Rewarded ad closed');
        setLoaded(false);
        if (onAdDismissed) onAdDismissed();

        // Reload the ad for next time
        const newRewarded = loadRewardedAd();
        setRewarded(newRewarded);
        newRewarded.load();
      }
    );

    // Show the rewarded ad
    rewarded.show().catch(error => {
      console.error('Error showing rewarded ad:', error);
      if (onAdDismissed) onAdDismissed();
    });

    // Return a cleanup function
    return () => {
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [rewarded, loaded]);

  return { showRewardedAd, isRewardedAdReady: loaded };
};
