/**
 * Map Stats Scoring Engine
 * Calculates premium scores for map performance
 */

import { MapStatsType, MapSeasonPerformance } from '@types';

/**
 * Score thresholds and weights for map evaluation
 */
const MAP_SCORING = {
  kdRatio: {
    excellent: { threshold: 1.5, score: 10 },
    good: { threshold: 1.2, score: 5 },
    average: { threshold: 1.0, score: 2 }
  },
  winRate: {
    excellent: { threshold: 0.6, score: 10 },
    good: { threshold: 0.5, score: 5 }
  },
  sideBalance: {
    maxScore: 15,
    ideal: { threshold: 0.55, score: 15 },
    good: { threshold: 0.6, score: 10 },
    average: { threshold: 0.65, score: 5 }
  },
  positioningDiversity: {
    highDiversity: { threshold: 5, score: 10 },
    mediumDiversity: { threshold: 3, score: 5 }
  },
  consistency: {
    kdThreshold: 1.2,
    winRateThreshold: 0.55,
    excellent: { threshold: 0.7, score: 15 },
    good: { threshold: 0.5, score: 10 }
  },
  activeSeasonMultiplier: 1.5
} as const;

/**
 * Calculate premium score for a map
 */
export function calculateMapPremiumScore(mapStat: MapStatsType): number {
  let totalScore = 0;

  // Analyze each season's performance
  mapStat.performanceBySeason.forEach((season: MapSeasonPerformance) => {
    totalScore += evaluateMapSeasonPerformance(season);
  });

  // Consistency bonus for multiple seasons
  if (mapStat.performanceBySeason.length > 1) {
    totalScore += calculateMapConsistencyBonus(mapStat.performanceBySeason);
  }

  return totalScore;
}

/**
 * Evaluate a single season's map performance
 */
function evaluateMapSeasonPerformance(season: MapSeasonPerformance): number {
  let seasonScore = 0;

  // 1. K/D Ratio
  seasonScore += scoreKDRatio(season.stats.kills, season.stats.deaths);

  // 2. Win Rate
  seasonScore += scoreWinRate(season.stats.matchesWon, season.stats.matchesLost);

  // 3. Side Balance (attack/defense balance)
  seasonScore += scoreSideBalance(season);

  // 4. Positioning Diversity
  seasonScore += scorePositioningDiversity(season);

  // Active season bonus
  if (season.season.isActive) {
    seasonScore *= MAP_SCORING.activeSeasonMultiplier;
  }

  return seasonScore;
}

/**
 * Score K/D ratio
 */
function scoreKDRatio(kills: number, deaths: number): number {
  const kdRatio = kills / Math.max(1, deaths);
  const { excellent, good, average } = MAP_SCORING.kdRatio;

  if (kdRatio > excellent.threshold) return excellent.score;
  if (kdRatio > good.threshold) return good.score;
  if (kdRatio > average.threshold) return average.score;
  return 0;
}

/**
 * Score win rate
 */
function scoreWinRate(wins: number, losses: number): number {
  const totalMatches = wins + losses;
  if (totalMatches === 0) return 0;

  const winRate = wins / totalMatches;
  const { excellent, good } = MAP_SCORING.winRate;

  if (winRate > excellent.threshold) return excellent.score;
  if (winRate > good.threshold) return good.score;
  return 0;
}

/**
 * Score side balance (performance consistency between attack and defense)
 */
function scoreSideBalance(season: MapSeasonPerformance): number {
  const attackWins = season.attackStats.roundsWon;
  const attackTotal = season.attackStats.roundsWon + season.attackStats.roundsLost;
  const defenseWins = season.defenseStats.roundsWon;
  const defenseTotal = season.defenseStats.roundsWon + season.defenseStats.roundsLost;

  if (attackTotal === 0 || defenseTotal === 0) return 0;

  const attackWinRate = attackWins / attackTotal;
  const defenseWinRate = defenseWins / defenseTotal;

  // Calculate balance score (closer to 50/50 is better)
  const balanceRatio = Math.min(attackWinRate, defenseWinRate) / Math.max(attackWinRate, defenseWinRate);
  const { ideal, good, average } = MAP_SCORING.sideBalance;

  if (balanceRatio > ideal.threshold) return ideal.score;
  if (balanceRatio > good.threshold) return good.score;
  if (balanceRatio > average.threshold) return average.score;
  return 0;
}

/**
 * Score positioning diversity (variety of kill/death locations)
 */
function scorePositioningDiversity(season: MapSeasonPerformance): number {
  // Use heatmap locations as diversity measure
  const attackKillLocations = season.attackStats.HeatmapLocation.killsLocation.length;
  const defenseKillLocations = season.defenseStats.HeatmapLocation.killsLocation.length;

  // Reward diverse positioning for kills (up to a maximum)
  const heatmapDiversity = Math.min(attackKillLocations, 15) + Math.min(defenseKillLocations, 15);
  const diversityScore = Math.ceil(heatmapDiversity / 5);

  return Math.min(diversityScore, MAP_SCORING.positioningDiversity.highDiversity.score);
}

/**
 * Calculate consistency bonus across seasons
 */
function calculateMapConsistencyBonus(seasons: MapSeasonPerformance[]): number {
  const { kdThreshold, winRateThreshold, excellent, good } = MAP_SCORING.consistency;

  // Count seasons with good KD
  const seasonsWithGoodKD = seasons.filter(season =>
    season.stats.kills / Math.max(1, season.stats.deaths) > kdThreshold
  ).length;

  // Count seasons with good win rate
  const seasonsWithGoodWinRate = seasons.filter(season => {
    const totalMatches = season.stats.matchesWon + season.stats.matchesLost;
    return totalMatches > 0 && (season.stats.matchesWon / totalMatches > winRateThreshold);
  }).length;

  // Calculate consistency percentages
  const kdConsistency = seasonsWithGoodKD / seasons.length;
  const winRateConsistency = seasonsWithGoodWinRate / seasons.length;

  let bonusScore = 0;

  // KD consistency bonus
  if (kdConsistency > excellent.threshold) {
    bonusScore += excellent.score;
  } else if (kdConsistency > good.threshold) {
    bonusScore += good.score;
  }

  // Win rate consistency bonus
  if (winRateConsistency > excellent.threshold) {
    bonusScore += excellent.score;
  } else if (winRateConsistency > good.threshold) {
    bonusScore += good.score;
  }

  return bonusScore;
}
