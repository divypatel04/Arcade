/**
 * Database record types
 * These represent the actual structure of records in Supabase (snake_case)
 */

/**
 * Base database record with common fields
 */
export interface BaseDbRecord {
  id: string;
  puuid: string;
  lastupdated: string;
}

/**
 * Agent stats database record (snake_case)
 */
export interface AgentStatsDbRecord extends BaseDbRecord {
  agent: {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    iconUrl: string;
    abilities?: Array<{
      id: string;
      name: string;
      imageUrl: string;
      type: string;
      cost: number;
    }>;
  };
  performancebyseason: Array<{
    season: {
      id: string;
      name: string;
      isActive: boolean;
    };
    stats: {
      kills: number;
      deaths: number;
      roundsWon: number;
      roundsLost: number;
      matchesPlayed: number;
      matchesWon: number;
      matchesLost: number;
      assists: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
      damageDealt: number;
      damageTaken: number;
      [key: string]: number;
    };
  }>;
}

/**
 * Map stats database record (snake_case)
 */
export interface MapStatsDbRecord extends BaseDbRecord {
  map: {
    id: string;
    name: string;
    imageUrl: string;
    coordinates?: string;
    [key: string]: unknown;
  };
  performancebyseason: Array<{
    season: {
      id: string;
      name: string;
      isActive: boolean;
    };
    stats: {
      kills: number;
      deaths: number;
      roundsWon: number;
      roundsLost: number;
      matchesPlayed: number;
      matchesWon: number;
      matchesLost: number;
      assists: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
      damageDealt: number;
      damageTaken: number;
      [key: string]: number;
    };
  }>;
}

/**
 * Weapon stats database record (snake_case)
 */
export interface WeaponStatsDbRecord extends BaseDbRecord {
  weapon: {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    [key: string]: unknown;
  };
  performancebyseason: Array<{
    season: {
      id: string;
      name: string;
      isActive: boolean;
    };
    stats: {
      kills: number;
      deaths: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
      damageDealt: number;
      roundsPlayed: number;
      [key: string]: number;
    };
  }>;
}

/**
 * Season stats database record (snake_case)
 */
export interface SeasonStatsDbRecord extends BaseDbRecord {
  season: {
    id: string;
    name: string;
    isActive: boolean;
    startTime?: string;
    endTime?: string;
  };
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    roundsPlayed: number;
    roundsWon: number;
    roundsLost: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    headshots: number;
    bodyshots: number;
    legshots: number;
    damageDealt: number;
    damageTaken: number;
    [key: string]: number;
  };
}

/**
 * Match stats database record (snake_case)
 */
export interface MatchStatsDbRecord extends BaseDbRecord {
  stats: {
    general: {
      matchId: string;
      gameMode: string;
      mapId: string;
      roundsPlayed: number;
      gameStart: string;
      gameLengthMillis: number;
      isCompleted: boolean;
      queueId: string;
      [key: string]: unknown;
    };
    playerPerformance: {
      kills: number;
      deaths: number;
      assists: number;
      score: number;
      roundsPlayed: number;
      playtimeMillis: number;
      agentId: string;
      teamId: string;
      won: boolean;
      roundsWon: number;
      roundsLost: number;
      [key: string]: unknown;
    };
    combat: {
      headshots: number;
      bodyshots: number;
      legshots: number;
      damageDealt: number;
      damageTaken: number;
      [key: string]: number;
    };
    economy: {
      loadoutValue: number;
      spentCreds: number;
      [key: string]: number;
    };
    [key: string]: unknown;
  };
}

/**
 * Generic database record type
 */
export type DbRecord = 
  | AgentStatsDbRecord 
  | MapStatsDbRecord 
  | WeaponStatsDbRecord 
  | SeasonStatsDbRecord 
  | MatchStatsDbRecord;
