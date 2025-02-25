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