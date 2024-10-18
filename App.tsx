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
import WeaponListScreen from './src/screens/WeaponListScreen';
import AgentInfoScreen from './src/screens/AgentInfoScreen';
import MapInfoScreen from './src/screens/MapInfoScreen';
import WeaponInfoScreen from './src/screens/WeaponInfoScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
      {/* <AgentInfoScreen/> */}
      {/* <MapInfoScreen/> */}
      {/* <ProfileScreen/> */}
      {/* <MapListScreen/> */}
      <BottomTabs/>
    {/* </SafeAreaView> */}
    </NavigationContainer>
    </>
  );
}

export default App;
