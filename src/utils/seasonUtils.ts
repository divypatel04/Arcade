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