import { supabase } from "../lib/supabase";
import { AgentStatType } from "../types/AgentStatsType";
import { MapStatsType } from "../types/MapStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatType } from "../types/WeaponStatsType";
import { MatchDetails } from "../types/MatchDetails";

/**
 * Functions for fetching data from Supabase
 */

/**
 * Fetch agent stats from database
 */
export async function fetchAgentStats(puuid: string): Promise<AgentStatType[]> {
  try {
    const { data, error } = await supabase
      .from('agentstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;

    // Transform database format to application format
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      puuid: item.puuid,
      agent: item.agent,
      performanceBySeason: item.performancebyseason || [],
      lastupdated: item.lastupdated
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching agent stats:", error);
    return [];
  }
}

/**
 * Fetch map stats from database
 */
export async function fetchMapStats(puuid: string): Promise<MapStatsType[]> {
  try {
    const { data, error } = await supabase
      .from('mapstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;

    // Transform database format to application format
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      puuid: item.puuid,
      map: item.map,
      performanceBySeason: item.performancebyseason || [],
      lastupdated: item.lastupdated
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching map stats:", error);
    return [];
  }
}

/**
 * Fetch weapon stats from database
 */
export async function fetchWeaponStats(puuid: string): Promise<WeaponStatType[]> {
  try {
    const { data, error } = await supabase
      .from('weaponstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;

    // Transform database format to application format
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      puuid: item.puuid,
      weapon: item.weapon,
      performanceBySeason: item.performancebyseason || [],
      lastupdated: item.lastupdated
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching weapon stats:", error);
    return [];
  }
}

/**
 * Fetch season stats from database
 */
export async function fetchSeasonStats(puuid: string): Promise<SeasonStatsType[]> {
  try {
    const { data, error } = await supabase
      .from('seasonstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;

    // Transform database format to application format
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      puuid: item.puuid,
      season: item.season,
      stats: item.stats,
      lastupdated: item.lastupdated
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching season stats:", error);
    return [];
  }
}

/**
 * Fetch match stats from database
 */
export async function fetchMatchStats(puuid: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('matchstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching match stats:", error);
    return [];
  }
}

/**
 * Fetch match history from database
 */
export async function fetchMatchHistory(puuid: string, limit = 20): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('matchhistory')
      .select('*')
      .eq('puuid', puuid)
      .order('gameStartMillis', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Return match IDs
    return (data || []).map((match: any) => match.matchId);
  } catch (error) {
    console.error("Error fetching match history:", error);
    return [];
  }
}

/**
 * Fetch match details from database
 */
export async function fetchMatchDetails(matchId: string): Promise<MatchDetails | null> {
  try {
    const { data, error } = await supabase
      .from('matchdetails')
      .select('*')
      .eq('matchId', matchId)
      .single();

    if (error) throw error;

    return data as MatchDetails;
  } catch (error) {
    console.error(`Error fetching match details for match ${matchId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple match details from database
 */
export async function fetchMatchesDetails(matchIds: string[]): Promise<MatchDetails[]> {
  if (!matchIds.length) return [];

  try {
    const { data, error } = await supabase
      .from('matchdetails')
      .select('*')
      .in('matchId', matchIds);

    if (error) throw error;

    return data as MatchDetails[];
  } catch (error) {
    console.error("Error fetching match details:", error);
    return [];
  }
}
