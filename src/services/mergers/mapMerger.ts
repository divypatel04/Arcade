/**
 * Map Stats Merger
 * Merges old and new map statistics
 */

import { createMerger, mergeSeasonPerformance } from './baseMerger';
import type { MapStatsType, MapSeasonPerformance } from '@types';

/**
 * Merge map stats
 */
export const mergeMapStats = createMerger<MapStatsType>({
  // Use map ID as unique identifier
  getId: (map) => map.map.id,
  
  // Merge season performance data
  mergeSeasons: (oldMap, newMap) => {
    const mergedSeasons = mergeSeasonPerformance<MapSeasonPerformance>(
      oldMap.performanceBySeason,
      newMap.performanceBySeason,
      (season) => season.id
    );

    return {
      ...newMap,
      performanceBySeason: mergedSeasons,
    };
  },
});
