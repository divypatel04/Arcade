import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Data types
export interface AgentStats {
  agentId: string;
  agentName: string;
  agentIcon: string;
  role: 'duelist' | 'controller' | 'initiator' | 'sentinel';
  matches: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  winRate: number;
  kd: number;
  averageScore: number;
  headshots: number;
  headshotPercentage: number;
}

export interface MapStats {
  mapId: string;
  mapName: string;
  mapImage: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  kd: number;
  attackWins: number;
  defenseWins: number;
}

export interface WeaponStats {
  weaponId: string;
  weaponName: string;
  weaponType: 'rifle' | 'smg' | 'shotgun' | 'sniper' | 'pistol' | 'heavy';
  kills: number;
  headshots: number;
  headshotPercentage: number;
  bodyshots: number;
  legshots: number;
  accuracy: number;
  damage: number;
}

export interface Match {
  matchId: string;
  map: string;
  mapImage: string;
  mode: 'competitive' | 'unrated' | 'deathmatch' | 'spike rush';
  date: string;
  result: 'victory' | 'defeat' | 'draw';
  score: string;
  duration: string;
  agent: string;
  kills: number;
  deaths: number;
  assists: number;
  combatScore: number;
  rank: string;
  rr: number;
  rrChange?: number;
}

export interface SeasonStats {
  seasonId: string;
  seasonName: string;
  act: number;
  currentRank: string;
  currentRR: number;
  peakRank: string;
  wins: number;
  losses: number;
  winRate: number;
  kd: number;
  averageScore: number;
  matches: number;
}

export interface UserProfile {
  riotId: string;
  gameName: string;
  tagLine: string;
  region: string;
  accountLevel: number;
  currentRank: string;
  currentRR: number;
  peakRank: string;
  profileIcon: string;
  bannerImage?: string;
}

interface DataState {
  profile: UserProfile | null;
  currentSeason: SeasonStats | null;
  seasons: SeasonStats[];
  agents: AgentStats[];
  maps: MapStats[];
  weapons: WeaponStats[];
  matches: Match[];
  recentMatches: Match[];
}

interface DataContextType {
  data: DataState;
  isLoading: boolean;
  error: string | null;
  selectedSeason: string;
  setSelectedSeason: (seasonId: string) => void;
  refreshData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshMatches: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const initialState: DataState = {
  profile: null,
  currentSeason: null,
  seasons: [],
  agents: [],
  maps: [],
  weapons: [],
  matches: [],
  recentMatches: [],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DataState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('current');

  // Load data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data on logout
      setData(initialState);
    }
  }, [isAuthenticated, user]);

  // Refresh data when season changes
  useEffect(() => {
    if (isAuthenticated && user && selectedSeason) {
      refreshStats();
    }
  }, [selectedSeason]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await Promise.all([
        refreshProfile(),
        refreshMatches(),
        refreshStats(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Data refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      // TODO: Fetch actual profile data from API
      // For now, using mock data
      const mockProfile: UserProfile = {
        riotId: user?.riotId || '',
        gameName: user?.gameName || '',
        tagLine: user?.tagLine || '',
        region: user?.region || 'na1',
        accountLevel: 150,
        currentRank: 'Diamond 2',
        currentRR: 45,
        peakRank: 'Immortal 1',
        profileIcon: '',
      };

      setData(prev => ({ ...prev, profile: mockProfile }));
    } catch (err) {
      console.error('Profile refresh error:', err);
      throw err;
    }
  };

  const refreshMatches = async () => {
    try {
      // TODO: Fetch actual match data from API
      // For now, using mock data
      const mockMatches: Match[] = [
        {
          matchId: '1',
          map: 'Ascent',
          mapImage: '',
          mode: 'competitive',
          date: new Date().toISOString(),
          result: 'victory',
          score: '13-7',
          duration: '42:18',
          agent: 'Jett',
          kills: 24,
          deaths: 15,
          assists: 4,
          combatScore: 328,
          rank: 'Diamond 2',
          rr: 45,
          rrChange: 23,
        },
      ];

      setData(prev => ({
        ...prev,
        matches: mockMatches,
        recentMatches: mockMatches.slice(0, 5),
      }));
    } catch (err) {
      console.error('Matches refresh error:', err);
      throw err;
    }
  };

  const refreshStats = async () => {
    try {
      // TODO: Fetch actual stats data from API
      // For now, using mock data
      const mockSeason: SeasonStats = {
        seasonId: 'e8a3',
        seasonName: 'Episode 8 Act 3',
        act: 3,
        currentRank: 'Diamond 2',
        currentRR: 45,
        peakRank: 'Immortal 1',
        wins: 54,
        losses: 46,
        winRate: 54.0,
        kd: 1.32,
        averageScore: 245,
        matches: 100,
      };

      const mockAgents: AgentStats[] = [
        {
          agentId: 'jett',
          agentName: 'Jett',
          agentIcon: '',
          role: 'duelist',
          matches: 45,
          wins: 28,
          kills: 892,
          deaths: 654,
          assists: 234,
          winRate: 62.2,
          kd: 1.36,
          averageScore: 267,
          headshots: 254,
          headshotPercentage: 28.5,
        },
      ];

      const mockMaps: MapStats[] = [
        {
          mapId: 'ascent',
          mapName: 'Ascent',
          mapImage: '',
          matches: 23,
          wins: 14,
          losses: 9,
          winRate: 60.9,
          kills: 458,
          deaths: 342,
          kd: 1.34,
          attackWins: 8,
          defenseWins: 6,
        },
      ];

      const mockWeapons: WeaponStats[] = [
        {
          weaponId: 'vandal',
          weaponName: 'Vandal',
          weaponType: 'rifle',
          kills: 892,
          headshots: 254,
          headshotPercentage: 28.5,
          bodyshots: 478,
          legshots: 160,
          accuracy: 22.3,
          damage: 142850,
        },
      ];

      setData(prev => ({
        ...prev,
        currentSeason: mockSeason,
        seasons: [mockSeason],
        agents: mockAgents,
        maps: mockMaps,
        weapons: mockWeapons,
      }));
    } catch (err) {
      console.error('Stats refresh error:', err);
      throw err;
    }
  };

  const value: DataContextType = {
    data,
    isLoading,
    error,
    selectedSeason,
    setSelectedSeason,
    refreshData,
    refreshProfile,
    refreshMatches,
    refreshStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
