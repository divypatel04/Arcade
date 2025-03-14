/**
 * Data processing service for transforming and enriching stats data
 * Contains pure functions that take raw data and return processed data
 */

/**
 * Process agent statistics data and transform it
 * @param data Raw agent stats data from database
 * @returns Processed agent stats data
 */
export function processAgentStatsData(data: any[]): any[] {
  return data.map(agent => {
    // Apply transformations here
    return {
      ...agent,
      performanceBySeason: agent.performancebyseason,
      // Add any calculated fields here
      calculatedKD: agent.kills / Math.max(1, agent.deaths),
      headshotPercentage: (agent.headshots / Math.max(1, agent.kills)) * 100,
      winRate: (agent.wins / Math.max(1, agent.matchesplayed)) * 100,
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Process map statistics data and transform it
 * @param data Raw map stats data from database
 * @returns Processed map stats data
 */
export function processMapStatsData(data: any[]): any[] {
  return data.map(map => {
    return {
      ...map,
      performanceBySeason: map.performancebyseason,
      winPercentage: (map.wins / Math.max(1, map.matchesplayed)) * 100,
      attackWinRate: (map.attackroundswon / Math.max(1, map.attackroundsplayed)) * 100,
      defenseWinRate: (map.defenseroundswon / Math.max(1, map.defenseroundsplayed)) * 100,
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Process weapon statistics data and transform it
 * @param data Raw weapon stats data from database
 * @returns Processed weapon stats data
 */
export function processWeaponStatsData(data: any[]): any[] {
  return data.map(weapon => {
    const totalShots = weapon.bodyshots + weapon.legshots + weapon.headshots;
    return {
      ...weapon,
      performanceBySeason: weapon.performancebyseason,
      headshotPercentage: (weapon.headshots / Math.max(1, weapon.kills)) * 100,
      headshotRatio: weapon.headshots / Math.max(1, totalShots) * 100,
      bodyRatio: weapon.bodyshots / Math.max(1, totalShots) * 100,
      legRatio: weapon.legshots / Math.max(1, totalShots) * 100,
      killEfficiency: weapon.kills / Math.max(1, totalShots),
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Process season statistics data and transform it
 * @param data Raw season stats data from database
 * @returns Processed season stats data
 */
export function processSeasonStatsData(data: any[]): any[] {
  return data.map(season => {
    return {
      ...season,
      averageCombatScore: season.totalscore / Math.max(1, season.matchesplayed),
      killsPerMatch: season.kills / Math.max(1, season.matchesplayed),
      assistsPerMatch: season.assists / Math.max(1, season.matchesplayed),
      deathsPerMatch: season.deaths / Math.max(1, season.matchesplayed),
      winRate: (season.matcheswon / Math.max(1, season.matchesplayed)) * 100,
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Process match statistics data and transform it
 * @param data Raw match stats data from database
 * @returns Processed match stats data
 */
export function processMatchStatsData(data: any[]): any[] {
  return data.map(match => {
    return {
      ...match,
      // Add any match-specific calculated fields
      killsPerRound: match.kills / Math.max(1, match.roundsplayed),
      impactScore: calculateImpactScore(match),
      damagePerRound: match.damagemade / Math.max(1, match.roundsplayed),
      scorePerRound: match.score / Math.max(1, match.roundsplayed),
      assistsPerRound: match.assists / Math.max(1, match.roundsplayed),
      deathsPerRound: match.deaths / Math.max(1, match.roundsplayed),
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Calculate impact score based on match statistics
 */
function calculateImpactScore(match: any): number {
  // Sample impact score calculation
  const killImpact = match.kills * 1.0;
  const assistImpact = match.assists * 0.5;
  const deathPenalty = match.deaths * -0.5;
  const firstBloodBonus = (match.firstbloods || 0) * 2;
  const clutchBonus = (match.clutches || 0) * 3;

  return Math.max(0, killImpact + assistImpact + deathPenalty + firstBloodBonus + clutchBonus);
}
