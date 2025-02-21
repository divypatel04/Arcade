import { AgentStatType } from "../types/AgentStatsType";

export const getBestPlayer = (agentStats: AgentStatType[]): AgentStatType => {

  const agentHighestKills: {agent: AgentStatType; kills: number}[] = [];

  // Loop through each agent to find the active season and calculate the highest kills
  for (const agent of agentStats) {
    const activeSeason = agent.performanceBySeason.find(seasonPerformace => seasonPerformace.season.isActive);
    if (activeSeason) {
      const kills = activeSeason.stats.kills;
      agentHighestKills.push({agent, kills});
    }
  }

  // If n o active season was found, try to find the season with the highest kills
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


export const getActiveOrRecentSeason = (agentStat: AgentStatType) => {
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



export const getSeasonNames = (agentStats: AgentStatType[]) => {
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


export function filterAndSortByMatches(
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



export const aggregateStatsForAllActs = (agentStat: AgentStatType) => {

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
    mapStats: [],
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
    abilityAndUltimateImpact: {
      abilityCasts: {
        grenadeCasts: {
          count: 0,
          kills: 0,
          damage: 0
        },
        ability1Casts: {
          count: 0,
          kills: 0,
          damage: 0
        },
        ability2Casts: {
          count: 0,
          kills: 0,
          damage: 0
        },
        ultimateCasts: {
          count: 0,
          kills: 0,
          damage: 0
        }
      },
      ultimateImpact: {
        killsUsingUltimate: 0,
        roundsWonUsingUltimate: 0,
        damageUsingUltimate: 0
      }
    }
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
      if (!acc.mapPerformance[map.id]) {
        acc.mapPerformance[map.id] = {
          id: map.id,
          imageUrl: map.imageUrl,
          name: map.name,
          losses: map.losses,
          location: map.location,
          wins: map.wins,
        };
      }
      acc.mapPerformance[map.id].wins += map.wins;
      acc.mapPerformance[map.id].losses += map.losses;
    });

    acc.attackStats.deaths += curr.attackStats.deaths;
    acc.attackStats.kills += curr.attackStats.kills;
    acc.attackStats.roundsLost += curr.attackStats.roundsLost;
    acc.attackStats.roundsWon += curr.attackStats.roundsWon;
    acc.attackStats.clutchStats["1v1Wins"] += curr.attackStats.clutchStats["1v1Wins"];
    acc.attackStats.clutchStats["1v2Wins"] += curr.attackStats.clutchStats["1v2Wins"];
    acc.attackStats.clutchStats["1v3Wins"] += curr.attackStats.clutchStats["1v3Wins"];
    acc.attackStats.clutchStats["1v4Wins"] += curr.attackStats.clutchStats["1v4Wins"];

    acc.defenseStats.deaths += curr.defenseStats.deaths;
    acc.defenseStats.kills += curr.defenseStats.kills;
    acc.defenseStats.roundsLost += curr.defenseStats.roundsLost;
    acc.defenseStats.roundsWon += curr.defenseStats.roundsWon;
    acc.defenseStats.clutchStats["1v1Wins"] += curr.defenseStats.clutchStats["1v1Wins"];
    acc.defenseStats.clutchStats["1v2Wins"] += curr.defenseStats.clutchStats["1v2Wins"];
    acc.defenseStats.clutchStats["1v3Wins"] += curr.defenseStats.clutchStats["1v3Wins"];
    acc.defenseStats.clutchStats["1v4Wins"] += curr.defenseStats.clutchStats["1v4Wins"];

    acc.abilityAndUltimateImpact.abilityCasts.grenadeCasts.count += curr.abilityAndUltimateImpact.abilityCasts.grenadeCasts.count;
    acc.abilityAndUltimateImpact.abilityCasts.grenadeCasts.kills += curr.abilityAndUltimateImpact.abilityCasts.grenadeCasts.kills;
    acc.abilityAndUltimateImpact.abilityCasts.grenadeCasts.damage += curr.abilityAndUltimateImpact.abilityCasts.grenadeCasts.damage;
    acc.abilityAndUltimateImpact.abilityCasts.ability1Casts.count += curr.abilityAndUltimateImpact.abilityCasts.ability1Casts.count;
    acc.abilityAndUltimateImpact.abilityCasts.ability1Casts.kills += curr.abilityAndUltimateImpact.abilityCasts.ability1Casts.kills;
    acc.abilityAndUltimateImpact.abilityCasts.ability1Casts.damage += curr.abilityAndUltimateImpact.abilityCasts.ability1Casts.damage;
    acc.abilityAndUltimateImpact.abilityCasts.ability2Casts.count += curr.abilityAndUltimateImpact.abilityCasts.ability2Casts.count;
    acc.abilityAndUltimateImpact.abilityCasts.ability2Casts.kills += curr.abilityAndUltimateImpact.abilityCasts.ability2Casts.kills;
    acc.abilityAndUltimateImpact.abilityCasts.ability2Casts.damage += curr.abilityAndUltimateImpact.abilityCasts.ability2Casts.damage;
    acc.abilityAndUltimateImpact.abilityCasts.ultimateCasts.count += curr.abilityAndUltimateImpact.abilityCasts.ultimateCasts.count;
    acc.abilityAndUltimateImpact.abilityCasts.ultimateCasts.kills += curr.abilityAndUltimateImpact.abilityCasts.ultimateCasts.kills;
    acc.abilityAndUltimateImpact.abilityCasts.ultimateCasts.damage += curr.abilityAndUltimateImpact.abilityCasts.ultimateCasts.damage;

    acc.abilityAndUltimateImpact.ultimateImpact.killsUsingUltimate += curr.abilityAndUltimateImpact.ultimateImpact.killsUsingUltimate;
    acc.abilityAndUltimateImpact.ultimateImpact.roundsWonUsingUltimate += curr.abilityAndUltimateImpact.ultimateImpact.roundsWonUsingUltimate;
    acc.abilityAndUltimateImpact.ultimateImpact.damageUsingUltimate += curr.abilityAndUltimateImpact.ultimateImpact.damageUsingUltimate;

    return acc;
  }, seasonStat);


  return aggregatedStats

}