/**
 * Weapon Stats Scoring Engine
 * Calculates premium scores for weapon performance
 */

import { WeaponStatsType, WeaponSeasonPerformance } from '@types';

/**
 * Weapon type-specific scoring thresholds
 */
const WEAPON_THRESHOLDS = {
  sniper: {
    headshot: { high: 60, medium: 40 }
  },
  shotgun: {
    headshot: { high: 15, medium: 8 }
  },
  smg: {
    headshot: { high: 25, medium: 15 }
  },
  rifle: {
    headshot: { high: 30, medium: 20 }
  },
  pistol: {
    roundsPlayed: 30
  },
  default: {
    headshot: { high: 30, medium: 20 },
    roundsPlayed: 50
  }
} as const;

/**
 * Score thresholds and weights for weapon evaluation
 */
const WEAPON_SCORING = {
  headshotPercentage: {
    exceptional: 25,
    good: 15,
    base: 5
  },
  killEfficiency: {
    exceptional: { threshold: 0.5, score: 20 },
    great: { threshold: 0.3, score: 12 },
    good: { threshold: 0.15, score: 6 }
  },
  damageEfficiency: {
    exceptional: { threshold: 140, score: 15 },
    great: { threshold: 100, score: 10 },
    good: { threshold: 70, score: 5 }
  },
  firstKillRate: {
    exceptional: { threshold: 0.2, score: 20 },
    great: { threshold: 0.1, score: 12 },
    good: { threshold: 0.05, score: 5 }
  },
  volumeOfUse: {
    significant: { multiplier: 3, score: 15 },
    high: { multiplier: 2, score: 10 },
    base: { multiplier: 1, score: 5 }
  },
  aces: {
    multiple: { threshold: 3, score: 15 },
    some: { threshold: 1, score: 10 },
    any: { score: 5 }
  },
  shotDistribution: {
    maxSniperBonus: 20,
    maxShotgunBonus: 15,
    maxBalancedBonus: 10,
    maxGeneralBonus: 10
  },
  consistency: {
    killEfficiency: { threshold: 0.25, excellent: 0.7, good: 0.5, scores: { excellent: 15, good: 8 } },
    headshots: { threshold: 25, excellent: 0.7, good: 0.5, scores: { excellent: 18, good: 10 } },
    usage: { threshold: 40, excellent: 0.7, good: 0.5, scores: { excellent: 10, good: 5 } }
  },
  activeSeasonMultiplier: 1.2
} as const;

/**
 * Calculate premium score for a weapon
 */
export function calculateWeaponPremiumScore(weaponStat: WeaponStatsType): number {
  let totalScore = 0;

  // Analyze each season's performance
  weaponStat.performanceBySeason.forEach((season: WeaponSeasonPerformance) => {
    totalScore += evaluateWeaponSeasonPerformance(
      season,
      weaponStat.weapon.type,
      weaponStat.weapon.name
    );
  });

  // Consistency bonus for multiple seasons
  if (weaponStat.performanceBySeason.length > 1) {
    totalScore += calculateWeaponConsistencyBonus(weaponStat.performanceBySeason);
  }

  return totalScore;
}

/**
 * Evaluate a single season's weapon performance
 */
function evaluateWeaponSeasonPerformance(
  season: WeaponSeasonPerformance,
  weaponType: string,
  weaponName: string
): number {
  let seasonScore = 0;
  const stats = season.stats;

  // 1. Headshot percentage
  seasonScore += scoreHeadshotPercentage(stats, weaponType);

  // 2. Kill efficiency
  seasonScore += scoreKillEfficiency(stats.avgKillsPerRound);

  // 3. Damage efficiency
  seasonScore += scoreDamageEfficiency(stats.avgDamagePerRound);

  // 4. First kill rate
  seasonScore += scoreFirstKillRate(stats.firstKills, stats.roundsPlayed);

  // 5. Volume of use
  seasonScore += scoreVolumeOfUse(stats.roundsPlayed, weaponName);

  // 6. Ace achievements
  seasonScore += scoreAces(stats.aces);

  // 7. Shot distribution
  seasonScore += scoreShotDistribution(stats, weaponType);

  // Active season bonus
  if (season.season.isActive) {
    seasonScore *= WEAPON_SCORING.activeSeasonMultiplier;
  }

  return seasonScore;
}

