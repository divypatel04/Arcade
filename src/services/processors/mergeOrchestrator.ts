/**
 * Merge Orchestrator
 * Coordinates merging of old and new stats data
 * 
 * This replaces the old 440-line mergeProcess.ts with clean,
 * maintainable code that delegates to specialized merger modules.
 */

import type { 
  AgentStatType, 
  MapStatsType, 
  WeaponStatsType, 
  SeasonStatsType,
  MatchStatsType 
} from '@types';
import { 
  mergeAgentStats, 
  mergeMapStats, 
  mergeWeaponStats, 
  mergeSeasonStats, 
  mergeMatchStats 
} from '../mergers';
import { ProcessingError, ErrorCodes, logError } from '@lib/errors';

/**
 * Input data structure
 */
export interface MergeInput {
  oldData: {
    agentStats: AgentStatType[];
    mapStats: MapStatsType[];
    weaponStats: WeaponStatsType[];
    seasonStats: SeasonStatsType[];
    matchStats: MatchStatsType[];
  };
  newData: {
    agentStats: AgentStatType[];
    mapStats: MapStatsType[];
    weaponStats: WeaponStatsType[];
    seasonStats: SeasonStatsType[];
    matchStats: MatchStatsType[];
  };
}

/**
 * Output data structure
 */
export interface MergeOutput {
  mergedAgentStats: AgentStatType[];
  mergedMapStats: MapStatsType[];
  mergedWeaponStats: WeaponStatsType[];
  mergedSeasonStats: SeasonStatsType[];
  mergedMatchStats: MatchStatsType[];
}

/**
 * Merge old and new stats data
 * 
 * Process flow:
 * 1. Validate inputs
 * 2. Merge each stat type using specialized mergers
 * 3. Return merged results
 * 
 * @param input Old and new stats data
 * @returns Merged stats for all types
 */
export async function mergeAllStats(input: MergeInput): Promise<MergeOutput> {
  try {
    // Validate input structure
    if (!input || !input.oldData || !input.newData) {
      throw new ProcessingError(
        'Invalid merge input structure',
        ErrorCodes.INVALID_INPUT,
        { hasInput: !!input, hasOldData: !!input?.oldData, hasNewData: !!input?.newData }
      );
    }

    console.log('[MergeOrchestrator] Starting merge process:', {
      oldAgents: input.oldData.agentStats?.length || 0,
      newAgents: input.newData.agentStats?.length || 0,
      oldMaps: input.oldData.mapStats?.length || 0,
      newMaps: input.newData.mapStats?.length || 0,
      oldWeapons: input.oldData.weaponStats?.length || 0,
      newWeapons: input.newData.weaponStats?.length || 0,
      oldSeasons: input.oldData.seasonStats?.length || 0,
      newSeasons: input.newData.seasonStats?.length || 0,
      oldMatches: input.oldData.matchStats?.length || 0,
      newMatches: input.newData.matchStats?.length || 0,
    });

    // Merge each stat type using specialized mergers
    const mergedAgentStats = mergeAgentStats(
      input.oldData.agentStats || [],
      input.newData.agentStats || []
    );

    const mergedMapStats = mergeMapStats(
      input.oldData.mapStats || [],
      input.newData.mapStats || []
    );

    const mergedWeaponStats = mergeWeaponStats(
      input.oldData.weaponStats || [],
      input.newData.weaponStats || []
    );

    const mergedSeasonStats = mergeSeasonStats(
      input.oldData.seasonStats || [],
      input.newData.seasonStats || []
    );

    const mergedMatchStats = mergeMatchStats(
      input.oldData.matchStats || [],
      input.newData.matchStats || []
    );

    console.log('[MergeOrchestrator] ✅ Merge complete:', {
      agents: mergedAgentStats.length,
      maps: mergedMapStats.length,
      weapons: mergedWeaponStats.length,
      seasons: mergedSeasonStats.length,
      matches: mergedMatchStats.length,
    });

    return {
      mergedAgentStats,
      mergedMapStats,
      mergedWeaponStats,
      mergedSeasonStats,
      mergedMatchStats,
    };
  } catch (error) {
    logError(error, { operation: 'mergeAllStats' });
    
    if (error instanceof ProcessingError) {
      throw error;
    }
    
    throw new ProcessingError(
      'Failed to merge stats data',
      ErrorCodes.MERGE_FAILED,
      { error }
    );
  }
}

// Legacy export for backward compatibility
export const mergeProcess = mergeAllStats;
