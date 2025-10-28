import type { AgentStats, MapStats, WeaponStats, Match, SeasonStats } from '@context/DataContext';

export type SortOrder = 'asc' | 'desc';

/**
 * Generic sort function
 */
function sortBy<T>(
  array: T[],
  key: keyof T,
  order: SortOrder = 'desc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });
}

/**
 * Sort agents by various criteria
 */
export const sortAgents = {
  byMatches: (agents: AgentStats[], order: SortOrder = 'desc') =>
    sortBy(agents, 'matches', order),

  byKD: (agents: AgentStats[], order: SortOrder = 'desc') =>
    sortBy(agents, 'kd', order),

  byWinRate: (agents: AgentStats[], order: SortOrder = 'desc') =>
    sortBy(agents, 'winRate', order),

  byKills: (agents: AgentStats[], order: SortOrder = 'desc') =>
    sortBy(agents, 'kills', order),

  byHeadshotPercentage: (agents: AgentStats[], order: SortOrder = 'desc') =>
    sortBy(agents, 'headshotPercentage', order),

  byName: (agents: AgentStats[], order: SortOrder = 'asc') =>
    sortBy(agents, 'agentName', order),

  byRole: (agents: AgentStats[], order: SortOrder = 'asc') =>
    sortBy(agents, 'role', order),
};

/**
 * Sort maps by various criteria
 */
export const sortMaps = {
  byMatches: (maps: MapStats[], order: SortOrder = 'desc') =>
    sortBy(maps, 'matches', order),

  byWinRate: (maps: MapStats[], order: SortOrder = 'desc') =>
    sortBy(maps, 'winRate', order),

  byKD: (maps: MapStats[], order: SortOrder = 'desc') =>
    sortBy(maps, 'kd', order),

  byName: (maps: MapStats[], order: SortOrder = 'asc') =>
    sortBy(maps, 'mapName', order),

  byWins: (maps: MapStats[], order: SortOrder = 'desc') =>
    sortBy(maps, 'wins', order),
};

/**
 * Sort weapons by various criteria
 */
export const sortWeapons = {
  byKills: (weapons: WeaponStats[], order: SortOrder = 'desc') =>
    sortBy(weapons, 'kills', order),

  byHeadshotPercentage: (weapons: WeaponStats[], order: SortOrder = 'desc') =>
    sortBy(weapons, 'headshotPercentage', order),

  byAccuracy: (weapons: WeaponStats[], order: SortOrder = 'desc') =>
    sortBy(weapons, 'accuracy', order),

  byName: (weapons: WeaponStats[], order: SortOrder = 'asc') =>
    sortBy(weapons, 'weaponName', order),

  byType: (weapons: WeaponStats[], order: SortOrder = 'asc') =>
    sortBy(weapons, 'weaponType', order),

  byDamage: (weapons: WeaponStats[], order: SortOrder = 'desc') =>
    sortBy(weapons, 'damage', order),
};

/**
 * Sort matches by various criteria
 */
export const sortMatches = {
  byDate: (matches: Match[], order: SortOrder = 'desc') =>
    [...matches].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    }),

  byKills: (matches: Match[], order: SortOrder = 'desc') =>
    sortBy(matches, 'kills', order),

  byCombatScore: (matches: Match[], order: SortOrder = 'desc') =>
    sortBy(matches, 'combatScore', order),

  byMap: (matches: Match[], order: SortOrder = 'asc') =>
    sortBy(matches, 'map', order),

  byResult: (matches: Match[], order: SortOrder = 'desc') =>
    [...matches].sort((a, b) => {
      const scoreA = a.result === 'victory' ? 1 : 0;
      const scoreB = b.result === 'victory' ? 1 : 0;
      return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    }),
};

/**
 * Sort seasons by recency
 */
export const sortSeasons = {
  byRecency: (seasons: SeasonStats[], order: SortOrder = 'desc') =>
    [...seasons].sort((a, b) => {
      // Parse episode and act from season ID (e.g., "e8a3" -> Episode 8, Act 3)
      const parseSeasonId = (id: string) => {
        const match = id.match(/e(\d+)a(\d+)/);
        if (match) {
          return parseInt(match[1]) * 10 + parseInt(match[2]);
        }
        return 0;
      };

      const scoreA = parseSeasonId(a.seasonId);
      const scoreB = parseSeasonId(b.seasonId);
      return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    }),

  byMatches: (seasons: SeasonStats[], order: SortOrder = 'desc') =>
    sortBy(seasons, 'matches', order),

  byWinRate: (seasons: SeasonStats[], order: SortOrder = 'desc') =>
    sortBy(seasons, 'winRate', order),
};

/**
 * Multi-criteria sorting
 */
export const multiSort = <T extends Record<string, any>>(
  array: T[],
  criteria: Array<{ key: keyof T; order: SortOrder }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const criterion of criteria) {
      const aVal = a[criterion.key];
      const bVal = b[criterion.key];

      if (aVal === bVal) continue;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return criterion.order === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return criterion.order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
    }

    return 0;
  });
};
