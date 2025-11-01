# Feature Flags Guide

**Date:** November 1, 2025  
**Purpose:** Control which features are enabled in your app via environment variables

---

## 📋 Overview

Feature flags allow you to enable/disable entire features in your app without changing code. This is perfect for:
- **Publishing without AdMob account** - Disable ads until you get approved
- **Testing different configurations** - Test with/without subscriptions
- **Gradual feature rollout** - Enable features when ready
- **Development vs Production** - Different features in different environments

---

## 🎯 Available Feature Flags

### 1. ENABLE_ADS

**Location:** `.env` file  
**Default:** `false`  
**Type:** `boolean` (string: 'true' or 'false')

**What it does:**
- Controls ALL ad functionality in the app
- When `false`: No ads shown, no AdMob SDK initialization, ad UI hidden
- When `true`: Ads load and display normally

**Files affected:**
- `src/services/ads/adConfig.ts` - Exports `ADS_ENABLED` constant
- `src/services/ads/rewardedAd.ts` - Skips loading ads, simulates rewards
- `src/services/ads/bannerAd.ts` - Exports flag for components
- `src/components/BannerAdContainer.tsx` - Returns `null` when ads disabled

**Usage in `.env`:**
```bash
# Disable ads (for initial publish without AdMob)
ENABLE_ADS=false

# Enable ads (once you have AdMob account)
ENABLE_ADS=true
```

**Testing behavior when disabled:**
- Banner ads: Component renders nothing
- Rewarded ads: `showAd()` immediately triggers success callback with test reward
- No network requests to AdMob
- No AdMob SDK initialization

---

### 2. ENABLE_SUBSCRIPTIONS

**Location:** `.env` file  
**Default:** `true`  
**Type:** `boolean` (string: 'true' or 'false')

**What it does:**
- Controls RevenueCat subscription functionality
- When `false`: Subscription features disabled or stubbed
- When `true`: Full subscription functionality

**Files affected:**
- `src/services/purchases/revenueCatConfig.ts` - Exports `SUBSCRIPTIONS_ENABLED`
- Premium subscription screens
- Paywall logic

**Usage in `.env`:**
```bash
# Disable subscriptions
ENABLE_SUBSCRIPTIONS=false

# Enable subscriptions (default)
ENABLE_SUBSCRIPTIONS=true
```

**Note:** Currently implemented in config but needs integration in subscription manager.

---

### 3. ENABLE_ANALYTICS

**Location:** `.env` file  
**Default:** `true`  
**Type:** `boolean` (string: 'true' or 'false')

**What it does:**
- Controls analytics tracking (Firebase, custom analytics, etc.)
- When `false`: No analytics events sent
- When `true`: Full analytics tracking

**Usage in `.env`:**
```bash
# Disable analytics
ENABLE_ANALYTICS=false

# Enable analytics (default)
ENABLE_ANALYTICS=true
```

**Note:** Placeholder for future analytics integration.

---

## 🚀 Common Scenarios

### Scenario 1: Publishing WITHOUT AdMob Account

**Your situation:** First app release, AdMob account not yet approved

**`.env` configuration:**
```bash
ENABLE_ADS=false
ENABLE_SUBSCRIPTIONS=true
ENABLE_ANALYTICS=true

# AdMob IDs can stay as placeholders
ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_IOS_BANNER_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_ANDROID_REWARDED_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_ANDROID_BANNER_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
```

**What happens:**
- ✅ App works perfectly without ads
- ✅ Subscriptions work normally
- ✅ No AdMob errors or crashes
- ✅ Premium features still gated properly
- ✅ Users can subscribe for premium access

**To enable ads later:**
1. Get approved for AdMob
2. Create ad units in AdMob dashboard
3. Copy real ad unit IDs
4. Update `.env` file:
   ```bash
   ENABLE_ADS=true
   ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-YOUR-REAL-ID/YYYYYY
   ADMOB_IOS_BANNER_AD_ID=ca-app-pub-YOUR-REAL-ID/ZZZZZZ
   # ... etc
   ```
