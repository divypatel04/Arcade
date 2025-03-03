import { SeasonStatsType } from "../types/SeasonStatsType";


export const getCurrentorRecentSeasonStats = (seasonStats: SeasonStatsType[]) => {
  const currentAct = seasonStats.find(season => season.season.isActive === true);

  if (currentAct) {
    return currentAct;
  } else {
    // If no current season is found, sort the seasons by seasonName in descending order and take the first one
    const sortedSeasons = seasonStats.slice().sort((a: SeasonStatsType, b: SeasonStatsType) => {
      if (a.season.name > b.season.name) return -1;
      if (a.season.name < b.season.name) return 1;
      return 0;
    });

    return sortedSeasons[0];
  }
};





export const getSeasonNames = (seasonStats: SeasonStatsType[]) => {
  const seasonSet: any = {};

  for (const season of seasonStats) {
    if (!seasonSet[season.season.id]) {
      seasonSet[season.season.id] = {
        seasonId: season.season.id,
        seasonName: season.season.name,
        seasonActive: season.season.isActive,
      };
    }
  }

  const seasonList = Object.values(seasonSet);

  const final = seasonList
    .map((season: any) => season.seasonName)
    .sort((a, b) => b.localeCompare(a));


  final.unshift('All Acts');

  return final;
};

export const aggregateSeasonStatsForAllActs = (seasonStats: SeasonStatsType[]) => {
  const initialStats = {
    season: {
      id: "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
      name: "EPISODE 9 - ACT 2",
      isActive: false,
    },
    stats: {
      kills: 0,
      deaths: 0,
      roundsWon: 0,
      roundsLost: 0,
      totalRounds: 0,
      plants: 0,
      defuses: 0,
      playtimeMillis: 0,
      matchesWon: 0,
      matchesLost: 0,
      matchesPlayed: 0,
      damage: 0,
      firstKill: 0,
      highestRank: 0,
      aces: 0,
      mvps: 0,
    }
  }

  const aggregatedStats = seasonStats.reduce((acc: any, curr) => {

    acc.stats.matchesPlayed += curr.stats.matchesPlayed;
    acc.stats.matchesWon += curr.stats.matchesWon;
    acc.stats.matchesLost += curr.stats.matchesLost;
    acc.stats.kills += curr.stats.kills;
    acc.stats.deaths += curr.stats.deaths;
    acc.stats.roundsWon += curr.stats.roundsWon;
    acc.stats.roundsLost += curr.stats.roundsLost;
    acc.stats.totalRounds += curr.stats.totalRounds;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis;
    acc.stats.damage += curr.stats.damage;
    acc.stats.Firstkill += curr.stats.firstKill;
    acc.stats.plants += curr.stats.plants;
    acc.stats.defuse += curr.stats.defuses;
    acc.stats.Aces += curr.stats.aces;
    acc.stats.mvps += curr.stats.mvps;
    acc.stats.highestRank =
      curr.stats.highestRank > acc.stats.highestRank ? curr.stats.highestRank : acc.stats.highestRank;

      return acc;
  }, initialStats);

  return aggregatedStats;
}