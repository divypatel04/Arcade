/**
 * Improvement Engine Module
 * Generates personalized improvement suggestions based on round performance
 */

import {
  CombatStats,
  EconomyStats,
  PositioningStats,
  UtilityStats
} from '../../../types/MatchStatsType';

/**
 * Generate improvement suggestions based on round performance
 * @param combatStats - Combat performance metrics
 * @param economyStats - Economy management metrics
 * @param positioningStats - Positioning and map control metrics
 * @param utilityStats - Utility usage metrics
 * @param outcome - Round outcome ("Won" or "Lost")
 * @returns Array of improvement suggestions
 */
export function generateImprovementSuggestions(
  combatStats: CombatStats,
  economyStats: EconomyStats,
  positioningStats: PositioningStats,
  utilityStats: UtilityStats,
  outcome: string
): string[] {
  const suggestions: string[] = [];

  // Combat suggestions
  addCombatSuggestions(suggestions, combatStats);

  // Economy suggestions
  addEconomySuggestions(suggestions, economyStats);

  // Position-specific suggestions
  addPositioningSuggestions(suggestions, positioningStats, combatStats, outcome);

  // Utility suggestions
  addUtilitySuggestions(suggestions, utilityStats);

  return suggestions;
}

/**
 * Add combat-related suggestions
 */
function addCombatSuggestions(suggestions: string[], combatStats: CombatStats): void {
  if (combatStats.kills === 0 && combatStats.deaths > 0) {
    suggestions.push("Work on crosshair placement and positioning to secure kills");
  }

  if (combatStats.headshotPercentage < 15) {
    suggestions.push("Practice aim to improve headshot accuracy");
  }

  if (combatStats.deaths > combatStats.kills + 1) {
    suggestions.push("Focus on staying alive - playing for trades and using cover");
  }

  if (!combatStats.tradedKill && combatStats.deaths > 0) {
    suggestions.push("When taking duels, position closer to teammates for trade potential");
  }
}

/**
 * Add economy-related suggestions
 */
function addEconomySuggestions(suggestions: string[], economyStats: EconomyStats): void {
  const ECONOMY_THRESHOLD = 0.7;

  if (economyStats.loadoutValue < economyStats.enemyLoadoutValue * ECONOMY_THRESHOLD) {
    suggestions.push("Improve economy management to match enemy loadout values");
  }

  if (economyStats.creditSpent > economyStats.loadoutValue * 1.2) {
    suggestions.push("Avoid overbuying - save credits for future rounds");
  }
}

/**
 * Add positioning-related suggestions
 */
function addPositioningSuggestions(
  suggestions: string[],
  positioningStats: PositioningStats,
  combatStats: CombatStats,
  outcome: string
): void {
  const { positionType, site, firstContact } = positioningStats;

  // Position-type specific suggestions
  switch (positionType) {
    case "Entry":
      if (combatStats.deaths > 0 && combatStats.kills === 0) {
        suggestions.push("As an entry player, focus on trading opportunities and use utility before engaging");
      }
      break;

    case "Aggressive":
      if (combatStats.deaths > 0) {
        suggestions.push("Consider playing more passively or using utility to secure aggressive positions");
      }
      break;

    case "Anchor":
      if (combatStats.deaths > 0) {
        suggestions.push("Focus on delaying enemies and using utility to hold your position");
      }
      break;

    case "Lurk":
      if (outcome === "Lost") {
        suggestions.push("Coordinate lurks with team pushes to maximize effectiveness");
      }
      break;
  }

  // Site-specific suggestions
  if ((site === "A" || site === "B") && firstContact && combatStats.deaths > 0) {
    suggestions.push(`When holding ${site} site, use defensive angles to survive first contact`);
  }

  // First contact suggestions
  if (firstContact && combatStats.kills === 0) {
    suggestions.push("When taking first contact, ensure you have escape routes or teammate support");
  }
}

/**
 * Add utility-related suggestions
 */
function addUtilitySuggestions(suggestions: string[], utilityStats: UtilityStats): void {
  const UTILITY_USAGE_THRESHOLD = 0.5;
  const usageRatio = utilityStats.abilitiesUsed / Math.max(1, utilityStats.totalAbilities);

  if (usageRatio < UTILITY_USAGE_THRESHOLD) {
    suggestions.push("Use abilities more effectively to support your team");
  }

  if (utilityStats.utilityDamage === 0 && utilityStats.abilitiesUsed > 0) {
    suggestions.push("Focus on using utility for damage or area denial");
  }
}
