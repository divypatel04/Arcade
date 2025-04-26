export type WeaponStatsType = {
  id: string;
  puuid: string;
  weapon: {
    id: string;
    name: string;
    image: string;
    type: string;
  };
  performanceBySeason: WeaponSeasonPerformance[];
  isPremiumStats?: boolean;
};

export type WeaponSeasonPerformance = {
  season: {
    id: string;
    name: string;
    isActive: boolean;
  };
  stats: {
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
  };
};