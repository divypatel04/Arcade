// Agent and ability types
interface Ability {
  id: string;
  name: string;
  image: string;
  type: string;
  cost: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  icon: string;
  abilities: Ability[];
}

// Map related types
interface MapCoordinate {
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
}

interface Map {
  id: string;
  name: string;
  location: string;
  image: string;
  mapCoordinate: MapCoordinate;
}

interface Season {
  id: string;
  name: string;
  isActive: boolean;
}

interface GeneralInfo {
  matchId: string;
  mapId: string;
  seasonId: string;
  queueId: string;
  gameStartMillis: number;
  gameLengthMillis: number;
  isRanked: boolean;
  winningTeam: string;
  roundsPlayed: number;
  agent: Agent;
  map: Map;
  season: Season;
}

// Player statistics
interface PlayerStats {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  firstBloods: number;
  clutchesWon: number;
  clutchAttempts: number;
  headshotPercentage: number;
  damagePerRound: number;
  kdRatio: number;
  aces: number;
  playtimeMillis: number;
  roundsPlayed: number;
  roundsWon: number;
  roundsLost: number;
}

interface Player {
  id: string;
  teamId: string;
  name: string;
  stats: PlayerStats;
}

// Event types
interface KillEvent {
  killer: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  timestamp: string;
  round: number;
}

interface ClutchEvent {
  player: string;
  situation: string;
  round: number;
  won: boolean;
}

interface Coordinate {
  x: number;
  y: number;
}

interface MapData {
  kills: {
    [playerId: string]: Coordinate[];
  };
  deaths: {
    [playerId: string]: Coordinate[];
  };
}

interface PlayerVsPlayerStat {
  user: Player;
  enemies: Player[];
  killEvents: KillEvent[];
  clutchEvents: ClutchEvent[];
  mapData: MapData;
  mapCoordinates: MapCoordinate;
}

// Team statistics
interface TeamStat {
  team: string;
  teamId: string;
  firstKills: number;
  thrifties: number;
  postPlantsWon: number;
  postPlantsLost: number;
  clutchesWon: number;
}

// Combat data
interface CombatStats {
  kills: number;
  deaths: number;
  assists: number;
  damageDealt: number;
  headshotPercentage: number;
  tradedKill: boolean;
  tradeKill: boolean;
}

// Economy data
interface EconomyStats {
  weaponType: string;
  armorType: string;
  creditSpent: number;
  loadoutValue: number;
  enemyLoadoutValue: number;
}

// Positioning data
interface PositioningStats {
  site: string;
  positionType: string;
  firstContact: boolean;
  timeToFirstContact: number;
}

// Utility data
interface UtilityStats {
  abilitiesUsed: number;
  totalAbilities: number;
  utilityDamage: number;
}

// Round performance data
interface RoundPerformance {
  roundNumber: number;
  outcome: string;
  impactScore: number;
  combat: CombatStats;
  economy: EconomyStats;
  positioning: PositioningStats;
  utility: UtilityStats;
  improvement: string[];
}

// Main match stats interface
interface MatchStatType {
  id: string
  puuid: string;
  stats: {
    general: GeneralInfo;
    playerVsplayerStat: PlayerVsPlayerStat;
    teamStats: TeamStat[];
    roundPerformace: RoundPerformance[];
  };
  isPremiumStats?: boolean;
}

export type {
  PlayerVsPlayerStat,
  TeamStat,
  RoundPerformance,
  MatchStatType,
  KillEvent,
  ClutchEvent,

};
