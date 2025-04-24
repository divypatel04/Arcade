import React, { useEffect } from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';
import { DataProvider } from './src/context/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './src/context/LanguageContext';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { REVENUECAT_ANDROID_API_KEY, REVENUECAT_IOS_API_KEY } from '@env';
import mobileAds from 'react-native-google-mobile-ads';

const queryClient = new QueryClient()

function App(): React.JSX.Element {

  const configPurchases = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      if (Platform.OS === 'ios') {
        Purchases.configure({apiKey: REVENUECAT_IOS_API_KEY});
      } else if (Platform.OS === 'android') {
        Purchases.configure({apiKey: REVENUECAT_ANDROID_API_KEY});
     }
    } catch (r) {}
  };

  useEffect(() => {
    configPurchases();

    // Initialize mobile ads
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Mobile Ads initialized:', adapterStatuses);
      });
  }, []);


  return (
    <>
    <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <DataProvider>
      <AuthProvider>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'rgba(52, 52, 52, 0)'}
        />
        <Navigation />
      </AuthProvider>
      </DataProvider>
    </LanguageProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
