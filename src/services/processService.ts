/**
 * Data processing service for transforming and enriching stats data
 * Contains pure functions that take raw data and return processed data
 */

import { generateStats } from "./generateProcess";
import { fetchMatchDetails } from "./api/fetchMatchDetails";
import { mergeProcess } from "./mergeProcess";

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

  try {
    // Validate input data to prevent errors
    if (!data.puuid || !data.region || !Array.isArray(data.newMatchIds)) {
      console.error('Invalid input data:', { puuid: data.puuid, region: data.region, newMatchIds: data.newMatchIds });
      throw new Error('Invalid input data for processing');
    }

    // Return early if no new match IDs to process
    if (data.newMatchIds.length === 0) {
      console.log('No new match IDs to process, returning current data');
      return {
        agentStats: data.agentStats || [],
        mapStats: data.mapStats || [],
        weaponStats: data.weaponStats || [],
        seasonStats: data.seasonStats || [],
        matchStats: data.matchStats || []
      };
    }

    const matchDetails = await fetchMatchDetails({
      matchIds: data.newMatchIds,
      region: data.region,
    });

    // Check if we got valid match details back
    if (!Array.isArray(matchDetails) || matchDetails.length === 0) {
      console.warn('No match details retrieved, returning current data');
      return {
        agentStats: data.agentStats || [],
        mapStats: data.mapStats || [],
        weaponStats: data.weaponStats || [],
        seasonStats: data.seasonStats || [],
        matchStats: data.matchStats || []
      };
    }

    const {
      agentStats,
      mapStats,
      weaponStats,
      seasonStats
    } = await generateStats(matchDetails, data.puuid);

    const {
      mergedAgentStats,
      mergedMapStats,
      mergedWeaponStats,
      mergedSeasonStats
    } = await mergeProcess({
      oldData: {
        agentStats: data.agentStats || [],
        mapStats: data.mapStats || [],
        weaponStats: data.weaponStats || [],
        seasonStats: data.seasonStats || []
      },
      newData:{
        agentStats: agentStats || [],
        mapStats: mapStats || [],
        weaponStats: weaponStats || [],
        seasonStats: seasonStats || []
      }
    });

    return {
      agentStats: mergedAgentStats,
      mapStats: mergedMapStats,
      weaponStats: mergedWeaponStats,
      seasonStats: mergedSeasonStats,
      matchStats: data.matchStats || []
    };
  } catch (error) {
    console.error('Error in processAllStatsData:', error);
    // Return original data if processing fails, to prevent data loss
    return {
      agentStats: data.agentStats || [],
      mapStats: data.mapStats || [],
      weaponStats: data.weaponStats || [],
      seasonStats: data.seasonStats || [],
      matchStats: data.matchStats || []
    };
  }
}

