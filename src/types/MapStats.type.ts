export type MapStatsType = {
  id: string;
  puuid: string;
  map: MapDetails;
  performanceBySeason: MapSeasonPerformance[];
};

type MapDetails = {
  id: string;
  name: string;
  location: string;
  image: string;
  mapcoordinates: {
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
  }
};

export type MapSeasonPerformance = {
  season: Season;
  stats: Stats;
  attackStats: AttackDefenseStats;
  defenseStats: AttackDefenseStats;
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

type AttackDefenseStats = {
  deaths: number;
  kills: number;
  roundsLost: number;
  roundsWon: number;
  HeatmapLocation: {
    "killsLocation":Location[];
    "deathLocation":Location[];
  };
};

type Location = {
  x: number;
  y: number;
};




