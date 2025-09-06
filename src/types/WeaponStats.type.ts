export type WeaponStatsType = {
    id: string;
    puuid: string;
    weapon: Weapon;
    performanceBySeason: WeaponSeasonPerformance[];
};

interface Weapon {
    id: string;
    name: string;
    image: string;
    type: string;
}

export type WeaponSeasonPerformance = {
    season: Season;
    stats: WeaponSeasonStats;
};

interface Season {
    id: string;
    name: string;
    isActive: boolean;
}

interface WeaponSeasonStats {
    kills: number;
    damage: number;
    aces: number;
    firstKills: number;
    roundsPlayed: number;
    avgKillsPerRound: number;
    avgDamagePerRound: number;
    legshots: number;
    headshots: number;
    bodyshots: number;
}
