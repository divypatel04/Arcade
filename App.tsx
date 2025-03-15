import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';
import { DataProvider } from './src/context/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Clipboard from "@react-native-clipboard/clipboard";
import { DevToolsBubble } from 'react-native-react-query-devtools';

const onCopy = async (text: string) => {
  try {
    await Clipboard.setString(text);
    return true;
  } catch {
    return false;
  }
};

const queryClient = new QueryClient()

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setString(text);
      return true;
    } catch {
      return false;
    }
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
    <DevToolsBubble onCopy={onCopy} />
    </QueryClientProvider>
    </>
  );
}

export default App;
