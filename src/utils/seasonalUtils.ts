import { AgentStatType, MapStatsType, SeasonStatsType, WeaponStatsType } from "@types";

type StatsType = AgentStatType | MapStatsType | WeaponStatsType;


export const getAllSeasonNames = <T extends StatsType>(stats: T[]) => {
  const seasonSet: Record<string, {
    seasonId: string,
    seasonName: string,
    seasonActive: boolean
  }> = {};

  for (const stat of stats) {
    for (const season of stat.performanceBySeason) {
      if (!seasonSet[season.season.id]) {
        seasonSet[season.season.id] = {
          seasonId: season.season.id,
          seasonName: season.season.name,
          seasonActive: season.season.isActive,
        };
      }
    }
  }

  const seasonList = Object.values(seasonSet);

  const final = seasonList
    .map((season) => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  final.unshift('All Act');

  return final;
};

export const getCurrentOrMostRecentSeason = (agentStat: AgentStatType) => {
  let CurrentSeason = agentStat?.performanceBySeason?.find(
    (seasonPerformace: any) => seasonPerformace.season.isActive,
  );
  if (!CurrentSeason) {
    const sortedSeasons =
      agentStat?.performanceBySeason?.slice().sort((a: any, b: any) => {
        if (a.season.name > b.season.name) return -1;
        if (a.season.name < b.season.name) return 1;
        return 0;
      }) || [];
    CurrentSeason = sortedSeasons[0];
  }

  return CurrentSeason;
}

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



export const getSortedSeasonNames = (seasonStats: SeasonStatsType[]) => {
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