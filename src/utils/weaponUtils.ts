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


export const getAllWeaponSeasonNames = (weaponStats: WeaponStatType[]) => {
  const seasonSet: any = {};

  for (const weapon of weaponStats) {
    for (const season of weapon.performanceBySeason) {
      if (!seasonSet[season.season.id]) {
        seasonSet[season.season.id] = {
          seasonId: season.season.id,
          seasonName: season.season.name,
          seasonActive: season.season.isActive,
        };
      }
    }
  }

  const seasonList = Object.values(seasonSet);

  const final = seasonList
    .map((season: any) => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  final.unshift('All Act');

  return final;
};


export function sortWeaponsByMatches(
  weaponStats: WeaponStatType[],
  seasonName: string,
) {
  let allSortedStats = [];

  if (seasonName === 'All Act') {
    // Handle the "All Act" case
    allSortedStats = weaponStats.map(weaponStat => {
      const numberOfKills = weaponStat.performanceBySeason.map(stat => stat.stats.kills);

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
      const filteredStats = weaponStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName,
      );

      const numberOfKills = filteredStats.map(stat => stat.stats.kills);

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


export const aggregateWeaponStatsForAllActs = (weaponStats: WeaponStatType) => {
  const initialStats = {
    season: {
      id: '0',
      name: 'All Acts',
      isActive: false,
    },
    stats: {
      kills: 0,
      damage: 0,
      aces: 0,
      firstKills: 0,
      roundsPlayed: 0,
      avgKillsPerRound: 0,
      avgDamagePerRound: 0,
      legshots: 0,
      headshots: 0,
      bodyshots: 0,
    }

  };

  const aggregatedStats = weaponStats.performanceBySeason.reduce((acc: any, curr) => {
    acc.stats.kills += curr.stats.kills;
    acc.stats.damage += curr.stats.damage;
    acc.stats.aces += curr.stats.aces;
    acc.stats.firstKills += curr.stats.firstKills;
    acc.stats.roundsPlayed += curr.stats.roundsPlayed;
    acc.stats.legshots += curr.stats.legshots;
    acc.stats.headshots += curr.stats.headshots;
    acc.stats.bodyshots += curr.stats.bodyshots;

    return acc;

  }, initialStats);


  return aggregatedStats;
};