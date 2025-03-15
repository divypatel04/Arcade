/**
 * Data processing service for transforming and enriching stats data
 * Contains pure functions that take raw data and return processed data
 */

import { fetchMatchDetails } from "./api/fetchMatchDetails";

/**
 * Interface for the data structure passed to processAllStatsData
 */
interface ProcessDataInput {
  region: string;
  puuid: string;
  agentStats: any[];
  mapStats: any[];
  weaponStats: any[];
  seasonStats: any[];
  matchStats: any[];
  newMatchIds: string[];
}

/**
 * Interface for the data structure returned from processAllStatsData
 */
interface ProcessDataOutput {
  agentStats: any[];
  mapStats: any[];
  weaponStats: any[];
  seasonStats: any[];
  matchStats: any[];
}

/**
 * Main function to process all stats data with new match IDs
 * This is a placeholder - the actual implementation will be done later
 *
 * @param data All current stats and new match IDs
 * @returns Processed stats for all data types
 */
export async function processAllStatsData(data: ProcessDataInput): Promise<ProcessDataOutput> {
  console.log('Processing all stats data with new match IDs:', data.newMatchIds);


  const matchDetails = await fetchMatchDetails({
    matchIds: data.newMatchIds,
    region: data.region,
  });

  let [agentStats, mapStats, weaponStats, seasonStats] =
    await Promise.all([
      generateAgentStats(matchDetails, puuid: data.puuid),
      generateMapStats(matchDetails, puuid: data.puuid),
      generateWeaponStats(matchDetails, puuid: data.puuid),
      generateSeasonStats(matchDetails, puuid: data.puuid),
    ]);

  let [
    mergedAgentStats,
    mergedMapStats,
    mergedWeaponStats,
    mergedSeasonStats,
  ] = await Promise.all([
    mergeAgentStats(data.agentStats, agentStats),
    mergeMapStats(data.mapStats, mapStats),
    mergeWeaponStats(data.weaponStats, weaponStats),
    mergeSeasonStats(data.seasonStats, seasonStats),
  ]);

  // For now, this is a placeholder that just returns the original data
  // The actual processing logic will be implemented later
  return {
    agentStats: mergedAgentStats,
    mapStats: mergedMapStats,
    weaponStats: mergedWeaponStats,
    seasonStats: mergedSeasonStats,
    matchStats: data.matchStats
  };
}

