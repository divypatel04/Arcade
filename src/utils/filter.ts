import type { AgentStats, MapStats, WeaponStats, Match } from '@context/DataContext';

/**
 * Filter agents by role
 */
export const filterAgentsByRole = (
  agents: AgentStats[],
  role: 'duelist' | 'controller' | 'initiator' | 'sentinel' | 'all'
): AgentStats[] => {
  if (role === 'all') return agents;
  return agents.filter(agent => agent.role === role);
};

/**
 * Filter agents by minimum matches
 */
export const filterAgentsByMinMatches = (
  agents: AgentStats[],
  minMatches: number
): AgentStats[] => {
  return agents.filter(agent => agent.matches >= minMatches);
};

/**
 * Filter weapons by type
 */
export const filterWeaponsByType = (
  weapons: WeaponStats[],
  type: 'rifle' | 'smg' | 'shotgun' | 'sniper' | 'pistol' | 'heavy' | 'all'
): WeaponStats[] => {
  if (type === 'all') return weapons;
  return weapons.filter(weapon => weapon.weaponType === type);
};

/**
 * Filter weapons by minimum kills
 */
export const filterWeaponsByMinKills = (
  weapons: WeaponStats[],
  minKills: number
): WeaponStats[] => {
  return weapons.filter(weapon => weapon.kills >= minKills);
};

/**
 * Filter matches by game mode
 */
export const filterMatchesByMode = (
  matches: Match[],
  mode: 'competitive' | 'unrated' | 'deathmatch' | 'spike rush' | 'all'
): Match[] => {
  if (mode === 'all') return matches;
  return matches.filter(match => match.mode === mode);
};

/**
 * Filter matches by result
 */
export const filterMatchesByResult = (
  matches: Match[],
  result: 'victory' | 'defeat' | 'draw' | 'all'
): Match[] => {
  if (result === 'all') return matches;
  return matches.filter(match => match.result === result);
};

/**
 * Filter matches by map
 */
export const filterMatchesByMap = (
  matches: Match[],
  mapName: string
): Match[] => {
  if (!mapName || mapName === 'all') return matches;
  return matches.filter(match => match.map === mapName);
};

/**
 * Filter matches by agent
 */
export const filterMatchesByAgent = (
  matches: Match[],
  agentName: string
): Match[] => {
  if (!agentName || agentName === 'all') return matches;
  return matches.filter(match => match.agent === agentName);
};

/**
 * Filter matches by date range
 */
export const filterMatchesByDateRange = (
  matches: Match[],
  startDate: Date,
  endDate: Date
): Match[] => {
  return matches.filter(match => {
    const matchDate = new Date(match.date);
    return matchDate >= startDate && matchDate <= endDate;
  });
};

/**
 * Filter matches by last N days
 */
export const filterMatchesByLastDays = (
  matches: Match[],
  days: number
): Match[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return matches.filter(match => {
    const matchDate = new Date(match.date);
    return matchDate >= startDate;
  });
};

/**
 * Filter maps by minimum matches
 */
export const filterMapsByMinMatches = (
  maps: MapStats[],
  minMatches: number
): MapStats[] => {
  return maps.filter(map => map.matches >= minMatches);
};

/**
 * Generic filter by property value
 */
export const filterByProperty = <T extends Record<string, any>>(
  array: T[],
  property: keyof T,
  value: any
): T[] => {
  if (value === 'all' || value === null || value === undefined) return array;
  return array.filter(item => item[property] === value);
};

/**
 * Generic filter by range
 */
export const filterByRange = <T extends Record<string, any>>(
  array: T[],
  property: keyof T,
  min: number,
  max: number
): T[] => {
  return array.filter(item => {
    const value = item[property];
    if (typeof value === 'number') {
      return value >= min && value <= max;
    }
    return false;
  });
};

/**
 * Generic search filter (case-insensitive)
 */
export const searchFilter = <T extends Record<string, any>>(
  array: T[],
  searchTerm: string,
  searchProperties: Array<keyof T>
): T[] => {
  if (!searchTerm || searchTerm.trim() === '') return array;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return array.filter(item =>
    searchProperties.some(prop => {
      const value = item[prop];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    })
  );
};

/**
 * Combine multiple filters
 */
export const combineFilters = <T>(
  array: T[],
  filters: Array<(arr: T[]) => T[]>
): T[] => {
  return filters.reduce((acc, filter) => filter(acc), array);
};
