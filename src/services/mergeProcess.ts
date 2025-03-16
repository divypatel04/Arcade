import { AgentStatType } from "../types/AgentStatsType";
import { MapStatsType } from "../types/MapStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatType } from "../types/WeaponStatsType";

interface ProcessDataInput {
  oldData: {
    agentStats: AgentStatType[];
    mapStats: MapStatsType[];
    weaponStats: WeaponStatType[];
    seasonStats: SeasonStatsType[];
  };
  newData: {
    agentStats: AgentStatType[];
    mapStats: MapStatsType[];
    weaponStats: WeaponStatType[];
    seasonStats: SeasonStatsType[];
  };
}

interface ProcessDataOutput {
  mergedAgentStats: AgentStatType[];
  mergedMapStats: MapStatsType[];
  mergedWeaponStats: WeaponStatType[];
  mergedSeasonStats: SeasonStatsType[];
}

// Helper function to merge agent stats
const mergeAgentStats = (oldStats: AgentStatType[], newStats: AgentStatType[]): AgentStatType[] => {
  const mergedStats = [...oldStats];

  // Process each agent from new stats
  for (const newAgentStat of newStats) {
    const existingAgentIndex = mergedStats.findIndex(
      agent => agent.id === newAgentStat.id ||
              (agent.puuid === newAgentStat.puuid && agent.agent.id === newAgentStat.agent.id)
    );

    if (existingAgentIndex === -1) {
      // If agent doesn't exist in old data, add it
      mergedStats.push(newAgentStat);
    } else {
      // Agent exists, merge season performances
      const existingAgent = mergedStats[existingAgentIndex];

      // Ensure ID and PUUID are set correctly
      existingAgent.id = existingAgent.id || newAgentStat.id;
      existingAgent.puuid = existingAgent.puuid || newAgentStat.puuid;

      for (const newSeasonPerf of newAgentStat.performanceBySeason) {
        const existingSeasonIndex = existingAgent.performanceBySeason.findIndex(
          season => season.season.id === newSeasonPerf.season.id
        );

        if (existingSeasonIndex === -1) {
          // If season doesn't exist, add it
          existingAgent.performanceBySeason.push(newSeasonPerf);
        } else {
          // Season exists, combine the stats (add values together)
          const existingSeason = existingAgent.performanceBySeason[existingSeasonIndex];

          // Combine Stats
          existingSeason.stats.kills += newSeasonPerf.stats.kills;
          existingSeason.stats.deaths += newSeasonPerf.stats.deaths;
          existingSeason.stats.roundsWon += newSeasonPerf.stats.roundsWon;
          existingSeason.stats.roundsLost += newSeasonPerf.stats.roundsLost;
          existingSeason.stats.totalRounds += newSeasonPerf.stats.totalRounds;
          existingSeason.stats.plants += newSeasonPerf.stats.plants;
          existingSeason.stats.defuses += newSeasonPerf.stats.defuses;
          existingSeason.stats.playtimeMillis += newSeasonPerf.stats.playtimeMillis;
          existingSeason.stats.matchesWon += newSeasonPerf.stats.matchesWon;
          existingSeason.stats.matchesLost += newSeasonPerf.stats.matchesLost;
          existingSeason.stats.aces += newSeasonPerf.stats.aces;
          existingSeason.stats.firstKills += newSeasonPerf.stats.firstKills;

          // Combine Attack Stats
          existingSeason.attackStats.kills += newSeasonPerf.attackStats.kills;
          existingSeason.attackStats.deaths += newSeasonPerf.attackStats.deaths;
          existingSeason.attackStats.roundsWon += newSeasonPerf.attackStats.roundsWon;
          existingSeason.attackStats.roundsLost += newSeasonPerf.attackStats.roundsLost;
          existingSeason.attackStats.clutchStats["1v1Wins"] += newSeasonPerf.attackStats.clutchStats["1v1Wins"];
          existingSeason.attackStats.clutchStats["1v2Wins"] += newSeasonPerf.attackStats.clutchStats["1v2Wins"];
          existingSeason.attackStats.clutchStats["1v3Wins"] += newSeasonPerf.attackStats.clutchStats["1v3Wins"];
          existingSeason.attackStats.clutchStats["1v4Wins"] += newSeasonPerf.attackStats.clutchStats["1v4Wins"];
          existingSeason.attackStats.clutchStats["1v5Wins"] += newSeasonPerf.attackStats.clutchStats["1v5Wins"];

          // Combine Defense Stats
          existingSeason.defenseStats.kills += newSeasonPerf.defenseStats.kills;
          existingSeason.defenseStats.deaths += newSeasonPerf.defenseStats.deaths;
          existingSeason.defenseStats.roundsWon += newSeasonPerf.defenseStats.roundsWon;
          existingSeason.defenseStats.roundsLost += newSeasonPerf.defenseStats.roundsLost;
          existingSeason.defenseStats.clutchStats["1v1Wins"] += newSeasonPerf.defenseStats.clutchStats["1v1Wins"];
          existingSeason.defenseStats.clutchStats["1v2Wins"] += newSeasonPerf.defenseStats.clutchStats["1v2Wins"];
          existingSeason.defenseStats.clutchStats["1v3Wins"] += newSeasonPerf.defenseStats.clutchStats["1v3Wins"];
          existingSeason.defenseStats.clutchStats["1v4Wins"] += newSeasonPerf.defenseStats.clutchStats["1v4Wins"];
          existingSeason.defenseStats.clutchStats["1v5Wins"] += newSeasonPerf.defenseStats.clutchStats["1v5Wins"];

          // Map Stats - merge by mapId
          for (const newMapStat of newSeasonPerf.mapStats) {
            const existingMapIndex = existingSeason.mapStats.findIndex(map => map.id === newMapStat.id);
            if (existingMapIndex === -1) {
              existingSeason.mapStats.push(newMapStat);
            } else {
              const existingMapStat = existingSeason.mapStats[existingMapIndex];
              existingMapStat.wins += newMapStat.wins;
              existingMapStat.losses += newMapStat.losses;
            }
          }

          // Ability and Ultimate Impact
          for (const newAbility of newSeasonPerf.abilityAndUltimateImpact) {
            const existingAbilityIndex = existingSeason.abilityAndUltimateImpact.findIndex(
              ability => ability.id === newAbility.id && ability.type === newAbility.type
            );
            if (existingAbilityIndex === -1) {
              existingSeason.abilityAndUltimateImpact.push(newAbility);
            } else {
              const existingAbility = existingSeason.abilityAndUltimateImpact[existingAbilityIndex];
              existingAbility.count += newAbility.count;
              existingAbility.kills += newAbility.kills;
              existingAbility.damage += newAbility.damage;
            }
          }
        }
      }
    }
  }

  return mergedStats;
};

