import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { AgentStatType } from '../types/AgentStatsType';
import { MapStatsType } from '../types/MapStatsType';
import { WeaponStatType } from '../types/WeaponStatsType';
import { SeasonStatsType } from '../types/SeasonStatsType';
import { MatchStatType } from '../types/MatchStatType';
import { dataUpdateTracker } from '../services';

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
  agentStats: any;
  mapStats: any;
  weaponStats: any;
  seasonStats: any;
  matchStats: any;
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

  // Track when the data was last updated by our processing function
  const [lastDataCheck, setLastDataCheck] = useState<Date | null>(null);

  // Helper function to handle API errors consistently
  const handleApiError = (error: any, resourceName: string) => {
    if (error?.message?.includes('contains 0 rows') || !error) {
      console.log(`No ${resourceName} found for this user`);
      return null;
    }
    throw error;
  };

  // Setup real-time subscriptions - this is the key to auto-updating data
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
          (payload) => {
            console.log(`📡 Received update for ${table}:`, payload);

            // When background service updates data, this subscription will trigger
            // a refetch of the specific changed data type
            const refetchFunction = {
              'agentstats': fetchAgentStats,
              'mapstats': fetchMapStats,
              'weaponstats': fetchWeaponStats,
              'seasonstats': fetchSeasonStats,
              'matchstats': fetchMatchStats
            }[table];

            if (refetchFunction) {
              refetchFunction(puuid);
              console.log(`🔄 Auto-refetching ${table} after background update`);
            }
          }
        )
        .subscribe();

      subscriptionRef.current[table] = () => {
        channel.unsubscribe();
      };
    });
  }, [queryClientInstance]);

  // Check for data updates from the processing function
  useEffect(() => {
    // Only run if we have a current user
    if (!currentPuuid) return;

    // Function to check if our data has been processed
    const checkForUpdates = () => {
      const { lastProcessedPuuid, lastUpdateTimestamp } = dataUpdateTracker;

      // Check if there's been a new update for our current user
      if (
        lastProcessedPuuid === currentPuuid &&
        lastUpdateTimestamp &&
        (!lastDataCheck || lastUpdateTimestamp > lastDataCheck)
      ) {
        console.log('🔔 Detected data update, refreshing data');

        // Update our last check time
        setLastDataCheck(lastUpdateTimestamp);

        // Refetch all data types
        Promise.all([
          fetchAgentStats(currentPuuid),
          fetchMapStats(currentPuuid),
          fetchWeaponStats(currentPuuid),
          fetchSeasonStats(currentPuuid),
          fetchMatchStats(currentPuuid)
        ]).catch(error => {
          console.error('Error refetching data after processing:', error);
        });
      }
    };

    // Check immediately and then periodically
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, 2000);

    return () => clearInterval(intervalId);
  }, [currentPuuid, lastDataCheck]);

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

      console.log('✅ User data fetched');

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

      // Mark data as ready - the processing function will be called from LoadingScreen component
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

      console.log('✅ Agent stats fetched:', data.length, 'records');

      // Transform all records to correct the casing of performanceBySeason
      const agentStats = data.map(item => ({
        ...item,
        performanceBySeason: item.performancebyseason,
        // Remove the original lowercase field if needed
        performancebyseason: undefined
      }));

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

      console.log('✅ Map stats fetched:', data.length, 'records');

      // Transform to correct the casing of performanceBySeason
      const mapStats = data.map(item => ({
        ...item,
        performanceBySeason: item.performancebyseason,
        performancebyseason: undefined
      }));

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

      console.log('✅ Weapon stats fetched:', data.length, 'records');

      // Transform to correct the casing of performanceBySeason
      const weaponStats = data.map(item => ({
        ...item,
        performanceBySeason: item.performancebyseason,
        performancebyseason: undefined
      }));

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

      console.log('✅ Season stats fetched:', data.length, 'records');

      // Transform the data to ensure correct casing
      // We're assuming seasonstats table also needs the same transformation
      const seasonStats = data.map(item => {
        if (item.performancebyseason) {
          return {
            ...item,
            performanceBySeason: item.performancebyseason,
            performancebyseason: undefined
          };
        }
        return item;
      });

      setState(prev => ({ ...prev, seasonStats }));
    } catch (error) {
      console.error('Error fetching season stats:', error);
      setState(prev => ({ ...prev, seasonStats: [] }));
    }
  };

  // Transform match stats data similarly
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

      // Transform match stats to ensure consistent casing
      const matchStats = data;

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
