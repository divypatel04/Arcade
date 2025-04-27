import React, { useRef } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@context';
import { View, Image, StatusBar, ActivityIndicator, Text, StyleSheet } from 'react-native';
import LoadingScreen from '@screens/LoadingScreen';
import BottomTabs from './BottomTabs';
import OnboardingScreen from '@screens/OnboardingScreen';
import { colors, fonts } from '@theme';
import AgentListScreen from '@screens/AgentListScreen';
import MapListScreen from '@screens/MapListScreen';
import WeaponListScreen from '@screens/WeaponListScreen';
import AgentInfoScreen from '@screens/AgentInfoScreen';
import MapInfoScreen from '@screens/MapInfoScreen';
import WeaponInfoScreen from '@screens/WeaponInfoScreen';
import MatchInfoScreen from '@screens/MatchInfoScreen';
import PremiumSubscriptionScreen from '@screens/PremiumSubscriptionScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const { isAuthenticated, authStatusChecked } = useAuth();
  const navigationRef =
    useNavigationContainerRef<ReactNavigation.RootParamList>();
  const routeNameRef = useRef<any>("");

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
      <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabs}
            />
            <Stack.Screen name="AgentListScreen" component={AgentListScreen} />
            <Stack.Screen name="MapListScreen" component={MapListScreen} />
            <Stack.Screen name="WeaponListScreen" component={WeaponListScreen} />
            <Stack.Screen name="AgentInfoScreen" component={AgentInfoScreen} />
            <Stack.Screen name="MapInfoScreen" component={MapInfoScreen} />
            <Stack.Screen name="WeaponInfoScreen" component={WeaponInfoScreen} />
            <Stack.Screen name="MatchInfoScreen" component={MatchInfoScreen} />
            <Stack.Screen name="PremiumSubscriptionScreen" component={PremiumSubscriptionScreen} />
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
    textTransform: 'lowercase',
    paddingTop: 8,
  },
});