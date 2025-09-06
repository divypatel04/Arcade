export type AgentStatType = {
  id: string;
  puuid: string;
  agent: Agent;
  performanceBySeason: AgentSeasonPerformance[];
};

type Agent = {
  id: string;
  name: string;
  role: string;
  image: string;
  icon: string;
  abilities: AgentAbility[];
};

export type AgentAbility = {
  id: string;
  name: string;
  image: string;
  type: string;
  cost: number;
};

export type AgentSeasonPerformance = {
  season: Season;
  stats: Stats;
  mapStats: AgentMapStats[];
  attackStats: SideStats;
  defenseStats: SideStats;
  abilityStats: AgentAbilityStats[];
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

export type AgentMapStats = {
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
  oneV1Wins: number;
  oneV2Wins: number;
  oneV3Wins: number;
  oneV4Wins: number;
  oneV5Wins: number;
};

export type AgentAbilityStats = {
  type: string;
  id: string;
  count: number;
  kills: number;
  damage: number;
};