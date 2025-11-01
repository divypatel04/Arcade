/**
 * Match Stats Database Service
 * CRUD operations for match statistics
 */

import { createDbService } from './baseDb';
import type { MatchStatsType } from '@types';

/**
 * No transformation needed for match stats
 */
const matchStatsDb = createDbService<MatchStatsType>('matchstats');

// Export individual functions for backward compatibility
export const {
  fetchByPuuid: fetchMatchStats,
  fetchById: fetchMatchStatById,
  upsert: upsertMatchStats,
  deleteById: deleteMatchStatById,
  deleteByPuuid: deleteAllMatchStats,
  count: countMatchStats,
} = matchStatsDb;

export { matchStatsDb };
