import { AgentStatType, AgentAbility, AgentMapStat, MapStatsType, MapSeasonPerformance, AgentSeasonPerformance, AgentAbilityCastDetails, WeaponStatsType, SeasonStatsType } from "@types";


export const mergeAgentSeasonalStats = (agentStat: AgentStatType): AgentStatType => {
  const seasonStat: AgentSeasonPerformance = {
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
    mapStats: [] as AgentMapStat[],
    attackStats: {
      deaths: 0,
      kills: 0,
      roundsLost: 0,
      roundsWon: 0,
      clutchStats: {
        "1v1Wins": 0,
        "1v2Wins": 0,
        "1v3Wins": 0,
        "1v4Wins": 0,
        "1v5Wins": 0,
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
        "1v4Wins": 0,
        "1v5Wins": 0,
      }
    },
    abilityAndUltimateImpact: [] as AgentAbilityCastDetails[]
  };

  const aggregatedSeasonStats = agentStat.performanceBySeason.reduce((acc, curr) => {
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
      const existingMap = acc.mapStats.find((m: AgentMapStat) => m.id === map.id);
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
        (ability: AgentAbilityCastDetails) => ability.id === abilityImpact.id
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

  return {
    ...agentStat,
    performanceBySeason: [aggregatedSeasonStats]
  };
}

export const mergeMapSeasonalStats = (mapStat: MapStatsType): MapStatsType => {
  const seasonStat: MapSeasonPerformance = {
    season: {
      id: 'All',
      name: 'All Act',
      isActive: false,
    },
    stats: {
      matchesWon: 0,
      matchesLost: 0,
      roundsWon: 0,
      roundsLost: 0,
      kills: 0,
      deaths: 0,
      playtimeMillis: 0,
      aces: 0,
      firstKills: 0,
      defuses: 0,
      plants: 0,
      totalRounds: 0,
    },
    attackStats: {
      roundsWon: 0,
      roundsLost: 0,
      deaths: 0,
      kills: 0,
      HeatmapLocation: {
        deathLocation: [],
        killsLocation: [],
      },
    },
    defenseStats: {
      roundsWon: 0,
      roundsLost: 0,
      deaths: 0,
      kills: 0,
      HeatmapLocation: {
        deathLocation: [],
        killsLocation: [],
      },
    },
  };

  const aggregatedSeasonStats = mapStat.performanceBySeason.reduce((acc, curr) => {
    acc.stats.matchesWon += curr.stats.matchesWon;
    acc.stats.matchesLost += curr.stats.matchesLost;
    acc.stats.roundsWon += curr.stats.roundsWon;
    acc.stats.roundsLost += curr.stats.roundsLost;
    acc.stats.kills += curr.stats.kills;
    acc.stats.deaths += curr.stats.deaths;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis;
    acc.stats.aces += curr.stats.aces;
    acc.stats.firstKills += curr.stats.firstKills;
    acc.stats.defuses += curr.stats.defuses;
    acc.stats.plants += curr.stats.plants;
    acc.stats.totalRounds += curr.stats.totalRounds;

    acc.attackStats.roundsWon += curr.attackStats.roundsWon;
    acc.attackStats.roundsLost += curr.attackStats.roundsLost;
    acc.attackStats.deaths += curr.attackStats.deaths;
    acc.attackStats.kills += curr.attackStats.kills;
    acc.attackStats.HeatmapLocation.deathLocation = [
      ...acc.attackStats.HeatmapLocation.deathLocation,
      ...curr.attackStats.HeatmapLocation.deathLocation,
    ];
    acc.attackStats.HeatmapLocation.killsLocation = [
      ...acc.attackStats.HeatmapLocation.killsLocation,
      ...curr.attackStats.HeatmapLocation.killsLocation,
    ];

    acc.defenseStats.roundsWon += curr.defenseStats.roundsWon;
    acc.defenseStats.roundsLost += curr.defenseStats.roundsLost;
    acc.defenseStats.deaths += curr.defenseStats.deaths;
    acc.defenseStats.kills += curr.defenseStats.kills;
    acc.defenseStats.HeatmapLocation.deathLocation = [
      ...acc.defenseStats.HeatmapLocation.deathLocation,
      ...curr.defenseStats.HeatmapLocation.deathLocation,
    ];
    acc.defenseStats.HeatmapLocation.killsLocation = [
      ...acc.defenseStats.HeatmapLocation.killsLocation,
      ...curr.defenseStats.HeatmapLocation.killsLocation,
    ];

    return acc;
  }, seasonStat);

  return {
    ...mapStat,
    performanceBySeason: [aggregatedSeasonStats]
  };
};

export const mergeWeaponSeasonalStats = (weaponStats: WeaponStatsType): WeaponStatsType => {
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

  const aggregatedSeasonStats = weaponStats.performanceBySeason.reduce((acc, curr) => {
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

  return {
    ...weaponStats,
    performanceBySeason: [aggregatedSeasonStats]
  };
};

export const mergeActSeasonalStats = (seasonStats: SeasonStatsType[]): SeasonStatsType => {
  if (seasonStats.length === 0) {
    throw new Error('Cannot merge empty season stats array');
  }

  // Use first season stats as base, copy id and puuid
  const firstSeason = seasonStats[0];
  const initialStats: SeasonStatsType = {
    id: firstSeason.id,
    puuid: firstSeason.puuid,
    season: {
      id: "292f58db-4c17-89a7-b1c0-ba988f0e9d98",
      name: "EPISODE 9 - ACT 2",
      isActive: false,
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
      matchesPlayed: 0,
      damage: 0,
      firstKill: 0,
      highestRank: 0,
      aces: 0,
      mvps: 0,
    }
  };

  const aggregatedStats = seasonStats.reduce((acc, curr) => {
    acc.stats.matchesPlayed += curr.stats.matchesPlayed;
    acc.stats.matchesWon += curr.stats.matchesWon;
    acc.stats.matchesLost += curr.stats.matchesLost;
    acc.stats.kills += curr.stats.kills;
    acc.stats.deaths += curr.stats.deaths;
    acc.stats.roundsWon += curr.stats.roundsWon;
    acc.stats.roundsLost += curr.stats.roundsLost;
    acc.stats.totalRounds += curr.stats.totalRounds;
    acc.stats.playtimeMillis += curr.stats.playtimeMillis;
    acc.stats.damage += curr.stats.damage;
    acc.stats.firstKill += curr.stats.firstKill;
    acc.stats.plants += curr.stats.plants;
    acc.stats.defuses += curr.stats.defuses;
    acc.stats.aces += curr.stats.aces;
    acc.stats.mvps += curr.stats.mvps;
    acc.stats.highestRank =
      curr.stats.highestRank > acc.stats.highestRank ? curr.stats.highestRank : acc.stats.highestRank;

    return acc;
  }, initialStats);

  return aggregatedStats;
}

interface AbilityData {
  id: string;
  count: number;
  kills: number;
  damage: number;
}

interface Utilities {
  grenadeCasts: AbilityData;
  ability1Casts: AbilityData;
  ability2Casts: AbilityData;
  ultimateCasts: AbilityData;
}

export const mergeUtilitiesAndAbilities = (
  abilitiesData: AgentAbilityCastDetails[], 
  utilities: Utilities
) => {
  return abilitiesData.map(ability => {
    let data: AbilityData;
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
        data = { id: ability.id, count: 0, kills: 0, damage: 0 };
    }
    return { ...ability, data };
  });
};