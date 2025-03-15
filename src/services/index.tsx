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
    console.log('✅ Data updated at:', this.lastUpdateTimestamp);
  }
};

/**
 * Main function to process user statistics data
 * Fetches user data, compares matchIds, processes and updates stats
 *
 * @param puuid User's PUUID to process data for
 */
export const processUserData = async (puuid: string): Promise<void> => {
  console.log('🔄 Starting data processing for PUUID:', puuid);

  try {
    // 1. Fetch the user data to get matchIds
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('puuid', puuid)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`);
    }

    if (!userData) {
      throw new Error('User not found');
    }

    console.log('✅ User data fetched:', userData);

    // 2. Compare with dummy data to find unique/new matchIds
    const newMatchIds = await findNewMatchIds(userData.puuid, userData.region, userData.matchesId || []);

    if (newMatchIds.length === 0) {
      console.log('📝 No new matches found, processing completed');
      // Update the tracker to signal that processing is complete
      dataUpdateTracker.markUpdated(puuid);
      return;
    }

    console.log('🎮 Found new matches to process:', newMatchIds);

    // 3. Process the data with new matchIds
    await processData(puuid, newMatchIds, userData.region);

    console.log('✅ All data processed and updated successfully');

    // 4. Update the tracker to signal that processing is complete
    dataUpdateTracker.markUpdated(puuid);

  } catch (error) {
    console.error('❌ Error processing data:', error);
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
  // Find matches in userMatchIds that aren't in dummyProcessedMatchIds
  return userMatchIds.filter(id => !matchIds.includes(id));
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

    console.log('📊 Fetched all current stats data');

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

    console.log('🧮 Data processing complete');

    // 3. Update all tables with the processed data
    await Promise.all([
      updateAgentStats(processedStats.agentStats),
      updateMapStats(processedStats.mapStats),
      updateWeaponStats(processedStats.weaponStats),
      updateSeasonStats(processedStats.seasonStats),
      updateMatchStats(processedStats.matchStats)
    ]);

    console.log('💾 All database tables updated with processed data');

  } catch (error) {
    console.error('Error in processData function:', error);
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
  return data || [];
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
  return data || [];
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
  return data || [];
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
  return data || [];
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
  return data || [];
}

/**
 * Update agent stats in the database
 */
async function updateAgentStats(agentStats: any[]): Promise<void> {
  if (!agentStats || agentStats.length === 0) return;

  const { error } = await supabase
    .from('agentstats')
    .upsert(agentStats, { onConflict: 'puuid,agent' });

  if (error) throw error;
}

/**
 * Update map stats in the database
 */
async function updateMapStats(mapStats: any[]): Promise<void> {
  if (!mapStats || mapStats.length === 0) return;

  const { error } = await supabase
    .from('mapstats')
    .upsert(mapStats, { onConflict: 'puuid,map' });

  if (error) throw error;
}

/**
 * Update weapon stats in the database
 */
async function updateWeaponStats(weaponStats: any[]): Promise<void> {
  if (!weaponStats || weaponStats.length === 0) return;

  const { error } = await supabase
    .from('weaponstats')
    .upsert(weaponStats, { onConflict: 'puuid,weapon' });

  if (error) throw error;
}

/**
 * Update season stats in the database
 */
async function updateSeasonStats(seasonStats: any[]): Promise<void> {
  if (!seasonStats || seasonStats.length === 0) return;

  const { error } = await supabase
    .from('seasonstats')
    .upsert(seasonStats, { onConflict: 'puuid,season' });

  if (error) throw error;
}

/**
 * Update match stats in the database
 */
async function updateMatchStats(matchStats: any[]): Promise<void> {
  if (!matchStats || matchStats.length === 0) return;

  const { error } = await supabase
    .from('matchstats')
    .upsert(matchStats, { onConflict: 'puuid,matchid' });

  if (error) throw error;
}
