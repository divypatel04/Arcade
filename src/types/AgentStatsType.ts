export type AgentStatType = {
  id: string;
  puuid: string;
  agent: Agent;
  performanceBySeason: AgentSeasonPerformance[];
  isPremiumStats?: boolean;
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
  mapStats: AgentMapStat[];
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

export type AgentMapStat = {
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

type AbilityAndUltimateImpact = AgentAbilityCastDetails[];

export type AgentAbilityCastDetails = {
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
