/**
 * Generic Merger Base
 * Eliminates code duplication for merging old and new stat data
 */

import { ProcessingError, ErrorCodes, logError } from '@lib/errors';
import type { Common } from '@types';

/**
 * Generic merger configuration
 */
export interface MergerConfig<T> {
  /**
   * Get unique identifier for a record
   */
  getId: (item: T) => string;
  
  /**
   * Merge season-level performance data
   * @param oldItem Existing record from database
   * @param newItem New record from processed data
   * @returns Merged record with combined season data
   */
  mergeSeasons: (oldItem: T, newItem: T) => T;
  
  /**
   * Optional: Merge overall stats (for records with stats property)
   */
  mergeStats?: (oldStats: Common.StatsObject, newStats: Common.StatsObject) => Common.StatsObject;
}

/**
 * Generic merge function
 * Combines old database records with new processed records
 * 
 * Logic:
 * 1. For each new record, check if it exists in old records
 * 2. If exists: merge season data
 * 3. If not exists: add as new record
 * 4. Return combined array
 */
export function createMerger<T>(config: MergerConfig<T>) {
  const { getId, mergeSeasons, mergeStats } = config;

  return function merge(oldRecords: T[], newRecords: T[]): T[] {
    try {
      // If no old records, return new records as-is
      if (!oldRecords || oldRecords.length === 0) {
        return newRecords;
      }

      // If no new records, return old records as-is
      if (!newRecords || newRecords.length === 0) {
        return oldRecords;
      }

      // Create a map of old records by ID for O(1) lookup
      const oldRecordsMap = new Map<string, T>();
      oldRecords.forEach(record => {
        oldRecordsMap.set(getId(record), record);
      });

      // Process new records
      const mergedRecords: T[] = [];
      const processedIds = new Set<string>();

      for (const newRecord of newRecords) {
        const id = getId(newRecord);
        const oldRecord = oldRecordsMap.get(id);

        if (oldRecord) {
          // Merge with existing record
          const merged = mergeSeasons(oldRecord, newRecord);
          mergedRecords.push(merged);
        } else {
          // Add as new record
          mergedRecords.push(newRecord);
        }

        processedIds.add(id);
      }

      // Add any old records that weren't in new records
      for (const oldRecord of oldRecords) {
        const id = getId(oldRecord);
        if (!processedIds.has(id)) {
          mergedRecords.push(oldRecord);
        }
      }

      return mergedRecords;
    } catch (error) {
      logError(error, {
        operation: 'merge',
        oldRecordsCount: oldRecords?.length,
        newRecordsCount: newRecords?.length,
      });
      
      // On error, return new records to avoid data loss
      return newRecords || oldRecords || [];
    }
  };
}

/**
 * Helper: Merge season performance arrays
 * Common pattern for stats that have performanceBySeason
 */
export function mergeSeasonPerformance<T extends Common.SeasonPerformance>(
  oldSeasons: T[],
  newSeasons: T[],
  getSeasonId: (season: Common.Season) => string
): T[] {
  if (!oldSeasons || oldSeasons.length === 0) {
    return newSeasons || [];
  }

  if (!newSeasons || newSeasons.length === 0) {
    return oldSeasons;
  }

  const mergedSeasons: T[] = [];
  const processedSeasonIds = new Set<string>();

  // Create map for O(1) lookup
  const oldSeasonsMap = new Map<string, T>();
  oldSeasons.forEach(seasonData => {
    oldSeasonsMap.set(getSeasonId(seasonData.season), seasonData);
  });

  // Process new seasons
  for (const newSeasonData of newSeasons) {
    const seasonId = getSeasonId(newSeasonData.season);
    const oldSeasonData = oldSeasonsMap.get(seasonId);

    if (oldSeasonData) {
      // For existing season, use new data (it's more up-to-date)
      mergedSeasons.push(newSeasonData);
    } else {
      // New season, add it
      mergedSeasons.push(newSeasonData);
    }

    processedSeasonIds.add(seasonId);
  }

  // Add any old seasons that weren't updated
  for (const oldSeasonData of oldSeasons) {
    const seasonId = getSeasonId(oldSeasonData.season);
    if (!processedSeasonIds.has(seasonId)) {
      mergedSeasons.push(oldSeasonData);
    }
  }

  return mergedSeasons;
}

/**
 * Helper: Merge stats objects
 * Adds values from new stats to old stats
 */
export function mergeStatsObjects(
  oldStats: Common.StatsObject, 
  newStats: Common.StatsObject
): Common.StatsObject {
  if (!oldStats) return newStats;
  if (!newStats) return oldStats;

  const merged: Common.StatsObject = { ...oldStats };

  // Add numeric values
  for (const key in newStats) {
    const value = newStats[key];
    if (typeof value === 'number') {
      const oldValue = merged[key];
      merged[key] = (typeof oldValue === 'number' ? oldValue : 0) + value;
    } else {
      merged[key] = value;
    }
  }

  // Recalculate derived stats
  if (typeof merged.kills === 'number' && typeof merged.deaths === 'number') {
    merged.kda = merged.deaths === 0 
      ? merged.kills 
      : Number((merged.kills / merged.deaths).toFixed(2));
  }

  if (typeof merged.wins === 'number' && typeof merged.matchesPlayed === 'number') {
    merged.winRate = merged.matchesPlayed === 0
      ? 0
      : Number(((merged.wins / merged.matchesPlayed) * 100).toFixed(2));
  }

  if (typeof merged.headshots === 'number' && typeof merged.kills === 'number') {
    merged.headshotPercentage = merged.kills === 0
      ? 0
      : Number(((merged.headshots / merged.kills) * 100).toFixed(2));
  }

  return merged;
}
