import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreen } from '@screens';
import type { AuthStackParamList } from './types';
import { colors } from '@theme';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
