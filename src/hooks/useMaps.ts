import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getMapStats } from '@lib/supabase';

export const useMaps = (seasonId: string = 'current') => {
  const { user } = useAuth();

  const {
    data: maps,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['maps', user?.id, seasonId],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getMapStats(user.id, seasonId);
    },
    enabled: !!user?.id && !!seasonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sort maps by win rate
  const sortedMaps = maps?.sort((a, b) => b.winRate - a.winRate) || [];

  // Get best map
  const bestMap = sortedMaps[0] || null;

  return {
    maps: sortedMaps,
    bestMap,
    isLoading,
    error,
    refetch,
  };
};
