import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, DataProvider } from '@context';
import { RootNavigator } from '@navigation';
import { colors } from '@theme';
import { ErrorBoundary } from '@components/common/ErrorBoundary';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize services when they're implemented
    const initializeServices = async () => {
      try {
        // TODO: Initialize premium and ads services
        // await Promise.all([
        //   premiumService.initialize(),
        //   adsService.initialize(),
        // ]);
        console.log('App initialized');
      } catch (error) {
        console.error('Service initialization error:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.background}
            />
            <RootNavigator />
          </DataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

