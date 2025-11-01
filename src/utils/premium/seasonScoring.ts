/**
 * Season Stats Scoring Engine
 * Calculates premium scores for season performance
 */

import { SeasonStatsType } from '@types';

/**
 * Score thresholds and weights for season evaluation
 */
const SEASON_SCORING = {
  kdRatio: {
    exceptional: { threshold: 1.8, score: 20 },
    great: { threshold: 1.5, score: 15 },
    good: { threshold: 1.2, score: 10 },
    average: { threshold: 1.0, score: 5 }
  },
  winRate: {
    exceptional: { threshold: 0.65, score: 25 },
    good: { threshold: 0.55, score: 15 },
    average: { threshold: 0.5, score: 8 }
  },
  roundWinRate: {
    excellent: { threshold: 0.55, score: 15 },
    good: { threshold: 0.5, score: 7 }
  },
  mvpRate: {
    exceptional: { threshold: 0.3, score: 20 },
    great: { threshold: 0.2, score: 15 },
    good: { threshold: 0.1, score: 8 }
  },
  firstKillRate: {
    exceptional: { threshold: 0.5, score: 15 },
    good: { threshold: 0.3, score: 10 },
    average: { threshold: 0.2, score: 5 }
  },
  aceRate: {
    exceptional: { threshold: 0.1, score: 15 },
    good: { threshold: 0.05, score: 10 },
    any: { score: 5 }
  },
  damagePerRound: {
    exceptional: { threshold: 150, score: 15 },
    great: { threshold: 130, score: 10 },
    good: { threshold: 100, score: 5 }
  },
  objectiveRate: {
    exceptional: { threshold: 1.0, score: 15 },
    good: { threshold: 0.7, score: 10 },
    average: { threshold: 0.5, score: 5 }
  },
  rank: {
    immortal: { threshold: 24, score: 25 },
    diamond: { threshold: 21, score: 20 },
    platinum: { threshold: 18, score: 15 },
    gold: { threshold: 15, score: 10 },
    silver: { threshold: 12, score: 5 }
  },
  playtimeHours: {
    dedicated: { threshold: 100, score: 10 },
    significant: { threshold: 50, score: 5 },
    moderate: { threshold: 20, score: 2 }
  },
  activeSeasonMultiplier: 1.15
} as const;

/**
 * Calculate premium score for a season
 */
export function calculateSeasonPremiumScore(seasonStat: SeasonStatsType): number {
  let score = 0;
  const stats = seasonStat.stats;

  // 1. K/D Ratio - core combat effectiveness
  score += scoreKDRatio(stats.kills, stats.deaths);

  // 2. Win Rate - fundamental success metric
  score += scoreWinRate(stats.matchesWon, stats.matchesPlayed);

  // 3. Round Win Rate - more granular success metric
  score += scoreRoundWinRate(stats.roundsWon, stats.totalRounds);

  // 4. MVP Frequency - leadership and impact
  score += scoreMVPRate(stats.mvps, stats.matchesPlayed);

  // 5. First Kill Ratio - opening impact
  score += scoreFirstKillRate(stats.firstKill, stats.matchesPlayed);

  // 6. Ace Frequency - exceptional round performance
  score += scoreAceRate(stats.aces, stats.matchesPlayed);

  // 7. Damage Efficiency - damage per round
  score += scoreDamageEfficiency(stats.damage, stats.totalRounds);

  // 8. Objective Play - plants and defuses
  score += scoreObjectivePlay(stats.plants, stats.defuses, stats.matchesPlayed);

  // 9. Rank Achievement
  score += scoreRank(stats.highestRank);

  // 10. Playtime Dedication
  score += scorePlaytime(stats.playtimeMillis);

  // Apply active season bonus
  if (seasonStat.season.isActive) {
    score *= SEASON_SCORING.activeSeasonMultiplier;
  }

  return score;
}

/**
 * Score K/D ratio
 */
function scoreKDRatio(kills: number, deaths: number): number {
  const kdRatio = kills / Math.max(1, deaths);
  const { exceptional, great, good, average } = SEASON_SCORING.kdRatio;

  if (kdRatio > exceptional.threshold) return exceptional.score;
  if (kdRatio > great.threshold) return great.score;
  if (kdRatio > good.threshold) return good.score;
  if (kdRatio > average.threshold) return average.score;
  return 0;
}

