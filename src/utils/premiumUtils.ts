import { AgentStatType, SeasonPerformance } from '../types/AgentStatsType';
import { MapStatsType, SeasonPerformance as MapSeasonPerformance } from '../types/MapStatsType';
import { MatchStatType } from '../types/MatchStatType';
import { SeasonStatsType } from '../types/SeasonStatsType';
import { WeaponStatType, SeasonPerformance as WeaponSeasonPerformance } from '../types/WeaponStatsType';

/**
 * Determines which agent stats should be marked as premium based on performance metrics.
 * Takes the top third of agents based on a scoring system.
 * Modifies the input array directly by adding isPremiumStats property.
 * @param agentStats Array of agent stats to evaluate and modify
 */
export const determinePremiumAgentStats = (agentStats: AgentStatType[]): void => {
  // Calculate premium score for each agent
  const agentsWithScores = agentStats.map(agentStat => {
    const score = calculatePremiumScore(agentStat);
    return {
      agentStat,
      premiumScore: score
    };
  });

  // Sort by premium score (descending)
  agentsWithScores.sort((a, b) => b.premiumScore - a.premiumScore);

  // Mark top third (minimum 1) as premium
  const premiumCount = Math.max(1, Math.ceil(agentStats.length / 3));

  // Reset all to false first
  agentStats.forEach(agent => {
    agent.isPremiumStats = false;
  });

  // Mark the top ones as premium
  agentsWithScores.forEach((item, index) => {
    if (index < premiumCount) {
      item.agentStat.isPremiumStats = true;
    }
  });
};

/**
 * Calculates a premium score for an agent based on various performance criteria.
 * Higher score means better performance.
 */
const calculatePremiumScore = (agentStat: AgentStatType): number => {
  let totalScore = 0;

  // Analyze each season's performance
  agentStat.performanceBySeason.forEach(season => {
    totalScore += evaluateSeasonPerformance(season);
  });

  // If there are multiple seasons, calculate consistency bonus
  if (agentStat.performanceBySeason.length > 1) {
    totalScore += calculateConsistencyBonus(agentStat.performanceBySeason);
  }

  return totalScore;
};

/**
 * Evaluates a single season's performance metrics
 */
const evaluateSeasonPerformance = (season: SeasonPerformance): number => {
  let seasonScore = 0;

  // 1. K/D Ratio
  const kdRatio = season.stats.kills / Math.max(1, season.stats.deaths);
  if (kdRatio > 1.5) {
    seasonScore += 10;
  } else if (kdRatio > 1.2) {
    seasonScore += 5;
  } else if (kdRatio > 1.0) {
    seasonScore += 2;
  }

  // 2. Win Rate
  const totalMatches = season.stats.matchesWon + season.stats.matchesLost;
  const winRate = totalMatches > 0 ? season.stats.matchesWon / totalMatches : 0;
  if (winRate > 0.6) {
    seasonScore += 10;
  } else if (winRate > 0.5) {
    seasonScore += 5;
  }

  // 3. Clutch Performance
  const clutchScore =
    season.attackStats.clutchStats["1v1Wins"] +
    season.attackStats.clutchStats["1v2Wins"] * 2 +
    season.attackStats.clutchStats["1v3Wins"] * 3 +
    season.attackStats.clutchStats["1v4Wins"] * 4 +
    season.attackStats.clutchStats["1v5Wins"] * 5 +
    season.defenseStats.clutchStats["1v1Wins"] +
    season.defenseStats.clutchStats["1v2Wins"] * 2 +
    season.defenseStats.clutchStats["1v3Wins"] * 3 +
    season.defenseStats.clutchStats["1v4Wins"] * 4 +
    season.defenseStats.clutchStats["1v5Wins"] * 5;

  seasonScore += Math.min(20, clutchScore);

  // 4. Ability Impact
  let abilityKills = 0;
  let abilityDamage = 0;

  season.abilityAndUltimateImpact.forEach(ability => {
    abilityKills += ability.kills;
    abilityDamage += ability.damage;
  });

  if (abilityKills > 20) {
    seasonScore += 10;
  } else if (abilityKills > 10) {
    seasonScore += 5;
  }

  if (abilityDamage > 2000) {
    seasonScore += 10;
  } else if (abilityDamage > 1000) {
    seasonScore += 5;
  }

  // 5. Map Performance
  const mapsWithGoodWinRate = season.mapStats.filter(map => {
    const totalMapMatches = map.wins + map.losses;
    return totalMapMatches > 0 && (map.wins / totalMapMatches) > 0.6;
  }).length;

  seasonScore += mapsWithGoodWinRate * 2;

  // If this is the current active season, weigh it more heavily
  if (season.season.isActive) {
    seasonScore *= 1.5;
  }

  return seasonScore;
};

