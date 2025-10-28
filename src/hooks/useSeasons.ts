import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getSeasonStats } from '@lib/supabase';

export const useSeasons = () => {
  const { user } = useAuth();

  const {
    data: seasons,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['seasons', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getSeasonStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get current season (latest)
  const currentSeason = seasons?.[0] || null;

  return {
    seasons: seasons || [],
    currentSeason,
    isLoading,
    error,
    refetch,
  };
};
