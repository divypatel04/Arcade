// import {
//   RewardedAd,
//   TestIds,
//   AdEventType,
//   RewardedAdEventType
// } from 'react-native-google-mobile-ads';
// import { Platform } from 'react-native';

// // Ad unit IDs - replace the test IDs with your actual IDs for production
// const ANDROID_REWARDED_AD_UNIT_ID = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-8137963668346387/3342227446'; // Replace with your actual production ID

// const IOS_REWARDED_AD_UNIT_ID = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-xxxxxxxx/xxxxxxxx'; // Replace with your actual iOS production ID

// // Get the appropriate ad unit ID based on the platform
// const getRewardedAdUnitId = () => {
//   return Platform.OS === 'ios' ? IOS_REWARDED_AD_UNIT_ID : ANDROID_REWARDED_AD_UNIT_ID;
// };

// /**
//  * Load and show a rewarded ad
//  * @param onRewarded Callback function called when the user earns a reward
//  * @param onAdDismissed Callback function called when the ad is closed (regardless of reward earned)
//  * @param onAdFailedToLoad Callback function called if the ad fails to load
//  */
// export const showRewardedAd = (
//   onRewarded: () => void,
//   onAdDismissed: () => void,
//   onAdFailedToLoad: () => void
// ) => {
//   // Create a rewarded ad instance
//   const rewardedAd = RewardedAd.createForAdRequest(getRewardedAdUnitId());

//   // Set up event listeners
//   const loadedListener = rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
//     // Once the ad is loaded, show it
//     rewardedAd.show();
//   });

//   const earnedRewardListener = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
//     // User has watched the ad and earned a reward
//     onRewarded();
//   });

//   const adClosedListener = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
//     // Clean up event listeners
//     loadedListener();
//     earnedRewardListener();
//     adClosedListener();
//     adFailedToLoadListener();

//     // Call the dismissed callback
//     onAdDismissed();
//   });

//   const adFailedToLoadListener = rewardedAd.addAdEventListener(AdEventType.ERROR, () => {
//     // Clean up event listeners
//     loadedListener();
//     earnedRewardListener();
//     adClosedListener();
//     adFailedToLoadListener();

//     // Call the failure callback
//     onAdFailedToLoad();
//   });

//   // Load the ad
//   rewardedAd.load();
// };
