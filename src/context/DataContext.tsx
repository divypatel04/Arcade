import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Define types for our context data
type DataContextType = {
  userData: any | null;
  agentStats: any[];
  mapStats: any[];
  weaponStats: any[];
  seasonStats: any[];
  matchStats: any[];
  isLoading: boolean;
  error: Error | null;
  fetchUserData: (puuid: string) => void;
  isDataReady: boolean;
};

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create a hook to use the context
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClientInstance = useQueryClient();
  const [puuid, setPuuid] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);

  // Function to fetch user data and set PUUID - this will be called from LoadingScreen
  const fetchUserData = async (userPuuid: string) => {
    try {
      // Set PUUID immediately to trigger other queries
      setPuuid(userPuuid);

      // Fetch user data by PUUID
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('puuid', userPuuid)
        .single();

      if (error) throw error;

      setUserData(data);
    } catch (err) {
      setError(err as Error);
    }
  };

  // Set up queries for each table once we have the PUUID
  const {
    data: agentStats = [],
    isLoading: isAgentsLoading
  } = useQuery({
    queryKey: ['agentStats', puuid],
    queryFn: async () => {
      if (!puuid) return [];
      const { data, error } = await supabase
        .from('agentstats')
        .select('*')
        .eq('puuid', puuid);
      if (error) throw error;
      return data || [];
    },
    enabled: !!puuid,
  });

  const {
    data: mapStats = [],
    isLoading: isMapsLoading
  } = useQuery({
    queryKey: ['mapStats', puuid],
    queryFn: async () => {
      if (!puuid) return [];
      const { data, error } = await supabase
        .from('mapstats')
        .select('*')
        .eq('puuid', puuid);
      if (error) throw error;
      return data || [];
    },
    enabled: !!puuid,
  });

  const {
    data: weaponStats = [],
    isLoading: isWeaponsLoading
  } = useQuery({
    queryKey: ['weaponStats', puuid],
    queryFn: async () => {
      if (!puuid) return [];
      const { data, error } = await supabase
        .from('weaponstats')
        .select('*')
        .eq('puuid', puuid);
      if (error) throw error;
      return data || [];
    },
    enabled: !!puuid,
  });

  const {
    data: seasonStats = [],
    isLoading: isSeasonsLoading
  } = useQuery({
    queryKey: ['seasonStats', puuid],
    queryFn: async () => {
      if (!puuid) return [];
      const { data, error } = await supabase
        .from('seasonstats')
        .select('*')
        .eq('puuid', puuid);
      if (error) throw error;
      return data || [];
    },
    enabled: !!puuid,
  });

  const {
    data: matchStats = [],
    isLoading: isMatchesLoading
  } = useQuery({
    queryKey: ['matchStats', puuid],
    queryFn: async () => {
      if (!puuid) return [];
      const { data, error } = await supabase
        .from('matchstats')
        .select('*')
        .eq('puuid', puuid);
      if (error) throw error;
      return data || [];
    },
    enabled: !!puuid,
  });

  // Set up real-time subscriptions when PUUID is available
  useEffect(() => {
    if (!puuid) return;

    // Set up real-time subscriptions for each table
    const agentSubscription = supabase
      .channel('agent-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agentstats', filter: `puuid=eq.${puuid}` },
        (payload) => {
          queryClientInstance.invalidateQueries({ queryKey: ['agentStats', puuid] });
        }
      )
      .subscribe();

    const mapSubscription = supabase
      .channel('map-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mapstats', filter: `puuid=eq.${puuid}` },
        (payload) => {
          queryClientInstance.invalidateQueries({ queryKey: ['mapStats', puuid] });
        }
      )
      .subscribe();

    const weaponSubscription = supabase
      .channel('weapon-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weaponstats', filter: `puuid=eq.${puuid}` },
        (payload) => {
          queryClientInstance.invalidateQueries({ queryKey: ['weaponStats', puuid] });
        }
      )
      .subscribe();

    const seasonSubscription = supabase
      .channel('season-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'seasonstats', filter: `puuid=eq.${puuid}` },
        (payload) => {
          queryClientInstance.invalidateQueries({ queryKey: ['seasonStats', puuid] });
        }
      )
      .subscribe();

    const matchSubscription = supabase
      .channel('match-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matchstats', filter: `puuid=eq.${puuid}` },
        (payload) => {
          queryClientInstance.invalidateQueries({ queryKey: ['matchStats', puuid] });
        }
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      agentSubscription.unsubscribe();
      mapSubscription.unsubscribe();
      weaponSubscription.unsubscribe();
      seasonSubscription.unsubscribe();
      matchSubscription.unsubscribe();
    };
  }, [puuid, queryClientInstance]);

  // Determine overall loading state
  const isLoading = !puuid ||
    (!!puuid && (isAgentsLoading || isMapsLoading || isWeaponsLoading || isSeasonsLoading || isMatchesLoading));

  // Check if data is ready (all queries completed and have data)
  useEffect(() => {
    if (
      !isLoading &&
      userData &&
      agentStats.length > 0 &&
      mapStats.length > 0 &&
      weaponStats.length > 0 &&
      seasonStats.length > 0 &&
      matchStats.length > 0
    ) {
      setIsDataReady(true);
    } else {
      setIsDataReady(false);
    }
  }, [isLoading, userData, agentStats, mapStats, weaponStats, seasonStats, matchStats]);

  // Context value
  const value: DataContextType = {
    userData: userData || null,
    agentStats: agentStats || [],
    mapStats: mapStats || [],
    weaponStats: weaponStats || [],
    seasonStats: seasonStats || [],
    matchStats: matchStats || [],
    isLoading,
    error,
    fetchUserData,
    isDataReady,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Root provider that combines DataProvider with QueryClientProvider
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>{children}</DataProvider>
    </QueryClientProvider>
  );
};
