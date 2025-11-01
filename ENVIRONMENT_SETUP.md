# Environment Variable Setup Guide

## Overview
This app uses environment variables to store sensitive configuration like API keys. This guide explains how to set up environment variables for the Arcade app.

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install react-native-dotenv
```

Or if using yarn:
```bash
yarn add react-native-dotenv
```

### 2. Update babel.config.js

Add the `react-native-dotenv` plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
```

### 3. Create .env File

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env` with your actual API keys:

```bash
# Supabase - Get from https://app.supabase.com/project/_/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# RevenueCat - Get from https://app.revenuecat.com/projects/
REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxxxxx
REVENUECAT_ANDROID_API_KEY=goog_xxxxxxxxxxxxxxxxxxxxxxxx

# AdMob - Get from https://apps.admob.com
ADMOB_IOS_REWARDED_AD_ID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_IOS_BANNER_AD_ID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_ANDROID_REWARDED_AD_ID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_ANDROID_BANNER_AD_ID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY

# App Config
APP_ENV=development
DEBUG_LOGGING=true
```

### 4. Verify .gitignore

Make sure `.env` is in your `.gitignore` file (it should already be):

```
# Environment variables
.env
.env.local
.env.*.local
```

**NEVER commit .env to git!**

### 5. Clean and Rebuild

After adding environment variables, you need to clean and rebuild:

```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# iOS
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

## Usage in Code

### Import the ENV object

```typescript
import { ENV } from '@/config/env';

// Access environment variables
const supabaseUrl = ENV.SUPABASE_URL;
const isProduction = ENV.IS_PRODUCTION;
const debugMode = ENV.DEBUG_LOGGING;
```

### Validate on Startup

In your `App.tsx` or main entry point:

```typescript
import { validateEnv } from '@/config/env';

// Call this early in app initialization
validateEnv();
```

This will throw an error if any required environment variables are missing, preventing runtime issues.

## Migration Checklist

Update these files to use `ENV` instead of hardcoded values:

- [ ] `src/lib/supabase.ts` - Use `ENV.SUPABASE_URL` and `ENV.SUPABASE_ANON_KEY`
- [ ] `src/services/purchases/revenueCatConfig.ts` - Use `ENV.REVENUECAT_IOS_API_KEY` and `ENV.REVENUECAT_ANDROID_API_KEY`
- [ ] `src/services/ads/adConfig.ts` - Use `ENV.ADMOB_*` constants
- [ ] `App.tsx` - Add `validateEnv()` call at startup

## Environment-Specific Configuration

### Development
```bash
APP_ENV=development
DEBUG_LOGGING=true
```

### Staging
```bash
APP_ENV=staging
DEBUG_LOGGING=true
```

### Production
```bash
APP_ENV=production
DEBUG_LOGGING=false
```

## Troubleshooting

### "Module '@env' has no exported member"
- Make sure you've updated `babel.config.js`
- Restart Metro bundler with `--reset-cache`
- Restart TypeScript server in VS Code

### Environment variables not loading
- Check that `.env` file exists in project root
- Verify `babel.config.js` is configured correctly
- Clear Metro cache: `npm start -- --reset-cache`
- Rebuild the app completely

### TypeScript errors on ENV imports
- Make sure `types/env.d.ts` exists
- Restart TypeScript server in VS Code
- Check that types are declared in `tsconfig.json` includes

## Security Best Practices

1. **Never commit .env** - It's in .gitignore for a reason
2. **Use different keys per environment** - Don't use prod keys in dev
3. **Rotate keys periodically** - Change API keys every 6-12 months
4. **Limit key permissions** - Use least-privilege principle
5. **Monitor key usage** - Check for unusual activity in service dashboards

## Production Deployment

### iOS (TestFlight/App Store)
Set environment variables in Xcode scheme or use fastlane:
- Build configurations for Debug/Release
- Different .env files per configuration

### Android (Play Store)
Set environment variables in `android/gradle.properties` or use fastlane:
- Build variants for debug/release
- Different .env files per variant

## Additional Resources

- [react-native-dotenv docs](https://github.com/goatandsheep/react-native-dotenv)
- [Supabase API keys](https://supabase.com/docs/guides/api)
- [RevenueCat API keys](https://www.revenuecat.com/docs/welcome)
- [AdMob setup](https://developers.google.com/admob/ios/quick-start)
