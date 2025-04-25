import { useState, useEffect, useCallback, useRef } from 'react';
import { RewardedAd, RewardedAdEventType, RewardedAdReward } from 'react-native-google-mobile-ads';
import { loadRewardedAd } from '../utils/adUtils';

type RewardCallback = (reward: RewardedAdReward) => void;
type DismissCallback = () => void;

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);

  // Use a ref to track if we need to load a new ad
  const needsNewAd = useRef(true);

  // Function to load a new ad
  const loadNewAd = useCallback(() => {
    console.log('Loading new rewarded ad');
    // Reset state
    setLoaded(false);

    // Create and load a new ad
    const newRewardedAd = loadRewardedAd();
    setRewarded(newRewardedAd);

    // Set up the loaded event listener
    const unsubscribeLoaded = newRewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('New ad loaded successfully');
        setLoaded(true);
        needsNewAd.current = false;
      }
    );

    // Load the ad
    newRewardedAd.load();

    return unsubscribeLoaded;
  }, []);

  // Initial load and reload when needed
  useEffect(() => {
    // Only load a new ad when needed
    if (needsNewAd.current) {
      const unsubscribe = loadNewAd();
      return () => {
        unsubscribe();
      };
    }
  }, [loadNewAd, needsNewAd.current]);

  // Function to show the rewarded ad
  const showRewardedAd = useCallback((onRewarded?: RewardCallback, onAdDismissed?: DismissCallback) => {
    if (!rewarded || !loaded) {
      console.log('Rewarded ad not ready yet');
      onAdDismissed?.();
      return;
    }

    console.log('Showing rewarded ad');

    // Set up reward event listener
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward:', reward);
        if (onRewarded) {
          onRewarded(reward);
        }
      }
    );

    // Show the ad
    rewarded.show().then(() => {
      console.log('Ad displayed successfully');
    }).catch(error => {
      console.error('Error showing rewarded ad:', error);
    }).finally(() => {
      // Clean up
      console.log('Ad display finished, cleaning up');
      unsubscribeEarned();

      // Set flag to load a new ad
      needsNewAd.current = true;
      setLoaded(false);

      // After a short delay, load a new ad
      setTimeout(() => {
        loadNewAd();
      }, 100);

      // Call dismiss callback
      if (onAdDismissed) onAdDismissed();
    });

  }, [rewarded, loaded, loadNewAd]);

  return { showRewardedAd, isRewardedAdReady: loaded };
};
