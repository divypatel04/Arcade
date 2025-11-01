import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { dataUpdateTracker } from '../services';
import { determinePremiumAgentStats, determinePremiumMapStats, determinePremiumMatchStats, determinePremiumSeasonStats, determinePremiumWeaponStats } from '@utils';
import { AgentStatType, MapStatsType, MatchStatsType, SeasonStatsType, WeaponStatsType } from '@types';
import { 
  fetchAgentStats as fetchAgentStatsDb, 
  fetchMapStats as fetchMapStatsDb,
  fetchWeaponStats as fetchWeaponStatsDb,
  fetchSeasonStats as fetchSeasonStatsDb,
  fetchMatchStats as fetchMatchStatsDb 
} from '@services/database';
import { logError } from '@lib/errors';
import { logger } from '../utils/logger';

// Create scoped logger for DataContext
const log = logger.scope('DataContext');
/**
 * Payment record from Supabase
 */
interface Payment {
  id: string;
  puuid: string;
  productId: string;
  transactionId: string;
  purchaseDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'cancelled';
  platform: 'ios' | 'android';
  [key: string]: unknown;
}

type UserData = {
  puuid: string;
  region: string;
  name: string;
  tagline: string;
  createdAt: string;
  lastUpdated: string;
  matchesId: string[];
  payments: Payment[];
};

interface DataContextState {
  userData: UserData | null;
  agentStats: AgentStatType[];
  mapStats: MapStatsType[];
  weaponStats: WeaponStatsType[];
  seasonStats: SeasonStatsType[];
  matchStats: MatchStatsType[];
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
  agentStats: [],
  mapStats: [],
  weaponStats: [],
  seasonStats: [],
  matchStats: [],
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
  const handleApiError = (error: unknown, resourceName: string): null | never => {
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message);
      if (errorMessage.includes('contains 0 rows')) {
        log.debug(`No ${resourceName} found for this user`);
        return null;
      }
    }
    if (!error) {
      log.debug(`No ${resourceName} found for this user`);
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
            log.debug(`📡 Received update for ${table}:`, payload);

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
              log.debug(`🔄 Auto-refetching ${table} after background update`);
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
        log.info('🔔 Detected data update, refreshing data');

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
          log.error('Error refetching data after processing:', error);
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
    log.info('🚀 Starting data fetch for PUUID:', puuid);

    setState(prev => ({ ...prev, isLoading: true, error: null, isDataReady: false }));
    setCurrentPuuid(puuid);

    try {
      // Fetch user data first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, payments(*)')
        .eq('puuid', puuid)
        .single();

      if (userError) throw new Error(`Failed to fetch user data: ${userError.message}`);
      if (!userData) throw new Error('User not found');

      log.info('✅ User data fetched');

      // Update state with user data
      setState(prev => ({
        ...prev,
        userData: userData,
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
      log.error('❌ Error fetching data:', error);
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
      log.debug('📊 Fetching agent stats...');
      
      // Use new database service with automatic transformation
      const agentStats = await fetchAgentStatsDb(puuid);

      if (!agentStats || agentStats.length === 0) {
        log.debug('No agent stats found for this user');
        setState(prev => ({ ...prev, agentStats: [] }));
        return;
      }

      log.info('✅ Agent stats fetched:', agentStats.length, 'records');

      determinePremiumAgentStats(agentStats);

      setState(prev => ({ ...prev, agentStats }));
    } catch (error) {
      log.error('Error fetching agent stats:', error);
      logError(error, { operation: 'fetchAgentStats', puuid });
      setState(prev => ({ ...prev, agentStats: [] }));
    }
  };

  const fetchMapStats = async (puuid: string) => {
    try {
      log.debug('📊 Fetching map stats...');
      
      // Use new database service with automatic transformation
      const mapStats = await fetchMapStatsDb(puuid);

      if (!mapStats || mapStats.length === 0) {
        log.debug('No map stats found for this user');
        setState(prev => ({ ...prev, mapStats: [] }));
        return;
      }

      log.info('✅ Map stats fetched:', mapStats.length, 'records');

      determinePremiumMapStats(mapStats);

      setState(prev => ({ ...prev, mapStats }));
    } catch (error) {
      log.error('Error fetching map stats:', error);
      logError(error, { operation: 'fetchMapStats', puuid });
      setState(prev => ({ ...prev, mapStats: [] }));
    }
  };

  const fetchWeaponStats = async (puuid: string) => {
    try {
      log.debug('📊 Fetching weapon stats...');
      
      // Use new database service with automatic transformation
      const weaponStats = await fetchWeaponStatsDb(puuid);

      if (!weaponStats || weaponStats.length === 0) {
        log.debug('No weapon stats found for this user');
        setState(prev => ({ ...prev, weaponStats: [] }));
        return;
      }

      log.info('✅ Weapon stats fetched:', weaponStats.length, 'records');

      determinePremiumWeaponStats(weaponStats);

      setState(prev => ({ ...prev, weaponStats }));
    } catch (error) {
      log.error('Error fetching weapon stats:', error);
      logError(error, { operation: 'fetchWeaponStats', puuid });
      setState(prev => ({ ...prev, weaponStats: [] }));
    }
  };

  const fetchSeasonStats = async (puuid: string) => {
    try {
      log.debug('📊 Fetching season stats...');
      
      // Use new database service
      const seasonStats = await fetchSeasonStatsDb(puuid);

      if (!seasonStats || seasonStats.length === 0) {
        log.debug('No season stats found for this user');
        setState(prev => ({ ...prev, seasonStats: [] }));
        return;
      }

      log.info('✅ Season stats fetched:', seasonStats.length, 'records');

      determinePremiumSeasonStats(seasonStats);

      setState(prev => ({ ...prev, seasonStats }));
    } catch (error) {
      log.error('Error fetching season stats:', error);
      logError(error, { operation: 'fetchSeasonStats', puuid });
      setState(prev => ({ ...prev, seasonStats: [] }));
    }
  };

  // Transform match stats data similarly
  const fetchMatchStats = async (puuid: string) => {
    try {
      log.debug('📊 Fetching match stats...');
      
      // Use new database service
      const matchStats = await fetchMatchStatsDb(puuid);

      if (!matchStats || matchStats.length === 0) {
        log.debug('No match stats found for this user');
        setState(prev => ({ ...prev, matchStats: [] }));
        return;
      }

      log.info('✅ Match stats fetched:', matchStats.length, 'matches');

      determinePremiumMatchStats(matchStats);

      setState(prev => ({ ...prev, matchStats }));
    } catch (error) {
      log.error('Error fetching match stats:', error);
      logError(error, { operation: 'fetchMatchStats', puuid });
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
