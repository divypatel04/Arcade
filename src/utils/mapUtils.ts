import { MapStatsType } from "../types/MapStatsType";

export const getBestMap = (
  mapStats: MapStatsType[],
): MapStatsType => {
  let bestMap: MapStatsType | undefined;
  let highestWinRate: number = 0;

  for (const map of mapStats) {
    const activeSeasonStats = map.performanceBySeason.find(
      season => season.season.isActive === true,
    );

    if (activeSeasonStats) {
      const totalGames = activeSeasonStats.stats.matchesWon + activeSeasonStats.stats.matchesLost;
      if (totalGames === 0) continue;

      const winRate = activeSeasonStats.stats.matchesWon / totalGames;

      if (winRate > highestWinRate) {
        highestWinRate = winRate;
        bestMap = map;
      }
    }
  }

  // If no active season was found, try to find the season with the highest win rate
  if (!bestMap) {
    for (const map of mapStats) {
      const seasonWithHighestWinRate = map.performanceBySeason.reduce((prev, current) =>
        prev.stats.matchesWon / (prev.stats.matchesWon + prev.stats.matchesLost) >
        current.stats.matchesWon / (current.stats.matchesWon + current.stats.matchesLost)
          ? prev
          : current,
      );
      bestMap = map;
    }
  }

  if (!bestMap) {
    throw new Error("No best map found");
  }
  return bestMap;
};

export const getMapsSeasonNames = (mapStats: MapStatsType[]) => {
  const seasonSet: any = {};

  for (const map of mapStats) {
    for (const season of map.performanceBySeason) {
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
    .map((season: any) => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  final.unshift('All Act');

  return final;
};


interface MapListProps {
  mapStat: MapStatsType,
  seasonName: string,
  numberOfMatches: number
}

export function filterAndSortByMapMatches(
  mapStats: MapStatsType[],
  seasonName: string,
) {
  let allSortedStats = [];

  if (seasonName === 'All Act') {
    // Handle the "All Act" case
    allSortedStats = mapStats.map(mapStat => {
      const numberOfMatches = mapStat.performanceBySeason.map(
        stat => stat.stats.matchesWon + stat.stats.matchesLost,
      );

      return {
        mapStat: mapStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  } else {
    // Handle individual seasons
    allSortedStats = mapStats.map(mapStat => {
      const filteredStats = mapStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName,
      );

      const numberOfMatches = filteredStats.map(stat => stat.stats.matchesWon + stat.stats.matchesLost);

      return {
        mapStat: mapStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  }

  // Filter out agents with numberOfMatches equal to 0
  const filteredSortedStats: MapListProps[] = allSortedStats.filter(
    stat => stat.numberOfMatches > 0,
  );

  // Sort all remaining agents by the number of matches in descending order
  const finalSortedStats: MapListProps[] = filteredSortedStats.sort(
    (a, b) => b.numberOfMatches - a.numberOfMatches,
  );

  return finalSortedStats;
}