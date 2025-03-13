import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';
import { DataProvider } from './src/context/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <DataProvider>
    <AuthProvider>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'rgba(52, 52, 52, 0)'}
      />
      <Navigation />
    </AuthProvider>
    </DataProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
