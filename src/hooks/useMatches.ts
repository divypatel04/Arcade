import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getMatches, saveMatch } from '@lib/supabase';
import type { Match } from '@context/DataContext';

export const useMatches = (limit = 50) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: matches,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['matches', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getMatches(user.id, limit);
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const saveMatchMutation = useMutation({
    mutationFn: async (match: Match) => {
      if (!user?.id) throw new Error('No user');
      return await saveMatch(user.id, match);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', user?.id] });
    },
  });

  const recentMatches = matches?.slice(0, 5) || [];

  return {
    matches: matches || [],
    recentMatches,
    isLoading,
    error,
    refetch,
    saveMatch: saveMatchMutation.mutate,
    isSaving: saveMatchMutation.isPending,
  };
};
