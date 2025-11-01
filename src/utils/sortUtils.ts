/**
 * Sort and Filter Utilities
 * Provides functions for sorting, filtering, and finding top-performing stats
 */

import { AgentStatType, MapStatsType, MatchStatsType, WeaponStatsType } from '@types';

/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */

interface MapListItem {
  mapStat: MapStatsType;
  seasonName: string;
  numberOfMatches: number;
}

interface GroupedMatchHistory {
  data: MatchStatsType[];
  title: string;
}

/**
 * ============================================================================
 * TOP PERFORMERS - Find best performing agents, maps, and weapons
 * ============================================================================
 */

/**
 * Gets the agent with the highest kill count
 * @param agentStats - Array of agent statistics
 * @returns Agent with most kills, or null if none found
 * 
 * @example
 * const topAgent = getTopAgentByKills(agentStats);
 * if (topAgent) {
 *   console.log(`Best agent: ${topAgent.agent.name}`);
 * }
 */
export const getTopAgentByKills = (
  agentStats: AgentStatType[]
): AgentStatType | null => {
  if (!agentStats?.length) {
    return null;
  }

  const agentHighestKills: { agent: AgentStatType; kills: number }[] = [];

  // First, try to find agents with active seasons
  for (const agent of agentStats) {
    const activeSeason = agent.performanceBySeason.find(
      season => season.season.isActive
    );
    if (activeSeason) {
      agentHighestKills.push({
        agent,
        kills: activeSeason.stats.kills
      });
    }
  }

  // If no active seasons, use highest kills from any season
  if (agentHighestKills.length === 0) {
    for (const agent of agentStats) {
      const highestKillsSeason = agent.performanceBySeason.reduce(
        (prev, current) =>
          prev.stats.kills > current.stats.kills ? prev : current,
        agent.performanceBySeason[0]
      );
      agentHighestKills.push({
        agent,
        kills: highestKillsSeason.stats.kills
      });
    }
  }

  if (agentHighestKills.length === 0) {
    return null;
  }

  // Sort by kills and return the top agent
  agentHighestKills.sort((a, b) => b.kills - a.kills);
  return agentHighestKills[0].agent;
};

/**
 * Gets the map with the highest win rate
 * @param mapStats - Array of map statistics
 * @returns Map with highest win rate, or null if none found
 * 
 * @example
 * const bestMap = getTopMapByWinRate(mapStats);
 * if (bestMap) {
 *   console.log(`Best map: ${bestMap.map.name}`);
 * }
 */
export const getTopMapByWinRate = (
  mapStats: MapStatsType[]
): MapStatsType | null => {
  if (!mapStats?.length) {
    return null;
  }

  let bestMap: MapStatsType | null = null;
  let highestWinRate = 0;

  // First, try active seasons
  for (const map of mapStats) {
    const activeSeasonStats = map.performanceBySeason.find(
      season => season.season.isActive
    );

    if (activeSeasonStats) {
      const totalGames =
        activeSeasonStats.stats.matchesWon + activeSeasonStats.stats.matchesLost;
      if (totalGames === 0) continue;

      const winRate = activeSeasonStats.stats.matchesWon / totalGames;

      if (winRate > highestWinRate) {
        highestWinRate = winRate;
        bestMap = map;
      }
    }
  }

  // If no active season found, get map with best overall win rate
  if (!bestMap && mapStats.length > 0) {
    bestMap = mapStats.reduce((prev, current) => {
      const prevWinRate =
        prev.performanceBySeason[0].stats.matchesWon /
        Math.max(
          1,
          prev.performanceBySeason[0].stats.matchesWon +
            prev.performanceBySeason[0].stats.matchesLost
        );
      const currentWinRate =
        current.performanceBySeason[0].stats.matchesWon /
        Math.max(
          1,
          current.performanceBySeason[0].stats.matchesWon +
            current.performanceBySeason[0].stats.matchesLost
        );
      return prevWinRate > currentWinRate ? prev : current;
    });
  }

  return bestMap;
};

/**
 * Gets the weapon with the highest kill count
 * @param weaponStats - Array of weapon statistics
 * @returns Weapon with most kills, or null if none found
 * 
 * @example
 * const topWeapon = getTopWeaponByKills(weaponStats);
 * if (topWeapon) {
 *   console.log(`Best weapon: ${topWeapon.weapon.name}`);
 * }
 */
