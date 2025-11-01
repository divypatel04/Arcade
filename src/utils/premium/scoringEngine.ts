/**
 * Agent Stats Scoring Engine
 * Calculates premium scores for agent performance
 */

import { AgentStatType, AgentSeasonPerformance } from '@types';

/**
 * Score thresholds and weights for agent evaluation
 */
const AGENT_SCORING = {
  kdRatio: {
    excellent: { threshold: 1.5, score: 10 },
    good: { threshold: 1.2, score: 5 },
    average: { threshold: 1.0, score: 2 }
  },
  winRate: {
    excellent: { threshold: 0.6, score: 10 },
    good: { threshold: 0.5, score: 5 }
  },
  clutch: {
    maxScore: 20,
    multipliers: { '1v1': 1, '1v2': 2, '1v3': 3, '1v4': 4, '1v5': 5 }
  },
  abilities: {
    kills: { high: { threshold: 20, score: 10 }, medium: { threshold: 10, score: 5 } },
    damage: { high: { threshold: 2000, score: 10 }, medium: { threshold: 1000, score: 5 } }
  },
  mapPerformance: {
    scorePerGoodMap: 2,
    winRateThreshold: 0.6
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
 * Calculate premium score for an agent
 */
export function calculateAgentPremiumScore(agentStat: AgentStatType): number {
  let totalScore = 0;

  // Analyze each season's performance
  agentStat.performanceBySeason.forEach(season => {
    totalScore += evaluateSeasonPerformance(season);
  });

  // Consistency bonus for multiple seasons
  if (agentStat.performanceBySeason.length > 1) {
    totalScore += calculateConsistencyBonus(agentStat.performanceBySeason);
  }

  return totalScore;
}

/**
 * Evaluate a single season's performance
 */
function evaluateSeasonPerformance(season: AgentSeasonPerformance): number {
  let seasonScore = 0;

  // 1. K/D Ratio
  seasonScore += scoreKDRatio(season.stats.kills, season.stats.deaths);

  // 2. Win Rate
  seasonScore += scoreWinRate(season.stats.matchesWon, season.stats.matchesLost);

  // 3. Clutch Performance
  seasonScore += scoreClutchPerformance(season);

  // 4. Ability Impact
  seasonScore += scoreAbilityImpact(season);

  // 5. Map Performance
  seasonScore += scoreMapPerformance(season);

  // Active season bonus
  if (season.season.isActive) {
    seasonScore *= AGENT_SCORING.activeSeasonMultiplier;
  }

  return seasonScore;
}

/**
 * Score K/D ratio
 */
function scoreKDRatio(kills: number, deaths: number): number {
  const kdRatio = kills / Math.max(1, deaths);
  const { excellent, good, average } = AGENT_SCORING.kdRatio;

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
  const { excellent, good } = AGENT_SCORING.winRate;

  if (winRate > excellent.threshold) return excellent.score;
  if (winRate > good.threshold) return good.score;
  return 0;
}

/**
 * Score clutch performance (1vX wins)
 */
function scoreClutchPerformance(season: AgentSeasonPerformance): number {
  const { multipliers, maxScore } = AGENT_SCORING.clutch;

  let clutchScore = 0;

  // Attack side clutches
  const attackClutch = season.attackStats.clutchStats;
  clutchScore += attackClutch["1v1Wins"] * multipliers['1v1'];
  clutchScore += attackClutch["1v2Wins"] * multipliers['1v2'];
  clutchScore += attackClutch["1v3Wins"] * multipliers['1v3'];
  clutchScore += attackClutch["1v4Wins"] * multipliers['1v4'];
  clutchScore += attackClutch["1v5Wins"] * multipliers['1v5'];

  // Defense side clutches
  const defenseClutch = season.defenseStats.clutchStats;
  clutchScore += defenseClutch["1v1Wins"] * multipliers['1v1'];
  clutchScore += defenseClutch["1v2Wins"] * multipliers['1v2'];
  clutchScore += defenseClutch["1v3Wins"] * multipliers['1v3'];
  clutchScore += defenseClutch["1v4Wins"] * multipliers['1v4'];
  clutchScore += defenseClutch["1v5Wins"] * multipliers['1v5'];

  return Math.min(maxScore, clutchScore);
}

/**
 * Score ability impact (kills and damage)
 */
function scoreAbilityImpact(season: AgentSeasonPerformance): number {
  let abilityScore = 0;

  const totalKills = season.abilityAndUltimateImpact.reduce((sum, ability) => sum + ability.kills, 0);
  const totalDamage = season.abilityAndUltimateImpact.reduce((sum, ability) => sum + ability.damage, 0);

  // Score kills
  const { kills, damage } = AGENT_SCORING.abilities;
  if (totalKills > kills.high.threshold) {
    abilityScore += kills.high.score;
  } else if (totalKills > kills.medium.threshold) {
    abilityScore += kills.medium.score;
  }

  // Score damage
  if (totalDamage > damage.high.threshold) {
    abilityScore += damage.high.score;
  } else if (totalDamage > damage.medium.threshold) {
    abilityScore += damage.medium.score;
  }

  return abilityScore;
}

/**
 * Score map performance (win rate across maps)
 */
function scoreMapPerformance(season: AgentSeasonPerformance): number {
  const { scorePerGoodMap, winRateThreshold } = AGENT_SCORING.mapPerformance;

  const mapsWithGoodWinRate = season.mapStats.filter(map => {
    const totalMapMatches = map.wins + map.losses;
    return totalMapMatches > 0 && (map.wins / totalMapMatches) > winRateThreshold;
  }).length;

  return mapsWithGoodWinRate * scorePerGoodMap;
}

/**
 * Calculate consistency bonus across seasons
 */
function calculateConsistencyBonus(seasons: AgentSeasonPerformance[]): number {
  const { kdThreshold, winRateThreshold, excellent, good } = AGENT_SCORING.consistency;

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
