/**
 * Premium Stats Determination Module
 * Marks top-performing stats as premium based on scoring algorithms
 */

import {
  AgentStatType,
  MapStatsType,
  MatchStatsType,
  SeasonStatsType,
  WeaponStatsType
} from '@types';

import { calculateAgentPremiumScore } from './scoringEngine';
import { calculateMapPremiumScore } from './mapScoring';
import { calculateSeasonPremiumScore } from './seasonScoring';
import { calculateMatchPremiumScore } from './matchScoring';
import { calculateWeaponPremiumScore } from './weaponScoring';

/**
 * Configuration for premium determination
 */
const PREMIUM_CONFIG = {
  defaultTopPercentage: 1 / 3, // Top third
  minPremiumCount: 1,
  matchPremiumPercentage: 0.2, // Top 20% for matches
  rankedMatchThreshold: 75,
  unrankedMatchThreshold: 85
} as const;

/**
 * Generic function to determine premium stats
 */
function determinePremiumStats<T extends { isPremiumStats?: boolean }>(
  stats: T[],
  calculateScore: (stat: T) => number,
  options: {
    topPercentage?: number;
    minCount?: number;
    customFilter?: (item: { stat: T; score: number }, index: number) => boolean;
  } = {}
): void {
  const {
    topPercentage = PREMIUM_CONFIG.defaultTopPercentage,
    minCount = PREMIUM_CONFIG.minPremiumCount,
    customFilter
  } = options;

  // Calculate scores
  const statsWithScores = stats.map(stat => ({
    stat,
    score: calculateScore(stat)
  }));

  // Sort by score (descending)
  statsWithScores.sort((a, b) => b.score - a.score);

  // Reset all to false
  stats.forEach(stat => {
    stat.isPremiumStats = false;
  });

  // Determine premium count
  const premiumCount = Math.max(minCount, Math.ceil(stats.length * topPercentage));

  // Mark premium stats
  statsWithScores.forEach((item, index) => {
    if (customFilter) {
      if (customFilter(item, index)) {
        item.stat.isPremiumStats = true;
      }
    } else if (index < premiumCount) {
      item.stat.isPremiumStats = true;
    }
  });
}

/**
 * Determines which agent stats should be marked as premium
 * Top third of agents based on performance scoring
 */
export function determinePremiumAgentStats(agentStats: AgentStatType[]): void {
  determinePremiumStats(agentStats, calculateAgentPremiumScore);
}

/**
 * Determines which map stats should be marked as premium
 * Top third of maps based on performance scoring
 */
export function determinePremiumMapStats(mapStats: MapStatsType[]): void {
  determinePremiumStats(mapStats, calculateMapPremiumScore);
}

/**
 * Determines which season stats should be marked as premium
 * Top third of seasons based on performance scoring
 */
export function determinePremiumSeasonStats(seasonStats: SeasonStatsType[]): void {
  determinePremiumStats(seasonStats, calculateSeasonPremiumScore);
}

/**
 * Determines which match stats should be marked as premium
 * Uses custom logic: score threshold OR top 20%
 */
export function determinePremiumMatchStats(matchStats: MatchStatsType[]): void {
  const minPremiumMatches = Math.max(
    PREMIUM_CONFIG.minPremiumCount,
    Math.ceil(matchStats.length * PREMIUM_CONFIG.matchPremiumPercentage)
  );

  determinePremiumStats(matchStats, calculateMatchPremiumScore, {
    topPercentage: PREMIUM_CONFIG.matchPremiumPercentage,
    customFilter: (item, index) => {
      const isRanked = item.stat.stats.general.isRanked;
      const threshold = isRanked
        ? PREMIUM_CONFIG.rankedMatchThreshold
        : PREMIUM_CONFIG.unrankedMatchThreshold;

      return item.score >= threshold || index < minPremiumMatches;
    }
  });
}

/**
 * Determines which weapon stats should be marked as premium
 * Top third of weapons based on performance scoring
 */
export function determinePremiumWeaponStats(weaponStats: WeaponStatsType[]): void {
  determinePremiumStats(weaponStats, calculateWeaponPremiumScore);
}

/**
 * Determine all premium stats at once
 * Convenience function for batch processing
 */
export function determineAllPremiumStats(stats: {
  agentStats?: AgentStatType[];
  mapStats?: MapStatsType[];
  seasonStats?: SeasonStatsType[];
  matchStats?: MatchStatsType[];
  weaponStats?: WeaponStatsType[];
}): void {
  if (stats.agentStats) determinePremiumAgentStats(stats.agentStats);
  if (stats.mapStats) determinePremiumMapStats(stats.mapStats);
  if (stats.seasonStats) determinePremiumSeasonStats(stats.seasonStats);
  if (stats.matchStats) determinePremiumMatchStats(stats.matchStats);
  if (stats.weaponStats) determinePremiumWeaponStats(stats.weaponStats);
}
