import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  return (
    <>
    {/* <SafeAreaView style={backgroundStyle}> */}
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'rgba(52, 52, 52, 0)'}
      />
      <HomeScreen/>
    {/* </SafeAreaView> */}
    </>
  );
}

export default App;
