import { AgentStatType, MapStatsType, MatchStatsType, WeaponStatsType } from "@types";


interface MapListProps {
  mapStat: MapStatsType;
  seasonName: string;
  numberOfMatches: number;
}

interface resultArray {
  data: MatchStatsType[];
  title: string;
}


export const getTopAgentByKills = (agentStats: AgentStatType[]): AgentStatType | null => {
  // Check if agentStats is undefined or empty
  if (!agentStats || agentStats.length === 0) {
    return null;
  }

  const agentHighestKills: {agent: AgentStatType; kills: number}[] = [];

  // Loop through each agent to find the active season and calculate the highest kills
  for (const agent of agentStats) {
    const activeSeason = agent.performanceBySeason.find(seasonPerformace => seasonPerformace.season.isActive);
    if (activeSeason) {
      const kills = activeSeason.stats.kills;
      agentHighestKills.push({agent, kills});
    }
  }

  // If no active season was found, try to find the season with the highest kills
  if (agentHighestKills.length === 0) {
    for (const agent of agentStats) {
      const highestKillsSeason = agent.performanceBySeason.reduce(
        (prev, current) => (prev.stats.kills > current.stats.kills ? prev : current),
        agent.performanceBySeason[0],
      );
      agentHighestKills.push({agent, kills: highestKillsSeason.stats.kills});
    }
  }

  // Sort the agents by highest kills in descending order
  agentHighestKills.sort((a, b) => b.kills - a.kills);

  // Return null if no agents with kills were found
  if (agentHighestKills.length === 0) {
    return null;
  }

  return agentHighestKills[0].agent;
};

export const getTopMapByWinRate = (mapStats: MapStatsType[]): MapStatsType | null => {
  // Check if mapStats is undefined or empty
  if (!mapStats || mapStats.length === 0) {
    return null;
  }

  let bestMap: MapStatsType | undefined;
  let highestWinRate: number = 0;

  for (const map of mapStats) {
    const activeSeasonStats = map.performanceBySeason.find(
      season => season.season.isActive === true,
    );

    if (activeSeasonStats) {
      const totalGames =
        activeSeasonStats.stats.matchesWon +
        activeSeasonStats.stats.matchesLost;
      if (totalGames === 0) continue;

      const winRate = activeSeasonStats.stats.matchesWon / totalGames;

      if (winRate > highestWinRate) {
        highestWinRate = winRate;
        bestMap = map;
      }
    }
  }

  // If no active season was found, try to find the season with the highest win rate
  if (!bestMap) {
    for (const map of mapStats) {
      const seasonWithHighestWinRate = map.performanceBySeason.reduce(
        (prev, current) =>
          prev.stats.matchesWon /
            (prev.stats.matchesWon + prev.stats.matchesLost) >
          current.stats.matchesWon /
            (current.stats.matchesWon + current.stats.matchesLost)
            ? prev
            : current,
      );
      bestMap = map;
    }
  }

  // If no best map was found, return null instead of throwing an error
  if (!bestMap) {
    return null;
  }
  return bestMap;
};

export const getTopWeaponByKills = (
  weaponStats: WeaponStatsType[],
): WeaponStatsType | null => {
  // Check if weaponStats is undefined or empty
  if (!weaponStats || weaponStats.length === 0) {
    return null;
  }

  let bestWeapon: WeaponStatsType | null = null;
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

  return bestWeapon as WeaponStatsType;
};

export const getMatchQueueTypes = (matchStats: MatchStatsType[]) => {
  // Default return value if matchStats is undefined or empty
  if (!matchStats || matchStats.length === 0) {
    return ['All'];
  }

  const matchTypeSet: Record<string, { queueId: string }> = {};

  if (matchStats) {
    for (const match of matchStats) {
      const queueId = match.stats.general.queueId;
      if (!matchTypeSet[queueId]) {
        matchTypeSet[queueId] = { queueId };
      }
    }
  }

  const matchTypes = Object.values(matchTypeSet);

  const final = matchTypes
    .map(item => item.queueId)
    .sort((a, b) => b.localeCompare(a));

  final.unshift('All');

  return final;
};

