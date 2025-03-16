import { AgentStatType, SeasonPerformance as AgentSeasonPerformance } from "../types/AgentStatsType";
import { MapStatsType, SeasonPerformance as MapSeasonPerformance } from "../types/MapStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatType, SeasonPerformance as WeaponSeasonPerformance } from "../types/WeaponStatsType";

// Define a simplified MatchDetails interface for clarity
interface MatchDetails {
  matchInfo: {
    matchId: string;
    mapId: string;
    gameLengthMillis: number;
    gameStartMillis: number;
    seasonId: string;
    isRanked: boolean;
    gameMode: string;
  };
  players: {
    puuid: string;
    gameName: string;
    tagLine: string;
    teamId: string;
    characterId: string;
    stats: {
      score: number;
      roundsPlayed: number;
      kills: number;
      deaths: number;
      assists: number;
      playtimeMillis: number;
      abilityCasts: {
        grenadeCasts: number;
        ability1Casts: number;
        ability2Casts: number;
        ultimateCasts: number;
      };
    };
    competitiveTier: number;
  }[];
  teams: {
    teamId: string;
    won: boolean;
    roundsPlayed: number;
    roundsWon: number;
  }[];
  roundResults: {
    roundNum: number;
    winningTeam: string;
    bombPlanter?: string;
    bombDefuser?: string;
    plantSite?: string;
    playerStats: {
      puuid: string;
      kills: {
        killer: string;
        victim: string;
        victimLocation: {
          x: number;
          y: number;
        };
        finishingDamage: {
          damageType: string;
          damageItem: string;
        };
      }[];
      damage: {
        receiver: string;
        damage: number;
        legshots: number;
        bodyshots: number;
        headshots: number;
      }[];
      score: number;
      economy: {
        weapon: string;
      };
    }[];
  }[];
}