/**
 * Score headshot percentage based on weapon type
 */
function scoreHeadshotPercentage(stats: any, weaponType: string): number {
  const totalShots = stats.headshots + stats.bodyshots + stats.legshots;
  if (totalShots === 0) return 0;

  const headshotPercentage = (stats.headshots / totalShots) * 100;

  // Get weapon-specific thresholds
  const weaponTypeLower = weaponType.toLowerCase();
  let highThreshold: number = WEAPON_THRESHOLDS.default.headshot.high;
  let mediumThreshold: number = WEAPON_THRESHOLDS.default.headshot.medium;

  if (weaponTypeLower === 'sniper') {
    highThreshold = WEAPON_THRESHOLDS.sniper.headshot.high;
    mediumThreshold = WEAPON_THRESHOLDS.sniper.headshot.medium;
  } else if (weaponTypeLower === 'shotgun') {
    highThreshold = WEAPON_THRESHOLDS.shotgun.headshot.high;
    mediumThreshold = WEAPON_THRESHOLDS.shotgun.headshot.medium;
  } else if (weaponTypeLower === 'smg') {
    highThreshold = WEAPON_THRESHOLDS.smg.headshot.high;
    mediumThreshold = WEAPON_THRESHOLDS.smg.headshot.medium;
  } else if (weaponTypeLower === 'rifle') {
    highThreshold = WEAPON_THRESHOLDS.rifle.headshot.high;
    mediumThreshold = WEAPON_THRESHOLDS.rifle.headshot.medium;
  }

  if (headshotPercentage > highThreshold) {
    return WEAPON_SCORING.headshotPercentage.exceptional;
  } else if (headshotPercentage > mediumThreshold) {
    return WEAPON_SCORING.headshotPercentage.good;
  } else if (headshotPercentage > 10) {
    return WEAPON_SCORING.headshotPercentage.base;
  }

  return 0;
}

/**
 * Score kill efficiency
 */
function scoreKillEfficiency(avgKillsPerRound: number): number {
  const { exceptional, great, good } = WEAPON_SCORING.killEfficiency;

  if (avgKillsPerRound > exceptional.threshold) return exceptional.score;
  if (avgKillsPerRound > great.threshold) return great.score;
  if (avgKillsPerRound > good.threshold) return good.score;
  return 0;
}

/**
 * Score damage efficiency
 */
function scoreDamageEfficiency(avgDamagePerRound: number): number {
  const { exceptional, great, good } = WEAPON_SCORING.damageEfficiency;

  if (avgDamagePerRound > exceptional.threshold) return exceptional.score;
  if (avgDamagePerRound > great.threshold) return great.score;
  if (avgDamagePerRound > good.threshold) return good.score;
  return 0;
}

/**
 * Score first kill rate
 */
function scoreFirstKillRate(firstKills: number, roundsPlayed: number): number {
  const firstKillRate = firstKills / Math.max(1, roundsPlayed);
  const { exceptional, great, good } = WEAPON_SCORING.firstKillRate;

  if (firstKillRate > exceptional.threshold) return exceptional.score;
  if (firstKillRate > great.threshold) return great.score;
  if (firstKillRate > good.threshold) return good.score;
  return 0;
}

/**
 * Score volume of use
 */
function scoreVolumeOfUse(roundsPlayed: number, weaponName: string): number {
  // Determine threshold based on weapon type
  const isPistol = ['pistol', 'classic', 'sheriff', 'ghost'].includes(weaponName.toLowerCase());
  const baseThreshold = isPistol ? 
    WEAPON_THRESHOLDS.pistol.roundsPlayed : 
    WEAPON_THRESHOLDS.default.roundsPlayed;

  const { significant, high, base } = WEAPON_SCORING.volumeOfUse;

  if (roundsPlayed > baseThreshold * significant.multiplier) return significant.score;
  if (roundsPlayed > baseThreshold * high.multiplier) return high.score;
  if (roundsPlayed > baseThreshold * base.multiplier) return base.score;
  return 0;
}

