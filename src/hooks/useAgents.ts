import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context';
import { getAgentStats } from '@lib/supabase';

export const useAgents = (seasonId: string = 'current') => {
  const { user } = useAuth();

  const {
    data: agents,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['agents', user?.id, seasonId],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getAgentStats(user.id, seasonId);
    },
    enabled: !!user?.id && !!seasonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sort agents by matches played
  const sortedAgents = agents?.sort((a, b) => b.matches - a.matches) || [];

  // Get top agent
  const topAgent = sortedAgents[0] || null;

  return {
    agents: sortedAgents,
    topAgent,
    isLoading,
    error,
    refetch,
  };
};
