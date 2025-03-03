export interface SeasonStatsType {
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
    totalRounds: number;
    plants: number;
    defuses: number;
    playtimeMillis: number;
    matchesWon: number;
    matchesLost: number;
    matchesPlayed: number;
    damage: number;
    firstKill: number;
    highestRank: number;
    aces: number;
    mvps: number;
  };
}