5. Build new app version
6. Upload to App Store / Play Store
7. **No code changes needed!**

---

### Scenario 2: Publishing WITH AdMob Account

**Your situation:** AdMob approved, have real ad unit IDs

**`.env` configuration:**
```bash
ENABLE_ADS=true
ENABLE_SUBSCRIPTIONS=true
ENABLE_ANALYTICS=true

# Real AdMob IDs
ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-1234567890123456/1111111111
ADMOB_IOS_BANNER_AD_ID=ca-app-pub-1234567890123456/2222222222
ADMOB_ANDROID_REWARDED_AD_ID=ca-app-pub-1234567890123456/3333333333
ADMOB_ANDROID_BANNER_AD_ID=ca-app-pub-1234567890123456/4444444444
```

**What happens:**
- ✅ Full ad functionality enabled
- ✅ Banner ads display on screens
- ✅ Users can watch rewarded ads for premium features
- ✅ Ad revenue starts flowing

---

### Scenario 3: Development Testing

**Your situation:** Testing the app during development

**`.env` configuration:**
```bash
# Test without any monetization
ENABLE_ADS=false
ENABLE_SUBSCRIPTIONS=false
ENABLE_ANALYTICS=false

# Or test with ads but not subscriptions
ENABLE_ADS=true
ENABLE_SUBSCRIPTIONS=false
ENABLE_ANALYTICS=true
```

**Benefits:**
- Test different feature combinations
- Faster development without ad delays
- No need to configure real API keys during development

---

## 🔧 Implementation Details

### How Feature Flags Work

**1. Environment Variable → TypeScript**

`.env` file:
```bash
ENABLE_ADS=false
```

`types/env.d.ts`:
```typescript
declare module '@env' {
  export const ENABLE_ADS: string; // Note: always string from .env
}
```

**2. Parse in Config File**

```typescript
import { ENABLE_ADS } from '@env';

// Convert string to boolean
export const ADS_ENABLED = ENABLE_ADS?.toLowerCase() === 'true';
```

**3. Use in Services**

```typescript
import { ADS_ENABLED } from './adConfig';

async function loadAd() {
  if (!ADS_ENABLED) {
    console.log('Ads disabled');
    return;
  }
  // ... load ad normally
}
```

**4. Use in Components**

```typescript
import { ADS_ENABLED } from '../services/ads';

function BannerAdContainer() {
  if (!ADS_ENABLED) {
    return null; // Don't render ad component
  }
  return <BannerAd />;
}
```

---

## ✅ Testing Checklist

### Before Publishing Without Ads

- [ ] Set `ENABLE_ADS=false` in `.env`
- [ ] Build the app
- [ ] Verify banner ads don't appear
- [ ] Test premium features (should still require subscription)
- [ ] Check that app doesn't crash when trying to show ads
- [ ] Verify subscriptions work normally

### Before Enabling Ads

- [ ] Get AdMob account approved
- [ ] Create ad units for:
  - [ ] iOS Rewarded Ad
  - [ ] iOS Banner Ad
  - [ ] Android Rewarded Ad
  - [ ] Android Banner Ad
- [ ] Copy ad unit IDs to `.env`
- [ ] Set `ENABLE_ADS=true`
- [ ] Test on real devices (both iOS and Android)
- [ ] Verify ads load and display correctly
- [ ] Test rewarded ad flow (watch ad → get reward)
- [ ] Check AdMob dashboard for impressions

---

## 📝 Environment File Example

**Complete `.env` for initial publish (no AdMob):**

