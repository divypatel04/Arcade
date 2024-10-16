import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import AgentListScreen from './src/screens/AgentListScreen';
import MapListScreen from './src/screens/MapListScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  return (
    <>
    <NavigationContainer>
    {/* <SafeAreaView style={backgroundStyle}> */}
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'rgba(52, 52, 52, 0)'}
      />
      {/* <AgentListScreen/> */}
      <MapListScreen />
      {/* <BottomTabs/> */}
    {/* </SafeAreaView> */}
    </NavigationContainer>
    </>
  );
}

export default App;