export function sortAgentsByMatches(
  agentStats: AgentStatType[],
  seasonName: string,
) {
  // Return empty array if agentStats is undefined or empty
  if (!agentStats || agentStats.length === 0) {
    return [];
  }

  let allSortedStats = [];

  if (seasonName === 'All Act') {
    // Handle the "All Act" case
    allSortedStats = agentStats.map(agentStat => {
      const numberOfMatches = agentStat.performanceBySeason.map(
        stat => stat.stats.matchesWon + stat.stats.matchesLost,
      );

      return {
        agentStat: agentStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  } else {
    // Handle individual seasons
    allSortedStats = agentStats.map(agentStat => {
      const filteredStats = agentStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName,
      );

      const numberOfMatches = filteredStats.map(stat => stat.stats.matchesWon + stat.stats.matchesLost);

      return {
        agentStat: agentStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  }

  // Filter out agents with numberOfMatches equal to 0
  const filteredSortedStats = allSortedStats.filter(
    stat => stat.numberOfMatches > 0,
  );

  // Sort all remaining agents by the number of matches in descending order
  const finalSortedStats = filteredSortedStats.sort(
    (a, b) => b.numberOfMatches - a.numberOfMatches,
  );

  return finalSortedStats;
}

export function sortMapsByMatches(
  mapStats: MapStatsType[],
  seasonName: string,
) {
  // Return empty array if mapStats is undefined or empty
  if (!mapStats || mapStats.length === 0) {
    return [];
  }

  let allSortedStats = [];

  if (seasonName === 'All Act') {
    // Handle the "All Act" case
    allSortedStats = mapStats.map(mapStat => {
      const numberOfMatches = mapStat.performanceBySeason.map(
        stat => stat.stats.matchesWon + stat.stats.matchesLost,
      );

      return {
        mapStat: mapStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  } else {
    // Handle individual seasons
    allSortedStats = mapStats.map(mapStat => {
      const filteredStats = mapStat.performanceBySeason.filter(
        stat => stat.season.name === seasonName,
      );

      const numberOfMatches = filteredStats.map(
        stat => stat.stats.matchesWon + stat.stats.matchesLost,
      );

      return {
        mapStat: mapStat,
        seasonName: seasonName,
        numberOfMatches:
          numberOfMatches.length > 0
            ? numberOfMatches.reduce((a, b) => a + b)
            : 0,
      };
    });
  }

  // Filter out agents with numberOfMatches equal to 0
  const filteredSortedStats: MapListProps[] = allSortedStats.filter(
    stat => stat.numberOfMatches > 0,
  );

  // Sort all remaining agents by the number of matches in descending order
  const finalSortedStats: MapListProps[] = filteredSortedStats.sort(
    (a, b) => b.numberOfMatches - a.numberOfMatches,
  );

  return finalSortedStats;
}

export function sortWeaponsByMatches(
  weaponStats: WeaponStatsType[],
  seasonName: string,
) {
  // Return empty array if weaponStats is undefined or empty
  if (!weaponStats || weaponStats.length === 0) {
    return [];
  }

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

export function sortAndGroupMatchHistory(
  matchStats: MatchStatsType[],
): resultArray[] {
  // Return empty array if matchStats is undefined or empty
  if (!matchStats || matchStats.length === 0) {
    return [];
  }

  // Create an empty array to store the result
  const resultArray: resultArray[] = [];

  // Iterate through the matchStats array
  if (matchStats) {
    for (const matchStat of matchStats) {
      // Convert gameStartMillis to a Date object
      const gameStartDate = new Date(matchStat.stats.general.gameStartMillis);

      // Format the date as "dd/mm/yyyy"
      const formattedDate = `${gameStartDate.getDate()}/${
        gameStartDate.getMonth() + 1
      }/${gameStartDate.getFullYear()}`;

      // Find an existing entry in resultArray with the same date
      const existingEntry = resultArray.find(
        entry => entry.title === formattedDate,
      );

      // Create a new entry if it doesn't exist
      if (!existingEntry) {
        resultArray.push({
          data: [matchStat], // Add the current matchStat
          title: formattedDate,
        });
      } else {
        // Add the current matchStat to the existing entry's data array
        existingEntry.data.push(matchStat);
      }
    }
  }

  const sortedResultArray = resultArray.sort((a, b) => {
    const dateA = new Date(a.title).getTime();
    const dateB = new Date(b.title).getTime();
    return dateA - dateB;
  });

  return sortedResultArray;
}