/**
 * Calculates a consistency bonus for performance across multiple seasons
 */
const calculateConsistencyBonus = (seasons: SeasonPerformance[]): number => {
  // Check how many seasons have good KD ratios
  const seasonsWithGoodKD = seasons.filter(season =>
    season.stats.kills / Math.max(1, season.stats.deaths) > 1.2
  ).length;

  // Check how many seasons have good win rates
  const seasonsWithGoodWinRate = seasons.filter(season => {
    const totalMatches = season.stats.matchesWon + season.stats.matchesLost;
    return totalMatches > 0 && (season.stats.matchesWon / totalMatches > 0.55);
  }).length;

  // Calculate consistency percentage
  const consistencyPercentageKD = seasonsWithGoodKD / seasons.length;
  const consistencyPercentageWinRate = seasonsWithGoodWinRate / seasons.length;

  // Award bonus points based on consistency
  let consistencyBonus = 0;

  if (consistencyPercentageKD > 0.7) {
    consistencyBonus += 15;
  } else if (consistencyPercentageKD > 0.5) {
    consistencyBonus += 10;
  }

  if (consistencyPercentageWinRate > 0.7) {
    consistencyBonus += 15;
  } else if (consistencyPercentageWinRate > 0.5) {
    consistencyBonus += 10;
  }

  return consistencyBonus;
};

/**
 * Determines which map stats should be marked as premium based on performance metrics.
 * Takes the top third of maps based on a scoring system.
 * Modifies the input array directly by adding isPremiumStats property.
 * @param mapStats Array of map stats to evaluate and modify
 */
export const determinePremiumMapStats = (mapStats: MapStatsType[]): void => {
  // Calculate premium score for each map
  const mapsWithScores = mapStats.map(mapStat => {
    const score = calculateMapPremiumScore(mapStat);
    return {
      mapStat,
      premiumScore: score
    };
  });

  // Sort by premium score (descending)
  mapsWithScores.sort((a, b) => b.premiumScore - a.premiumScore);

  // Mark top third (minimum 1) as premium
  const premiumCount = Math.max(1, Math.ceil(mapStats.length / 3));

  // Reset all to false first
  mapStats.forEach(map => {
    map.isPremiumStats = false;
  });

  // Mark the top ones as premium
  mapsWithScores.forEach((item, index) => {
    if (index < premiumCount) {
      item.mapStat.isPremiumStats = true;
    }
  });
};

/**
 * Calculates a premium score for a map based on various performance criteria.
 * Higher score means better performance.
 */
const calculateMapPremiumScore = (mapStat: MapStatsType): number => {
  let totalScore = 0;

  // Analyze each season's performance
  mapStat.performanceBySeason.forEach(season => {
    totalScore += evaluateMapSeasonPerformance(season);
  });

  // If there are multiple seasons, calculate consistency bonus
  if (mapStat.performanceBySeason.length > 1) {
    totalScore += calculateMapConsistencyBonus(mapStat.performanceBySeason);
  }

  return totalScore;
};

