import {WeaponSeasonStats, WeaponStatsTypes} from '../types/weaponStatsTypes';

export const evaluateBestPerformingWeapon = (
  weaponStats: WeaponStatsTypes[],
): WeaponStatsTypes | null => {
  let bestWeapon: WeaponStatsTypes | null = null;
  let highestKills: number = 0;

  for (const weapon of weaponStats) {
    const activeSeasonStats = weapon.actStats.find(
      season => season.seasonActive === true,
    );

    if (activeSeasonStats) {
      const kills = activeSeasonStats.kills;

      if (kills > highestKills) {
        highestKills = kills;
        bestWeapon = weapon;
      }
    }
  }

  // If no active season was found, consider the weapon with the highest kills across all seasons
  if (!bestWeapon) {
    for (const weapon of weaponStats) {
      const highestKillsAcrossAllSeasons = weapon.actStats.reduce(
        (prev, current) => (prev.kills > current.kills ? prev : current),
      );

      if (
        !bestWeapon ||
        highestKillsAcrossAllSeasons.kills > bestWeapon.actStats[0].kills
      ) {
        bestWeapon = {...weapon, actStats: [highestKillsAcrossAllSeasons]};
      }
    }
  }

  return bestWeapon;
};

export const extractUniqueSeasonDetails = (weaponStats: WeaponStatsTypes[]) => {
  const seasonSet: any = {};

  for (const weapon of weaponStats) {
    for (const season of weapon.actStats) {
      if (!seasonSet[season.seasonId]) {
        seasonSet[season.seasonId] = {
          seasonId: season.seasonId,
          seasonName: season.seasonName,
          seasonActive: season.seasonActive,
        };
      }
    }
  }

  const seasonList = Object.values(seasonSet);

  const final = seasonList
    .map((season: any) => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  return final;
};

export function filterAndSortByMatches(
  weaponStats: WeaponStatsTypes[],
  seasonName: string,
) {
  let allSortedStats = [];

  if (seasonName === 'All Act') {
    // Handle the "All Act" case
    allSortedStats = weaponStats.map(weaponStat => {
      const numberOfKills = weaponStat.actStats.map(stat => stat.kills);

      return {
        weapon: weaponStat,
        seasonName: seasonName,
        numberOfKills:
          numberOfKills.length > 0 ? numberOfKills.reduce((a, b) => a + b) : 0,
      };
    });
  } else {
    // Handle individual seasons
    allSortedStats = weaponStats.map(weaponStat => {
      const filteredStats = weaponStat.actStats.filter(
        stat => stat.seasonName === seasonName,
      );

      const numberOfKills = filteredStats.map(stat => stat.kills);

      return {
        weapon: weaponStat,
        seasonName: seasonName,
        numberOfKills:
          numberOfKills.length > 0 ? numberOfKills.reduce((a, b) => a + b) : 0,
      };
    });
  }

  // Filter out agents with numberOfMatches equal to 0
  const filteredSortedStats = allSortedStats.filter(
    stat => stat.numberOfKills > 0,
  );

  // Sort all remaining agents by the number of matches in descending order
  const finalSortedStats = filteredSortedStats.sort(
    (a, b) => b.numberOfKills - a.numberOfKills,
  );

  return finalSortedStats;
}

export const aggregateStatsForAllActs = (weaponData: WeaponStatsTypes) => {
  const initialStats = {
    kills: 0,
    legshots: 0,
    headshots: 0,
    bodyshots: 0,
    damage: 0,
    roundsPlayed: 0,
    Aces: 0,
    Firstkill: 0,
  };

  const aggregatedStats = weaponData.actStats.reduce((acc: any, curr) => {
    acc.kills += curr.kills;
    acc.legshots += curr.legshots;
    acc.headshots += curr.headshots;
    acc.bodyshots += curr.bodyshots;
    acc.damage += curr.damage;
    acc.roundsPlayed += curr.roundsPlayed;
    acc.Aces += curr.Aces;
    acc.Firstkill += curr.Firstkill;

    return acc;
  }, initialStats);

  return aggregatedStats;
};
