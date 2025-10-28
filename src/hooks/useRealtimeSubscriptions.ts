import { useEffect, useState } from 'react';
import { useAuth } from '@context';
import { supabase } from '@lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to subscribe to real-time data changes
 */
export const useRealtimeSubscriptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to agent stats changes
    const agentStatsChannel = supabase
      .channel('agent_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_stats',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate agent stats queries
          queryClient.invalidateQueries({ queryKey: ['agents', user.id] });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to map stats changes
    const mapStatsChannel = supabase
      .channel('map_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'map_stats',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['maps', user.id] });
        }
      )
      .subscribe();

    // Subscribe to weapon stats changes
    const weaponStatsChannel = supabase
      .channel('weapon_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weapon_stats',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['weapons', user.id] });
        }
      )
      .subscribe();

    // Subscribe to season stats changes
    const seasonStatsChannel = supabase
      .channel('season_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'season_stats',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['seasons', user.id] });
        }
      )
      .subscribe();

    // Subscribe to match changes
    const matchesChannel = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['matches', user.id] });
        }
      )
      .subscribe();

    // Subscribe to profile changes
    const profileChannel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profile', user.puuid] });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(agentStatsChannel);
      supabase.removeChannel(mapStatsChannel);
      supabase.removeChannel(weaponStatsChannel);
      supabase.removeChannel(seasonStatsChannel);
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(profileChannel);
    };
  }, [user?.id, user?.puuid, queryClient]);

  return { isConnected };
};

export default useRealtimeSubscriptions;