/**
 * Evaluates a single season's performance metrics for a map
 */
const evaluateMapSeasonPerformance = (season: MapSeasonPerformance): number => {
  let seasonScore = 0;

  // 1. K/D Ratio on this map
  const kdRatio = season.stats.kills / Math.max(1, season.stats.deaths);
  if (kdRatio > 1.5) {
    seasonScore += 10;
  } else if (kdRatio > 1.2) {
    seasonScore += 5;
  } else if (kdRatio > 1.0) {
    seasonScore += 2;
  }

  // 2. Win Rate on this map
  const totalMatches = season.stats.matchesWon + season.stats.matchesLost;
  const winRate = totalMatches > 0 ? season.stats.matchesWon / totalMatches : 0;
  if (winRate > 0.6) {
    seasonScore += 15; // Higher weight for map-specific win rate
  } else if (winRate > 0.5) {
    seasonScore += 8;
  }

  // 3. Round Win Rate for attack and defense
  const attackRoundWinRate = season.attackStats.roundsWon / Math.max(1, season.attackStats.roundsWon + season.attackStats.roundsLost);
  const defenseRoundWinRate = season.defenseStats.roundsWon / Math.max(1, season.defenseStats.roundsWon + season.defenseStats.roundsLost);

  // Score balanced performance higher
  const sideBalanceScore = 10 - Math.abs(attackRoundWinRate - defenseRoundWinRate) * 20;
  seasonScore += Math.max(0, sideBalanceScore);

  // Score each side individually
  if (attackRoundWinRate > 0.55) seasonScore += 8;
  if (defenseRoundWinRate > 0.55) seasonScore += 8;

  // 4. Kills per side
  const killsPerSideBalance = Math.min(season.attackStats.kills, season.defenseStats.kills) /
                             Math.max(1, Math.max(season.attackStats.kills, season.defenseStats.kills));

  // Higher score for balanced kill distribution between sides
  seasonScore += Math.round(killsPerSideBalance * 6);

  // 5. First bloods
  if (season.stats.firstKills > 10) {
    seasonScore += 5;
  } else if (season.stats.firstKills > 5) {
    seasonScore += 3;
  }

  // 6. Plants and defuses (if applicable)
  if (season.stats.plants > 10 || season.stats.defuses > 5) {
    seasonScore += 4;
  }

  // 7. Aces - exceptional performance
  seasonScore += Math.min(10, season.stats.aces * 3);

  // 8. Heat map diversity (measures positioning skill)
  const attackKillLocations = season.attackStats.HeatmapLocation.killsLocation.length;
  const defenseKillLocations = season.defenseStats.HeatmapLocation.killsLocation.length;

  // Reward diverse positioning for kills (up to a maximum)
  const heatmapDiversity = Math.min(attackKillLocations, 15) + Math.min(defenseKillLocations, 15);
  seasonScore += Math.ceil(heatmapDiversity / 5);

  // If this is the current active season, weigh it more heavily
  if (season.season.isActive) {
    seasonScore *= 1.5;
  }

  return seasonScore;
};

/**
 * Calculates a consistency bonus for map performance across multiple seasons
 */
