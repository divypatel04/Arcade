import { supabase } from '../lib/supabase';
import { fetchMatchList } from './api/fetchMatchList';
import { processAllStatsData } from './processService';

// A simple state object to track the last processed data
export const dataUpdateTracker = {
  lastProcessedPuuid: null as string | null,
  lastUpdateTimestamp: null as Date | null,

  // Update the tracker when processing is complete
  markUpdated: function(puuid: string) {
    this.lastProcessedPuuid = puuid;
    this.lastUpdateTimestamp = new Date();
    console.log('[BACKGROUND_PROCESS] ✅ Data updated at:', this.lastUpdateTimestamp);
  }
};

/**
 * Main function to process user statistics data
 * Fetches user data, compares matchIds, processes and updates stats
 *
 * @param puuid User's PUUID to process data for
 */
export const processUserData = async (puuid: string): Promise<void> => {
  console.log('[BACKGROUND_PROCESS] 🔄 Starting data processing for PUUID:', puuid);

  try {
    // 1. Fetch the user data to get matchIds
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('puuid', puuid)
      .single();

    if (userError) {
      throw new Error(`[ERROR] Failed to fetch user data: ${userError.message}`);
    }

    if (!userData) {
      throw new Error('[ERROR] User not found');
    }

    console.log('[BACKGROUND_PROCESS] ✅ User data fetched');

    // 2. Compare with dummy data to find unique/new matchIds
    const newMatchIds = await findNewMatchIds(userData.puuid, userData.region, userData.matchid || []);

    if (newMatchIds.length === 0) {
      console.log('[BACKGROUND_PROCESS] 📝 No new matches found, processing completed');
      // Update the tracker to signal that processing is complete
      dataUpdateTracker.markUpdated(puuid);
      return;
    }

    console.log('[BACKGROUND_PROCESS] 🎮 Found new matches to process:', newMatchIds);

    // 3. Process the data with new matchIds
    await processData(puuid, newMatchIds, userData.region);

    console.log('[BACKGROUND_PROCESS] ✅ All data processed and updated successfully');

    // 4. Update the tracker to signal that processing is complete
    dataUpdateTracker.markUpdated(puuid);

  } catch (error) {
    console.error('[ERROR] ❌ Error processing data:', error);
    throw error;
  }
};

/**
 * Compare user matchIds with a dummy list to find new matches
 * @param userMatchIds Array of match IDs from user record
 * @returns Array of new match IDs that need processing
 */
async function findNewMatchIds(puuid: string, region: string, userMatchIds: string[]): Promise<string[]> {
  const matchIds = await fetchMatchList({ puuid, region});

  // FIXED: Return matches in matchIds that aren't in userMatchIds
  // (not the other way around as before)
  return matchIds.filter((id:string) => !userMatchIds.includes(id));
}

/**
 * Process data for all stat types using new match IDs
 * @param puuid User PUUID
 * @param newMatchIds Array of new match IDs to process
 */
async function processData(puuid: string, newMatchIds: string[], region: string): Promise<void> {
  try {
    // 1. Fetch all current stats from the database
    const [agentStats, mapStats, weaponStats, seasonStats, matchStats] = await Promise.all([
      fetchAgentStats(puuid),
      fetchMapStats(puuid),
      fetchWeaponStats(puuid),
      fetchSeasonStats(puuid),
      fetchMatchStats(puuid)
    ]);

    console.log('[BACKGROUND_PROCESS] 📊 Fetched all current stats data');

    // 2. Process all stats with new matchIds
    const processedStats = await processAllStatsData({
      region,
      puuid,
      agentStats,
      mapStats,
      weaponStats,
      seasonStats,
      matchStats,
      newMatchIds
    });

    console.log('[BACKGROUND_PROCESS] 🧮 Data processing complete');

    // 3. Update all tables with the processed data
    await Promise.all([
      updateAgentStats(processedStats.agentStats, puuid),
      updateMapStats(processedStats.mapStats, puuid),
      updateWeaponStats(processedStats.weaponStats, puuid),
      updateSeasonStats(processedStats.seasonStats, puuid),
      updateMatchStats(processedStats.matchStats, puuid),
      // Add the new update function for user matchIds
      updateUserMatchIds(puuid, newMatchIds)
    ]);

    console.log('[BACKGROUND_PROCESS] 💾 All database tables updated with processed data');

  } catch (error) {
    console.error('[ERROR] Error in processData function:', error);
    throw error;
  }
}

