/**
 * Weapon Stats Database Service
 * CRUD operations for weapon statistics
 */

import { createDbService } from './baseDb';
import type { WeaponStatsType } from '@types';

/**
 * Transform DB snake_case to app camelCase
 */
function transformFromDb(dbRecord: Record<string, unknown>): WeaponStatsType {
  return {
    ...dbRecord,
    performanceBySeason: (dbRecord.performancebyseason || []) as WeaponStatsType['performanceBySeason'],
  } as WeaponStatsType;
}

/**
 * Transform app camelCase to DB snake_case
 */
function transformToDb(appRecord: WeaponStatsType): Record<string, unknown> {
  return {
    ...appRecord,
    performancebyseason: appRecord.performanceBySeason,
  };
}

/**
 * Weapon stats database service
 */
export const weaponStatsDb = createDbService<WeaponStatsType>('weaponstats', {
  transformFromDb,
  transformToDb,
});

// Export individual functions for backward compatibility
export const {
  fetchByPuuid: fetchWeaponStats,
  fetchById: fetchWeaponStatById,
  upsert: upsertWeaponStats,
  deleteById: deleteWeaponStatById,
  deleteByPuuid: deleteAllWeaponStats,
  count: countWeaponStats,
} = weaponStatsDb;
