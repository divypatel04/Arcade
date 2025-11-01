# Third-Party Services

This directory contains all third-party service integrations for the Arcade app. The code is organized into modular, well-documented services for easy maintenance and testing.

## 📁 Directory Structure

```
services/
├── ads/                    # Google Mobile Ads (AdMob)
│   ├── adConfig.ts        # Centralized ad configuration
│   ├── rewardedAd.ts      # Rewarded video ad manager
│   ├── bannerAd.ts        # Banner ad utilities
│   └── index.ts           # Public exports
└── purchases/             # RevenueCat subscriptions
    ├── revenueCatConfig.ts   # RevenueCat configuration
    ├── subscriptionManager.ts # Subscription lifecycle manager
    └── index.ts              # Public exports
```

## 🎯 Ad Services (`services/ads/`)

### Configuration (`adConfig.ts`)

Centralized configuration for all ad types:

```typescript
import { AD_UNIT_IDS, DEFAULT_AD_REQUEST_OPTIONS, AD_CONFIG } from '@/services/ads';

// Get ad unit ID for current platform
const adUnitId = AD_UNIT_IDS.rewarded.ios; // or .android

// Use default ad request options (GDPR-compliant)
const options = DEFAULT_AD_REQUEST_OPTIONS;

// Access configuration
const { MAX_RETRY_ATTEMPTS, RETRY_DELAY, AD_COOLDOWN } = AD_CONFIG;
```

**Features:**
- ✅ Automatic test/production ad unit selection based on `__DEV__`
- ✅ GDPR-compliant default settings (non-personalized ads)
- ✅ Contextual keyword targeting
- ✅ Platform-specific configurations

### Rewarded Ads (`rewardedAd.ts`)

Singleton manager for rewarded video ads:

```typescript
import { showRewardedAd, isRewardedAdReady, preloadRewardedAd } from '@/services/ads';

// Show rewarded ad
showRewardedAd({
  onRewarded: (reward) => {
    console.log('User earned reward:', reward);
    grantPremiumAccess();
  },
  onAdDismissed: () => {
    console.log('Ad closed');
  },
  onAdFailedToLoad: (error) => {
    console.error('Failed to load ad:', error);
  },
  onAdFailedToShow: (error) => {
    console.error('Failed to show ad:', error);
  }
});

// Check if ad is ready
if (isRewardedAdReady()) {
  // Show button to watch ad
}

// Preload for next time
preloadRewardedAd();
```

**Features:**
- ✅ Automatic retry on load failure (up to 3 attempts)
- ✅ 30-second cooldown between ads
- ✅ Preload capability for faster ad display
- ✅ Event-driven callback architecture
- ✅ Singleton pattern for consistent state

### Banner Ads (`bannerAd.ts`)

Utilities for banner ad configuration:

```typescript
import { getBannerAdUnitId, BANNER_SIZES, getRecommendedBannerSize } from '@/services/ads';
import { Dimensions } from 'react-native';

// Get banner ad unit ID
const unitId = getBannerAdUnitId();

// Use different banner sizes
<BannerAd 
  unitId={unitId} 
  size={BANNER_SIZES.ADAPTIVE} // or STANDARD, LARGE, LEADERBOARD, etc.
/>

// Get recommended size based on screen width
const { width } = Dimensions.get('window');
const size = getRecommendedBannerSize(width);
```

**Features:**
- ✅ Platform-specific ad unit IDs
- ✅ Multiple banner size options
- ✅ Responsive size recommendations
- ✅ Configuration for auto-refresh and positioning

## 💳 Purchase Services (`services/purchases/`)

### Configuration (`revenueCatConfig.ts`)

Centralized RevenueCat configuration:

```typescript
import { 
  ENTITLEMENTS, 
  PRODUCT_IDS, 
  SUBSCRIPTION_TIERS,
  getRevenueCatApiKey 
} from '@/services/purchases';

// Get API key for current platform
const apiKey = getRevenueCatApiKey();

// Check entitlement
const hasPremium = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];

// Access product info
const monthlyInfo = SUBSCRIPTION_TIERS[PRODUCT_IDS.MONTHLY];
console.log(monthlyInfo.name); // "Monthly"
console.log(monthlyInfo.features); // Array of features
```

**Features:**
- ✅ Platform-specific API keys
- ✅ Entitlement and product ID constants
- ✅ Subscription tier metadata
- ✅ Debug logging configuration

### Subscription Manager (`subscriptionManager.ts`)

Singleton manager for subscription lifecycle:

```typescript
import { subscriptionManager, ENTITLEMENTS } from '@/services/purchases';

// Initialize (do this once at app start)
await subscriptionManager.initialize('user_123');

// Get available offerings
const offerings = await subscriptionManager.getOfferings();
const packages = offerings.current?.availablePackages || [];

// Purchase a package
try {
  const customerInfo = await subscriptionManager.purchasePackage(package);
  if (customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM]) {
    console.log('Premium activated!');
  }
} catch (error) {
  console.error('Purchase failed:', error);
}

// Check premium status
const isPremium = await subscriptionManager.isPremiumActive();

// Restore purchases
await subscriptionManager.restorePurchases();

// Set user ID
await subscriptionManager.setUserId('user_123');

// Logout
await subscriptionManager.logout();
```

**Features:**
- ✅ Complete subscription lifecycle management
- ✅ Automatic error handling
- ✅ User identification and logout
- ✅ Purchase restoration
- ✅ Singleton pattern for consistent state
- ✅ Comprehensive JSDoc documentation

## 🔧 Migration Guide

### Updating Components to Use New Services

#### Before (Old Pattern)
```typescript
// Old: Scattered configuration
const adUnitId = Platform.OS === 'ios' 
  ? 'ca-app-pub-xxx/yyy' 
  : 'ca-app-pub-xxx/zzz';

// Old: Manual ad loading
const loadAd = async () => {
  try {
    const ad = await RewardedAd.createForAdRequest(adUnitId);
    await ad.load();
  } catch (error) {
    // Basic error handling
  }
};
```

#### After (New Pattern)
```typescript
// New: Use centralized services
import { showRewardedAd } from '@/services/ads';

showRewardedAd({
  onRewarded: (reward) => grantReward(),
  onAdFailedToLoad: (error) => showError(error)
});
```

#### RevenueCat Migration

##### Before (Old Pattern)
```typescript
// Old: SDK initialization in component
useEffect(() => {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: 'xxx' });
}, []);

// Old: Manual purchase flow
const purchase = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    // Check entitlements...
  } catch (error) {
    // Handle error...
  }
};
```

##### After (New Pattern)
```typescript
// New: Use subscription manager
import { subscriptionManager } from '@/services/purchases';

// Initialize once at app start
await subscriptionManager.initialize('user_123');

// Simple purchase
const customerInfo = await subscriptionManager.purchasePackage(pkg);

// Check premium status
const isPremium = await subscriptionManager.isPremiumActive();
```

## 📝 Best Practices

### Ad Management
1. **Always preload** rewarded ads after showing one for better UX
2. **Check cooldown** before showing ad button: `getCooldownRemaining()`
3. **Handle errors gracefully** with user-friendly messages
4. **Use GDPR-compliant settings** - default config handles this

### Subscription Management
1. **Initialize once** at app start, not in every component
2. **Cache customer info** to reduce API calls
3. **Handle purchase cancellation** - it's not an error
4. **Always restore purchases** when user reinstalls app
5. **Use entitlements** not product IDs to check access

### Error Handling
```typescript
// Good: Specific error messages
try {
  await subscriptionManager.purchasePackage(pkg);
} catch (error) {
  if (error.message.includes('cancelled')) {
    // User cancelled - don't show error
  } else {
    showErrorToast('Purchase failed. Please try again.');
  }
}

// Good: Graceful ad failure
showRewardedAd({
  onAdFailedToLoad: (error) => {
    console.error('Ad load failed:', error);
    // Offer alternative way to access content
    showAlternativeOption();
  }
});
```

## 🧪 Testing

### Testing Ads in Development

The services automatically use test ad unit IDs when `__DEV__` is true:
- No configuration needed
- Safe to test without policy violations
- Real ads shown in production builds

### Testing Subscriptions

1. Use RevenueCat sandbox environment
2. Set up test users in RevenueCat dashboard
3. Use iOS/Android sandbox testers for app store testing

## 🔐 Security Notes

⚠️ **Important:** In production, consider moving API keys to:
- Environment variables (`.env` files)
- Secure configuration management system
- React Native Config or similar libraries

Current implementation has keys in code for simplicity but should be externalized for better security.

## 📊 Monitoring

### Ad Performance
- Check `AD_CONFIG.DEBUG_MODE` logs for ad events
- Monitor cooldown timing
- Track retry attempts

### Subscription Health
- Enable `REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED` for detailed logs
- Monitor entitlement checks
- Track purchase success/failure rates

## 🎓 Additional Resources

- [Google Mobile Ads Documentation](https://developers.google.com/admob/react-native)
- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [App Store Subscription Guidelines](https://developer.apple.com/app-store/subscriptions/)
- [Google Play Billing Guidelines](https://developer.android.com/google/play/billing)