const calculateMapConsistencyBonus = (seasons: MapSeasonPerformance[]): number => {
  // Check how many seasons have good KD ratios on this map
  const seasonsWithGoodKD = seasons.filter(season =>
    season.stats.kills / Math.max(1, season.stats.deaths) > 1.2
  ).length;

  // Check how many seasons have good win rates on this map
  const seasonsWithGoodWinRate = seasons.filter(season => {
    const totalMatches = season.stats.matchesWon + season.stats.matchesLost;
    return totalMatches > 0 && (season.stats.matchesWon / totalMatches > 0.55);
  }).length;

  // Check attack/defense balance across seasons
  const seasonsWithBalancedSides = seasons.filter(season => {
    const attackWinRate = season.attackStats.roundsWon / Math.max(1, season.attackStats.roundsWon + season.attackStats.roundsLost);
    const defenseWinRate = season.defenseStats.roundsWon / Math.max(1, season.defenseStats.roundsWon + season.defenseStats.roundsLost);
    // Less than 20% difference between attack and defense win rates
    return Math.abs(attackWinRate - defenseWinRate) < 0.2;
  }).length;

  // Calculate consistency percentages
  const consistencyPercentageKD = seasonsWithGoodKD / seasons.length;
  const consistencyPercentageWinRate = seasonsWithGoodWinRate / seasons.length;
  const consistencyPercentageBalance = seasonsWithBalancedSides / seasons.length;

  // Award bonus points based on consistency
  let consistencyBonus = 0;

  if (consistencyPercentageKD > 0.7) {
    consistencyBonus += 12;
  } else if (consistencyPercentageKD > 0.5) {
    consistencyBonus += 8;
  }

  if (consistencyPercentageWinRate > 0.7) {
    consistencyBonus += 15;
  } else if (consistencyPercentageWinRate > 0.5) {
    consistencyBonus += 10;
  }

  if (consistencyPercentageBalance > 0.7) {
    consistencyBonus += 10; // Reward consistent balanced play on both sides
  } else if (consistencyPercentageBalance > 0.5) {
    consistencyBonus += 5;
  }

  return consistencyBonus;
};

/**
 * Determines which season stats should be marked as premium based on performance metrics.
 * Takes the top performers based on a scoring system.
 * Modifies the input array directly by adding isPremiumStats property.
 * @param seasonStats Array of season stats to evaluate and modify
 */
export const determinePremiumSeasonStats = (seasonStats: SeasonStatsType[]): void => {
  // Calculate premium score for each season stat
  const seasonStatsWithScores = seasonStats.map(seasonStat => {
    const score = calculateSeasonPremiumScore(seasonStat);
    return {
      seasonStat,
      premiumScore: score
    };
  });

  // Sort by premium score (descending)
  seasonStatsWithScores.sort((a, b) => b.premiumScore - a.premiumScore);

  // Mark top third (minimum 1) as premium
  const premiumCount = Math.max(1, Math.ceil(seasonStats.length / 3));

  // Reset all to false first
  seasonStats.forEach(stat => {
    stat.isPremiumStats = false;
  });

  // Mark the top ones as premium
  seasonStatsWithScores.forEach((item, index) => {
    if (index < premiumCount) {
      item.seasonStat.isPremiumStats = true;
    }
  });
};

/**
 * Calculates a premium score for a season's stats based on various performance criteria.
 * Higher score means better performance.
 */
