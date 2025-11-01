/**
 * Stats Generator Orchestrator
 * Coordinates the generation of all stat types from match details
 * 
 * This replaces the old 2,719-line generateProcess.ts with a clean,
 * maintainable orchestrator that delegates to specialized generator modules.
 */

import type { 
  MatchDetails,
  AgentStatType, 
  MapStatsType, 
  WeaponStatsType, 
  SeasonStatsType,
  MatchStatsType,
  Common
} from '@types';
import { processAgentStats } from '../generators/agentStatsGenerator';
import { processMapStats } from '../generators/mapStatsGenerator';
import { processWeaponStats } from '../generators/weaponStatsGenerator';
import { processSeasonStats } from '../generators/seasonStatsGenerator';
import { generateMatchStats } from '../generators/matchStatsGenerator';
import { enrichStatsWithDetails } from '../utils/dataEnrichment';
import { ProcessingError, ErrorCodes, logError } from '@lib/errors';
import { validatePuuid } from '@lib/validation';

/**
 * Generated stats result
 */
export interface GeneratedStats {
  agentStats: AgentStatType[];
  mapStats: MapStatsType[];
  weaponStats: WeaponStatsType[];
  seasonStats: SeasonStatsType[];
  matchStats: MatchStatsType[];
}

/**
 * Generate all stats from match details
 * 
 * Process flow:
 * 1. Validate inputs
 * 2. Process each match through all stat generators
 * 3. Convert Maps to arrays and assign IDs
 * 4. Enrich with missing details (agent names, map names, etc.)
 * 5. Return generated stats
 * 
 * @param matchDetails Array of match details from Riot API
 * @param puuid Player PUUID
 * @returns Generated stats for all types
 */
export async function generateStats(
  matchDetails: MatchDetails[],
  puuid: string
): Promise<GeneratedStats> {
  try {
    // Validate inputs
    if (!Array.isArray(matchDetails)) {
      throw new ProcessingError(
        'matchDetails must be an array',
        ErrorCodes.INVALID_INPUT,
        { matchDetails: typeof matchDetails }
      );
    }

    validatePuuid(puuid);

    if (matchDetails.length === 0) {
      console.log('[StatsGenerator] No matches to process');
      return createEmptyStats();
    }

    console.log(`[StatsGenerator] Processing ${matchDetails.length} matches for ${puuid}`);

    // Initialize stat maps for aggregation
    const agentMap = new Map<string, AgentStatType>();
    const mapMap = new Map<string, MapStatsType>();
    const weaponMap = new Map<string, WeaponStatsType>();
    const seasonMap = new Map<string, SeasonStatsType>();

    let processedCount = 0;
    let skippedCount = 0;

    // Process each match
    for (const match of matchDetails) {
      try {
        // Validate match data structure
        if (!isValidMatchData(match)) {
          const invalidMatch = match as Record<string, unknown>;
          const matchInfo = invalidMatch?.matchInfo as Record<string, unknown> | undefined;
          console.warn('[StatsGenerator] Skipping invalid match data:', {
            matchId: matchInfo?.['matchId'],
            hasPlayers: Array.isArray(invalidMatch?.players),
            hasTeams: Array.isArray(invalidMatch?.teams),
          });
          skippedCount++;
          continue;
        }

        // Find the player in this match
        const player = match.players.find(p => p?.puuid === puuid);
        if (!player) {
          console.warn(`[StatsGenerator] Player ${puuid} not found in match ${match.matchInfo.matchId}`);
          skippedCount++;
          continue;
        }

        // Find player's team
        const playerTeam = match.teams.find(t => t?.teamId === player.teamId);
        if (!playerTeam) {
          console.warn(`[StatsGenerator] Team ${player.teamId} not found in match ${match.matchInfo.matchId}`);
          skippedCount++;
          continue;
        }

        // Extract match context
        const matchWon = playerTeam.won;
        const roundsWon = playerTeam.roundsWon || 0;
        const roundsLost = (playerTeam.roundsPlayed || 0) - (playerTeam.roundsWon || 0);
        const seasonId = match.matchInfo.seasonId || 'unknown';

        // Process through all stat generators
        processAgentStats(agentMap, player, match, seasonId, matchWon, roundsWon, roundsLost, puuid);
        processMapStats(mapMap, match, seasonId, player, matchWon, roundsWon, roundsLost, puuid);
        processWeaponStats(weaponMap, match, seasonId, puuid);
        processSeasonStats(seasonMap, match, seasonId, player, matchWon, roundsWon, roundsLost);

        processedCount++;
      } catch (error) {
        logError(error, {
          operation: 'processMatch',
          matchId: match?.matchInfo?.matchId,
          puuid,
        });
        skippedCount++;
        // Continue to next match instead of failing the whole process
      }
    }

    console.log(`[StatsGenerator] Processed ${processedCount} matches, skipped ${skippedCount}`);

    // Convert maps to arrays and assign IDs
    const agentStats = Array.from(agentMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.agent.id}`,
      puuid,
    }));

    const mapStats = Array.from(mapMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.map.id}`,
      puuid,
    }));

    const weaponStats = Array.from(weaponMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.weapon.id}`,
      puuid,
    }));

    const seasonStats = Array.from(seasonMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.season.id}`,
      puuid,
    }));

    // Generate match stats (returns array directly)
    const matchStats = await generateMatchStats(matchDetails, puuid);

    // Enrich all stats with missing details
    try {
      await enrichStatsWithDetails({
        agentStats,
        mapStats,
        weaponStats,
        seasonStats,
        matchStats,
      });
      console.log('[StatsGenerator] ✅ Stats enriched with details');
    } catch (error) {
      logError(error, { operation: 'enrichStats', puuid });
      console.warn('[StatsGenerator] ⚠️ Continuing with unenriched stats');
      // Continue with unenriched data rather than failing
    }

    console.log('[StatsGenerator] ✅ Stats generation complete:', {
      agents: agentStats.length,
      maps: mapStats.length,
      weapons: weaponStats.length,
      seasons: seasonStats.length,
      matches: matchStats.length,
    });

    return {
      agentStats,
      mapStats,
      weaponStats,
      seasonStats,
      matchStats,
    };
  } catch (error) {
    logError(error, { operation: 'generateStats', puuid, matchCount: matchDetails?.length });
    
    if (error instanceof ProcessingError) {
      throw error;
    }
    
    throw new ProcessingError(
      'Failed to generate stats from match details',
      ErrorCodes.PROCESSING_FAILED,
      { puuid, matchCount: matchDetails?.length, error }
    );
  }
}

/**
 * Validate match data structure
 */
function isValidMatchData(match: unknown): match is MatchDetails {
  if (!match || typeof match !== 'object') return false;
  
  const m = match as Record<string, unknown>;
  return (
    m.matchInfo !== undefined &&
    typeof m.matchInfo === 'object' &&
    Array.isArray(m.players) &&
    m.players.length > 0 &&
    Array.isArray(m.teams) &&
    m.teams.length > 0
  );
}

/**
 * Create empty stats structure
 */
function createEmptyStats(): GeneratedStats {
  return {
    agentStats: [],
    mapStats: [],
    weaponStats: [],
    seasonStats: [],
    matchStats: [],
  };
}