/**
 * Score ace achievements
 */
function scoreAces(aces: number): number {
  const { multiple, some, any } = WEAPON_SCORING.aces;

  if (aces > multiple.threshold) return multiple.score;
  if (aces > some.threshold) return some.score;
  if (aces > 0) return any.score;
  return 0;
}

/**
 * Score shot distribution based on weapon type
 */
function scoreShotDistribution(stats: any, weaponType: string): number {
  const totalShots = stats.headshots + stats.bodyshots + stats.legshots;
  if (totalShots === 0) return 0;

  const weaponTypeLower = weaponType.toLowerCase();

  switch (weaponTypeLower) {
    case 'sniper':
      // Reward headshots heavily, penalize legshots
      const sniperBonus = Math.min(WEAPON_SCORING.shotDistribution.maxSniperBonus, stats.headshots / 5);
      const sniperPenalty = Math.min(10, stats.legshots / 10);
      return sniperBonus - sniperPenalty;

    case 'shotgun':
      // Body shots are acceptable
      return Math.min(WEAPON_SCORING.shotDistribution.maxShotgunBonus, stats.bodyshots / 20);

    case 'smg':
    case 'rifle':
      // Balanced shooting is important
      const headshotRatio = stats.headshots / totalShots * 2;
      const balancedShooting = 1 - Math.abs(headshotRatio - 0.5);
      return Math.round(balancedShooting * WEAPON_SCORING.shotDistribution.maxBalancedBonus);

    default:
      // General evaluation
      if (stats.headshots > stats.legshots * 2) {
        return WEAPON_SCORING.shotDistribution.maxGeneralBonus;
      } else if (stats.headshots > stats.legshots) {
        return WEAPON_SCORING.shotDistribution.maxGeneralBonus / 2;
      }
      return 0;
  }
}

/**
 * Calculate consistency bonus across seasons
 */
function calculateWeaponConsistencyBonus(seasons: WeaponSeasonPerformance[]): number {
  let consistencyBonus = 0;

  // Kill efficiency consistency
  const seasonsWithGoodKillEfficiency = seasons.filter(season =>
    season.stats.avgKillsPerRound > WEAPON_SCORING.consistency.killEfficiency.threshold
  ).length;

  // Headshot consistency
  const seasonsWithGoodHeadshots = seasons.filter(season => {
    const totalShots = season.stats.headshots + season.stats.bodyshots + season.stats.legshots;
    const headshotPercentage = totalShots > 0 ? (season.stats.headshots / totalShots) * 100 : 0;
    return headshotPercentage > WEAPON_SCORING.consistency.headshots.threshold;
  }).length;

  // Usage consistency
  const seasonsWithSignificantUsage = seasons.filter(season =>
    season.stats.roundsPlayed > WEAPON_SCORING.consistency.usage.threshold
  ).length;

  // Calculate consistency percentages
  const killEfficiencyConsistency = seasonsWithGoodKillEfficiency / seasons.length;
  const headshotConsistency = seasonsWithGoodHeadshots / seasons.length;
  const usageConsistency = seasonsWithSignificantUsage / seasons.length;

  // Award bonus points
  const { killEfficiency, headshots, usage } = WEAPON_SCORING.consistency;

  if (killEfficiencyConsistency > killEfficiency.excellent) {
    consistencyBonus += killEfficiency.scores.excellent;
  } else if (killEfficiencyConsistency > killEfficiency.good) {
    consistencyBonus += killEfficiency.scores.good;
  }

  if (headshotConsistency > headshots.excellent) {
    consistencyBonus += headshots.scores.excellent;
  } else if (headshotConsistency > headshots.good) {
    consistencyBonus += headshots.scores.good;
  }

  if (usageConsistency > usage.excellent) {
    consistencyBonus += usage.scores.excellent;
  } else if (usageConsistency > usage.good) {
    consistencyBonus += usage.scores.good;
  }

  return consistencyBonus;
}
