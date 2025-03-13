import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { AgentStatType } from '../types/AgentStatsType';
import { MapStatsType } from '../types/MapStatsType';
import { WeaponStatType } from '../types/WeaponStatsType';
import { SeasonStatsType } from '../types/SeasonStatsType';
import { MatchStatType } from '../types/MatchStatType';

type UserData = {
  puuid: string;
  region: string;
  name: string;
  tagline: string;
  createdAt: string;
  lastUpdated: string;
  matchesId: string[];
};

interface DataContextState {
  userData: UserData | null;
  agentStats: AgentStatType | null;
  mapStats: MapStatsType | null;
  weaponStats: WeaponStatType | null;
  seasonStats: SeasonStatsType[] | null;
  matchStats: MatchStatType[] | null;
  isLoading: boolean;
  error: Error | null;
  isDataReady: boolean;
}

interface DataContextValue extends DataContextState {
  fetchUserData: (puuid: string) => Promise<void>;
}

// Create QueryClient with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 2000,
    },
  },
});

// Create context
const DataContext = createContext<DataContextValue | undefined>(undefined);

// Initial state
const initialState: DataContextState = {
  userData: null,
  agentStats: null,
  mapStats: null,
  weaponStats: null,
  seasonStats: null,
  matchStats: null,
  isLoading: false,
  error: null,
  isDataReady: false,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClientInstance = useQueryClient();
  const [state, setState] = useState<DataContextState>(initialState);
  const [currentPuuid, setCurrentPuuid] = useState<string | null>(null);
  const subscriptionRef = useRef<{ [key: string]: () => void }>({});

  // Helper function to handle API errors consistently
  const handleApiError = (error: any, resourceName: string) => {
    if (error?.message?.includes('contains 0 rows') || !error) {
      console.log(`No ${resourceName} found for this user`);
      return null;
    }
    throw error;
  };

  // Setup real-time subscriptions
  const setupSubscriptions = useCallback((puuid: string) => {
    // Clean up existing subscriptions first
    Object.values(subscriptionRef.current).forEach(unsub => unsub());
    subscriptionRef.current = {};

    const tables = ['agentstats', 'mapstats', 'weaponstats', 'seasonstats', 'matchstats'];

    tables.forEach(table => {
      const channel = supabase.channel(`${table}-changes-${puuid}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table, filter: `puuid=eq.${puuid}` },
          () => {
            queryClientInstance.invalidateQueries({ queryKey: [table.toLowerCase(), puuid] });
          }
        )
        .subscribe();

      subscriptionRef.current[table] = () => {
        channel.unsubscribe();
      };
    });
  }, [queryClientInstance]);

  // Fetch user data function
  const fetchUserData = useCallback(async (puuid: string) => {
    console.log('🚀 Starting data fetch for PUUID:', puuid);

    setState(prev => ({ ...prev, isLoading: true, error: null, isDataReady: false }));
    setCurrentPuuid(puuid);

    try {
      // Fetch user data first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('puuid', puuid)
        .single();

      if (userError) throw new Error(`Failed to fetch user data: ${userError.message}`);
      if (!userData) throw new Error('User not found');

      console.log('✅ User data fetched:', userData);

      // Update state with user data
      setState(prev => ({
        ...prev,
        userData: userData as UserData,
      }));

      // Setup subscriptions
      setupSubscriptions(puuid);

      // Separately fetch other data
      await Promise.all([
        fetchAgentStats(puuid),
        fetchMapStats(puuid),
        fetchWeaponStats(puuid),
        fetchSeasonStats(puuid),
        fetchMatchStats(puuid)
      ]);

      // Mark data as ready
      setState(prev => ({
        ...prev,
        isLoading: false,
        isDataReady: true,
      }));

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
        isDataReady: false,
      }));
    }
  }, [setupSubscriptions]);

  // Individual data fetching functions
  const fetchAgentStats = async (puuid: string) => {
    try {
      console.log('📊 Fetching agent stats...');
      const { data, error } = await supabase
        .from('agentstats')
        .select('*')
        .eq('puuid', puuid);

      if (error || !data || data.length === 0) {
        handleApiError(error, 'agent stats');
        setState(prev => ({ ...prev, agentStats: null }));
        return;
      }

      const record = data[0];
      console.log('✅ Agent stats fetched');

      const agentStats = {
        playerId: record.puuid,
        agent: record.agent,
        performanceBySeason: record.performancebyseason || []
      } as AgentStatType;

      setState(prev => ({ ...prev, agentStats }));
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      setState(prev => ({ ...prev, agentStats: null }));
    }
  };

  const fetchMapStats = async (puuid: string) => {
    try {
      console.log('📊 Fetching map stats...');
      const { data, error } = await supabase
        .from('mapstats')
        .select('*')
        .eq('puuid', puuid);

      if (error || !data || data.length === 0) {
        handleApiError(error, 'map stats');
        setState(prev => ({ ...prev, mapStats: null }));
        return;
      }

      const record = data[0];
      console.log('✅ Map stats fetched');

      const mapStats = {
        playerId: record.puuid,
        map: record.map,
        performanceBySeason: record.performancebyseason || []
      } as MapStatsType;

      setState(prev => ({ ...prev, mapStats }));
    } catch (error) {
      console.error('Error fetching map stats:', error);
      setState(prev => ({ ...prev, mapStats: null }));
    }
  };

  const fetchWeaponStats = async (puuid: string) => {
    try {
      console.log('📊 Fetching weapon stats...');
      const { data, error } = await supabase
        .from('weaponstats')
        .select('*')
        .eq('puuid', puuid);

      if (error || !data || data.length === 0) {
        handleApiError(error, 'weapon stats');
        setState(prev => ({ ...prev, weaponStats: null }));
        return;
      }

      const record = data[0];
      console.log('✅ Weapon stats fetched');

      const weaponStats = {
        playerId: record.puuid,
        weapon: record.weapon,
        performanceBySeason: record.performancebyseason || []
      } as WeaponStatType;

      setState(prev => ({ ...prev, weaponStats }));
    } catch (error) {
      console.error('Error fetching weapon stats:', error);
      setState(prev => ({ ...prev, weaponStats: null }));
    }
  };

  const fetchSeasonStats = async (puuid: string) => {
    try {
      console.log('📊 Fetching season stats...');
      const { data, error } = await supabase
        .from('seasonstats')
        .select('*')
        .eq('puuid', puuid);

      if (error || !data || data.length === 0) {
        handleApiError(error, 'season stats');
        setState(prev => ({ ...prev, seasonStats: [] }));
        return;
      }

      const record = data[0];
      console.log('✅ Season stats fetched');
      const seasonStats = (record?.performancebyseason || []) as SeasonStatsType[];

      setState(prev => ({ ...prev, seasonStats }));
    } catch (error) {
      console.error('Error fetching season stats:', error);
      setState(prev => ({ ...prev, seasonStats: [] }));
    }
  };

  const fetchMatchStats = async (puuid: string) => {
    try {
      console.log('📊 Fetching match stats...');
      const { data, error } = await supabase
        .from('matchstats')
        .select('*')
        .eq('puuid', puuid)
        .order('createdat', { ascending: false });

      if (error || !data || data.length === 0) {
        handleApiError(error, 'match stats');
        setState(prev => ({ ...prev, matchStats: [] }));
        return;
      }

      console.log('✅ Match stats fetched:', data.length, 'matches');
      const matchStats = data.map(item => ({
        ...item.stats,
        puuid: item.puuid,
        match_id: item.id
      })) as MatchStatType[];

      setState(prev => ({ ...prev, matchStats }));
    } catch (error) {
      console.error('Error fetching match stats:', error);
      setState(prev => ({ ...prev, matchStats: [] }));
    }
  };

  // Cleanup subscriptions on unmount
  React.useEffect(() => {
    return () => {
      Object.values(subscriptionRef.current).forEach(unsub => unsub());
      subscriptionRef.current = {};
    };
  }, []);

  const value: DataContextValue = {
    ...state,
    fetchUserData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>{children}</DataProvider>
  </QueryClientProvider>
);
