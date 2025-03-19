export type WeaponStatType = {
  id: string;
  puuid: string;
  weapon: {
    id: string;
    name: string;
    imageUrl: string;
    type: string;
  };
  performanceBySeason: SeasonPerformance[];
  isPremiumStats?: boolean;
};

export type SeasonPerformance = {
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