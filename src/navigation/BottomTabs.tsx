import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { Icon } from '../components/lcon';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SeasonInfoScreen from '../screens/SeasonInfoScreen';
import MatchListScreen from '../screens/MatchListScreen';

const BottomTab = createBottomTabNavigator();

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


const SCREENS = [
  {
    name: 'HomeScreen',
    component: HomeScreen,
    icons: ['home-fill', 'home-line'],
  },
  {
    name: 'MatchListScreen',
    component: MatchListScreen,
    icons: ['shopping-basket-2-fill', 'shopping-basket-2-line'],
  },
  {
    name: 'SeasonInfoScreen',
    component: SeasonInfoScreen,
    icons: ['bar-chart-2-fill', 'bar-chart-2-line'],
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
    icons: ['user-fill', 'user-line'],
  },
];

export default function BottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
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
