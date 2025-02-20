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