const calculateSeasonPremiumScore = (seasonStat: SeasonStatsType): number => {
  let score = 0;
  const stats = seasonStat.stats;

  // 1. K/D Ratio - core combat effectiveness
  const kdRatio = stats.kills / Math.max(1, stats.deaths);
  if (kdRatio > 1.8) {
    score += 20; // Exceptional K/D
  } else if (kdRatio > 1.5) {
    score += 15;
  } else if (kdRatio > 1.2) {
    score += 10;
  } else if (kdRatio > 1.0) {
    score += 5;
  }

  // 2. Win Rate - fundamental success metric
  const winRate = stats.matchesWon / Math.max(1, stats.matchesPlayed);
  if (winRate > 0.65) {
    score += 25; // Exceptional win rate
  } else if (winRate > 0.55) {
    score += 15;
  } else if (winRate > 0.5) {
    score += 8;
  }

  // 3. Round Win Rate - more granular success metric
  const roundWinRate = stats.roundsWon / Math.max(1, stats.totalRounds);
  if (roundWinRate > 0.55) {
    score += 15;
  } else if (roundWinRate > 0.5) {
    score += 7;
  }

  // 4. MVP Frequency - leadership and impact
  const mvpRate = stats.mvps / Math.max(1, stats.matchesPlayed);
  if (mvpRate > 0.3) {
    score += 20; // Frequently the most valuable player
  } else if (mvpRate > 0.2) {
    score += 15;
  } else if (mvpRate > 0.1) {
    score += 8;
  }

  // 5. First Kill Ratio - opening impact
  const firstKillRatio = stats.firstKill / Math.max(1, stats.matchesPlayed);
  if (firstKillRatio > 0.5) {
    score += 15; // Consistently gets first blood
  } else if (firstKillRatio > 0.3) {
    score += 10;
  } else if (firstKillRatio > 0.2) {
    score += 5;
  }

  // 6. Ace Frequency - exceptional round performance
  const aceRate = stats.aces / Math.max(1, stats.matchesPlayed);
  if (aceRate > 0.1) {
    score += 15; // Gets an ace in more than 10% of matches
  } else if (aceRate > 0.05) {
    score += 10;
  } else if (stats.aces > 0) {
    score += 5; // Any aces are good
  }

  // 7. Damage Efficiency - damage per round
  const damagePerRound = stats.damage / Math.max(1, stats.totalRounds);
  if (damagePerRound > 150) {
    score += 15; // Exceptional damage output
  } else if (damagePerRound > 130) {
    score += 10;
  } else if (damagePerRound > 100) {
    score += 5;
  }

  // 8. Objective Play - plants and defuses
  const objectivePlays = stats.plants + stats.defuses;
  const objectiveRate = objectivePlays / Math.max(1, stats.matchesPlayed);
  if (objectiveRate > 1.0) {
    score += 15; // Consistently plays the objective
  } else if (objectiveRate > 0.7) {
    score += 10;
  } else if (objectiveRate > 0.5) {
    score += 5;
  }

  // 9. Rank Achievement - if available
  if (stats.highestRank > 24) { // Immortal+ (assuming rank numbering system)
    score += 25;
  } else if (stats.highestRank > 21) { // Diamond
    score += 20;
  } else if (stats.highestRank > 18) { // Platinum
    score += 15;
  } else if (stats.highestRank > 15) { // Gold
    score += 10;
  } else if (stats.highestRank > 12) { // Silver
    score += 5;
  }

  // 10. Playtime Dedication - more playtime indicates more data reliability and commitment
  // Convert playtime from milliseconds to hours
  const playtimeHours = stats.playtimeMillis / (1000 * 60 * 60);
  if (playtimeHours > 100) {
    score += 10; // Significant time investment
  } else if (playtimeHours > 50) {
    score += 5;
  } else if (playtimeHours > 20) {
    score += 2;
  }

  // Apply active season bonus if this is the current season
  if (seasonStat.season.isActive) {
    score *= 1.15; // 15% bonus for current season
  }

  return score;
};

/**
 * Determines which weapon stats should be marked as premium based on performance metrics.
 * Takes the top performers based on a scoring system.
 * Modifies the input array directly by adding isPremiumStats property.
 * @param weaponStats Array of weapon stats to evaluate and modify
 */
export const determinePremiumWeaponStats = (weaponStats: WeaponStatType[]): void => {
  // Calculate premium score for each weapon stat
  const weaponStatsWithScores = weaponStats.map(weaponStat => {
    const score = calculateWeaponPremiumScore(weaponStat);
    return {
      weaponStat,
      premiumScore: score
    };
  });

  // Sort by premium score (descending)
  weaponStatsWithScores.sort((a, b) => b.premiumScore - a.premiumScore);

  // Mark top third (minimum 1) as premium
  const premiumCount = Math.max(1, Math.ceil(weaponStats.length / 3));

  // Reset all to false first
  weaponStats.forEach(weapon => {
    weapon.isPremiumStats = false;
  });

  // Mark the top ones as premium
  weaponStatsWithScores.forEach((item, index) => {
    if (index < premiumCount) {
      item.weaponStat.isPremiumStats = true;
    }
  });
};

