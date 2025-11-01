/**
 * Match Stats Merger
 * Merges old and new match statistics
 */

import { createMerger } from './baseMerger';
import type { MatchStatsType } from '@types';

/**
 * Merge match stats
 * Note: Match stats are typically append-only (each match is unique)
 */
export const mergeMatchStats = createMerger<MatchStatsType>({
  // Use match ID as unique identifier
  getId: (match) => match.id,
  
  // For match stats, prefer new data if match ID exists
  mergeSeasons: (oldMatch, newMatch) => {
    return newMatch;
  },
});