/**
 * Update user's matchesId array in the database by adding new match IDs
 * @param puuid User PUUID
 * @param newMatchIds Array of new match IDs to add
 */
async function updateUserMatchIds(puuid: string, newMatchIds: string[]): Promise<void> {
  if (!newMatchIds || newMatchIds.length === 0) return;
  if (!puuid) return;

  try {
    // First get the user's current matchesId array
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('matchid')
      .eq('puuid', puuid)
      .single();

    if (fetchError) {
      console.error('[ERROR] Error fetching user matchesId:', fetchError);
      throw fetchError;
    }

    // Combine existing and new match IDs
    const currentMatchIds = userData?.matchid || [];
    const updatedMatchIds = [...currentMatchIds, ...newMatchIds];

    // Update the user record with the combined match IDs
    const { error: updateError } = await supabase
      .from('users')
      .update({
        matchid: updatedMatchIds,
        lastupdated: new Date().toISOString()
      })
      .eq('puuid', puuid);

    if (updateError) {
      console.error('[ERROR] Error updating user matchesId:', updateError);
      throw updateError;
    }

    console.log(`[BACKGROUND_PROCESS] ✅ Updated user's matchesId with ${newMatchIds.length} new matches`);
  } catch (error) {
    console.error('[ERROR] Error in updateUserMatchIds:', error);
    throw error;
  }
}

/**
 * Fetch agent stats from database
 */
async function fetchAgentStats(puuid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('agentstats')
    .select('*')
    .eq('puuid', puuid);

  if (error) throw error;

  // Transform database format to application format
  const transformedData = (data || []).map(item => ({
    id: item.id,
    puuid: item.puuid,
    agent: item.agent,
    performanceBySeason: item.performancebyseason,
    lastupdated: item.lastupdated
  }));

  return transformedData;
}

/**
 * Fetch map stats from database
 */
async function fetchMapStats(puuid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('mapstats')
    .select('*')
    .eq('puuid', puuid);

  if (error) throw error;

  // Transform database format to application format
  const transformedData = (data || []).map(item => ({
    id: item.id,
    puuid: item.puuid,
    map: item.map,
    performanceBySeason: item.performancebyseason,
    lastupdated: item.lastupdated
  }));

  return transformedData;
}

/**
 * Fetch weapon stats from database
 */
async function fetchWeaponStats(puuid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('weaponstats')
    .select('*')
    .eq('puuid', puuid);

  if (error) throw error;

  // Transform database format to application format
  const transformedData = (data || []).map(item => ({
    id: item.id,
    puuid: item.puuid,
    weapon: item.weapon,
    performanceBySeason: item.performancebyseason,
    lastupdated: item.lastupdated
  }));

  return transformedData;
}

/**
 * Fetch season stats from database
 */
async function fetchSeasonStats(puuid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('seasonstats')
    .select('*')
    .eq('puuid', puuid);

  if (error) throw error;

  // Season stats format is slightly different
  const transformedData = (data || []).map(item => ({
    id: item.id,
    puuid: item.puuid,
    season: item.season,
    stats: item.stats,
    lastupdated: item.lastupdated
  }));

  return transformedData;
}

/**
 * Fetch match stats from database
 */
async function fetchMatchStats(puuid: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('matchstats')
    .select('*')
    .eq('puuid', puuid);

  if (error) throw error;

  // Transform match stats to expected format
  const transformedData = (data || []).map(item => ({
    id: item.id,
    puuid: item.puuid,
    stats: item.stats,
    lastupdated: item.lastupdated
  }));

  return transformedData;
}

/**
 * Update agent stats in the database
 * Uses upsert to update existing records or insert new ones
 */