// Helper function to merge map stats
const mergeMapStats = (oldStats: MapStatsType[], newStats: MapStatsType[]): MapStatsType[] => {
  const mergedStats = [...oldStats];

  // Process each map from new stats
  for (const newMapStat of newStats) {
    const existingMapIndex = mergedStats.findIndex(
      map => map.id === newMapStat.id ||
            (map.puuid === newMapStat.puuid && map.map.id === newMapStat.map.id)
    );

    if (existingMapIndex === -1) {
      // If map doesn't exist in old data, add it
      mergedStats.push(newMapStat);
    } else {
      // Map exists, merge season performances
      const existingMap = mergedStats[existingMapIndex];

      // Ensure ID and PUUID are set correctly
      existingMap.id = existingMap.id || newMapStat.id;
      existingMap.puuid = existingMap.puuid || newMapStat.puuid;

      for (const newSeasonPerf of newMapStat.performanceBySeason) {
        const existingSeasonIndex = existingMap.performanceBySeason.findIndex(
          season => season.season.id === newSeasonPerf.season.id
        );

        if (existingSeasonIndex === -1) {
          // If season doesn't exist, add it
          existingMap.performanceBySeason.push(newSeasonPerf);
        } else {
          // Season exists, combine the stats (add values together)
          const existingSeason = existingMap.performanceBySeason[existingSeasonIndex];

          // Combine main stats
          existingSeason.stats.kills += newSeasonPerf.stats.kills;
          existingSeason.stats.deaths += newSeasonPerf.stats.deaths;
          existingSeason.stats.roundsWon += newSeasonPerf.stats.roundsWon;
          existingSeason.stats.roundsLost += newSeasonPerf.stats.roundsLost;
          existingSeason.stats.totalRounds += newSeasonPerf.stats.totalRounds;
          existingSeason.stats.plants += newSeasonPerf.stats.plants;
          existingSeason.stats.defuses += newSeasonPerf.stats.defuses;
          existingSeason.stats.playtimeMillis += newSeasonPerf.stats.playtimeMillis;
          existingSeason.stats.matchesWon += newSeasonPerf.stats.matchesWon;
          existingSeason.stats.matchesLost += newSeasonPerf.stats.matchesLost;
          existingSeason.stats.aces += newSeasonPerf.stats.aces;
          existingSeason.stats.firstKills += newSeasonPerf.stats.firstKills;

          // Combine Attack Stats
          existingSeason.attackStats.deaths += newSeasonPerf.attackStats.deaths;
          existingSeason.attackStats.kills += newSeasonPerf.attackStats.kills;
          existingSeason.attackStats.roundsLost += newSeasonPerf.attackStats.roundsLost;
          existingSeason.attackStats.roundsWon += newSeasonPerf.attackStats.roundsWon;

          // Combine heat map locations
          existingSeason.attackStats.HeatmapLocation.killsLocation = [
            ...existingSeason.attackStats.HeatmapLocation.killsLocation,
            ...newSeasonPerf.attackStats.HeatmapLocation.killsLocation
          ];
          existingSeason.attackStats.HeatmapLocation.deathLocation = [
            ...existingSeason.attackStats.HeatmapLocation.deathLocation,
            ...newSeasonPerf.attackStats.HeatmapLocation.deathLocation
          ];

          // Combine Defense Stats
          existingSeason.defenseStats.deaths += newSeasonPerf.defenseStats.deaths;
          existingSeason.defenseStats.kills += newSeasonPerf.defenseStats.kills;
          existingSeason.defenseStats.roundsLost += newSeasonPerf.defenseStats.roundsLost;
          existingSeason.defenseStats.roundsWon += newSeasonPerf.defenseStats.roundsWon;

          // Combine defense heat map locations
          existingSeason.defenseStats.HeatmapLocation.killsLocation = [
            ...existingSeason.defenseStats.HeatmapLocation.killsLocation,
            ...newSeasonPerf.defenseStats.HeatmapLocation.killsLocation
          ];
          existingSeason.defenseStats.HeatmapLocation.deathLocation = [
            ...existingSeason.defenseStats.HeatmapLocation.deathLocation,
            ...newSeasonPerf.defenseStats.HeatmapLocation.deathLocation
          ];
        }
      }
    }
  }

  return mergedStats;
};

