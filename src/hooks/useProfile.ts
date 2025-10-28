import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getUserProfile, upsertUserProfile } from '@lib/supabase';
import type { UserProfile } from '@context/DataContext';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.puuid],
    queryFn: async () => {
      if (!user?.puuid) return null;
      return await getUserProfile(user.puuid);
    },
    enabled: !!user?.puuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!user?.puuid) throw new Error('No user');
      return await upsertUserProfile({ ...data, puuid: user.puuid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.puuid] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
