/**
 * Season Stats Merger
 * Merges old and new season statistics
 */

import { createMerger } from './baseMerger';
import type { SeasonStatsType } from '@types';

/**
 * Merge season stats
 */
export const mergeSeasonStats = createMerger<SeasonStatsType>({
  // Use season ID as unique identifier
  getId: (seasonStat) => seasonStat.season.id,
  
  // For season stats, just replace with new data (no nested seasons)
  mergeSeasons: (oldSeasonStat, newSeasonStat) => {
    return newSeasonStat;
  },
});
