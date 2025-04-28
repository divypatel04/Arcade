import { supabase } from "../lib/supabase";
import { AgentStatType } from "../types/AgentStatsType";
import { MapStatsType } from "../types/MapStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatsType } from "../types/WeaponStatsType";
import { MatchDetails } from "../types/MatchDetails";

/**
 * Functions for updating data in Supabase
 */

/**
 * Update or insert agent stats
 */
export async function upsertAgentStats(agentStats: AgentStatType[]): Promise<void> {
  if (!agentStats.length) return;

  try {
    // Transform data for database
    const transformedData = agentStats.map(stat => ({
      id: stat.id,
      puuid: stat.puuid,
      agent: stat.agent,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('agentstats')
      .upsert(transformedData, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error upserting agent stats:", error);
  }
}

/**
 * Update or insert map stats
 */
export async function upsertMapStats(mapStats: MapStatsType[]): Promise<void> {
  if (!mapStats.length) return;

  try {
    // Transform data for database
    const transformedData = mapStats.map(stat => ({
      id: stat.id,
      puuid: stat.puuid,
      map: stat.map,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('mapstats')
      .upsert(transformedData, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error upserting map stats:", error);
  }
}

/**
 * Update or insert weapon stats
 */
export async function upsertWeaponStats(weaponStats: WeaponStatsType[]): Promise<void> {
  if (!weaponStats.length) return;

  try {
    // Transform data for database
    const transformedData = weaponStats.map(stat => ({
      id: stat.id,
      puuid: stat.puuid,
      weapon: stat.weapon,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('weaponstats')
      .upsert(transformedData, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error upserting weapon stats:", error);
  }
}

/**
 * Update or insert season stats
 */
export async function upsertSeasonStats(seasonStats: SeasonStatsType[]): Promise<void> {
  if (!seasonStats.length) return;

  try {
    // Transform data for database
    const transformedData = seasonStats.map(stat => ({
      id: stat.id,
      puuid: stat.puuid,
      season: stat.season,
      stats: stat.stats,
      lastupdated: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('seasonstats')
      .upsert(transformedData, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error upserting season stats:", error);
  }
}

/**
 * Update or insert match stats
 */
export async function upsertMatchStats(matchStats: any[]): Promise<void> {
  if (!matchStats.length) return;

  try {
    // Add last updated timestamp to each record
    const transformedData = matchStats.map(stat => ({
      ...stat,
      lastupdated: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('matchstats')
      .upsert(transformedData, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error upserting match stats:", error);
  }
}

/**
 * Store match details in database
 */
export async function upsertMatchDetails(matchDetails: MatchDetails): Promise<void> {
  if (!matchDetails?.matchInfo?.matchId) return;

  try {
    const { error } = await supabase
      .from('matchdetails')
      .upsert({
        matchId: matchDetails.matchInfo.matchId,
        details: matchDetails,
        lastupdated: new Date().toISOString()
      }, {
        onConflict: 'matchId',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    console.error(`Error upserting match details for match ${matchDetails?.matchInfo?.matchId}:`, error);
  }
}

/**
 * Add match to match history for a player
 */
export async function addToMatchHistory(puuid: string, matchId: string, gameStartMillis: number): Promise<void> {
  if (!puuid || !matchId) return;

  try {
    const { error } = await supabase
      .from('matchhistory')
      .upsert({
        id: `${puuid}_${matchId}`,
        puuid,
        matchId,
        gameStartMillis,
        lastupdated: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: true
      });

    if (error) throw error;
  } catch (error) {
    console.error(`Error adding match ${matchId} to history for player ${puuid}:`, error);
  }
}

/**
 * Update user's processed match counter
 */
export async function updateUserProcessedMatches(puuid: string, processedCount: number): Promise<void> {
  if (!puuid) return;

  try {
    const { error } = await supabase
      .from('users')
      .update({
        processedMatches: processedCount,
        lastUpdated: new Date().toISOString()
      })
      .eq('puuid', puuid);

    if (error) throw error;
  } catch (error) {
    console.error(`Error updating processed match count for user ${puuid}:`, error);
  }
}

/**
 * Bulk update function to handle updating all stats at once
 */
export async function updatePlayerStats(
  puuid: string,
  agentStats: AgentStatType[],
  mapStats: MapStatsType[],
  weaponStats: WeaponStatsType[],
  seasonStats: SeasonStatsType[],
  matchStats: any[] = []
): Promise<void> {
  // Run all updates in parallel for efficiency
  const updatePromises = [
    upsertAgentStats(agentStats),
    upsertMapStats(mapStats),
    upsertWeaponStats(weaponStats),
    upsertSeasonStats(seasonStats)
  ];

  // Add match stats update if provided
  if (matchStats.length) {
    updatePromises.push(upsertMatchStats(matchStats));
  }

  try {
    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Update user's processed match count
    // This assumes we're always processing all available matches
    const processedCount = await getLatestProcessedCount(puuid);
    await updateUserProcessedMatches(puuid, processedCount);
  } catch (error) {
    console.error(`Error in bulk update of player stats for ${puuid}:`, error);
  }
}

/**
 * Helper function to get latest processed match count
 */
async function getLatestProcessedCount(puuid: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('matchhistory')
      .select('matchId')
      .eq('puuid', puuid);

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error(`Error getting processed match count for ${puuid}:`, error);
    return 0;
  }
}
