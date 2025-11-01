/**
 * Season Stats Database Service
 * CRUD operations for season statistics
 */

import { createDbService } from './baseDb';
import type { SeasonStatsType } from '@types';

/**
 * No transformation needed for season stats
 */
const seasonStatsDb = createDbService<SeasonStatsType>('seasonstats');

// Export individual functions for backward compatibility
export const {
  fetchByPuuid: fetchSeasonStats,
  fetchById: fetchSeasonStatById,
  upsert: upsertSeasonStats,
  deleteById: deleteSeasonStatById,
  deleteByPuuid: deleteAllSeasonStats,
  count: countSeasonStats,
} = seasonStatsDb;

export { seasonStatsDb };
