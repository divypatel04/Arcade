import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getWeaponStats } from '@lib/supabase';

export const useWeapons = (seasonId: string = 'current') => {
  const { user } = useAuth();

  const {
    data: weapons,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['weapons', user?.id, seasonId],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getWeaponStats(user.id, seasonId);
    },
    enabled: !!user?.id && !!seasonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sort weapons by kills
  const sortedWeapons = weapons?.sort((a, b) => b.kills - a.kills) || [];

  // Get top weapon
  const topWeapon = sortedWeapons[0] || null;

  return {
    weapons: sortedWeapons,
    topWeapon,
    isLoading,
    error,
    refetch,
  };
};