export const generateStats = async (matchDetails: MatchDetails[], puuid: string) => {
  // Validate inputs
  if (!Array.isArray(matchDetails) || !puuid) {
    console.error('Invalid input to generateStats:', { matchDetailsLength: matchDetails?.length, puuid });
    return {
      agentStats: [],
      mapStats: [],
      weaponStats: [],
      seasonStats: []
    };
  }

  const agentMap = new Map<string, AgentStatType>();
  const mapMap = new Map<string, MapStatsType>();
  const weaponMap = new Map<string, WeaponStatType>();
  const seasonMap = new Map<string, SeasonStatsType>();

  // Process each match
  for (const match of matchDetails) {
    try {
      // Skip invalid match data
      if (!match?.matchInfo || !Array.isArray(match.players) || !Array.isArray(match.teams)) {
        console.warn('Skipping invalid match data:', match);
        continue;
      }

      // Find the player in this match
      const player = match.players.find(player => player?.puuid === puuid);
      if (!player) {
        console.warn(`Player ${puuid} not found in match ${match.matchInfo.matchId}`);
        continue;
      }

      // Find player's team
      const playerTeam = match.teams.find(team => team?.teamId === player.teamId);
      if (!playerTeam) {
        console.warn(`Player's team ${player.teamId} not found in match ${match.matchInfo.matchId}`);
        continue;
      }

      // Get match winner status
      const matchWon = playerTeam.won;
      const roundsWon = playerTeam.roundsWon || 0;
      const roundsLost = (playerTeam.roundsPlayed || 0) - (playerTeam.roundsWon || 0);

      // Simplified season information - just ID
      const seasonId = match.matchInfo.seasonId || 'unknown';

      // Process stats
      processAgentStats(agentMap, player, match, seasonId, matchWon, roundsWon, roundsLost, puuid);
      processMapStats(mapMap, match, seasonId, player, matchWon, roundsWon, roundsLost, puuid);
      processWeaponStats(weaponMap, match, seasonId, puuid);
      processSeasonStats(seasonMap, match, seasonId, player, matchWon, roundsWon, roundsLost);
    } catch (error) {
      console.error(`Error processing match ${match?.matchInfo?.matchId}:`, error);
      // Continue to next match instead of failing the whole process
    }
  }

  // Convert maps to arrays and assign IDs
  const result = {
    agentStats: Array.from(agentMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.agent.id}`,
      puuid
    })),
    mapStats: Array.from(mapMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.map.id}`,
      puuid
    })),
    weaponStats: Array.from(weaponMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.weapon.id}`,
      puuid
    })),
    seasonStats: Array.from(seasonMap.values()).map(stat => ({
      ...stat,
      id: `${puuid}_${stat.season.id}`,
      puuid
    }))
  };

  try {
    // Fetch missing details for all entities
    await enrichStatsWithDetails(result);
  } catch (error) {
    console.error('Error enriching stats with details:', error);
    // Continue with unenriched data rather than failing
  }

  return result;
};

// Helper functions for processing stats

function processAgentStats(
  agentMap: Map<string, AgentStatType>,
  player: MatchDetails['players'][0],
  match: MatchDetails,
  seasonId: string,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number,
  puuid: string
) {
  const agentId = player.characterId;

  if (!agentMap.has(agentId)) {
    // Initialize minimal agent stats with just ID
    agentMap.set(agentId, {
      id: `${puuid}_${agentId}`, // Add ID
      puuid, // Add puuid
      agent: {
        id: agentId,
        name: "",
        role: "",
        imageUrl: "",
        iconUrl: "",
        abilities: []
      },
      performanceBySeason: []
    });
  }

  const agentStat = agentMap.get(agentId)!;

  // Find or create season performance
  let seasonPerformance = agentStat.performanceBySeason.find(
    perf => perf.season.id === seasonId
  );

  if (!seasonPerformance) {
    seasonPerformance = createAgentSeasonPerformance(seasonId);
    agentStat.performanceBySeason.push(seasonPerformance);
  }

  // Update stats
  updateAgentSeasonStats(seasonPerformance, player, match, matchWon, roundsWon, roundsLost);
}

function processMapStats(
  mapMap: Map<string, MapStatsType>,
  match: MatchDetails,
  seasonId: string,
  player: MatchDetails['players'][0],
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number,
  puuid: string
) {
  const mapId = match.matchInfo.mapId;

  if (!mapMap.has(mapId)) {
    // Initialize minimal map stats with just ID
    mapMap.set(mapId, {
      id: `${puuid}_${mapId}`, // Add ID
      puuid, // Add puuid
      map: {
        id: mapId,
        name: "",
        location: "",
        imageUrl: "",
        mapCoordinate: {
          xMultiplier: 0,
          yMultiplier: 0,
          xScalarToAdd: 0,
          yScalarToAdd: 0
        }
      },
      performanceBySeason: []
    });
  }

  const mapStat = mapMap.get(mapId)!;

  // Find or create season performance
  let seasonPerformance = mapStat.performanceBySeason.find(
    perf => perf.season.id === seasonId
  );

  if (!seasonPerformance) {
    seasonPerformance = createMapSeasonPerformance(seasonId);
    mapStat.performanceBySeason.push(seasonPerformance);
  }

  // Update stats
  updateMapSeasonStats(seasonPerformance, player, match, matchWon, roundsWon, roundsLost);
}

function processWeaponStats(
  weaponMap: Map<string, WeaponStatType>,
  match: MatchDetails,
  seasonId: string,
  puuid: string
) {
  // Collect all weapons used by the player in this match
  const weaponsUsed = new Set<string>();

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (playerStats && playerStats.economy.weapon) {
      weaponsUsed.add(playerStats.economy.weapon);
    }

    // Add weapons from kills
    if (playerStats) {
      for (const kill of playerStats.kills) {
        if (kill.finishingDamage.damageItem) {
          weaponsUsed.add(kill.finishingDamage.damageItem);
        }
      }
    }
  }

  // Process each weapon
  weaponsUsed.forEach(weaponId => {
    if (!weaponMap.has(weaponId)) {
      // Initialize minimal weapon stats with just ID
      weaponMap.set(weaponId, {
        id: `${puuid}_${weaponId}`, // Add ID
        puuid, // Add puuid
        weapon: {
          id: weaponId,
          name: "",
          imageUrl: "",
          type: ""
        },
        performanceBySeason: []
      });
    }

    const weaponStat = weaponMap.get(weaponId)!;

    // Find or create season performance
    let seasonPerformance = weaponStat.performanceBySeason.find(
      perf => perf.season.id === seasonId
    );

    if (!seasonPerformance) {
      seasonPerformance = createWeaponSeasonPerformance(seasonId);
      weaponStat.performanceBySeason.push(seasonPerformance);
    }

    // Update stats
    updateWeaponSeasonStats(seasonPerformance, match, puuid, weaponId);
  });
}

function processSeasonStats(
  seasonMap: Map<string, SeasonStatsType>,
  match: MatchDetails,
  seasonId: string,
  player: MatchDetails['players'][0],
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number
) {
  if (!seasonMap.has(seasonId)) {
    // Initialize minimal season stats with just ID
    seasonMap.set(seasonId, {
      id: `${player.puuid}_${seasonId}`, // Add ID
      puuid: player.puuid, // Add puuid
      season: {
        id: seasonId,
        name: "",
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
        matchesPlayed: 0,
        damage: 0,
        firstKill: 0,
        highestRank: player.competitiveTier,
        aces: 0,
        mvps: 0
      }
    });
  }

  const seasonStat = seasonMap.get(seasonId)!;

  // Update season stats
  updateSeasonStats(seasonStat, player, match, matchWon, roundsWon, roundsLost);
}

// Helper functions for creating seasonal performances
function createAgentSeasonPerformance(seasonId: string): AgentSeasonPerformance {
  return {
    season: {
      id: seasonId,
      name: "",
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
        "1v4Wins": 0,
        "1v5Wins": 0
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
        "1v5Wins": 0
      }
    },
    abilityAndUltimateImpact: []
  };
}

function createMapSeasonPerformance(seasonId: string): MapSeasonPerformance {
  return {
    season: {
      id: seasonId,
      name: "",
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
    attackStats: {
      deaths: 0,
      kills: 0,
      roundsLost: 0,
      roundsWon: 0,
      HeatmapLocation: {
        killsLocation: [],
        deathLocation: []
      }
    },
    defenseStats: {
      deaths: 0,
      kills: 0,
      roundsLost: 0,
      roundsWon: 0,
      HeatmapLocation: {
        killsLocation: [],
        deathLocation: []
      }
    }
  };
}

function createWeaponSeasonPerformance(seasonId: string): WeaponSeasonPerformance {
  return {
    season: {
      id: seasonId,
      name: "",
      isActive: false
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
      bodyshots: 0
    }
  };
}

// Update functions for each stat type
function updateAgentSeasonStats(
  seasonPerformance: AgentSeasonPerformance,
  player: MatchDetails['players'][0],
  match: MatchDetails,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number
) {
  const stats = seasonPerformance.stats;

  // Update basic stats
  stats.kills += player.stats.kills;
  stats.deaths += player.stats.deaths;
  stats.roundsWon += roundsWon;
  stats.roundsLost += roundsLost;
  stats.totalRounds += player.stats.roundsPlayed;
  stats.playtimeMillis += player.stats.playtimeMillis;

  if (matchWon) {
    stats.matchesWon += 1;
  } else {
    stats.matchesLost += 1;
  }

  // Would need more logic for plants, defuses, aces, firstKills
  // Also for attackStats, defenseStats, and abilities
}

function updateMapSeasonStats(
  seasonPerformance: MapSeasonPerformance,
  player: MatchDetails['players'][0],
  match: MatchDetails,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number
) {
  const stats = seasonPerformance.stats;

  // Update basic stats
  stats.kills += player.stats.kills;
  stats.deaths += player.stats.deaths;
  stats.roundsWon += roundsWon;
  stats.roundsLost += roundsLost;
  stats.totalRounds += player.stats.roundsPlayed;
  stats.playtimeMillis += player.stats.playtimeMillis;

  if (matchWon) {
    stats.matchesWon += 1;
  } else {
    stats.matchesLost += 1;
  }

  // Would need more logic for attack/defense stats and heatmap locations
}

function updateWeaponSeasonStats(
  seasonPerformance: WeaponSeasonPerformance,
  match: MatchDetails,
  puuid: string,
  weaponId: string
) {
  let kills = 0;
  let damage = 0;
  let headshots = 0;
  let bodyshots = 0;
  let legshots = 0;
  let roundsPlayed = 0;

  // Process each round
  for (const round of match.roundResults) {
    roundsPlayed++;
    const playerStat = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStat) continue;

    // Count kills with this weapon
    for (const kill of playerStat.kills) {
      if (kill.finishingDamage.damageItem === weaponId) {
        kills++;
      }
    }

    // Sum up damage, headshots, bodyshots, legshots
    for (const damageEntry of playerStat.damage) {
      // In a real scenario, we'd need to filter by weapon
      damage += damageEntry.damage;
      headshots += damageEntry.headshots;
      bodyshots += damageEntry.bodyshots;
      legshots += damageEntry.legshots;
    }
  }

  // Update stats
  seasonPerformance.stats.kills += kills;
  seasonPerformance.stats.damage += damage;
  seasonPerformance.stats.headshots += headshots;
  seasonPerformance.stats.bodyshots += bodyshots;
  seasonPerformance.stats.legshots += legshots;
  seasonPerformance.stats.roundsPlayed += roundsPlayed;

  // Calculate averages
  if (roundsPlayed > 0) {
    seasonPerformance.stats.avgKillsPerRound = seasonPerformance.stats.kills / seasonPerformance.stats.roundsPlayed;
    seasonPerformance.stats.avgDamagePerRound = seasonPerformance.stats.damage / seasonPerformance.stats.roundsPlayed;
  }
}

function updateSeasonStats(
  seasonStat: SeasonStatsType,
  player: MatchDetails['players'][0],
  match: MatchDetails,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number
) {
  const stats = seasonStat.stats;

  // Update basic stats
  stats.kills += player.stats.kills;
  stats.deaths += player.stats.deaths;
  stats.roundsWon += roundsWon;
  stats.roundsLost += roundsLost;
  stats.totalRounds += player.stats.roundsPlayed;
  stats.playtimeMillis += player.stats.playtimeMillis;
  stats.matchesPlayed += 1;

  if (matchWon) {
    stats.matchesWon += 1;
  } else {
    stats.matchesLost += 1;
  }

  // Update highest rank if needed
  if (player.competitiveTier > stats.highestRank) {
    stats.highestRank = player.competitiveTier;
  }

  // Would need more logic for damage, plants, defuses, firstKill, aces, mvps
}

// New functions to fetch and enrich entity details

// Main function to enrich all stats with details
async function enrichStatsWithDetails(stats: {
  agentStats: AgentStatType[],
  mapStats: MapStatsType[],
  weaponStats: WeaponStatType[],
  seasonStats: SeasonStatsType[]
}) {
  try {
    // Process agents
    for (const agentStat of stats.agentStats) {
      try {
        // Enrich agent details
        if (!agentStat.agent.name) {
          const agentDetails = await fetchAgentDetails(agentStat.agent.id);
          agentStat.agent = {
            ...agentStat.agent,
            ...agentDetails
          };
        }

        // Enrich seasons within agent performance
        for (const performance of agentStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }
        }
      } catch (error) {
        console.error(`Error enriching agent stats for agent ${agentStat.agent.id}:`, error);
        // Continue with other agents rather than failing the whole process
      }
    }

    // Process maps
    for (const mapStat of stats.mapStats) {
      try {
        // Enrich map details
        if (!mapStat.map.name) {
          const mapDetails = await fetchMapDetails(mapStat.map.id);
          mapStat.map = {
            ...mapStat.map,
            ...mapDetails
          };
        }

        // Enrich seasons within map performance
        for (const performance of mapStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }
        }
      } catch (error) {
        console.error(`Error enriching map stats for map ${mapStat.map.id}:`, error);
      }
    }

    // Process weapons
    for (const weaponStat of stats.weaponStats) {
      try {
        // Enrich weapon details
        if (!weaponStat.weapon.name) {
          const weaponDetails = await fetchWeaponDetails(weaponStat.weapon.id);
          weaponStat.weapon = {
            ...weaponStat.weapon,
            ...weaponDetails
          };
        }

        // Enrich seasons within weapon performance
        for (const performance of weaponStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }
        }
      } catch (error) {
        console.error(`Error enriching weapon stats for weapon ${weaponStat.weapon.id}:`, error);
      }
    }

    // Process seasons
    for (const seasonStat of stats.seasonStats) {
      try {
        // Enrich season details
        if (!seasonStat.season.name) {
          const seasonDetails = await fetchSeasonDetails(seasonStat.season.id);
          seasonStat.season = {
            ...seasonStat.season,
            ...seasonDetails
          };
        }
      } catch (error) {
        console.error(`Error enriching season stats for season ${seasonStat.season.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in enrichStatsWithDetails:', error);
    // Function continues despite errors
  }
}

