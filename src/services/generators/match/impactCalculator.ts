/**
 * Impact Calculator Module
 * Calculates overall impact score based on multiple performance metrics
 */

import {
  CombatStats,
  EconomyStats,
  PositioningStats,
  UtilityStats
} from '../../../types/MatchStatsType';

// Weight distribution for impact score (total = 100)
const WEIGHTS = {
  combat: 40,      // Combat has highest weight
  economy: 20,     // Economy management
  position: 25,    // Positioning and map control
  utility: 15      // Utility usage
} as const;

/**
 * Calculate overall impact score for a round
 * @param combatStats - Combat performance metrics
 * @param economyStats - Economy management metrics
 * @param positioningStats - Positioning metrics
 * @param utilityStats - Utility usage metrics
 * @param outcome - Round outcome
 * @param roundWon - Whether the round was won
 * @returns Impact score (0-100)
 */
export function calculateImpactScore(
  combatStats: CombatStats,
  economyStats: EconomyStats,
  positioningStats: PositioningStats,
  utilityStats: UtilityStats,
  outcome: string,
  roundWon: boolean
): number {
  // Calculate component scores
  const combatScore = calculateCombatScore(combatStats);
  const economyScore = calculateEconomyScore(combatStats, economyStats);
  const positionScore = calculatePositionScore(combatStats, positioningStats);
  const utilityScore = calculateUtilityScore(utilityStats);

  // Calculate weighted average
  let finalScore = (
    (combatScore * WEIGHTS.combat) +
    (economyScore * WEIGHTS.economy) +
    (positionScore * WEIGHTS.position) +
    (utilityScore * WEIGHTS.utility)
  ) / 100;

  // Apply outcome modifiers
  finalScore = applyOutcomeModifiers(finalScore, combatStats, roundWon);

  // Ensure final score is between 0 and 100
  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

/**
 * Calculate combat score (0-100)
 */
function calculateCombatScore(combatStats: CombatStats): number {
  let score = 0;

  // Base kills contribution (up to 50 points)
  score += Math.min(50, combatStats.kills * 25);

  // Reduce score for deaths
  score -= Math.min(score, combatStats.deaths * 15);

  // Add assists contribution
  score += Math.min(20, combatStats.assists * 10);

  // Add headshot bonus
  score += (combatStats.headshotPercentage / 100) * 20;

  // Trade kill bonuses
  if (combatStats.tradeKill) score += 5;
  if (combatStats.tradedKill) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate economy score (0-100)
 */
function calculateEconomyScore(combatStats: CombatStats, economyStats: EconomyStats): number {
  let score = 100;

  // Penalize for having much lower loadout than enemies
  const economyRatio = economyStats.loadoutValue / Math.max(1, economyStats.enemyLoadoutValue);
  score *= Math.min(1, economyRatio + 0.3); // Allow for some disadvantage

  // Bonus for dealing damage relative to loadout value
  const damagePerCredit = combatStats.damageDealt / Math.max(1, economyStats.loadoutValue);
  score += Math.min(30, damagePerCredit * 50);

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate position score (0-100)
 */
function calculatePositionScore(
  combatStats: CombatStats,
  positioningStats: PositioningStats
): number {
  let score = 50; // Start at neutral

  // Reward or penalize first contact based on outcome
  if (positioningStats.firstContact) {
    if (combatStats.kills > 0 && combatStats.deaths === 0) {
      score += 30;
    } else if (combatStats.deaths > 0) {
      score -= 20;
    }
  }

  // Adjust based on position type and performance
  score += calculatePositionTypeScore(positioningStats.positionType, combatStats);

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate score adjustment based on position type
 */
function calculatePositionTypeScore(positionType: string, combatStats: CombatStats): number {
  const killMultipliers: Record<string, number> = {
    Entry: 15,
    Anchor: 20,
    Lurk: 25,
    Aggressive: 18,
    default: 10
  };

  const deathPenalties: Record<string, number> = {
    Entry: 10,
    Anchor: 15,
    Lurk: 10,
    Aggressive: 12,
    default: 10
  };

  const killMult = killMultipliers[positionType] || killMultipliers.default;
  const deathPenalty = deathPenalties[positionType] || deathPenalties.default;

  return (combatStats.kills * killMult) - (combatStats.deaths * deathPenalty);
}

/**
 * Calculate utility score (0-100)
 */
function calculateUtilityScore(utilityStats: UtilityStats): number {
  let score = 0;

  // Base score from utility usage ratio
  const usageRatio = utilityStats.abilitiesUsed / Math.max(1, utilityStats.totalAbilities);
  score += usageRatio * 60;

  // Add score for utility damage (assume 300 damage is excellent)
  score += Math.min(40, (utilityStats.utilityDamage / 300) * 40);

  return Math.max(0, Math.min(100, score));
}

/**
 * Apply outcome-based modifiers to the final score
 */
function applyOutcomeModifiers(
  score: number,
  combatStats: CombatStats,
  roundWon: boolean
): number {
  let modifiedScore = score;

  // Round outcome multiplier
  if (roundWon) {
    modifiedScore *= 1.15; // 15% bonus for winning
  } else if (combatStats.kills >= 2) {
    modifiedScore *= 1.05; // 5% bonus for good performance in lost round
  }

  // Exceptional performance bonus
  if (combatStats.kills >= 3 && combatStats.deaths === 0) {
    modifiedScore = Math.min(100, modifiedScore * 1.2);
  }

  return modifiedScore;
}
