import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { AuthProvider } from './src/context/AuthContext';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  return (
    <>
    <AuthProvider>
    <NavigationContainer>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'rgba(52, 52, 52, 0)'}
      />
      {/* <BottomTabs/> */}
      <OnboardingScreen/>
    </NavigationContainer>
    </AuthProvider>
    </>
  );
}

export default App;
