/**
 * Weapon Stats Merger
 * Merges old and new weapon statistics
 */

import { createMerger, mergeSeasonPerformance } from './baseMerger';
import type { WeaponStatsType, WeaponSeasonPerformance } from '@types';

/**
 * Merge weapon stats
 */
export const mergeWeaponStats = createMerger<WeaponStatsType>({
  // Use weapon ID as unique identifier
  getId: (weapon) => weapon.weapon.id,
  
  // Merge season performance data
  mergeSeasons: (oldWeapon, newWeapon) => {
    const mergedSeasons = mergeSeasonPerformance<WeaponSeasonPerformance>(
      oldWeapon.performanceBySeason,
      newWeapon.performanceBySeason,
      (season) => season.id
    );

    return {
      ...newWeapon,
      performanceBySeason: mergedSeasons,
    };
  },
});
