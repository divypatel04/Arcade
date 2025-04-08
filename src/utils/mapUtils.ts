import { MapStatsType, SeasonPerformance } from '../types/MapStatsType';

/**
 * Identifies the map with the highest win rate based on active season or best historical performance.
 * First looks for maps with active seasons, then falls back to historical data if no active season exists.
 *
 * @param mapStats - Array of map statistics
 * @returns The map with the highest win rate
 * @throws Error if no suitable map is found
 */
export const getTopMapByWinRate = (mapStats: MapStatsType[]): MapStatsType => {
  let bestMap: MapStatsType | undefined;
  let highestWinRate = 0;

  // First try to find maps with active seasons
  for (const map of mapStats) {
    const activeSeasonStats = map.performanceBySeason.find(
      season => season.season.isActive
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

  // If no map with active season is found, use historical data
  if (!bestMap && mapStats.length > 0) {
    for (const map of mapStats) {
      // Skip maps with no performance data
      if (map.performanceBySeason.length === 0) continue;

      // Find season with highest win rate
      const bestSeason = map.performanceBySeason.reduce((prev, current) => {
        const prevTotal = prev.stats.matchesWon + prev.stats.matchesLost;
        const currentTotal = current.stats.matchesWon + current.stats.matchesLost;

        // Skip seasons with no matches
        if (currentTotal === 0) return prev;
        if (prevTotal === 0) return current;

        const prevWinRate = prev.stats.matchesWon / prevTotal;
        const currentWinRate = current.stats.matchesWon / currentTotal;

        return prevWinRate > currentWinRate ? prev : current;
      });

      const totalGames = bestSeason.stats.matchesWon + bestSeason.stats.matchesLost;
      if (totalGames === 0) continue;

      const winRate = bestSeason.stats.matchesWon / totalGames;
      if (winRate > highestWinRate) {
        highestWinRate = winRate;
        bestMap = map;
      }
    }
  }

  if (!bestMap) {
    throw new Error('No map with sufficient data found');
  }

  return bestMap;
};

/**
 * Extracts all unique season names from map statistics.
 * Returns a sorted list with "All Act" always at the beginning.
 *
 * @param mapStats - Array of map statistics
 * @returns Array of season names sorted chronologically (newest first) with "All Act" at index 0
 */
export const getAllMapSeasonNames = (mapStats: MapStatsType[]): string[] => {
  const seasonMap: Record<string, {
    seasonId: string;
    seasonName: string;
    seasonActive: boolean;
  }> = {};

  // Collect unique seasons
  for (const map of mapStats) {
    for (const season of map.performanceBySeason) {
      if (!seasonMap[season.season.id]) {
        seasonMap[season.season.id] = {
          seasonId: season.season.id,
          seasonName: season.season.name,
          seasonActive: season.season.isActive,
        };
      }
    }
  }

  // Sort seasons by name (descending order - newest first)
  const sortedSeasons = Object.values(seasonMap)
    .map(season => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  // Add "All Act" at the beginning
  sortedSeasons.unshift('All Act');

  return sortedSeasons;
};

/**
 * Interface for map statistics with match counts for a specific season
 */
interface MapWithMatchCount {
  mapStat: MapStatsType;
  seasonName: string;
  numberOfMatches: number;
}

/**
 * Sorts maps by the number of matches played in a specific season or across all seasons.
 * Only includes maps with at least one match played.
 *
 * @param mapStats - Array of map statistics
 * @param seasonName - Season to filter by, or "All Act" for aggregated data
 * @returns Array of maps sorted by number of matches in descending order
 */
export const sortMapsByMatches = (
  mapStats: MapStatsType[],
  seasonName: string,
): MapWithMatchCount[] => {
  // Calculate number of matches for each map
  const mapsWithMatchCounts = mapStats.map(mapStat => {
    // Filter seasons based on the selected season name
    const relevantSeasons = seasonName === 'All Act'
      ? mapStat.performanceBySeason
      : mapStat.performanceBySeason.filter(stat => stat.season.name === seasonName);

    // Calculate total matches across relevant seasons
    const totalMatches = relevantSeasons.reduce(
      (total, season) => total + season.stats.matchesWon + season.stats.matchesLost,
      0
    );

    return {
      mapStat,
      seasonName,
      numberOfMatches: totalMatches
    };
  });

  // Only include maps with at least one match
  return mapsWithMatchCounts
    .filter(map => map.numberOfMatches > 0)
    .sort((a, b) => b.numberOfMatches - a.numberOfMatches);
};

/**
 * Aggregates statistics for a map across all seasons into a single "All Act" season.
 * Combines match data, round data, and location-based stats from all seasons.
 *
 * @param mapStat - The map's statistics
 * @returns Aggregated statistics for all acts
 */
export const aggregateMapStatsForAllActs = (mapStat: MapStatsType) => {
  const seasonStat: SeasonPerformance = {
    season: {
      id: 'All',
      name: 'All Act',
      isActive: false,
    },
    stats: {
      matchesWon: 0,
      matchesLost: 0,
      roundsWon: 0,
      roundsLost: 0,
      kills: 0,
      deaths: 0,
      playtimeMillis: 0,
      aces: 0,
      firstKills: 0,
      defuses: 0,
      plants: 0,
      totalRounds: 0,
    },
    attackStats: {
      roundsWon: 0,
      roundsLost: 0,
      deaths: 0,
      kills: 0,
      HeatmapLocation: {
        deathLocation: [],
        killsLocation: [],
      },
    },
    defenseStats: {
      roundsWon: 0,
      roundsLost: 0,
      deaths: 0,
      kills: 0,
      HeatmapLocation: {
        deathLocation: [],
        killsLocation: [],
      },
    },
  };

  const aggregatedStats = mapStat.performanceBySeason.reduce((acc: any, curr) => {
    acc.stats.matchesWon += curr.stats.matchesWon;
    acc.stats.matchesLost += curr.stats.matchesLost;
    acc.stats.roundsWon += curr.stats.roundsWon;
    acc.stats.roundsLost += curr.stats.roundsLost;
    acc.stats.kills += curr.stats.kills;
    acc.stats.deaths += curr.stats.deaths;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis;
    acc.stats.aces += curr.stats.aces;
    acc.stats.firstKills += curr.stats.firstKills;
    acc.stats.defuses += curr.stats.defuses;
    acc.stats.plants += curr.stats.plants;
    acc.stats.totalRounds += curr.stats.totalRounds;

    acc.attackStats.roundsWon += curr.attackStats.roundsWon;
    acc.attackStats.roundsLost += curr.attackStats.roundsLost;
    acc.attackStats.deaths += curr.attackStats.deaths;
    acc.attackStats.kills += curr.attackStats.kills;
    acc.attackStats.HeatmapLocation.deathLocation = [
      ...acc.attackStats.HeatmapLocation.deathLocation,
      ...curr.attackStats.HeatmapLocation.deathLocation,
    ];
    acc.attackStats.HeatmapLocation.killsLocation = [
      ...acc.attackStats.HeatmapLocation.killsLocation,
      ...curr.attackStats.HeatmapLocation.killsLocation,
    ];

    acc.defenseStats.roundsWon += curr.defenseStats.roundsWon;
    acc.defenseStats.roundsLost += curr.defenseStats.roundsLost;
    acc.defenseStats.deaths += curr.defenseStats.deaths;
    acc.defenseStats.kills += curr.defenseStats.kills;
    acc.defenseStats.HeatmapLocation.deathLocation = [
      ...acc.defenseStats.HeatmapLocation.deathLocation,
      ...curr.defenseStats.HeatmapLocation.deathLocation,
    ];
    acc.defenseStats.HeatmapLocation.killsLocation = [
      ...acc.defenseStats.HeatmapLocation.killsLocation,
      ...curr.defenseStats.HeatmapLocation.killsLocation,
    ];

    return acc;
  }, seasonStat);


  return aggregatedStats
};