// Helper function to merge weapon stats
const mergeWeaponStats = (oldStats: WeaponStatType[], newStats: WeaponStatType[]): WeaponStatType[] => {
  const mergedStats = [...oldStats];

  // Process each weapon from new stats
  for (const newWeaponStat of newStats) {
    const existingWeaponIndex = mergedStats.findIndex(
      weapon => weapon.id === newWeaponStat.id ||
                (weapon.puuid === newWeaponStat.puuid && weapon.weapon.id === newWeaponStat.weapon.id)
    );

    if (existingWeaponIndex === -1) {
      // If weapon doesn't exist in old data, add it
      mergedStats.push(newWeaponStat);
    } else {
      // Weapon exists, merge season performances
      const existingWeapon = mergedStats[existingWeaponIndex];

      // Ensure ID and PUUID are set correctly
      existingWeapon.id = existingWeapon.id || newWeaponStat.id;
      existingWeapon.puuid = existingWeapon.puuid || newWeaponStat.puuid;

      for (const newSeasonPerf of newWeaponStat.performanceBySeason) {
        const existingSeasonIndex = existingWeapon.performanceBySeason.findIndex(
          season => season.season.id === newSeasonPerf.season.id
        );

        if (existingSeasonIndex === -1) {
          // If season doesn't exist, add it
          existingWeapon.performanceBySeason.push(newSeasonPerf);
        } else {
          // Season exists, combine the stats (add values together)
          const existingSeason = existingWeapon.performanceBySeason[existingSeasonIndex];

          // Combine stats
          existingSeason.stats.kills += newSeasonPerf.stats.kills;
          existingSeason.stats.damage += newSeasonPerf.stats.damage;
          existingSeason.stats.aces += newSeasonPerf.stats.aces;
          existingSeason.stats.firstKills += newSeasonPerf.stats.firstKills;
          existingSeason.stats.roundsPlayed += newSeasonPerf.stats.roundsPlayed;
          existingSeason.stats.legshots += newSeasonPerf.stats.legshots;
          existingSeason.stats.headshots += newSeasonPerf.stats.headshots;
          existingSeason.stats.bodyshots += newSeasonPerf.stats.bodyshots;

          // Recalculate averages
          if (existingSeason.stats.roundsPlayed > 0) {
            existingSeason.stats.avgKillsPerRound = existingSeason.stats.kills / existingSeason.stats.roundsPlayed;
            existingSeason.stats.avgDamagePerRound = existingSeason.stats.damage / existingSeason.stats.roundsPlayed;
          }
        }
      }
    }
  }

  return mergedStats;
};

