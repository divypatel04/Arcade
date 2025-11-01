/**
 * Round Performance Generator Module
 * Generates detailed performance metrics for each round in a match
 */

import { MatchDetails } from '../../../types/MatchDetails';
import {
  RoundPerformance,
  CombatStats,
  EconomyStats,
  PositioningStats,
  UtilityStats
} from '../../../types/MatchStatsType';

import {
  calculateAverageEnemyLoadout,
  findPlayerLocationInRound,
  determinePositionInfoLocally
} from './roundHelpers';

import {
  wasPlayerKilled,
  countAssists,
  calculateDamageDealt,
  calculateHeadshotPercentageForRound,
  wasPlayerTradedKill,
  didPlayerTradeKill
} from './combatHelpers';

import {
  countAbilitiesUsed,
  calculateUtilityDamage,
  wasFirstContact,
  calculateTimeToFirstContact
} from './utilityHelpers';

import { generateImprovementSuggestions } from './improvementEngine';
import { calculateImpactScore } from './impactCalculator';

/**
 * Generate comprehensive round-by-round performance data
 * @param match - Complete match details
 * @param player - Player object
 * @returns Array of round performance metrics
 */
export async function generateRoundPerformance(
  match: MatchDetails,
  player: any
): Promise<RoundPerformance[]> {
  const roundPerformances: RoundPerformance[] = [];
  const playerTeamId = player.teamId;
  const mapId = match.matchInfo.mapId;

  for (let i = 0; i < match.roundResults.length; i++) {
    const round = match.roundResults[i];
    const playerStats = round.playerStats.find((stats: any) => stats.puuid === player.puuid);

    if (!playerStats) {
      console.warn(`Player stats not found for round ${i + 1}`);
      continue;
    }

    const roundPerformance = buildRoundPerformance(
      round,
      playerStats,
      player,
      playerTeamId,
      i + 1,
      match,
      mapId
    );

    roundPerformances.push(roundPerformance);
  }

  return roundPerformances;
}

/**
 * Build complete round performance object
 */
function buildRoundPerformance(
  round: any,
  playerStats: any,
  player: any,
  playerTeamId: string,
  roundNumber: number,
  match: MatchDetails,
  mapId: string
): RoundPerformance {
  const isRoundWon = round.winningTeam === playerTeamId;
  const outcome = isRoundWon ? "Won" : "Lost";

  // Generate all stat categories
  const combatStats = generateCombatStats(round, playerStats, player.puuid);
  const economyStats = generateEconomyStats(playerStats, match, round, playerTeamId);
  const positioningStats = generatePositioningStats(round, playerStats, player, match, mapId);
  const utilityStats = generateUtilityStats(playerStats);

  // Calculate improvement suggestions and impact score
  const improvement = generateImprovementSuggestions(
    combatStats,
    economyStats,
    positioningStats,
    utilityStats,
    outcome
  );

  const impactScore = calculateImpactScore(
    combatStats,
    economyStats,
    positioningStats,
    utilityStats,
    outcome,
    isRoundWon
  );

  return {
    roundNumber,
    outcome,
    impactScore,
    combat: combatStats,
    economy: economyStats,
    positioning: positioningStats,
    utility: utilityStats,
    improvement
  };
}

/**
 * Generate combat statistics for a round
 */
function generateCombatStats(round: any, playerStats: any, puuid: string): CombatStats {
  return {
    kills: playerStats.kills?.length || 0,
    deaths: wasPlayerKilled(round, puuid),
    assists: countAssists(round, puuid),
    damageDealt: calculateDamageDealt(playerStats),
    headshotPercentage: calculateHeadshotPercentageForRound(playerStats),
    tradedKill: wasPlayerTradedKill(round, puuid),
    tradeKill: didPlayerTradeKill(round, puuid)
  };
}

/**
 * Generate economy statistics for a round
 */
function generateEconomyStats(
  playerStats: any,
  match: MatchDetails,
  round: any,
  playerTeamId: string
): EconomyStats {
  const weaponId = playerStats.economy?.weapon || "";
  const armorId = playerStats.economy?.armor || "";

  return {
    weaponId,
    weaponType: weaponId, // Will be enriched later with actual weapon data
    armorId,
    armorType: armorId, // Will be enriched later with actual armor data
    creditSpent: playerStats.economy?.spent || 0,
    loadoutValue: playerStats.economy?.loadoutValue || 0,
    enemyLoadoutValue: calculateAverageEnemyLoadout(match, round, playerTeamId)
  };
}

/**
 * Generate positioning statistics for a round
 */
function generatePositioningStats(
  round: any,
  playerStats: any,
  player: any,
  match: MatchDetails,
  mapId: string
): PositioningStats {
  const playerLocation = findPlayerLocationInRound(round, player.puuid);

  let site = "Unknown";
  let positionType = "Balanced";

  if (playerLocation) {
    const siteInfo = determinePositionInfoLocally(playerLocation, round, player, match, mapId);
    site = siteInfo.site;
    positionType = siteInfo.positionType;
  }

  return {
    site,
    positionType,
    firstContact: wasFirstContact(round, player.puuid),
    timeToFirstContact: calculateTimeToFirstContact(round, player.puuid)
  };
}

/**
 * Generate utility usage statistics for a round
 */
function generateUtilityStats(playerStats: any): UtilityStats {
  const TYPICAL_ABILITIES = 4; // Valorant agents typically have 4 abilities

  return {
    abilitiesUsed: countAbilitiesUsed(playerStats),
    totalAbilities: TYPICAL_ABILITIES,
    utilityDamage: calculateUtilityDamage(playerStats)
  };
}
