import { WeaponStatType } from "../types/WeaponStatsType";

export const getTopWeaponByKills = (
  weaponStats: WeaponStatType[],
): WeaponStatType => {
  let bestWeapon: WeaponStatType | null = null;
  let highestKills: number = 0;

  for (const weapon of weaponStats) {
    const activeSeasonStats = weapon.performanceBySeason.find(
      season => season.season.isActive === true,
    );

    if (activeSeasonStats) {
      const kills = activeSeasonStats.stats.kills;

      if (kills > highestKills) {
        highestKills = kills;
        bestWeapon = weapon;
      }
    }
  }

  // If no active season was found, consider the weapon with the highest kills across all seasons
  if (!bestWeapon) {
    for (const weapon of weaponStats) {
      const highestKillsAcrossAllSeasons = weapon.performanceBySeason.reduce(
        (prev, current) => (prev.stats.kills > current.stats.kills ? prev : current),
      );

      if (
        !bestWeapon ||
        highestKillsAcrossAllSeasons.stats.kills > bestWeapon.performanceBySeason[0].stats.kills
      ) {
        bestWeapon = {...weapon, performanceBySeason: [highestKillsAcrossAllSeasons]};
      }
    }
  }

  return bestWeapon as WeaponStatType;
};