```bash
# ==========================================
# SUPABASE CONFIGURATION
# ==========================================
REACT_NATIVE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
REACT_NATIVE_SUPABASE_ANON_KEY=your-anon-key-here

# ==========================================
# REVENUECAT CONFIGURATION
# ==========================================
REVENUECAT_IOS_API_KEY=appl_fHVAlcXwjKGJoEfGHPKLIPRwHFO
REVENUECAT_ANDROID_API_KEY=goog_HemfImbSCkMNhXPCzSZdEeWggpB

# ==========================================
# GOOGLE MOBILE ADS (ADMOB)
# ==========================================
# 🎯 DISABLED for initial publish - will enable once AdMob approved
ENABLE_ADS=false

# Placeholder IDs - will replace with real values later
ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_IOS_BANNER_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_ANDROID_REWARDED_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy
ADMOB_ANDROID_BANNER_AD_ID=ca-app-pub-xxxxxxxx/yyyyyyyy

# ==========================================
# APP CONFIGURATION
# ==========================================
APP_ENV=production
DEBUG_LOGGING=false

# ==========================================
# FEATURE FLAGS
# ==========================================
ENABLE_SUBSCRIPTIONS=true
ENABLE_ANALYTICS=true
```

---

## 🔄 Updating Production App

### Steps to Enable Ads in Live App:

1. **Update `.env` file:**
   ```bash
   ENABLE_ADS=true
   ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-your-real-id/123456
   # ... add all real ad unit IDs
   ```

2. **Clear Metro cache:**
   ```bash
   npm start -- --reset-cache
   ```

3. **Build production app:**
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npm run ios --configuration Release
   
   # Android
   npm run android --variant release
   ```

4. **Test thoroughly:**
   - Test ads on real devices
   - Verify ad impressions in AdMob dashboard
   - Check that revenue tracking works

5. **Submit update to stores:**
   - Upload to App Store Connect (iOS)
   - Upload to Google Play Console (Android)
   - No app review needed (just binary update)

---

## 🎓 Best Practices

### DO ✅
- **Use feature flags for gradual rollout**
- **Test with flags disabled first**
- **Document why each flag is set**
- **Keep `.env.example` updated with comments**
- **Test all flag combinations before release**

### DON'T ❌
- **Don't commit `.env` to git** (use `.env.example` instead)
- **Don't hardcode flag values** (always use environment variables)
- **Don't skip testing** when changing flags
- **Don't forget to clear Metro cache** after `.env` changes
- **Don't assume flags are boolean** (they're strings, convert them)

---

## 🐛 Troubleshooting

### Issue: Changed `.env` but app behavior didn't change

**Solution:**
```bash
# Kill Metro bundler (Ctrl+C)
# Clear cache and restart
npm start -- --reset-cache
```

### Issue: Ads still trying to load when ENABLE_ADS=false

**Problem:** String comparison might be failing

**Check:**
```typescript
// Make sure you're doing lowercase comparison
const ADS_ENABLED = ENABLE_ADS?.toLowerCase() === 'true';

// NOT this:
const ADS_ENABLED = ENABLE_ADS === 'true'; // Might fail if 'TRUE'
```

### Issue: TypeScript error "Cannot find module '@env'"

**Solution:**
1. Check `types/env.d.ts` exists
2. Verify `babel.config.js` has `react-native-dotenv` plugin
3. Restart TypeScript server in VS Code

---

## 📚 Related Files

- `.env` - Your environment variables (never commit)
- `.env.example` - Template for developers
- `types/env.d.ts` - TypeScript definitions
- `src/services/ads/adConfig.ts` - Ad feature flag logic
- `src/services/purchases/revenueCatConfig.ts` - Subscription feature flag
- `ENVIRONMENT_SETUP.md` - Full environment setup guide

---

## 🎯 Summary

**For your use case (publish without AdMob):**

1. Set `ENABLE_ADS=false` in `.env`
2. Build and publish your app
3. Get AdMob account approved
4. Update `.env` with real ad IDs and set `ENABLE_ADS=true`
5. Build and push update
6. **Zero code changes required!** ✨

This gives you the flexibility to monetize later without any code modifications - just configuration changes!
