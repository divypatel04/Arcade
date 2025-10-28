import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AgentStats, MapStats, WeaponStats, Match, SeasonStats, UserProfile } from '@context/DataContext';

// Supabase Configuration
const SUPABASE_URL = Config.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY || '';

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          puuid: string;
          riot_id: string;
          game_name: string;
          tag_line: string;
          region: string;
          account_level: number;
          current_rank: string;
          current_rr: number;
          peak_rank: string;
          profile_icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      matches: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          map: string;
          mode: string;
          date: string;
          result: string;
          score: string;
          duration: string;
          agent: string;
          kills: number;
          deaths: number;
          assists: number;
          combat_score: number;
          rank: string;
          rr: number;
          rr_change: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
      };
      agent_stats: {
        Row: {
          id: string;
          user_id: string;
          season_id: string;
          agent_id: string;
          agent_name: string;
          role: string;
          matches: number;
          wins: number;
          kills: number;
          deaths: number;
          assists: number;
          headshots: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_stats']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agent_stats']['Insert']>;
      };
      map_stats: {
        Row: {
          id: string;
          user_id: string;
          season_id: string;
          map_id: string;
          map_name: string;
          matches: number;
          wins: number;
          losses: number;
          kills: number;
          deaths: number;
          attack_wins: number;
          defense_wins: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['map_stats']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['map_stats']['Insert']>;
      };
      weapon_stats: {
        Row: {
          id: string;
          user_id: string;
          season_id: string;
          weapon_id: string;
          weapon_name: string;
          weapon_type: string;
          kills: number;
          headshots: number;
          bodyshots: number;
          legshots: number;
          damage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['weapon_stats']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['weapon_stats']['Insert']>;
      };
      season_stats: {
        Row: {
          id: string;
          user_id: string;
          season_id: string;
          season_name: string;
          act: number;
          current_rank: string;
          current_rr: number;
          peak_rank: string;
          wins: number;
          losses: number;
          matches: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['season_stats']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['season_stats']['Insert']>;
      };
    };
  };
}

// Create Supabase client with AsyncStorage
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// User Profile Functions
export const getUserProfile = async (puuid: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('puuid', puuid)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  if (!data) return null;

  return {
    riotId: data.riot_id,
    gameName: data.game_name,
    tagLine: data.tag_line,
    region: data.region,
    accountLevel: data.account_level,
    currentRank: data.current_rank,
    currentRR: data.current_rr,
    peakRank: data.peak_rank,
    profileIcon: data.profile_icon,
  };
};

export const upsertUserProfile = async (profile: Partial<UserProfile> & { puuid: string }): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .upsert({
      puuid: profile.puuid,
      riot_id: profile.riotId || '',
      game_name: profile.gameName || '',
      tag_line: profile.tagLine || '',
      region: profile.region || '',
      account_level: profile.accountLevel || 0,
      current_rank: profile.currentRank || '',
      current_rr: profile.currentRR || 0,
      peak_rank: profile.peakRank || '',
      profile_icon: profile.profileIcon || '',
    });

  if (error) {
    console.error('Error upserting user profile:', error);
    return false;
  }

  return true;
};

// Match Functions
export const getMatches = async (userId: string, limit = 50): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return data.map(match => ({
    matchId: match.match_id,
    map: match.map,
    mapImage: '',
    mode: match.mode as any,
    date: match.date,
    result: match.result as any,
    score: match.score,
    duration: match.duration,
    agent: match.agent,
    kills: match.kills,
    deaths: match.deaths,
    assists: match.assists,
    combatScore: match.combat_score,
    rank: match.rank,
    rr: match.rr,
    rrChange: match.rr_change || undefined,
  }));
};

export const saveMatch = async (userId: string, match: Match): Promise<boolean> => {
  const { error } = await supabase
    .from('matches')
    .insert({
      user_id: userId,
      match_id: match.matchId,
      map: match.map,
      mode: match.mode,
      date: match.date,
      result: match.result,
      score: match.score,
      duration: match.duration,
      agent: match.agent,
      kills: match.kills,
      deaths: match.deaths,
      assists: match.assists,
      combat_score: match.combatScore,
      rank: match.rank,
      rr: match.rr,
      rr_change: match.rrChange || null,
    });

  if (error) {
    console.error('Error saving match:', error);
    return false;
  }

  return true;
};

// Season Stats Functions
export const getSeasonStats = async (userId: string): Promise<SeasonStats[]> => {
  const { data, error } = await supabase
    .from('season_stats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching season stats:', error);
    return [];
  }

  return data.map(season => ({
    seasonId: season.season_id,
    seasonName: season.season_name,
    act: season.act,
    currentRank: season.current_rank,
    currentRR: season.current_rr,
    peakRank: season.peak_rank,
    wins: season.wins,
    losses: season.losses,
    winRate: season.matches > 0 ? (season.wins / season.matches) * 100 : 0,
    kd: 0, // Calculate from matches
    averageScore: 0, // Calculate from matches
    matches: season.matches,
  }));
};

// Agent Stats Functions
export const getAgentStats = async (userId: string, seasonId: string): Promise<AgentStats[]> => {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('season_id', seasonId);

  if (error) {
    console.error('Error fetching agent stats:', error);
    return [];
  }

  return data.map(agent => ({
    agentId: agent.agent_id,
    agentName: agent.agent_name,
    agentIcon: '',
    role: agent.role as any,
    matches: agent.matches,
    wins: agent.wins,
    kills: agent.kills,
    deaths: agent.deaths,
    assists: agent.assists,
    winRate: agent.matches > 0 ? (agent.wins / agent.matches) * 100 : 0,
    kd: agent.deaths > 0 ? agent.kills / agent.deaths : agent.kills,
    averageScore: 0,
    headshots: agent.headshots,
    headshotPercentage: agent.kills > 0 ? (agent.headshots / agent.kills) * 100 : 0,
  }));
};

// Map Stats Functions
export const getMapStats = async (userId: string, seasonId: string): Promise<MapStats[]> => {
  const { data, error } = await supabase
    .from('map_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('season_id', seasonId);

  if (error) {
    console.error('Error fetching map stats:', error);
    return [];
  }

  return data.map(map => ({
    mapId: map.map_id,
    mapName: map.map_name,
    mapImage: '',
    matches: map.matches,
    wins: map.wins,
    losses: map.losses,
    winRate: map.matches > 0 ? (map.wins / map.matches) * 100 : 0,
    kills: map.kills,
    deaths: map.deaths,
    kd: map.deaths > 0 ? map.kills / map.deaths : map.kills,
    attackWins: map.attack_wins,
    defenseWins: map.defense_wins,
  }));
};

// Weapon Stats Functions
export const getWeaponStats = async (userId: string, seasonId: string): Promise<WeaponStats[]> => {
  const { data, error } = await supabase
    .from('weapon_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('season_id', seasonId);

  if (error) {
    console.error('Error fetching weapon stats:', error);
    return [];
  }

  return data.map(weapon => ({
    weaponId: weapon.weapon_id,
    weaponName: weapon.weapon_name,
    weaponType: weapon.weapon_type as any,
    kills: weapon.kills,
    headshots: weapon.headshots,
    headshotPercentage: weapon.kills > 0 ? (weapon.headshots / weapon.kills) * 100 : 0,
    bodyshots: weapon.bodyshots,
    legshots: weapon.legshots,
    accuracy: 0, // Calculate from total shots if available
    damage: weapon.damage,
  }));
};

export default supabase;
