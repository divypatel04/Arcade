/**
 * Common types used across services
 */

/**
 * Generic stats object with numeric values
 */
export interface StatsObject {
  [key: string]: number | string | boolean | undefined;
  kills?: number;
  deaths?: number;
  assists?: number;
  kda?: number;
  headshots?: number;
  bodyshots?: number;
  legshots?: number;
  roundsWon?: number;
  roundsLost?: number;
  matchesWon?: number;
  matchesLost?: number;
  damageDealt?: number;
  damageTaken?: number;
}

/**
 * Generic season identifier
 */
export interface Season {
  id: string;
  name: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
}

/**
 * Generic season performance with stats
 */
export interface SeasonPerformance<TStats = StatsObject> {
  season: Season;
  stats: TStats;
}

/**
 * Player information from match data
 */
export interface Player {
  puuid: string;
  gameName?: string;
  tagLine?: string;
  teamId: string;
  characterId: string;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    score: number;
    [key: string]: number | string;
  };
  [key: string]: unknown;
}

/**
 * Team information from match data
 */
export interface Team {
  teamId: string;
  won: boolean;
  roundsWon: number;
  roundsLost: number;
  players?: Player[];
  [key: string]: unknown;
}

/**
 * Round information from match data
 */
export interface Round {
  roundNum: number;
  roundResult: string;
  winningTeam: string;
  playerStats?: Array<{
    puuid: string;
    kills: number;
    damage: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

/**
 * Match information
 */
export interface MatchInfo {
  matchId: string;
  mapId: string;
  gameMode: string;
  gameStart: string;
  queueId: string;
  [key: string]: unknown;
}
