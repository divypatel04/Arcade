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

type Location = {
  x: number;
  y: number;
};

type AttackDefenseStats = {
  deaths: number;
  kills: number;
  roundsLost: number;
  roundsWon: number;
};

export type SeasonPerformance = {
  season: {
    id: string;
    name: string;
    isActive: boolean;
  };
  stats: Stats;
  deathLocation: Location[];
  attackStats: AttackDefenseStats;
  defenseStats: AttackDefenseStats;
};

type MapDetails = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
};

export type MapStatsType = {
  playerId: string;
  map: MapDetails;
  performanceBySeason: SeasonPerformance[];
};
