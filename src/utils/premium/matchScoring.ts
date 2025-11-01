/**
 * Match Stats Scoring Engine
 * Calculates premium scores for individual match performance
 */

import { MatchStatsType } from '@types';

/**
 * Score thresholds and weights for match evaluation
 */
const MATCH_SCORING = {
  rankedMultiplier: 1.2,
  unrankedMultiplier: 1.0,
  kdRatio: {
    exceptional: { threshold: 3.0, score: 15 },
    great: { threshold: 2.0, score: 12 },
    good: { threshold: 1.5, score: 8 },
    average: { threshold: 1.0, score: 5 }
  },
  headshotPercentage: {
    exceptional: { threshold: 40, score: 10 },
    good: { threshold: 30, score: 7 },
    average: { threshold: 20, score: 4 }
  },
  acs: {
    threshold: 300,
    maxScore: 15
  },
  impactScore: {
    high: { threshold: 500, weight: 30 },
    consistent: { threshold: 300, weight: 20 }
  },
  clutchWins: {
    pointsPerClutch: 3,
    maxScore: 10
  },
  multiKills: {
    quad: { kills: 4, points: 3 },
    triple: { kills: 3, points: 2 },
    maxScore: 10
  },
  killShare: {
    dominant: { threshold: 30, score: 10 },
    strong: { threshold: 25, score: 7 },
    good: { threshold: 20, score: 4 }
  },
  scoreRange: {
    min: 0,
    max: 100
  }
} as const;

/**
 * Calculate premium score for a match
 */
export function calculateMatchPremiumScore(matchStat: MatchStatsType): number {
  let score = 0;
  const { general, playerVsplayerStat: pvp, roundPerformace } = matchStat.stats;

  if (!pvp?.user?.stats) return 0;

  // Base multiplier for match type
  const matchMultiplier = general.isRanked ? 
    MATCH_SCORING.rankedMultiplier : 
    MATCH_SCORING.unrankedMultiplier;

  // Core performance metrics (40 points max)
  score += calculateCorePerformance(pvp.user.stats, general.roundsPlayed);

  // Round impact metrics (30 points max)
  if (roundPerformace) {
    score += calculateRoundImpact(roundPerformace, general.roundsPlayed);
  }

  // Clutch and momentum metrics (20 points max)
  if (roundPerformace) {
    score += calculateClutchImpact(pvp.user.stats, roundPerformace);
  }

  // Team contribution metrics (10 points max)
  score += calculateTeamContribution(pvp);

  // Apply match multiplier and ensure score is between 0-100
  return Math.min(
    MATCH_SCORING.scoreRange.max,
    Math.max(MATCH_SCORING.scoreRange.min, score * matchMultiplier)
  );
}

/**
 * Calculate core performance score (K/D, headshot %, combat score)
 */
function calculateCorePerformance(stats: any, totalRounds: number): number {
  let score = 0;

  // K/D Impact (0-15 points)
  const { kdRatio } = MATCH_SCORING;
  if (stats.kdRatio >= kdRatio.exceptional.threshold) score += kdRatio.exceptional.score;
  else if (stats.kdRatio >= kdRatio.great.threshold) score += kdRatio.great.score;
  else if (stats.kdRatio >= kdRatio.good.threshold) score += kdRatio.good.score;
  else if (stats.kdRatio >= kdRatio.average.threshold) score += kdRatio.average.score;

  // Headshot Precision (0-10 points)
  const hsPercent = stats.headshotPercentage || 0;
  const { headshotPercentage } = MATCH_SCORING;
  if (hsPercent >= headshotPercentage.exceptional.threshold) score += headshotPercentage.exceptional.score;
  else if (hsPercent >= headshotPercentage.good.threshold) score += headshotPercentage.good.score;
  else if (hsPercent >= headshotPercentage.average.threshold) score += headshotPercentage.average.score;

  // Combat Score per Round (0-15 points)
  const acs = (stats.combatScore || 0) / Math.max(1, totalRounds);
  score += Math.min(
    MATCH_SCORING.acs.maxScore,
    (acs / MATCH_SCORING.acs.threshold) * MATCH_SCORING.acs.maxScore
  );

  return score;
}

/**
 * Calculate round impact score
 */
function calculateRoundImpact(rounds: any[], totalRounds: number): number {
  if (!Array.isArray(rounds) || rounds.length === 0) return 0;

  let score = 0;
  let highImpactRounds = 0;
  let consistentRounds = 0;

  rounds.forEach(round => {
    if (!round) return;

    const impactScore = round.impactScore || 0;

    // Count high impact rounds (500+ impact score)
    if (impactScore >= MATCH_SCORING.impactScore.high.threshold) {
      highImpactRounds++;
    }
    // Count consistently good rounds (300+ impact score)
    if (impactScore >= MATCH_SCORING.impactScore.consistent.threshold) {
      consistentRounds++;
    }
  });

  // High impact frequency (0-15 points)
  score += Math.min(15, (highImpactRounds / totalRounds) * MATCH_SCORING.impactScore.high.weight);

  // Consistency (0-15 points)
  score += Math.min(15, (consistentRounds / totalRounds) * MATCH_SCORING.impactScore.consistent.weight);

  return score;
}

/**
 * Calculate clutch impact score
 */
function calculateClutchImpact(stats: any, rounds: any[]): number {
  if (!stats || !Array.isArray(rounds)) return 0;

  let score = 0;

  // Clutch wins (0-10 points)
  const clutchScore = (stats.clutchesWon || 0) * MATCH_SCORING.clutchWins.pointsPerClutch;
  score += Math.min(MATCH_SCORING.clutchWins.maxScore, clutchScore);

  // Multi-kills (0-10 points)
  let multiKillScore = 0;
  rounds.forEach(round => {
    if (!round?.combat?.kills) return;

    if (round.combat.kills >= MATCH_SCORING.multiKills.quad.kills) {
      multiKillScore += MATCH_SCORING.multiKills.quad.points;
    } else if (round.combat.kills >= MATCH_SCORING.multiKills.triple.kills) {
      multiKillScore += MATCH_SCORING.multiKills.triple.points;
    }
  });
  score += Math.min(MATCH_SCORING.multiKills.maxScore, multiKillScore);

  return score;
}

/**
 * Calculate team contribution score
 */
function calculateTeamContribution(pvp: any): number {
  let score = 0;

  // Safely handle potentially undefined data
  if (!pvp?.user?.stats?.kills || !Array.isArray(pvp.teams)) {
    return score;
  }

  const userTeamId = pvp.user.teamId;
  const userTeam = pvp.teams.find((t: any) => t.teamId === userTeamId);

  if (!userTeam?.players) {
    return score;
  }

  // Calculate team's total kills
  const teamTotalKills = userTeam.players.reduce((sum: number, p: any) => {
    return sum + (p.stats?.kills || 0);
  }, 0);

  if (teamTotalKills === 0) {
    return score;
  }

  // Calculate kill share percentage
  const killShare = (pvp.user.stats.kills / teamTotalKills) * 100;

  // Team impact score (0-10 points)
  const { killShare: killShareScoring } = MATCH_SCORING;
  if (killShare >= killShareScoring.dominant.threshold) {
    score += killShareScoring.dominant.score;
  } else if (killShare >= killShareScoring.strong.threshold) {
    score += killShareScoring.strong.score;
  } else if (killShare >= killShareScoring.good.threshold) {
    score += killShareScoring.good.score;
  }

  return score;
}
