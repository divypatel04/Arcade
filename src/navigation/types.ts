import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Param List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Loading: undefined;
};

// Auth Stack Param List
export type AuthStackParamList = {
  Onboarding: undefined;
};

// Main Tab Param List
export type MainTabParamList = {
  Home: undefined;
  Agents: NavigatorScreenParams<AgentsStackParamList>;
  Maps: NavigatorScreenParams<MapsStackParamList>;
  Weapons: NavigatorScreenParams<WeaponsStackParamList>;
  Matches: NavigatorScreenParams<MatchesStackParamList>;
  Profile: undefined;
};

// Agents Stack Param List
export type AgentsStackParamList = {
  AgentsList: undefined;
  AgentDetail: {
    agentId: string;
    agentName: string;
  };
};

// Maps Stack Param List
export type MapsStackParamList = {
  MapsList: undefined;
  MapDetail: {
    mapId: string;
    mapName: string;
  };
};

// Weapons Stack Param List
export type WeaponsStackParamList = {
  WeaponsList: undefined;
  WeaponDetail: {
    weaponId: string;
    weaponName: string;
  };
};

// Matches Stack Param List
export type MatchesStackParamList = {
  MatchesList: undefined;
  MatchDetail: {
    matchId: string;
  };
};

// Declare navigation types globally
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