export const getTopWeaponByKills = (
  weaponStats: WeaponStatsType[]
): WeaponStatsType | null => {
  if (!weaponStats?.length) {
    return null;
  }

  let bestWeapon: WeaponStatsType | null = null;
  let highestKills = 0;

  // First, try active seasons
  for (const weapon of weaponStats) {
    const activeSeasonStats = weapon.performanceBySeason.find(
      season => season.season.isActive
    );

    if (activeSeasonStats) {
      const kills = activeSeasonStats.stats.kills;
      if (kills > highestKills) {
        highestKills = kills;
        bestWeapon = weapon;
      }
    }
  }

  // If no active season, find weapon with most kills across all seasons
  if (!bestWeapon) {
    for (const weapon of weaponStats) {
      const highestKillsSeason = weapon.performanceBySeason.reduce(
        (prev, current) =>
          prev.stats.kills > current.stats.kills ? prev : current
      );

      if (
        !bestWeapon ||
        highestKillsSeason.stats.kills >
          bestWeapon.performanceBySeason[0].stats.kills
      ) {
        bestWeapon = {
          ...weapon,
          performanceBySeason: [highestKillsSeason]
        };
      }
    }
  }

  return bestWeapon;
};

/**
 * ============================================================================
 * SORTING FUNCTIONS - Sort stats by various criteria
 * ============================================================================
 */

/**
 * Sorts agents by number of matches played in a specific season
 * @param agentStats - Array of agent statistics
 * @param seasonName - Season name to filter by, or 'All Act' for all seasons
 * @returns Sorted array of agents with match counts
 * 
 * @example
 * const sorted = sortAgentsByMatches(agentStats, 'Episode 8 Act 1');
 * sorted.forEach(item => {
 *   console.log(`${item.agentStat.agent.name}: ${item.numberOfMatches} matches`);
 * });
 */
export function sortAgentsByMatches(
  agentStats: AgentStatType[],
  seasonName: string
) {
  if (!agentStats?.length) {
    return [];
  }

  const allSortedStats = agentStats.map(agentStat => {
    let numberOfMatches = 0;

    if (seasonName === 'All Act') {
      // Sum matches across all seasons
      numberOfMatches = agentStat.performanceBySeason.reduce(
        (sum, stat) => sum + stat.stats.matchesWon + stat.stats.matchesLost,
        0
      );
    } else {
      // Count matches for specific season
      const seasonStats = agentStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName
      );
      numberOfMatches = seasonStats.reduce(
        (sum, stat) => sum + stat.stats.matchesWon + stat.stats.matchesLost,
        0
      );
    }

    return {
      agentStat,
      seasonName,
      numberOfMatches
    };
  });

  // Filter out agents with no matches and sort by match count
  return allSortedStats
    .filter(stat => stat.numberOfMatches > 0)
    .sort((a, b) => b.numberOfMatches - a.numberOfMatches);
}

/**
 * Sorts maps by number of matches played in a specific season
 * @param mapStats - Array of map statistics
 * @param seasonName - Season name to filter by, or 'All Act' for all seasons
 * @returns Sorted array of maps with match counts
 * 
 * @example
 * const sorted = sortMapsByMatches(mapStats, 'Episode 8 Act 1');
 * sorted.forEach(item => {
 *   console.log(`${item.mapStat.map.name}: ${item.numberOfMatches} matches`);
 * });
 */
export function sortMapsByMatches(
  mapStats: MapStatsType[],
  seasonName: string
): MapListItem[] {
  if (!mapStats?.length) {
    return [];
  }

  const allSortedStats = mapStats.map(mapStat => {
    let numberOfMatches = 0;

    if (seasonName === 'All Act') {
      // Sum matches across all seasons
      numberOfMatches = mapStat.performanceBySeason.reduce(
        (sum, stat) => sum + stat.stats.matchesWon + stat.stats.matchesLost,
        0
      );
    } else {
      // Count matches for specific season
      const seasonStats = mapStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName
      );
      numberOfMatches = seasonStats.reduce(
        (sum, stat) => sum + stat.stats.matchesWon + stat.stats.matchesLost,
        0
      );
    }

    return {
      mapStat,
      seasonName,
      numberOfMatches
    };
  });

  // Filter out maps with no matches and sort by match count
  return allSortedStats
    .filter(stat => stat.numberOfMatches > 0)
    .sort((a, b) => b.numberOfMatches - a.numberOfMatches);
}

