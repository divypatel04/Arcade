import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme';
import { Icon } from '../components/lcon';
import HomeScreen from '../screens/HomeScreen';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack navigator
function HomeStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Career stack navigator
function CareerStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Act stack navigator
function ActStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Profile stack navigator
function ProfileStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Move the screen options outside of the component to avoid re-creation on each render
const SCREEN_OPTIONS = {
  tabBarActiveTintColor: colors.white,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 10,
  },
  tabBarInactiveTintColor: colors.primary,
  tabBarHideOnKeyboard: true,
  headerShown: false,
};

// Extract repeated logic into a helper function
const createTabBarIcon =
  (focusedIconName: string, unfocusedIconName: string) =>
  ({ color, focused }: any) =>
    (
      <Icon
        name={focused ? focusedIconName : unfocusedIconName}
        size={22}
        color={color}
      />
    );

// Define the screens for bottom tabs with individual stack navigators
const SCREENS = [
  {
    name: 'Home',
    component: HomeStackScreen,
    icons: ['home-fill', 'home-line'],
  },
  {
    name: 'Career',
    component: CareerStackScreen,
    icons: ['shopping-basket-2-fill', 'shopping-basket-2-line'],
  },
  {
    name: 'Act',
    component: ActStackScreen,
    icons: ['bar-chart-2-fill', 'bar-chart-2-line'],
  },
  {
    name: 'Profile',
    component: ProfileStackScreen,
    icons: ['user-fill', 'user-line'],
  },
];

export default function BottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={SCREEN_OPTIONS as any}>
      {SCREENS.map(({ name, component, icons }) => (
        <BottomTab.Screen
          key={name}
          name={name}
          component={component}
          options={{ tabBarIcon: createTabBarIcon(icons[0], icons[1]) }}
        />
      ))}
    </BottomTab.Navigator>
  );
}
