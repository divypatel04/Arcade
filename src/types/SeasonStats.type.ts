export interface SeasonStatsType {
    id: string;
    puuid: string;
    performanceBySeason: SeasonPerformance[];
}

interface SeasonPerformance {
    season: Season;
    stats: SeasonStats;
}

interface Season {
    id: string;
    name: string;
    isActive: boolean;
};

interface SeasonStats {
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
}