/**
 * Score win rate
 */
function scoreWinRate(wins: number, totalMatches: number): number {
  const winRate = wins / Math.max(1, totalMatches);
  const { exceptional, good, average } = SEASON_SCORING.winRate;

  if (winRate > exceptional.threshold) return exceptional.score;
  if (winRate > good.threshold) return good.score;
  if (winRate > average.threshold) return average.score;
  return 0;
}

/**
 * Score round win rate
 */
function scoreRoundWinRate(roundsWon: number, totalRounds: number): number {
  const roundWinRate = roundsWon / Math.max(1, totalRounds);
  const { excellent, good } = SEASON_SCORING.roundWinRate;

  if (roundWinRate > excellent.threshold) return excellent.score;
  if (roundWinRate > good.threshold) return good.score;
  return 0;
}

/**
 * Score MVP rate
 */
function scoreMVPRate(mvps: number, totalMatches: number): number {
  const mvpRate = mvps / Math.max(1, totalMatches);
  const { exceptional, great, good } = SEASON_SCORING.mvpRate;

  if (mvpRate > exceptional.threshold) return exceptional.score;
  if (mvpRate > great.threshold) return great.score;
  if (mvpRate > good.threshold) return good.score;
  return 0;
}

/**
 * Score first kill rate
 */
function scoreFirstKillRate(firstKills: number, totalMatches: number): number {
  const firstKillRatio = firstKills / Math.max(1, totalMatches);
  const { exceptional, good, average } = SEASON_SCORING.firstKillRate;

  if (firstKillRatio > exceptional.threshold) return exceptional.score;
  if (firstKillRatio > good.threshold) return good.score;
  if (firstKillRatio > average.threshold) return average.score;
  return 0;
}

/**
 * Score ace rate
 */
function scoreAceRate(aces: number, totalMatches: number): number {
  const aceRate = aces / Math.max(1, totalMatches);
  const { exceptional, good, any } = SEASON_SCORING.aceRate;

  if (aceRate > exceptional.threshold) return exceptional.score;
  if (aceRate > good.threshold) return good.score;
  if (aces > 0) return any.score;
  return 0;
}

/**
 * Score damage efficiency
 */
function scoreDamageEfficiency(totalDamage: number, totalRounds: number): number {
  const damagePerRound = totalDamage / Math.max(1, totalRounds);
  const { exceptional, great, good } = SEASON_SCORING.damagePerRound;

  if (damagePerRound > exceptional.threshold) return exceptional.score;
  if (damagePerRound > great.threshold) return great.score;
  if (damagePerRound > good.threshold) return good.score;
  return 0;
}

/**
 * Score objective play
 */
function scoreObjectivePlay(plants: number, defuses: number, totalMatches: number): number {
  const objectivePlays = plants + defuses;
  const objectiveRate = objectivePlays / Math.max(1, totalMatches);
  const { exceptional, good, average } = SEASON_SCORING.objectiveRate;

  if (objectiveRate > exceptional.threshold) return exceptional.score;
  if (objectiveRate > good.threshold) return good.score;
  if (objectiveRate > average.threshold) return average.score;
  return 0;
}

/**
 * Score rank achievement
 */
function scoreRank(highestRank: number): number {
  const { immortal, diamond, platinum, gold, silver } = SEASON_SCORING.rank;

  if (highestRank > immortal.threshold) return immortal.score;
  if (highestRank > diamond.threshold) return diamond.score;
  if (highestRank > platinum.threshold) return platinum.score;
  if (highestRank > gold.threshold) return gold.score;
  if (highestRank > silver.threshold) return silver.score;
  return 0;
}

/**
 * Score playtime dedication
 */
function scorePlaytime(playtimeMillis: number): number {
  const playtimeHours = playtimeMillis / (1000 * 60 * 60);
  const { dedicated, significant, moderate } = SEASON_SCORING.playtimeHours;

  if (playtimeHours > dedicated.threshold) return dedicated.score;
  if (playtimeHours > significant.threshold) return significant.score;
  if (playtimeHours > moderate.threshold) return moderate.score;
  return 0;
}