async function updateAgentStats(agentStats: any[], puuid: string): Promise<void> {
  if (!agentStats || agentStats.length === 0) return;
  if (!puuid) return;

  try {
    // Transform data structure for database insertion/update
    const formattedAgentStats = agentStats.map(stat => ({
      id: `${puuid}-${stat.agent.id}`,
      puuid: stat.puuid,
      agent: stat.agent,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    // Upsert the records (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('agentstats')
      .upsert(formattedAgentStats, { onConflict: 'id' });

    if (upsertError) {
      console.error('[ERROR] Error upserting agent stats:', upsertError);
      throw upsertError;
    }
  } catch (error) {
    console.error('[ERROR] Error in updateAgentStats:', error);
    throw error;
  }
}

/**
 * Update map stats in the database
 * Uses upsert to update existing records or insert new ones
 */
async function updateMapStats(mapStats: any[], puuid: string): Promise<void> {
  if (!mapStats || mapStats.length === 0) return;
  if (!puuid) return;

  try {
    // Transform data structure for database insertion/update
    const formattedMapStats = mapStats.map(stat => ({
      id: `${puuid}-${stat.map.id}`,
      puuid: puuid,
      map: stat.map,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    // Upsert the records (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('mapstats')
      .upsert(formattedMapStats, { onConflict: 'id' });

    if (upsertError) {
      console.error('[ERROR] Error upserting map stats:', upsertError);
      throw upsertError;
    }
  } catch (error) {
    console.error('[ERROR] Error in updateMapStats:', error);
    throw error;
  }
}

/**
 * Update weapon stats in the database
 * Uses upsert to update existing records or insert new ones
 */
async function updateWeaponStats(weaponStats: any[], puuid: string): Promise<void> {
  if (!weaponStats || weaponStats.length === 0) return;
  if (!puuid) return;

  try {
    // Transform data structure for database insertion/update
    const formattedWeaponStats = weaponStats.map(stat => ({
      id: `${puuid}-${stat.weapon.id}`,
      puuid: puuid,
      weapon: stat.weapon,
      performancebyseason: stat.performanceBySeason,
      lastupdated: new Date().toISOString()
    }));

    // Upsert the records (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('weaponstats')
      .upsert(formattedWeaponStats, { onConflict: 'id' });

    if (upsertError) {
      console.error('[ERROR] Error upserting weapon stats:', upsertError);
      throw upsertError;
    }
  } catch (error) {
    console.error('[ERROR] Error in updateWeaponStats:', error);
    throw error;
  }
}

/**
 * Update season stats in the database
 * Uses upsert to update existing records or insert new ones
 */
async function updateSeasonStats(seasonStats: any[], puuid: string): Promise<void> {
  if (!seasonStats || seasonStats.length === 0) return;
  if (!puuid) return;

  try {
    // Transform data structure for database insertion/update
    const formattedSeasonStats = seasonStats.map(stat => ({
      id: `${puuid}-${stat.season.id}`,
      puuid: puuid,
      season: stat.season,
      stats: stat.stats,
      lastupdated: new Date().toISOString()
    }));

    // Upsert the records (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('seasonstats')
      .upsert(formattedSeasonStats, { onConflict: 'id' });

    if (upsertError) {
      console.error('[ERROR] Error upserting season stats:', upsertError);
      throw upsertError;
    }
  } catch (error) {
    console.error('[ERROR] Error in updateSeasonStats:', error);
    throw error;
  }
}

/**
 * Update match stats in the database
 * Uses upsert to update existing records or insert new ones
 */
async function updateMatchStats(matchStats: any[], puuid: string): Promise<void> {
  if (!matchStats || matchStats.length === 0) return;
  if (!puuid) return;

  try {
    // Transform data structure for database insertion/update
    const formattedMatchStats = matchStats.map(stat => ({
      id: stat.id || `${puuid}-${stat.stats.general.matchId}`,
      puuid: puuid,
      stats: stat.stats,
      lastupdated: new Date().toISOString()
    }));

    // Upsert the records (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('matchstats')
      .upsert(formattedMatchStats, { onConflict: 'id' });

    if (upsertError) {
      console.error('[ERROR] Error upserting match stats:', upsertError);
      throw upsertError;
    }
  } catch (error) {
    console.error('[ERROR] Error in updateMatchStats:', error);
    throw error;
  }
}