/**
 * Sorts weapons by number of kills in a specific season
 * @param weaponStats - Array of weapon statistics
 * @param seasonName - Season name to filter by, or 'All Act' for all seasons
 * @returns Sorted array of weapons with kill counts
 * 
 * @example
 * const sorted = sortWeaponsByMatches(weaponStats, 'Episode 8 Act 1');
 * sorted.forEach(item => {
 *   console.log(`${item.weapon.weapon.name}: ${item.numberOfKills} kills`);
 * });
 */
export function sortWeaponsByMatches(
  weaponStats: WeaponStatsType[],
  seasonName: string
) {
  if (!weaponStats?.length) {
    return [];
  }

  const allSortedStats = weaponStats.map(weaponStat => {
    let numberOfKills = 0;

    if (seasonName === 'All Act') {
      // Sum kills across all seasons
      numberOfKills = weaponStat.performanceBySeason.reduce(
        (sum, stat) => sum + stat.stats.kills,
        0
      );
    } else {
      // Count kills for specific season
      const seasonStats = weaponStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName
      );
      numberOfKills = seasonStats.reduce(
        (sum, stat) => sum + stat.stats.kills,
        0
      );
    }

    return {
      weapon: weaponStat,
      seasonName,
      numberOfKills
    };
  });

  // Filter out weapons with no kills and sort by kill count
  return allSortedStats
    .filter(stat => stat.numberOfKills > 0)
    .sort((a, b) => b.numberOfKills - a.numberOfKills);
}

/**
 * ============================================================================
 * MATCH UTILITIES - Match history and queue type operations
 * ============================================================================
 */

/**
 * Gets unique queue types from match history
 * @param matchStats - Array of match statistics
 * @returns Array of unique queue IDs with 'All' prepended
 * 
 * @example
 * const queueTypes = getMatchQueueTypes(matchStats);
 * // Returns: ['All', 'competitive', 'unrated', 'deathmatch']
 */
export const getMatchQueueTypes = (matchStats: MatchStatsType[]): string[] => {
  if (!matchStats?.length) {
    return ['All'];
  }

  const uniqueQueueIds = new Set<string>();
  matchStats.forEach(match => {
    uniqueQueueIds.add(match.stats.general.queueId);
  });

  const sortedQueueIds = Array.from(uniqueQueueIds).sort((a, b) =>
    b.localeCompare(a)
  );

  return ['All', ...sortedQueueIds];
};

/**
 * Groups match history by date
 * @param matchStats - Array of match statistics
 * @returns Array of grouped matches by date
 * 
 * @example
 * const grouped = sortAndGroupMatchHistory(matchStats);
 * grouped.forEach(group => {
 *   console.log(`${group.title}: ${group.data.length} matches`);
 * });
 */
export function sortAndGroupMatchHistory(
  matchStats: MatchStatsType[]
): GroupedMatchHistory[] {
  if (!matchStats?.length) {
    return [];
  }

  const groupedByDate = new Map<string, MatchStatsType[]>();

  matchStats.forEach(matchStat => {
    const gameStartDate = new Date(matchStat.stats.general.gameStartMillis);
    const formattedDate = `${gameStartDate.getDate()}/${
      gameStartDate.getMonth() + 1
    }/${gameStartDate.getFullYear()}`;

    const existing = groupedByDate.get(formattedDate) || [];
    existing.push(matchStat);
    groupedByDate.set(formattedDate, existing);
  });

  // Convert Map to array and sort by date
  const resultArray: GroupedMatchHistory[] = Array.from(groupedByDate.entries())
    .map(([title, data]) => ({ title, data }))
    .sort((a, b) => {
      const dateA = new Date(a.title).getTime();
      const dateB = new Date(b.title).getTime();
      return dateA - dateB;
    });

  return resultArray;
}
