/**
 * Map Stats Database Service
 * CRUD operations for map statistics
 */

import { createDbService } from './baseDb';
import type { MapStatsType } from '@types';

/**
 * Transform DB snake_case to app camelCase
 */
function transformFromDb(dbRecord: Record<string, unknown>): MapStatsType {
  return {
    ...dbRecord,
    performanceBySeason: (dbRecord.performancebyseason || []) as MapStatsType['performanceBySeason'],
  } as MapStatsType;
}

/**
 * Transform app camelCase to DB snake_case
 */
function transformToDb(appRecord: MapStatsType): Record<string, unknown> {
  return {
    ...appRecord,
    performancebyseason: appRecord.performanceBySeason,
  };
}

/**
 * Map stats database service
 */
export const mapStatsDb = createDbService<MapStatsType>('mapstats', {
  transformFromDb,
  transformToDb,
});

// Export individual functions for backward compatibility
export const {
  fetchByPuuid: fetchMapStats,
  fetchById: fetchMapStatById,
  upsert: upsertMapStats,
  deleteById: deleteMapStatById,
  deleteByPuuid: deleteAllMapStats,
  count: countMapStats,
} = mapStatsDb;
