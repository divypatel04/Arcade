import React from 'react';
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
import { REVENUECAT_API_KEY } from '@env';



const queryClient = new QueryClient()

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const configPurchases = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      if (Platform.OS === 'ios') {
        Purchases.configure({apiKey: REVENUECAT_API_KEY});
      } else if (Platform.OS === 'android') {
        Purchases.configure({apiKey: REVENUECAT_API_KEY});
     }
    } catch (r) {}
  };


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
