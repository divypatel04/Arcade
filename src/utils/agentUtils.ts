import { Ability, AbilityCastDetails, AgentStatType, MapStat, SeasonPerformance } from "../types/AgentStatsType";

/**
 * Retrieves the agent with the highest kills based on the active season or the season with the highest kills.
 * @param agentStats - Array of agent statistics.
 * @returns The agent with the highest kills.
 */
export const getTopAgentByKills = (agentStats: AgentStatType[]): AgentStatType => {
  const agentHighestKills: { agent: AgentStatType; kills: number }[] = [];

  // Identify the active season and calculate kills for each agent
  for (const agent of agentStats) {
    const activeSeason = agent.performanceBySeason.find(season => season.season.isActive);
    if (activeSeason) {
      agentHighestKills.push({ agent, kills: activeSeason.stats.kills });
    }
  }

  // If no active season exists, find the season with the highest kills
  if (agentHighestKills.length === 0) {
    for (const agent of agentStats) {
      const highestKillsSeason = agent.performanceBySeason.reduce(
        (prev, current) => (prev.stats.kills > current.stats.kills ? prev : current),
        agent.performanceBySeason[0]
      );
      agentHighestKills.push({ agent, kills: highestKillsSeason.stats.kills });
    }
  }

  // Sort agents by kills in descending order and return the top agent
  agentHighestKills.sort((a, b) => b.kills - a.kills);
  return agentHighestKills[0].agent;
};

/**
 * Retrieves the current active season or the most recent season for an agent.
 * @param agentStat - The agent's statistics.
 * @returns The current or most recent season.
 */
export const getCurrentOrMostRecentSeason = (agentStat: AgentStatType) => {
  let currentSeason = agentStat.performanceBySeason.find(season => season.season.isActive);

  if (!currentSeason) {
    currentSeason = agentStat.performanceBySeason
      .slice()
      .sort((a, b) => b.season.name.localeCompare(a.season.name))[0];
  }

  return currentSeason;
};

/**
 * Retrieves all unique season names from the agent statistics.
 * @param agentStats - Array of agent statistics.
 * @returns A sorted list of season names, including "All Act".
 */
export const getAllAgentSeasonNames = (agentStats: AgentStatType[]) => {
  const seasonSet: Record<string, { seasonId: string; seasonName: string; seasonActive: boolean }> = {};

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

  const seasonList = Object.values(seasonSet)
    .map(season => season.seasonName)
    .sort((a, b) => b.localeCompare(a));

  seasonList.unshift("All Act");
  return seasonList;
};

/**
 * Sorts agents by the number of matches played in a specific season or across all seasons.
 * @param agentStats - Array of agent statistics.
 * @param seasonName - The name of the season to filter by.
 * @returns A sorted list of agents with their match counts.
 */
export const sortAgentsByMatches = (agentStats: AgentStatType[], seasonName: string) => {
  const allSortedStats = agentStats.map(agentStat => {
    const filteredStats = seasonName === "All Act"
      ? agentStat.performanceBySeason
      : agentStat.performanceBySeason.filter(stat => stat.season.name === seasonName);

    const numberOfMatches = filteredStats.reduce(
      (total, stat) => total + stat.stats.matchesWon + stat.stats.matchesLost,
      0
    );

    return {
      agentStat,
      seasonName,
      numberOfMatches,
    };
  });

  // Filter out agents with no matches and sort by match count in descending order
  return allSortedStats
    .filter(stat => stat.numberOfMatches > 0)
    .sort((a, b) => b.numberOfMatches - a.numberOfMatches);
};

/**
 * Aggregates statistics for an agent across all seasons into a single "All Act" season.
 * @param agentStat - The agent's statistics.
 * @returns Aggregated statistics for "All Act".
 */
