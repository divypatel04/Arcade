import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  HomeScreen,
  ProfileScreen,
  AgentsListScreen,
  AgentDetailScreen,
  MapsListScreen,
  MapDetailScreen,
  WeaponsListScreen,
  WeaponDetailScreen,
  MatchesListScreen,
  MatchDetailScreen,
} from '@screens';
import type {
  MainTabParamList,
  AgentsStackParamList,
  MapsStackParamList,
  WeaponsStackParamList,
  MatchesStackParamList,
} from './types';
import { colors, fonts } from '@theme';
import { slideFromRight, fadeTransition } from './transitions';

const Tab = createBottomTabNavigator<MainTabParamList>();
const AgentsStack = createStackNavigator<AgentsStackParamList>();
const MapsStack = createStackNavigator<MapsStackParamList>();
const WeaponsStack = createStackNavigator<WeaponsStackParamList>();
const MatchesStack = createStackNavigator<MatchesStackParamList>();

// Stack Navigators for each tab
const AgentsNavigator = () => (
  <AgentsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: fonts.styles.h5,
    }}
  >
    <AgentsStack.Screen 
      name="AgentsList" 
      component={AgentsListScreen}
      options={{ title: 'Agents' }}
    />
    <AgentsStack.Screen 
      name="AgentDetail" 
      component={AgentDetailScreen}
      options={({ route }) => ({ title: route.params.agentName })}
    />
  </AgentsStack.Navigator>
);

const MapsNavigator = () => (
  <MapsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: fonts.styles.h5,
    }}
  >
    <MapsStack.Screen 
      name="MapsList" 
      component={MapsListScreen}
      options={{ title: 'Maps' }}
    />
    <MapsStack.Screen 
      name="MapDetail" 
      component={MapDetailScreen}
      options={({ route }) => ({ title: route.params.mapName })}
    />
  </MapsStack.Navigator>
);

const WeaponsNavigator = () => (
  <WeaponsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: fonts.styles.h5,
    }}
  >
    <WeaponsStack.Screen 
      name="WeaponsList" 
      component={WeaponsListScreen}
      options={{ title: 'Weapons' }}
    />
    <WeaponsStack.Screen 
      name="WeaponDetail" 
      component={WeaponDetailScreen}
      options={({ route }) => ({ title: route.params.weaponName })}
    />
  </WeaponsStack.Navigator>
);

const MatchesNavigator = () => (
  <MatchesStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: fonts.styles.h5,
    }}
  >
    <MatchesStack.Screen 
      name="MatchesList" 
      component={MatchesListScreen}
      options={{ title: 'Matches' }}
    />
    <MatchesStack.Screen 
      name="MatchDetail" 
      component={MatchDetailScreen}
      options={{ title: 'Match Details' }}
    />
  </MatchesStack.Navigator>
);

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.gray700,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: {
          ...fonts.styles.caption,
          fontWeight: fonts.weights.medium,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agents"
        component={AgentsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={MapsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Weapons"
        component={WeaponsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="pistol" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