/**
 * Calculates a premium score for weapon stats based on various performance criteria.
 * Higher score means better performance with the weapon.
 */
const calculateWeaponPremiumScore = (weaponStat: WeaponStatType): number => {
  let totalScore = 0;

  // Analyze each season's performance with this weapon
  weaponStat.performanceBySeason.forEach(season => {
    totalScore += evaluateWeaponSeasonPerformance(season, weaponStat.weapon.type, weaponStat.weapon.name);
  });

  // If there are multiple seasons, calculate consistency bonus
  if (weaponStat.performanceBySeason.length > 1) {
    totalScore += calculateWeaponConsistencyBonus(weaponStat.performanceBySeason);
  }

  return totalScore;
};

/**
 * Evaluates a single season's performance metrics for a weapon
 * Different weapon types have different scoring criteria
 */
const evaluateWeaponSeasonPerformance = (season: WeaponSeasonPerformance, weaponType: string, weaponName: string): number => {
  let seasonScore = 0;
  const stats = season.stats;

  // 1. Headshot percentage - measure of accuracy and skill
  const totalShots = stats.headshots + stats.bodyshots + stats.legshots;
  const headshotPercentage = totalShots > 0 ? (stats.headshots / totalShots) * 100 : 0;

  // Different expectations for different weapon types
  let headshotThresholds: { high: number; medium: number } = { high: 30, medium: 20 };

  // Adjust thresholds based on weapon type
  switch(weaponType.toLowerCase()) {
    case 'sniper':
      headshotThresholds = { high: 60, medium: 40 }; // Higher expectations for snipers
      break;
    case 'shotgun':
      headshotThresholds = { high: 15, medium: 8 }; // Lower expectations for shotguns
      break;
    case 'smg':
      headshotThresholds = { high: 25, medium: 15 }; // Adjusted for SMGs
      break;
    case 'rifle':
    default:
      // Use default thresholds
      break;
  }

  if (headshotPercentage > headshotThresholds.high) {
    seasonScore += 25; // Exceptional headshot percentage
  } else if (headshotPercentage > headshotThresholds.medium) {
    seasonScore += 15;
  } else if (headshotPercentage > 10) {
    seasonScore += 5;
  }

  // 2. Kill efficiency - kills per round
  if (stats.avgKillsPerRound > 0.5) {
    seasonScore += 20; // Exceptional kill efficiency
  } else if (stats.avgKillsPerRound > 0.3) {
    seasonScore += 12;
  } else if (stats.avgKillsPerRound > 0.15) {
    seasonScore += 6;
  }

  // 3. Damage efficiency - damage per round
  if (stats.avgDamagePerRound > 140) {
    seasonScore += 15; // Exceptional damage
  } else if (stats.avgDamagePerRound > 100) {
    seasonScore += 10;
  } else if (stats.avgDamagePerRound > 70) {
    seasonScore += 5;
  }

  // 4. First kill rate - getting opening kills with this weapon
  const firstKillRate = stats.firstKills / Math.max(1, stats.roundsPlayed);
  if (firstKillRate > 0.2) {
    seasonScore += 20; // Frequently gets first blood with this weapon
  } else if (firstKillRate > 0.1) {
    seasonScore += 12;
  } else if (firstKillRate > 0.05) {
    seasonScore += 5;
  }

  // 5. Volume of use - significant sample size
  // Scale depending on weapon type - primary weapons are used more often
  let roundsPlayedThreshold = 50;
  if (['pistol', 'classic', 'sheriff', 'ghost'].includes(weaponName.toLowerCase())) {
    roundsPlayedThreshold = 30; // Lower threshold for pistols
  }

  if (stats.roundsPlayed > roundsPlayedThreshold * 3) {
    seasonScore += 15; // Significant usage
  } else if (stats.roundsPlayed > roundsPlayedThreshold * 2) {
    seasonScore += 10;
  } else if (stats.roundsPlayed > roundsPlayedThreshold) {
    seasonScore += 5;
  }

  // 6. Ace achievements with this weapon
  if (stats.aces > 3) {
    seasonScore += 15; // Multiple aces with this weapon
  } else if (stats.aces > 1) {
    seasonScore += 10;
  } else if (stats.aces > 0) {
    seasonScore += 5;
  }

  // 7. Shot distribution - reward skilled play based on weapon type
  switch(weaponType.toLowerCase()) {
    case 'sniper':
      // For snipers, heavily reward headshots, penalize legshots
      seasonScore += Math.min(20, stats.headshots / 5);
      seasonScore -= Math.min(10, stats.legshots / 10);
      break;
    case 'shotgun':
      // For shotguns, body shots are fine
      seasonScore += Math.min(15, stats.bodyshots / 20);
      break;
    case 'smg':
    case 'rifle':
      // For rifles and SMGs, balance is important
      const balancedShooting = 1 - Math.abs((stats.headshots / Math.max(1, totalShots) * 2) - 0.5);
      seasonScore += Math.round(balancedShooting * 10);
      break;
    default:
      // For other weapons, general evaluation
      if (stats.headshots > stats.legshots * 2) {
        seasonScore += 10; // Good shot distribution
      } else if (stats.headshots > stats.legshots) {
        seasonScore += 5;
      }
  }

  // If this is the current active season, weigh it more heavily
  if (season.season.isActive) {
    seasonScore *= 1.2; // 20% bonus for current season
  }

  return seasonScore;
};