// Helper function to merge season stats
const mergeSeasonStats = (oldStats: SeasonStatsType[], newStats: SeasonStatsType[]): SeasonStatsType[] => {
  const mergedStats = [...oldStats];

  // Process each season from new stats
  for (const newSeasonStat of newStats) {
    const existingSeasonIndex = mergedStats.findIndex(
      season => season.id === newSeasonStat.id ||
                (season.puuid === newSeasonStat.puuid && season.season.id === newSeasonStat.season.id)
    );

    if (existingSeasonIndex === -1) {
      // If season doesn't exist in old data, add it
      mergedStats.push(newSeasonStat);
    } else {
      // Season exists, combine the stats (add values together)
      const existingSeason = mergedStats[existingSeasonIndex];

      // Ensure ID and PUUID are set correctly
      existingSeason.id = existingSeason.id || newSeasonStat.id;
      existingSeason.puuid = existingSeason.puuid || newSeasonStat.puuid;

      existingSeason.stats.kills += newSeasonStat.stats.kills;
      existingSeason.stats.deaths += newSeasonStat.stats.deaths;
      existingSeason.stats.roundsWon += newSeasonStat.stats.roundsWon;
      existingSeason.stats.roundsLost += newSeasonStat.stats.roundsLost;
      existingSeason.stats.totalRounds += newSeasonStat.stats.totalRounds;
      existingSeason.stats.plants += newSeasonStat.stats.plants;
      existingSeason.stats.defuses += newSeasonStat.stats.defuses;
      existingSeason.stats.playtimeMillis += newSeasonStat.stats.playtimeMillis;
      existingSeason.stats.matchesWon += newSeasonStat.stats.matchesWon;
      existingSeason.stats.matchesLost += newSeasonStat.stats.matchesLost;
      existingSeason.stats.matchesPlayed += newSeasonStat.stats.matchesPlayed;
      existingSeason.stats.damage += newSeasonStat.stats.damage;
      existingSeason.stats.firstKill += newSeasonStat.stats.firstKill;
      existingSeason.stats.aces += newSeasonStat.stats.aces;
      existingSeason.stats.mvps += newSeasonStat.stats.mvps;

      // For highestRank, keep the higher value
      existingSeason.stats.highestRank = Math.max(
        existingSeason.stats.highestRank,
        newSeasonStat.stats.highestRank
      );
    }
  }

  return mergedStats;
};

export const mergeProcess = async ({oldData, newData}: ProcessDataInput): Promise<ProcessDataOutput> => {
  try {
    // Validate inputs to prevent errors
    const validatedOldData = {
      agentStats: Array.isArray(oldData.agentStats) ? oldData.agentStats : [],
      mapStats: Array.isArray(oldData.mapStats) ? oldData.mapStats : [],
      weaponStats: Array.isArray(oldData.weaponStats) ? oldData.weaponStats : [],
      seasonStats: Array.isArray(oldData.seasonStats) ? oldData.seasonStats : []
    };

    const validatedNewData = {
      agentStats: Array.isArray(newData.agentStats) ? newData.agentStats : [],
      mapStats: Array.isArray(newData.mapStats) ? newData.mapStats : [],
      weaponStats: Array.isArray(newData.weaponStats) ? newData.weaponStats : [],
      seasonStats: Array.isArray(newData.seasonStats) ? newData.seasonStats : []
    };

    // Perform merges with proper error handling
    let mergedAgentStats = [];
    let mergedMapStats = [];
    let mergedWeaponStats = [];
    let mergedSeasonStats = [];

    try {
      mergedAgentStats = mergeAgentStats(validatedOldData.agentStats, validatedNewData.agentStats);
    } catch (error) {
      console.error('Error merging agent stats:', error);
      mergedAgentStats = [...validatedOldData.agentStats]; // Fallback to old data
    }

    try {
      mergedMapStats = mergeMapStats(validatedOldData.mapStats, validatedNewData.mapStats);
    } catch (error) {
      console.error('Error merging map stats:', error);
      mergedMapStats = [...validatedOldData.mapStats]; // Fallback to old data
    }

    try {
      mergedWeaponStats = mergeWeaponStats(validatedOldData.weaponStats, validatedNewData.weaponStats);
    } catch (error) {
      console.error('Error merging weapon stats:', error);
      mergedWeaponStats = [...validatedOldData.weaponStats]; // Fallback to old data
    }

    try {
      mergedSeasonStats = mergeSeasonStats(validatedOldData.seasonStats, validatedNewData.seasonStats);
    } catch (error) {
      console.error('Error merging season stats:', error);
      mergedSeasonStats = [...validatedOldData.seasonStats]; // Fallback to old data
    }

    return {
      mergedAgentStats,
      mergedMapStats,
      mergedWeaponStats,
      mergedSeasonStats
    };
  } catch (error) {
    console.error('Fatal error in mergeProcess:', error);
    // Return original data if an unexpected error occurs
    return {
      mergedAgentStats: oldData.agentStats || [],
      mergedMapStats: oldData.mapStats || [],
      mergedWeaponStats: oldData.weaponStats || [],
      mergedSeasonStats: oldData.seasonStats || []
    };
  }
};