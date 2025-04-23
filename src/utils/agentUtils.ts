import { Ability, AgentStatType, MapStat } from "../types/AgentStatsType";

export const getTopAgentByKills = (agentStats: AgentStatType[]): AgentStatType => {
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

  return agentHighestKills[0].agent;
};

export const getCurrentOrMostRecentSeason = (agentStat: AgentStatType) => {
  let CurrentSeason = agentStat?.performanceBySeason?.find(
    (seasonPerformace: any) => seasonPerformace.season.isActive,
  );
  if (!CurrentSeason) {
    const sortedSeasons =
      agentStat?.performanceBySeason?.slice().sort((a: any, b: any) => {
        if (a.season.name > b.season.name) return -1;
        if (a.season.name < b.season.name) return 1;
        return 0;
      }) || [];
    CurrentSeason = sortedSeasons[0];
  }

  return CurrentSeason;
}

export const getAllAgentSeasonNames = (agentStats: AgentStatType[]) => {
  const seasonSet: any = {};

  for (const agent of agentStats) {
    for (const season of agent.performanceBySeason) {
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

export function sortAgentsByMatches(
  agentStats: AgentStatType[],
  seasonName: string,
) {
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

export const aggregateAgentStatsForAllActs = (agentStat: AgentStatType) => {
  const seasonStat = {
    season: {
      id: "0",
      name: "All Act",
      isActive: false
    },
    stats: {
      kills: 0,
      deaths: 0,
      roundsWon: 0,
      roundsLost: 0,
      totalRounds: 0,
      plants: 0,
      defuses: 0,
      playtimeMillis: 0,
      matchesWon: 0,
      matchesLost: 0,
      aces: 0,
      firstKills: 0
    },
    mapStats: [] as MapStat[],
    attackStats: {
      deaths: 0,
      kills: 0,
      roundsLost: 0,
      roundsWon: 0,
      clutchStats: {
        "1v1Wins": 0,
        "1v2Wins": 0,
        "1v3Wins": 0,
        "1v4Wins": 0
      }
    },
    defenseStats: {
      deaths: 0,
      kills: 0,
      roundsLost: 0,
      roundsWon: 0,
      clutchStats: {
        "1v1Wins": 0,
        "1v2Wins": 0,
        "1v3Wins": 0,
        "1v4Wins": 0
      }
    },
    abilityAndUltimateImpact: [] as Ability[]
  };

  const aggregatedStats = agentStat.performanceBySeason.reduce((acc: any, curr) => {
    acc.stats.kills += curr.stats.kills;
    acc.stats.deaths += curr.stats.deaths;
    acc.stats.roundsWon += curr.stats.roundsWon;
    acc.stats.roundsLost += curr.stats.roundsLost;
    acc.stats.totalRounds += curr.stats.totalRounds;
    acc.stats.plants += curr.stats.plants;
    acc.stats.defuses += curr.stats.defuses;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis;
    acc.stats.matchesWon += curr.stats.matchesWon;
    acc.stats.matchesLost += curr.stats.matchesLost;
    acc.stats.aces += curr.stats.aces;
    acc.stats.firstKills += curr.stats.firstKills;

    curr.mapStats.forEach((map) => {
      const existingMap = acc.mapStats.find((m: MapStat) => m.id === map.id);
      if (existingMap) {
        existingMap.wins += map.wins;
        existingMap.losses += map.losses;
      } else {
        acc.mapStats.push({
          id: map.id,
          image: map.image,
          name: map.name,
          location: map.location,
          wins: map.wins,
          losses: map.losses
        });
      }
    });

    acc.attackStats.deaths += curr.attackStats.deaths;
    acc.attackStats.kills += curr.attackStats.kills;
    acc.attackStats.roundsLost += curr.attackStats.roundsLost;
    acc.attackStats.roundsWon += curr.attackStats.roundsWon;
    acc.attackStats.clutchStats["1v1Wins"] += curr.attackStats.clutchStats["1v1Wins"];
    acc.attackStats.clutchStats["1v2Wins"] += curr.attackStats.clutchStats["1v2Wins"];
    acc.attackStats.clutchStats["1v3Wins"] += curr.attackStats.clutchStats["1v3Wins"];
    acc.attackStats.clutchStats["1v4Wins"] += curr.attackStats.clutchStats["1v4Wins"];
    acc.attackStats.clutchStats["1v5Wins"] += curr.attackStats.clutchStats["1v5Wins"];

    acc.defenseStats.deaths += curr.defenseStats.deaths;
    acc.defenseStats.kills += curr.defenseStats.kills;
    acc.defenseStats.roundsLost += curr.defenseStats.roundsLost;
    acc.defenseStats.roundsWon += curr.defenseStats.roundsWon;
    acc.defenseStats.clutchStats["1v1Wins"] += curr.defenseStats.clutchStats["1v1Wins"];
    acc.defenseStats.clutchStats["1v2Wins"] += curr.defenseStats.clutchStats["1v2Wins"];
    acc.defenseStats.clutchStats["1v3Wins"] += curr.defenseStats.clutchStats["1v3Wins"];
    acc.defenseStats.clutchStats["1v4Wins"] += curr.defenseStats.clutchStats["1v4Wins"];
    acc.defenseStats.clutchStats["1v5Wins"] += curr.defenseStats.clutchStats["1v5Wins"];

    curr.abilityAndUltimateImpact.forEach((abilityImpact) => {
      const existingAbility = acc.abilityAndUltimateImpact.find(
        (ability: Ability) => ability.id === abilityImpact.id
      );

      if (existingAbility) {
        existingAbility.count += abilityImpact.count;
        existingAbility.kills += abilityImpact.kills;
        existingAbility.damage += abilityImpact.damage;
      } else {
        acc.abilityAndUltimateImpact.push({
          type: abilityImpact.type,
          id: abilityImpact.id,
          count: abilityImpact.count,
          kills: abilityImpact.kills,
          damage: abilityImpact.damage
        });
      }
    });

    return acc;
  }, seasonStat);

  return aggregatedStats;
}

export const convertMillisToReadableTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};



export const mergeUtilitiesAndAbilities = (abilitiesData: any, utilities: any) => {
  // console.log(abilitiesData, utilities);
  return abilitiesData.map((ability: any) => {
    let data;
    switch (ability.id) {
      case utilities?.grenadeCasts.id:
        data = utilities.grenadeCasts;
        break;
      case utilities?.ability1Casts.id:
        data = utilities.ability1Casts;
        break;
      case utilities?.ability2Casts.id:
        data = utilities.ability2Casts;
        break;
      case utilities?.ultimateCasts.id:
        data = utilities.ultimateCasts;
        break;
      default:
        data = { count: 0, kills: 0, damage: 0 };
    }
    return { ...ability, data };
  });
};