export const aggregateAgentStatsForAllActs = (agentStat: AgentStatType) => {
  const initialStats: SeasonPerformance = {
    season: { id: "0", name: "All Act", isActive: false },
    stats: {
      kills: 0, deaths: 0, roundsWon: 0, roundsLost: 0, totalRounds: 0,
      plants: 0, defuses: 0, playtimeMillis: 0, matchesWon: 0, matchesLost: 0,
      aces: 0, firstKills: 0,
    },
    mapStats: [] as MapStat[],
    attackStats: { deaths: 0, kills: 0, roundsLost: 0, roundsWon: 0, clutchStats: { "1v1Wins": 0, "1v2Wins": 0, "1v3Wins": 0, "1v4Wins": 0, "1v5Wins": 0 } },
    defenseStats: { deaths: 0, kills: 0, roundsLost: 0, roundsWon: 0, clutchStats: { "1v1Wins": 0, "1v2Wins": 0, "1v3Wins": 0, "1v4Wins": 0, "1v5Wins": 0 } },
    abilityAndUltimateImpact: [] as AbilityCastDetails[],
  };

  return agentStat.performanceBySeason.reduce((acc, curr) => {
    // Aggregate basic stats
    acc.stats.kills += curr.stats.kills || 0;
    acc.stats.deaths += curr.stats.deaths || 0;
    acc.stats.roundsWon += curr.stats.roundsWon || 0;
    acc.stats.roundsLost += curr.stats.roundsLost || 0;
    acc.stats.totalRounds += curr.stats.totalRounds || 0;
    acc.stats.plants += curr.stats.plants || 0;
    acc.stats.defuses += curr.stats.defuses || 0;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis || 0;
    acc.stats.matchesWon += curr.stats.matchesWon || 0;
    acc.stats.matchesLost += curr.stats.matchesLost || 0;
    acc.stats.aces += curr.stats.aces || 0;
    acc.stats.firstKills += curr.stats.firstKills || 0;

    // Aggregate map stats
    (curr.mapStats || []).forEach(map => {
      const existingMap = acc.mapStats.find(m => m.id === map.id);
      if (existingMap) {
        existingMap.wins += map.wins || 0;
        existingMap.losses += map.losses || 0;
      } else {
        acc.mapStats.push({ ...map });
      }
    });

    // Aggregate attack stats
    acc.attackStats.deaths += curr.attackStats?.deaths || 0;
    acc.attackStats.kills += curr.attackStats?.kills || 0;
    acc.attackStats.roundsLost += curr.attackStats?.roundsLost || 0;
    acc.attackStats.roundsWon += curr.attackStats?.roundsWon || 0;
    acc.attackStats.clutchStats["1v1Wins"] += curr.attackStats?.clutchStats?.["1v1Wins"] || 0;
    acc.attackStats.clutchStats["1v2Wins"] += curr.attackStats?.clutchStats?.["1v2Wins"] || 0;
    acc.attackStats.clutchStats["1v3Wins"] += curr.attackStats?.clutchStats?.["1v3Wins"] || 0;
    acc.attackStats.clutchStats["1v4Wins"] += curr.attackStats?.clutchStats?.["1v4Wins"] || 0;
    acc.attackStats.clutchStats["1v5Wins"] += curr.attackStats?.clutchStats?.["1v5Wins"] || 0;

    // Aggregate defense stats
    acc.defenseStats.deaths += curr.defenseStats?.deaths || 0;
    acc.defenseStats.kills += curr.defenseStats?.kills || 0;
    acc.defenseStats.roundsLost += curr.defenseStats?.roundsLost || 0;
    acc.defenseStats.roundsWon += curr.defenseStats?.roundsWon || 0;
    acc.defenseStats.clutchStats["1v1Wins"] += curr.defenseStats?.clutchStats?.["1v1Wins"] || 0;
    acc.defenseStats.clutchStats["1v2Wins"] += curr.defenseStats?.clutchStats?.["1v2Wins"] || 0;
    acc.defenseStats.clutchStats["1v3Wins"] += curr.defenseStats?.clutchStats?.["1v3Wins"] || 0;
    acc.defenseStats.clutchStats["1v4Wins"] += curr.defenseStats?.clutchStats?.["1v4Wins"] || 0;
    acc.defenseStats.clutchStats["1v5Wins"] += curr.defenseStats?.clutchStats?.["1v5Wins"] || 0;

    // Aggregate ability and ultimate impacts
    (curr.abilityAndUltimateImpact || []).forEach(ability => {
      const existingAbility = acc.abilityAndUltimateImpact.find(a => a.id === ability.id);
      if (existingAbility) {
        existingAbility.count += ability.count || 0;
        existingAbility.kills += ability.kills || 0;
        existingAbility.damage += ability.damage || 0;
      } else {
        acc.abilityAndUltimateImpact.push({ ...ability });
      }
    });

    return acc;
  }, initialStats);
};

/**
 * Converts milliseconds into a human-readable time format (e.g., "2h 30m").
 * @param ms - Time in milliseconds.
 * @returns A formatted time string.
 */
export const convertMillisToReadableTime = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

/**
 * Merges ability data with utility data for enhanced insights.
 * @param abilitiesData - Array of ability data.
 * @param utilities - Utility data object.
 * @returns Merged ability and utility data.
 */
export const mergeUtilitiesAndAbilities = (abilitiesData: any, utilities: any) => {
  return abilitiesData.map((ability:any) => {
    const data = utilities?.[`${ability.id}Casts`] || { count: 0, kills: 0, damage: 0 };
    return { ...ability, data };
  });
};