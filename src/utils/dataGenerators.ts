import type { Match, AgentStats, MapStats, WeaponStats, SeasonStats } from '@context/DataContext';

interface RawMatchData {
  matchId: string;
  mapName: string;
  gameMode: string;
  matchStartTime: number;
  matchDuration: number;
  teamWon: 'Red' | 'Blue';
  roundsPlayed: number;
  playerStats: {
    puuid: string;
    characterId: string;
    kills: number;
    deaths: number;
    assists: number;
    score: number;
    headshots: number;
    bodyshots: number;
    legshots: number;
    damageDealt: number;
    weaponStats: Array<{
      weaponId: string;
      kills: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
    }>;
  };
  roundResults: Array<{
    roundNum: number;
    winningTeam: 'Red' | 'Blue';
  }>;
}

/**
 * Generate agent statistics from match data
 */
export const generateAgentStats = (
  matches: Match[],
  seasonId: string
): AgentStats[] => {
  const agentMap = new Map<string, AgentStats>();

  matches.forEach((match) => {
    const existing = agentMap.get(match.agent);
    
    if (existing) {
      // Update existing agent stats
      existing.matches += 1;
      existing.wins += match.result === 'victory' ? 1 : 0;
      existing.kills += match.kills;
      existing.deaths += match.deaths;
      existing.assists += match.assists;
      existing.averageScore = Math.round(
        (existing.averageScore * (existing.matches - 1) + match.combatScore) / existing.matches
      );
    } else {
      // Create new agent stats
      agentMap.set(match.agent, {
        agentId: match.agent.toLowerCase(),
        agentName: match.agent,
        agentIcon: '',
        role: 'duelist', // TODO: Get from agent data
        matches: 1,
        wins: match.result === 'victory' ? 1 : 0,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        winRate: match.result === 'victory' ? 100 : 0,
        kd: match.deaths > 0 ? match.kills / match.deaths : match.kills,
        averageScore: match.combatScore,
        headshots: 0, // TODO: Get from detailed match data
        headshotPercentage: 0,
      });
    }
  });

  // Calculate derived stats
  agentMap.forEach((agent) => {
    agent.winRate = agent.matches > 0 ? (agent.wins / agent.matches) * 100 : 0;
    agent.kd = agent.deaths > 0 ? agent.kills / agent.deaths : agent.kills;
  });

  return Array.from(agentMap.values());
};

/**
 * Generate map statistics from match data
 */
export const generateMapStats = (
  matches: Match[],
  seasonId: string
): MapStats[] => {
  const mapStatsMap = new Map<string, MapStats>();

  matches.forEach((match) => {
    const existing = mapStatsMap.get(match.map);
    
    if (existing) {
      existing.matches += 1;
      existing.wins += match.result === 'victory' ? 1 : 0;
      existing.losses += match.result === 'defeat' ? 1 : 0;
      existing.kills += match.kills;
      existing.deaths += match.deaths;
      // TODO: Track attack/defense wins from detailed match data
    } else {
      mapStatsMap.set(match.map, {
        mapId: match.map.toLowerCase(),
        mapName: match.map,
        mapImage: match.mapImage,
        matches: 1,
        wins: match.result === 'victory' ? 1 : 0,
        losses: match.result === 'defeat' ? 1 : 0,
        winRate: match.result === 'victory' ? 100 : 0,
        kills: match.kills,
        deaths: match.deaths,
        kd: match.deaths > 0 ? match.kills / match.deaths : match.kills,
        attackWins: 0,
        defenseWins: 0,
      });
    }
  });

  // Calculate derived stats
  mapStatsMap.forEach((mapStats) => {
    mapStats.winRate = mapStats.matches > 0 ? (mapStats.wins / mapStats.matches) * 100 : 0;
    mapStats.kd = mapStats.deaths > 0 ? mapStats.kills / mapStats.deaths : mapStats.kills;
  });

  return Array.from(mapStatsMap.values());
};

/**
 * Generate weapon statistics from detailed match data
 */
export const generateWeaponStats = (
  rawMatches: RawMatchData[],
  seasonId: string
): WeaponStats[] => {
  const weaponMap = new Map<string, WeaponStats>();

  rawMatches.forEach((match) => {
    match.playerStats.weaponStats.forEach((weaponData) => {
      const existing = weaponMap.get(weaponData.weaponId);
      
      if (existing) {
        existing.kills += weaponData.kills;
        existing.headshots += weaponData.headshots;
        existing.bodyshots += weaponData.bodyshots;
        existing.legshots += weaponData.legshots;
      } else {
        weaponMap.set(weaponData.weaponId, {
          weaponId: weaponData.weaponId,
          weaponName: weaponData.weaponId, // TODO: Get proper weapon name
          weaponType: 'rifle', // TODO: Get from weapon data
          kills: weaponData.kills,
          headshots: weaponData.headshots,
          bodyshots: weaponData.bodyshots,
          legshots: weaponData.legshots,
          headshotPercentage: 0,
          accuracy: 0,
          damage: 0,
        });
      }
    });
  });

  // Calculate derived stats
  weaponMap.forEach((weapon) => {
    const totalShots = weapon.headshots + weapon.bodyshots + weapon.legshots;
    weapon.headshotPercentage = totalShots > 0 ? (weapon.headshots / totalShots) * 100 : 0;
  });

  return Array.from(weaponMap.values());
};