/**
 * Calculates a consistency bonus for weapon performance across multiple seasons
 */
const calculateWeaponConsistencyBonus = (seasons: WeaponSeasonPerformance[]): number => {
  let consistencyBonus = 0;

  // Check how many seasons have good kill efficiency
  const seasonsWithGoodKillEfficiency = seasons.filter(season =>
    season.stats.avgKillsPerRound > 0.25
  ).length;

  // Check how many seasons have good headshot percentage
  const seasonsWithGoodHeadshots = seasons.filter(season => {
    const totalShots = season.stats.headshots + season.stats.bodyshots + season.stats.legshots;
    const headshotPercentage = totalShots > 0 ? (season.stats.headshots / totalShots) * 100 : 0;
    return headshotPercentage > 25;
  }).length;

  // Check how many seasons have significant usage
  const seasonsWithSignificantUsage = seasons.filter(season =>
    season.stats.roundsPlayed > 40
  ).length;

  // Calculate consistency percentages
  const consistencyPercentageKillEfficiency = seasonsWithGoodKillEfficiency / seasons.length;
  const consistencyPercentageHeadshots = seasonsWithGoodHeadshots / seasons.length;
  const consistencyPercentageUsage = seasonsWithSignificantUsage / seasons.length;

  // Award bonus points based on consistency
  if (consistencyPercentageKillEfficiency > 0.7) {
    consistencyBonus += 15;
  } else if (consistencyPercentageKillEfficiency > 0.5) {
    consistencyBonus += 8;
  }

  if (consistencyPercentageHeadshots > 0.7) {
    consistencyBonus += 18;
  } else if (consistencyPercentageHeadshots > 0.5) {
    consistencyBonus += 10;
  }

  if (consistencyPercentageUsage > 0.7) {
    consistencyBonus += 10; // Consistently uses this weapon across seasons
  } else if (consistencyPercentageUsage > 0.5) {
    consistencyBonus += 5;
  }

  return consistencyBonus;
};

/**
 * Determines which match stats should be marked as premium based on performance metrics.
 * Evaluates individual match performances and marks the top ones as premium.
 * Modifies the input array directly by adding isPremiumStats property.
 * @param matchStats Array of match stats to evaluate and modify
 */
