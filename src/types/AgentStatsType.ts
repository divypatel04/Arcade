export type AgentStatType = {
  id: string;
  puuid: string;
  agent: Agent;
  performanceBySeason: SeasonPerformance[];
  isPremiumStats?: boolean;
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

export type SeasonPerformance = {
  season: Season;
  stats: Stats;
  mapStats: MapStat[];
  attackStats: SideStats;
  defenseStats: SideStats;
  abilityAndUltimateImpact: AbilityAndUltimateImpact;
};

type Season = {
  id: string;
  name: string;
  isActive: boolean;
};

type Stats = {
  kills: number;
  deaths: number;
  roundsWon: number;
  roundsLost: number;
  totalRounds: number;
  plants: number;
  defuses: number;
  playtimeMillis: number;
  matchesWon: number;
  matchesLost: number;
  aces: number;
  firstKills: number;
};

type MapStat = {
  id: string;
  image: string;
  name: string;
  location: string;
  wins: number;
  losses: number;
};

type SideStats = {
  deaths: number;
  kills: number;
  roundsLost: number;
  roundsWon: number;
  clutchStats: ClutchStats;
};

type ClutchStats = {
  "1v1Wins": number;
  "1v2Wins": number;
  "1v3Wins": number;
  "1v4Wins": number;
  "1v5Wins": number;
};

type AbilityAndUltimateImpact = AbilityCastDetails[];

type AbilityCastDetails = {
  type: string;
  id: string;
  count: number;
  kills: number;
  damage: number;
};

type UltimateImpact = {
  killsUsingUltimate: number;
  roundsWonUsingUltimate: number;
  damageUsingUltimate: number;
};