/**
 * Generate season statistics from match data
 */
export const generateSeasonStats = (
  matches: Match[],
  seasonId: string,
  seasonName: string,
  act: number
): SeasonStats => {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalScore = 0;
  let wins = 0;
  let losses = 0;

  let currentRank = '';
  let currentRR = 0;
  let peakRank = '';

  matches.forEach((match) => {
    totalKills += match.kills;
    totalDeaths += match.deaths;
    totalScore += match.combatScore;
    
    if (match.result === 'victory') wins++;
    if (match.result === 'defeat') losses++;

    // Track latest rank
    currentRank = match.rank;
    currentRR = match.rr;

    // TODO: Track peak rank properly
    if (!peakRank) peakRank = match.rank;
  });

  const totalMatches = matches.length;

  return {
    seasonId,
    seasonName,
    act,
    currentRank,
    currentRR,
    peakRank,
    wins,
    losses,
    winRate: totalMatches > 0 ? (wins / totalMatches) * 100 : 0,
    kd: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    averageScore: totalMatches > 0 ? Math.round(totalScore / totalMatches) : 0,
    matches: totalMatches,
  };
};

/**
 * Merge new stats with existing stats
 */
export const mergeAgentStats = (
  existing: AgentStats[],
  newStats: AgentStats[]
): AgentStats[] => {
  const merged = new Map<string, AgentStats>();

  // Add existing stats
  existing.forEach((stat) => {
    merged.set(stat.agentId, { ...stat });
  });

  // Merge with new stats
  newStats.forEach((newStat) => {
    const existingStat = merged.get(newStat.agentId);
    
    if (existingStat) {
      existingStat.matches += newStat.matches;
      existingStat.wins += newStat.wins;
      existingStat.kills += newStat.kills;
      existingStat.deaths += newStat.deaths;
      existingStat.assists += newStat.assists;
      existingStat.headshots += newStat.headshots;
      
      // Recalculate derived stats
      existingStat.winRate = (existingStat.wins / existingStat.matches) * 100;
      existingStat.kd = existingStat.deaths > 0 ? existingStat.kills / existingStat.deaths : existingStat.kills;
      existingStat.headshotPercentage = existingStat.kills > 0 ? (existingStat.headshots / existingStat.kills) * 100 : 0;
    } else {
      merged.set(newStat.agentId, newStat);
    }
  });

  return Array.from(merged.values());
};

/**
 * Merge map stats
 */
export const mergeMapStats = (
  existing: MapStats[],
  newStats: MapStats[]
): MapStats[] => {
  const merged = new Map<string, MapStats>();

  existing.forEach((stat) => {
    merged.set(stat.mapId, { ...stat });
  });

  newStats.forEach((newStat) => {
    const existingStat = merged.get(newStat.mapId);
    
    if (existingStat) {
      existingStat.matches += newStat.matches;
      existingStat.wins += newStat.wins;
      existingStat.losses += newStat.losses;
      existingStat.kills += newStat.kills;
      existingStat.deaths += newStat.deaths;
      existingStat.attackWins += newStat.attackWins;
      existingStat.defenseWins += newStat.defenseWins;
      
      existingStat.winRate = (existingStat.wins / existingStat.matches) * 100;
      existingStat.kd = existingStat.deaths > 0 ? existingStat.kills / existingStat.deaths : existingStat.kills;
    } else {
      merged.set(newStat.mapId, newStat);
    }
  });

  return Array.from(merged.values());
};

/**
 * Merge weapon stats
 */
export const mergeWeaponStats = (
  existing: WeaponStats[],
  newStats: WeaponStats[]
): WeaponStats[] => {
  const merged = new Map<string, WeaponStats>();

  existing.forEach((stat) => {
    merged.set(stat.weaponId, { ...stat });
  });

  newStats.forEach((newStat) => {
    const existingStat = merged.get(newStat.weaponId);
    
    if (existingStat) {
      existingStat.kills += newStat.kills;
      existingStat.headshots += newStat.headshots;
      existingStat.bodyshots += newStat.bodyshots;
      existingStat.legshots += newStat.legshots;
      existingStat.damage += newStat.damage;
      
      const totalShots = existingStat.headshots + existingStat.bodyshots + existingStat.legshots;
      existingStat.headshotPercentage = totalShots > 0 ? (existingStat.headshots / totalShots) * 100 : 0;
    } else {
      merged.set(newStat.weaponId, newStat);
    }
  });

  return Array.from(merged.values());
};
