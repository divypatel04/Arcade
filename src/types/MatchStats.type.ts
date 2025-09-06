
// Core types
export type MatchStatsType = {
  id: string;
  puuid: string;
  match: MatchDetails;
  performance: MatchPerformance;
};

// Match details
type MatchDetails = {
  id: string;
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
};

type Agent = {
  id: string;
  name: string;
  role: string;
  image: string;
  icon: string;
  abilities: Ability[];
};

type Ability = {
  id: string;
  name: string;
  image: string;
  type: string;
  cost: number;
};

type Map = {
  id: string;
  name: string;
  location: string;
  image: string;
  mapCoordinate: MapCoordinate;
};

type MapCoordinate = {
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
};

type Season = {
  id: string;
  name: string;
  isActive: boolean;
};

// Performance data
export type MatchPerformance = {
  stats: MatchStats;
  combatStats: CombatStats;
  economyStats: EconomyStats;
  utilityStats: UtilityStats;
  teamStats: TeamStats;
  playerComparison: PlayerVsPlayerStats;
  roundByRound: RoundPerformance[];
  positioningData: PositioningData;
};

type MatchStats = {
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  firstBloods: number;
  aces: number;
  clutchesWon: number;
  clutchAttempts: number;
  headshotPercentage: number;
  damagePerRound: number;
  playtimeMillis: number;
  roundsPlayed: number;
  roundsWon: number;
  roundsLost: number;
  winRate: number;
};

// Combat statistics
export type CombatStats = {
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalDamageDealt: number;
  avgDamagePerRound: number;
  headshotPercentage: number;
  firstKillsSecured: number;
  tradedKills: number;
  tradeKills: number;
  multiKills: {
    doubles: number;
    triples: number;
    quadras: number;
    aces: number;
  };
};

// Economy statistics
export type EconomyStats = {
  totalCreditsSpent: number;
  avgLoadoutValue: number;
  avgEnemyLoadoutValue: number;
  ecoRoundsWon: number;
  forceRoundsWon: number;
  fullBuyRoundsWon: number;
  weaponPreferences: WeaponUsage[];
  armorPurchases: ArmorUsage[];
};

type WeaponUsage = {
  weaponId: string;
  weaponName: string;
  weaponType: string;
  roundsUsed: number;
  kills: number;
  creditsSpent: number;
};

type ArmorUsage = {
  armorId: string;
  armorType: string;
  roundsUsed: number;
  creditsSpent: number;
};

// Utility statistics
export type UtilityStats = {
  totalAbilitiesUsed: number;
  abilityUsageByType: AbilityUsage[];
  utilityDamage: number;
  utilityKills: number;
  utilityAssists: number;
  flashAssists: number;
  smokeUptime: number;
};

type AbilityUsage = {
  abilityId: string;
  abilityName: string;
  abilityType: string;
  timesUsed: number;
  damage: number;
  kills: number;
  cost: number;
};

// Team statistics
export type TeamStats = {
  teamId: string;
  teamName: string;
  firstKills: number;
  thrifties: number;
  postPlantsWon: number;
  postPlantsLost: number;
  clutchesWon: number;
  attackRoundsWon: number;
  defenseRoundsWon: number;
  pistolRoundsWon: number;
};

// Player comparison
export type PlayerVsPlayerStats = {
  user: PlayerInfo;
  teammates: PlayerInfo[];
  enemies: PlayerInfo[];
  killEvents: KillEvent[];
  clutchEvents: ClutchEvent[];
  mapData: MapData;
};

type PlayerInfo = {
  id: string;
  puuid: string;
  name: string;
  agent: Agent;
  stats: MatchStats;
};

// Events
export type KillEvent = {
  killer: string;
  victim: string;
  weaponId?: string;
  weapon: string;
  headshot: boolean;
  timestamp: string;
  round: number;
  location: Coordinate;
};

export type ClutchEvent = {
  player: string;
  situation: string;
  round: number;
  won: boolean;
  enemiesRemaining: number;
  timeRemaining: number;
};

// Map data
export type MapData = {
  kills: {
    [playerId: string]: Coordinate[];
  };
  deaths: {
    [playerId: string]: Coordinate[];
  };
  firstContactLocations: Coordinate[];
  plantLocations: Coordinate[];
  defuseLocations: Coordinate[];
};

export type Coordinate = {
  x: number;
  y: number;
};

// Positioning data
export type PositioningData = {
  heatmapData: {
    killsLocation: Coordinate[];
    deathsLocation: Coordinate[];
    firstContactLocation: Coordinate[];
  };
  siteHold: {
    [site: string]: {
      roundsHeld: number;
      totalRounds: number;
      avgTimeToFirstContact: number;
    };
  };
  rotationTimes: {
    [fromSite: string]: {
      [toSite: string]: number;
    };
  };
};

// Round performance
export type RoundPerformance = {
  roundNumber: number;
  side: 'attack' | 'defense';
  outcome: 'win' | 'loss';
  impactScore: number;
  roundType: 'pistol' | 'eco' | 'force' | 'full-buy' | 'save';
  combat: RoundCombatStats;
  economy: RoundEconomyStats;
  positioning: RoundPositioningStats;
  utility: RoundUtilityStats;
  improvements: string[];
  mvpPlayer?: string;
};

type RoundCombatStats = {
  kills: number;
  deaths: number;
  assists: number;
  damageDealt: number;
  damageReceived: number;
  headshotPercentage: number;
  firstKill: boolean;
  clutchAttempt: boolean;
  clutchWon: boolean;
};

type RoundEconomyStats = {
  creditsSpent: number;
  loadoutValue: number;
  enemyLoadoutValue: number;
  weaponType: string;
  armorType: string;
  economyRating: 'eco' | 'force' | 'full-buy' | 'save';
};

type RoundPositioningStats = {
  site: string;
  positionType: 'anchor' | 'lurk' | 'entry' | 'support';
  firstContact: boolean;
  timeToFirstContact?: number;
  rotations: number;
  mapControl: number;
};

type RoundUtilityStats = {
  abilitiesUsed: number;
  totalAbilities: number;
  utilityDamage: number;
  utilityKills: number;
  flashAssists: number;
  smokeUptime: number;
};