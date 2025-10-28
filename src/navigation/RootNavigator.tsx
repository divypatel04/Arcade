import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Linking } from 'react-native';
import { useAuth } from '@context';
import { LoadingScreen } from '@screens';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';
import { colors } from '@theme';
import { authService } from '@services/auth.service';
import { fadeTransition } from './transitions';

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['arcadeapp://', 'https://arcade.app'],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
      Loading: 'loading',
    },
  },
};

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Handle deep linking for OAuth callback
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      
      // Check if it's an OAuth callback
      if (url.includes('auth/callback')) {
        try {
          const { authState, user } = await authService.handleOAuthCallback(url);
          await login(authState, user);
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      }
    };

    // Listen for deep link events
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [login]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          ...fadeTransition,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