export const determinePremiumMatchStats = (matchStats: MatchStatType[]): void => {
  // Calculate premium score for each match
  const matchesWithScores = matchStats.map(matchStat => ({
    matchStat,
    premiumScore: calculateMatchPremiumScore(matchStat)
  }));

  // Sort by premium score (descending)
  matchesWithScores.sort((a, b) => b.premiumScore - a.premiumScore);

  // Reset all to false first
  matchStats.forEach(match => match.isPremiumStats = false);

  // For ranked games: Mark matches with score > 75 as premium
  // For unranked: Mark matches with score > 85 as premium
  // Additionally, ensure at least top 20% of matches are premium
  const minPremiumMatches = Math.max(1, Math.ceil(matchStats.length * 0.2));

  matchesWithScores.forEach((item, index) => {
    const isRanked = item.matchStat.stats.general.isRanked;
    const threshold = isRanked ? 75 : 85;

    if (item.premiumScore >= threshold || index < minPremiumMatches) {
      item.matchStat.isPremiumStats = true;
    }
  });
}

const calculateMatchPremiumScore = (matchStat: MatchStatType): number => {
  let score = 0;
  const { general, playerVsplayerStat: pvp, roundPerformace } = matchStat.stats;

  if (!pvp?.user?.stats) return 0;

  // Base multiplier for match type
  const matchMultiplier = general.isRanked ? 1.2 : 1.0;

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
  return Math.min(100, Math.max(0, score * matchMultiplier));
};

const calculateTeamContribution = (pvp: any): number => {
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
  if (killShare >= 30) score += 10;
  else if (killShare >= 25) score += 7;
  else if (killShare >= 20) score += 4;

  return score;
};

const calculateCorePerformance = (stats: any, totalRounds: number): number => {
  let score = 0;

  // K/D Impact (0-15 points)
  if (stats.kdRatio >= 3.0) score += 15;
  else if (stats.kdRatio >= 2.0) score += 12;
  else if (stats.kdRatio >= 1.5) score += 8;
  else if (stats.kdRatio >= 1.0) score += 5;

  // Headshot Precision (0-10 points)
  const hsPercent = stats.headshotPercentage || 0;
  if (hsPercent >= 40) score += 10;
  else if (hsPercent >= 30) score += 7;
  else if (hsPercent >= 20) score += 4;

  // Combat Score per Round (0-15 points)
  const acsThreshold = 300;
  const acs = (stats.combatScore || 0) / Math.max(1, totalRounds);
  score += Math.min(15, (acs / acsThreshold) * 15);

  return score;
};

const calculateRoundImpact = (rounds: any[], totalRounds: number): number => {
  if (!Array.isArray(rounds) || rounds.length === 0) return 0;

  let score = 0;
  let highImpactRounds = 0;
  let consistentRounds = 0;

  rounds.forEach(round => {
    if (!round) return;

    const impactScore = round.impactScore || 0;

    // Count high impact rounds (500+ impact score)
    if (impactScore >= 500) highImpactRounds++;
    // Count consistently good rounds (300+ impact score)
    if (impactScore >= 300) consistentRounds++;
  });

  // High impact frequency (0-15 points)
  score += Math.min(15, (highImpactRounds / totalRounds) * 30);

  // Consistency (0-15 points)
  score += Math.min(15, (consistentRounds / totalRounds) * 20);

  return score;
};

const calculateClutchImpact = (stats: any, rounds: any[]): number => {
  if (!stats || !Array.isArray(rounds)) return 0;

  let score = 0;

  // Clutch wins (0-10 points)
  const clutchScore = (stats.clutchesWon || 0) * 3;
  score += Math.min(10, clutchScore);

  // Multi-kills (0-10 points)
  let multiKillScore = 0;
  rounds.forEach(round => {
    if (!round?.combat?.kills) return;

    if (round.combat.kills >= 4) multiKillScore += 3;
    else if (round.combat.kills >= 3) multiKillScore += 2;
  });
  score += Math.min(10, multiKillScore);

  return score;
};
