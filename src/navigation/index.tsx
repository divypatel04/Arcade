import React, {useRef} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import {View, Image, StatusBar, ActivityIndicator, Text, StyleSheet} from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';
import BottomTabs from './BottomTabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import { colors, fonts } from '../theme';

const Stack = createStackNavigator();

export default function Navigation() {
  const {isAuthenticated, authStatusChecked} = useAuth();
  const navigationRef =
    useNavigationContainerRef<ReactNavigation.RootParamList>();
  const routeNameRef = useRef<any>();

  if (!authStatusChecked) {
    return (
      <View style={styles.wrapper}>
            <StatusBar backgroundColor="white" barStyle={'dark-content'} />
            <Image
              style={styles.logo}
              source={require('../assets/images/logo_black.png')}
            />
            <ActivityIndicator size="small" color={'#000'} />
            <Text style={styles.text}>Loading...</Text>
          </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        routeNameRef.current = currentRouteName;
      }}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#fff',
        },
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabs}
            />
          </>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: '75%',
    height: '20%',
    resizeMode: 'contain',
  },
  text: {
    fontFamily: fonts.family.novecentoUltraBold,
    color: colors.black,
    fontSize: 20,
    textTransform:'lowercase',
    paddingTop: 8,
  },
});