// Functions to fetch entity details
async function fetchAgentDetails(agentId: string) {
  // This would be an API call or database lookup in a real implementation
  console.log(`Fetching details for agent ${agentId}`);

  // Placeholder implementation
  return {
    name: `Agent ${agentId}`,
    role: "Unknown Role",
    imageUrl: `https://example.com/agents/${agentId}.png`,
    iconUrl: `https://example.com/icons/${agentId}.png`,
    abilities: [
      {
        id: "ability1",
        name: "Ability 1",
        imageUrl: `https://example.com/abilities/${agentId}_1.png`,
        type: "Basic",
        cost: 100
      },
      {
        id: "ability2",
        name: "Ability 2",
        imageUrl: `https://example.com/abilities/${agentId}_2.png`,
        type: "Signature",
        cost: 0
      },
      {
        id: "grenade",
        name: "Grenade",
        imageUrl: `https://example.com/abilities/${agentId}_grenade.png`,
        type: "Grenade",
        cost: 200
      },
      {
        id: "ultimate",
        name: "Ultimate",
        imageUrl: `https://example.com/abilities/${agentId}_ultimate.png`,
        type: "Ultimate",
        cost: 7
      }
    ]
  };
}

async function fetchMapDetails(mapId: string) {
  // This would be an API call or database lookup in a real implementation
  console.log(`Fetching details for map ${mapId}`);

  // Placeholder implementation
  return {
    name: `Map ${mapId}`,
    location: "Unknown Location",
    imageUrl: `https://example.com/maps/${mapId}.png`,
    mapCoordinate: {
      xMultiplier: 0.1,
      yMultiplier: 0.1,
      xScalarToAdd: 0,
      yScalarToAdd: 0
    }
  };
}

async function fetchWeaponDetails(weaponId: string) {
  // This would be an API call or database lookup in a real implementation
  console.log(`Fetching details for weapon ${weaponId}`);

  // Placeholder implementation
  return {
    name: `Weapon ${weaponId}`,
    imageUrl: `https://example.com/weapons/${weaponId}.png`,
    type: "Unknown Type"
  };
}

async function fetchSeasonDetails(seasonId: string) {
  // This would be an API call or database lookup in a real implementation
  console.log(`Fetching details for season ${seasonId}`);

  // Placeholder implementation
  return {
    name: `Season ${seasonId}`,
    isActive: seasonId === "e7" // Example logic to determine active season
  };
}
