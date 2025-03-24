import { AgentStatType, SeasonPerformance as AgentSeasonPerformance } from "../types/AgentStatsType";
import { MapStatsType, SeasonPerformance as MapSeasonPerformance } from "../types/MapStatsType";
import { SeasonStatsType } from "../types/SeasonStatsType";
import { WeaponStatType, SeasonPerformance as WeaponSeasonPerformance } from "../types/WeaponStatsType";
import { supabase } from "../lib/supabase";
import { ClutchEvent, CombatStats, Coordinate, EconomyStats, KillEvent, MapData, PlayerVsPlayerStat, PositioningStats, RoundPerformance, TeamStat, UtilityStats } from "../types/MatchStatType";

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
    queueId: string;
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
        playerLocations: {
          puuid: string;
          location: {
            x: number;
            y: number;
          };
        }[];
        timeSinceRoundStartMillis: number;
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
        loadoutValue: number;
        weapon: string;
        armor: string;
        remaining: number;
        spent: number;
      };
    }[];
  }[];
}

// Update the generateStats function to also generate match stats
export const generateStats = async (matchDetails: MatchDetails[], puuid: string) => {
  // Validate inputs
  if (!Array.isArray(matchDetails) || !puuid) {
    console.error('[BackgroundProcess] Invalid input to generateStats:', { matchDetailsLength: matchDetails?.length, puuid });
    return {
      agentStats: [],
      mapStats: [],
      weaponStats: [],
      seasonStats: [],
      matchStats: [] // Add matchStats to the return object
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
  const agentStats = Array.from(agentMap.values()).map(stat => ({
    ...stat,
    id: `${puuid}_${stat.agent.id}`,
    puuid
  }));
  const mapStats = Array.from(mapMap.values()).map(stat => ({
    ...stat,
    id: `${puuid}_${stat.map.id}`,
    puuid
  }));
  const weaponStats = Array.from(weaponMap.values()).map(stat => ({
    ...stat,
    id: `${puuid}_${stat.weapon.id}`,
    puuid
  }));
  const seasonStats = Array.from(seasonMap.values()).map(stat => ({
    ...stat,
    id: `${puuid}_${stat.season.id}`,
    puuid
  }));

  // Generate match stats
  const matchStats = await generateMatchStats(matchDetails, puuid);

  try {
    // Fetch missing details for all entities including match stats
    await enrichStatsWithDetails({ agentStats, mapStats, weaponStats, seasonStats, matchStats });
  } catch (error) {
    console.error('Error enriching stats with details:', error);
    // Continue with unenriched data rather than failing
  }

  // Return all generated stats
  return {
    agentStats,
    mapStats,
    weaponStats,
    seasonStats,
    matchStats
  };
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
    // Initialize agent stats with just ID
    agentMap.set(agentId, {
      id: `${puuid}_${agentId}`,
      puuid,
      agent: {
        id: agentId,
        name: "",
        role: "",
        image: "",
        icon: "",
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
  updateAgentSeasonStats(seasonPerformance, player, match, matchWon, roundsWon, roundsLost, puuid);
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
        image: "",
        mapcoordinate: {
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
          image: "",
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
  roundsLost: number,
  puuid: string
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

  // Process ability casts and impact
  processAbilityCasts(seasonPerformance, player, match, puuid);

  // Process plants and defuses
  processPlantsAndDefuses(seasonPerformance, match, puuid);

  // Process first kills
  processFirstKills(seasonPerformance, match, puuid);

  // Process aces (5 kills in a single round)
  processAces(seasonPerformance, match, puuid);

  // Process map stats (if this map isn't already in the agent's map stats)
  processAgentMapStats(seasonPerformance, match, matchWon);

  // Process attack and defense stats
  processAttackDefenseStats(seasonPerformance, match, puuid);

  // Process clutch situations
  processClutchStats(seasonPerformance, match, puuid);
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
  const puuid = player.puuid;

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

  // Process plants and defuses
  processMapPlantsAndDefuses(seasonPerformance, match, puuid);

  // Process first kills
  processMapFirstKills(seasonPerformance, match, puuid);

  // Process aces (5 kills in a single round)
  processMapAces(seasonPerformance, match, puuid);

  // Process attack and defense stats including heatmap locations
  processMapAttackDefenseStats(seasonPerformance, match, puuid);
}

// Helper functions for map stats processing

function processMapPlantsAndDefuses(
  seasonPerformance: MapSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count plants and defuses
  let plants = 0;
  let defuses = 0;

  for (const round of match.roundResults) {
    if (round.bombPlanter === puuid) {
      plants++;
    }
    if (round.bombDefuser === puuid) {
      defuses++;
    }
  }

  // Update stats
  seasonPerformance.stats.plants += plants;
  seasonPerformance.stats.defuses += defuses;
}

function processMapFirstKills(
  seasonPerformance: MapSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count first kills
  let firstKills = 0;

  for (const round of match.roundResults) {
    // Check if this player got any kills
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Simple approach: assume first kill in the array might be first kill of the round
    // A more accurate approach would compare timestamps across all players
    firstKills++;
  }

  // Update stats
  seasonPerformance.stats.firstKills += firstKills;
}

function processMapAces(
  seasonPerformance: MapSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count aces (5 or more kills in a single round)
  let aces = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    // Check if player got 5 or more kills in this round
    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }

  // Update stats
  seasonPerformance.stats.aces += aces;
}

function processMapAttackDefenseStats(
  seasonPerformance: MapSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Find the player and their team
  const player = match.players.find(p => p.puuid === puuid);
  if (!player) return;

  const playerTeam = match.teams.find(team => team.teamId === player.teamId);
  if (!playerTeam) return;

  // Process each round
  match.roundResults.forEach((round) => {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) return;

    // Determine if player is on attack or defense using the proper logic
    // In Valorant: First 12 rounds, Red team is attacker; after that, Blue team is attacker
    const isAttackRound =
      (round.roundNum < 12 && playerTeam.teamId === 'Red') ||
      (round.roundNum >= 12 && playerTeam.teamId === 'Blue');

    const stats = isAttackRound ? seasonPerformance.attackStats : seasonPerformance.defenseStats;

    // Update kills and location data
    for (const kill of playerStats.kills) {
      stats.kills++;

      if (kill.victimLocation) {
        // Add the kill location to the heatmap
        stats.HeatmapLocation.killsLocation.push({
          x: kill.victimLocation.x,
          y: kill.victimLocation.y
        });
      }
    }

    // Update deaths
    // Since we don't have direct death locations, we need to find this player as a victim
    for (const otherPlayerStats of round.playerStats) {
      for (const kill of otherPlayerStats.kills) {
        if (kill.victim === puuid) {
          stats.deaths++;

          // If victim location is available, add to death heatmap
          if (kill.victimLocation) {
            stats.HeatmapLocation.deathLocation.push({
              x: kill.victimLocation.x,
              y: kill.victimLocation.y
            });
          }
        }
      }
    }

    // Update rounds won/lost stats
    if (round.winningTeam === player.teamId) {
      stats.roundsWon++;
    } else {
      stats.roundsLost++;
    }
  });
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
  let aces = 0;
  let firstKills = 0;
  let roundsWithWeapon = 0;

  // Process each round
  for (const round of match.roundResults) {
    roundsPlayed++;
    const playerStat = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStat) continue;

    let weaponUsedInRound = false;
    let killsInRound = 0;
    let damageInRound = 0;

    // Check if this weapon was used (either in economy or for kills)
    if (playerStat.economy.weapon === weaponId) {
      weaponUsedInRound = true;
    }

    // Count kills with this weapon
    for (const kill of playerStat.kills) {
      if (kill.finishingDamage.damageItem === weaponId) {
        kills++;
        killsInRound++;
        weaponUsedInRound = true;

        // Check if this was the first kill in the array (simplified approach for first kill)
        if (playerStat.kills.indexOf(kill) === 0) {
          firstKills++;
        }
      }
    }

    // Check for aces with this weapon (5+ kills in a round with this weapon)
    if (killsInRound >= 5) {
      aces++;
    }

    // Sum up damage, headshots, bodyshots, legshots from this weapon
    for (const damageEntry of playerStat.damage) {
      // We can't filter by weapon here without more data, so we'll attribute
      // hit stats proportionally or when we know the weapon was used
      if (weaponUsedInRound) {
        // Add to damage total
        damage += damageEntry.damage;
        damageInRound += damageEntry.damage;

        // Add to hit location counters
        headshots += damageEntry.headshots;
        bodyshots += damageEntry.bodyshots;
        legshots += damageEntry.legshots;
      }
    }

    // Count this round as a round where the weapon was used
    if (weaponUsedInRound) {
      roundsWithWeapon++;
    }
  }

  // Update stats
  seasonPerformance.stats.kills += kills;
  seasonPerformance.stats.damage += damage;
  seasonPerformance.stats.headshots += headshots;
  seasonPerformance.stats.bodyshots += bodyshots;
  seasonPerformance.stats.legshots += legshots;
  seasonPerformance.stats.roundsPlayed += roundsWithWeapon; // Only count rounds where weapon was used
  seasonPerformance.stats.aces += aces;
  seasonPerformance.stats.firstKills += firstKills;

  // Calculate averages (only when weapon was actually used)
  if (roundsWithWeapon > 0) {
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
  const puuid = player.puuid;

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

  // Process plants and defuses
  for (const round of match.roundResults) {
    if (round.bombPlanter === puuid) {
      stats.plants++;
    }
    if (round.bombDefuser === puuid) {
      stats.defuses++;
    }
  }

  // Calculate damage dealt
  let totalDamage = 0;
  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    for (const damageEntry of playerStats.damage) {
      totalDamage += damageEntry.damage;
    }
  }
  stats.damage += totalDamage;

  // Count first kills
  let firstKills = 0;
  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Simplified approach - count if player has any kills in round
    // A more accurate approach would determine if it was actually the first kill
    firstKills++;
  }
  stats.firstKill += firstKills;

  // Count aces (5+ kills in a round)
  let aces = 0;
  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }
  stats.aces += aces;

  // Count MVPs (highest score in the match on winning team)
  // Note: This is a simplification - actual MVP determination may vary
  if (matchWon) {
    let highestScore = player.stats.score;
    let isMVP = true;

    // Check if this player had the highest score on their team
    for (const otherPlayer of match.players) {
      if (otherPlayer.puuid !== puuid && otherPlayer.teamId === player.teamId) {
        if (otherPlayer.stats.score > highestScore) {
          isMVP = false;
          break;
        }
      }
    }

    if (isMVP) {
      stats.mvps++;
    }
  }
}

// New functions to fetch and enrich entity details

// Main function to enrich all stats with details
async function enrichStatsWithDetails(stats: {
  agentStats: AgentStatType[],
  mapStats: MapStatsType[],
  weaponStats: WeaponStatType[],
  seasonStats: SeasonStatsType[],
  matchStats?: any[] // Add optional matchStats parameter
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

    // Process match stats if provided
    if (stats.matchStats && stats.matchStats.length > 0) {
      for (const matchStat of stats.matchStats) {
        try {
          if (matchStat.stats && matchStat.stats.general) {
            const general = matchStat.stats.general;

            // Enrich agent details
            if (general.agent && general.agent.id && (!general.agent.name || !general.agent.role)) {
              const agentDetails = await fetchAgentDetails(general.agent.id);
              general.agent = {
                ...general.agent,
                ...agentDetails
              };
            }

            // Enrich map details
            if (general.map && general.map.id && (!general.map.name || !general.map.location)) {
              const mapDetails = await fetchMapDetails(general.map.id);
              general.map = {
                ...general.map,
                ...mapDetails
              };
            }

            // Enrich season details
            if (general.season && general.season.id && !general.season.name) {
              const seasonDetails = await fetchSeasonDetails(general.season.id);
              general.season = {
                ...general.season,
                ...seasonDetails
              };
            }
          }
        } catch (error) {
          console.error(`Error enriching match stats for match ${matchStat.id || matchStat?.stats?.general?.matchId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in enrichStatsWithDetails:', error);
    // Function continues despite errors
  }
}

// Functions to fetch entity details
async function fetchAgentDetails(agentId: string) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Agent with ID ${agentId} not found`);

    // Return agent data without the id field
    const { id, ...agentWithoutId } = data;
    return agentWithoutId;
  } catch (error) {
    console.error(`Error fetching agent details for ${agentId}:`, error);
    // Return a fallback in case of errors
    return {
    };
  }
}

async function fetchMapDetails(mapId: string) {
  try {
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Map with ID ${mapId} not found`);

    // Return map data without the id field
    const { id, ...mapWithoutId } = data;
    return mapWithoutId;
  } catch (error) {
    console.error(`Error fetching map details for ${mapId}:`, error);
    // Return a fallback in case of errors
    return {
    };
  }
}

async function fetchWeaponDetails(weaponId: string) {
  try {
    const { data, error } = await supabase
      .from('weapons')
      .select('*')
      .eq('id', weaponId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Weapon with ID ${weaponId} not found`);

    // Return weapon data without the id field
    const { id, ...weaponWithoutId } = data;
    return weaponWithoutId;
  } catch (error) {
    console.error(`Error fetching weapon details for ${weaponId}:`, error);
    // Return a fallback in case of errors
    return {
    };
  }
}

async function fetchSeasonDetails(seasonId: string) {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', seasonId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Season with ID ${seasonId} not found`);

    // Return season data without the id field
    const { id, ...seasonWithoutId } = data;
    return seasonWithoutId;
  } catch (error) {
    console.error(`Error fetching season details for ${seasonId}:`, error);
    // Return a fallback in case of errors
    return {
    };
  }
}

// Helper functions for specific stat processing

function processAbilityCasts(
  seasonPerformance: AgentSeasonPerformance,
  player: MatchDetails['players'][0],
  match: MatchDetails,
  puuid: string
) {
  // Get ability casts from the player's stats
  const abilityCasts = player.stats.abilityCasts;
  if (!abilityCasts) return;

  // Define ability types to track
  const abilityTypes = [
    { id: 'grenade', type: 'Grenade', count: abilityCasts.grenadeCasts || 0 },
    { id: 'ability1', type: 'Basic', count: abilityCasts.ability1Casts || 0 },
    { id: 'ability2', type: 'Signature', count: abilityCasts.ability2Casts || 0 },
    { id: 'ultimate', type: 'Ultimate', count: abilityCasts.ultimateCasts || 0 }
  ];

  // For each ability type, update or create ability impact details
  abilityTypes.forEach(ability => {
    // Find existing ability impact or create new one
    let abilityImpact = seasonPerformance.abilityAndUltimateImpact.find(
      impact => impact.id === ability.id
    );

    if (!abilityImpact) {
      abilityImpact = {
        id: ability.id,
        type: ability.type,
        count: 0,
        kills: 0,
        damage: 0
      };
      seasonPerformance.abilityAndUltimateImpact.push(abilityImpact);
    }

    // Update ability cast count
    abilityImpact.count += ability.count;

    // Track ability kills and damage from match data
    for (const round of match.roundResults) {
      const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
      if (!playerStats) continue;

      // Track ability kills
      for (const kill of playerStats.kills) {
        // Check if the kill was done with this ability
        // Map damageType and damageItem to ability IDs
        const damageType = kill.finishingDamage.damageType?.toLowerCase() || '';
        const damageItem = kill.finishingDamage.damageItem?.toLowerCase() || '';

        let isAbilityKill = false;

        // Grenade (C) ability
        if (ability.id === 'grenade' && (
            damageType.includes('grenade') ||
            damageType.includes('ability_c') ||
            damageItem.includes('grenade') ||
            damageItem.includes('ability_c'))) {
          isAbilityKill = true;
        }
        // Basic (Q) ability
        else if (ability.id === 'ability1' && (
            damageType.includes('ability_q') ||
            damageItem.includes('ability_q') ||
            damageType.includes('ability1'))) {
          isAbilityKill = true;
        }
        // Signature (E) ability
        else if (ability.id === 'ability2' && (
            damageType.includes('ability_e') ||
            damageItem.includes('ability_e') ||
            damageType.includes('ability2'))) {
          isAbilityKill = true;
        }
        // Ultimate (X) ability
        else if (ability.id === 'ultimate' && (
            damageType.includes('ultimate') ||
            damageType.includes('ability_x') ||
            damageItem.includes('ultimate') ||
            damageItem.includes('ability_x'))) {
          isAbilityKill = true;
        }

        if (isAbilityKill) {
          abilityImpact.kills++;
        }
      }

      // Track ability damage
      for (const damageEntry of playerStats.damage) {
        // Without specific ability damage data, we can use a heuristic to estimate
        // This is an approximation based on kills data
        // For more accurate tracking, the API would need to provide ability-specific damage

        const damageContribution = damageEntry.damage;
        // Apply a portion of damage to abilities based on their usage ratio
        // This is a simplified approach - real data would be better
        if (abilityImpact.kills > 0) {
          // Attribute damage proportionally to abilities that got kills
          const abilityKillsRatio = abilityImpact.kills / Math.max(1, playerStats.kills.length);
          abilityImpact.damage += Math.floor(damageContribution * abilityKillsRatio);
        }
      }
    }
  });
}

function processPlantsAndDefuses(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count plants and defuses
  let plants = 0;
  let defuses = 0;

  for (const round of match.roundResults) {
    if (round.bombPlanter === puuid) {
      plants++;
    }
    if (round.bombDefuser === puuid) {
      defuses++;
    }
  }

  // Update stats
  seasonPerformance.stats.plants += plants;
  seasonPerformance.stats.defuses += defuses;
}

function processFirstKills(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count first kills
  let firstKills = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Sort kills by implicit timestamp (assuming they're in order)
    // In a real scenario, you'd want a proper timestamp to determine first kill
    const firstKill = playerStats.kills[0]; // Just taking the first kill in the array

    // Check if this might have been the first kill of the round
    // A more accurate implementation would compare timestamps of all kills in the round
    if (playerStats.kills.length > 0) {
      firstKills++;
    }
  }

  // Update stats
  seasonPerformance.stats.firstKills += firstKills;
}

function processAces(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Count aces (5 or more kills in a single round)
  let aces = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    // Check if player got 5 or more kills in this round
    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }

  // Update stats
  seasonPerformance.stats.aces += aces;
}

function processAgentMapStats(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  matchWon: boolean
) {
  const mapId = match.matchInfo.mapId;

  // Find existing map stat or create new one
  let mapStat = seasonPerformance.mapStats.find(
    stat => stat.id === mapId
  );

  if (!mapStat) {
    // Create new map stat with empty values
    mapStat = {
      id: mapId,
      name: "",
      location: "",
      image: "",
      wins: 0,
      losses: 0
    };
    seasonPerformance.mapStats.push(mapStat);
  }

  // Update wins/losses
  if (matchWon) {
    mapStat.wins += 1;
  } else {
    mapStat.losses += 1;
  }
}

function processAttackDefenseStats(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Find the player and their team
  const player = match.players.find(p => p.puuid === puuid);
  if (!player) return;

  const playerTeam = match.teams.find(team => team.teamId === player.teamId);
  if (!playerTeam) return;

  // Process each round
  match.roundResults.forEach((round) => {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) return;

    // Determine if player is on attack or defense using the proper logic
    // In Valorant: First 12 rounds, Red team is attacker; after that, Blue team is attacker
    const isAttackRound =
      (round.roundNum < 12 && playerTeam.teamId === 'Red') ||
      (round.roundNum >= 12 && playerTeam.teamId === 'Blue');

    const sideStats = isAttackRound ? seasonPerformance.attackStats : seasonPerformance.defenseStats;

    // Count kills, deaths
    sideStats.kills += playerStats.kills.length;

    // Count deaths (check if player is a victim in anyone's kills)
    const died = round.playerStats.some(stat =>
      stat.kills.some(kill => kill.victim === puuid)
    );
    if (died) sideStats.deaths += 1;

    // Update rounds won/lost
    if (round.winningTeam === player.teamId) {
      sideStats.roundsWon += 1;
    } else {
      sideStats.roundsLost += 1;
    }

    // Update clutch stats if this was a clutch situation
    // This would require more detailed round data to accurately determine
    // TODO: Implement clutch stats
  });
}

function processClutchStats(
  seasonPerformance: AgentSeasonPerformance,
  match: MatchDetails,
  puuid: string
) {
  // Find the player's team
  const player = match.players.find(p => p.puuid === puuid);
  if (!player) return;

  const playerTeamId = player.teamId;

  // Process each round for clutch situations
  for (const round of match.roundResults) {
    // Skip if the player's team didn't win the round
    if (round.winningTeam !== playerTeamId) continue;

    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    // Get all players from both teams in this round
    const teammateStats = round.playerStats.filter(
      stat => match.players.find(p => p.puuid === stat.puuid)?.teamId === playerTeamId && stat.puuid !== puuid
    );

    const enemyStats = round.playerStats.filter(
      stat => match.players.find(p => p.puuid === stat.puuid)?.teamId !== playerTeamId
    );

    // Check if all teammates are dead (had deaths in this round)
    const allTeammatesDead = teammateStats.every(teammate =>
      round.playerStats.some(enemy =>
        enemy.kills.some(kill => kill.victim === teammate.puuid)
      )
    );

    // If all teammates are dead and the player's team won, it's a clutch
    if (allTeammatesDead && round.winningTeam === playerTeamId) {
      // Count how many enemies the player had to face in the clutch
      // This is a simplification - ideally we'd know the exact state when the clutch began
      let enemiesAliveInClutch = 0;

      // Count enemies that weren't killed by teammates
      for (const enemy of enemyStats) {
        const killedByTeammates = teammateStats.some(teammate =>
          teammate.kills.some(kill => kill.victim === enemy.puuid)
        );

        if (!killedByTeammates) {
          enemiesAliveInClutch++;
        }
      }

      // Track the clutch based on how many enemies were faced
      const clutchStats =
        round.playerStats.find(stat => stat.puuid === puuid)?.kills.length ?? -1 > 0
          ? seasonPerformance.attackStats.clutchStats
          : seasonPerformance.defenseStats.clutchStats;

      if (enemiesAliveInClutch === 1) clutchStats["1v1Wins"]++;
      else if (enemiesAliveInClutch === 2) clutchStats["1v2Wins"]++;
      else if (enemiesAliveInClutch === 3) clutchStats["1v3Wins"]++;
      else if (enemiesAliveInClutch === 4) clutchStats["1v4Wins"]++;
      else if (enemiesAliveInClutch === 5) clutchStats["1v5Wins"]++;
    }
  }
}

/**
 * Generate match stats from match details
 * @param matchDetails Match details from API
 * @param puuid User PUUID
 * @returns Array of processed match stats
 */
export const generateMatchStats = async (matchDetails: MatchDetails[], puuid: string): Promise<any[]> => {
  if (!Array.isArray(matchDetails) || !puuid) {
    console.error('[BackgroundProcess] Invalid input to generateMatchStats:', { matchDetailsLength: matchDetails?.length, puuid });
    return [];
  }

  const matchStats = [];

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

      // Find enemy team
      const enemyTeam = match.teams.find(team => team?.teamId !== player.teamId);
      if (!enemyTeam) {
        console.warn(`Enemy team not found in match ${match.matchInfo.matchId}`);
        continue;
      }

      // Get opponent players (enemy team)
      const enemyPlayers = match.players.filter(p => p.teamId !== player.teamId);

      // Generate team stats
      const teamStats = generateTeamStats(match, player, playerTeam, enemyTeam);

      // Generate player vs player stats
      const playerVsPlayerStat = generatePlayerVsPlayerStats(match, player, enemyPlayers, puuid);

      // Generate round performance data
      const roundPerformance = generateRoundPerformance(match, player);

      // Create general info with only IDs (for later enrichment)
      const generalInfo = {
        matchId: match.matchInfo.matchId,
        mapId: match.matchInfo.mapId,
        seasonId: match.matchInfo.seasonId,
        queueId: match.matchInfo.queueId,
        gameStartMillis: match.matchInfo.gameStartMillis,
        gameLengthMillis: match.matchInfo.gameLengthMillis,
        isRanked: match.matchInfo.isRanked,
        winningTeam: playerTeam.won ? player.teamId : enemyTeam.teamId,
        roundsPlayed: match.teams.reduce((sum, team) => sum + team.roundsPlayed, 0) / 2, // Divide by 2 since both teams play the same rounds
        agent: {
          id: player.characterId
        },
        map: {
          id: match.matchInfo.mapId
        },
        season: {
          id: match.matchInfo.seasonId
        }
      };

      // Build full match stat object
      const matchStat = {
        id: `${puuid}_${match.matchInfo.matchId}`,
        puuid,
        stats: {
          general: generalInfo,
          playerVsplayerStat: playerVsPlayerStat,
          teamStats: teamStats,
          roundPerformace: roundPerformance
        }
      };

      matchStats.push(matchStat);
    } catch (error) {
      console.error(`Error processing match ${match?.matchInfo?.matchId}:`, error);
      // Continue to next match instead of failing the whole process
    }
  }

  return matchStats;
};

/**
 * Generate team statistics
 */
function generateTeamStats(match: MatchDetails, player: any, playerTeam: any, enemyTeam: any): TeamStat[] {
  // Initialize team stats for player's team and enemy team
  const yourTeamStat: TeamStat = {
    team: "Your Team",
    teamId: playerTeam.teamId,
    firstKills: 0,
    thrifties: 0,
    postPlantsWon: 0,
    postPlantsLost: 0,
    clutchesWon: 0
  };

  const enemyTeamStat: TeamStat = {
    team: "Enemy Team",
    teamId: enemyTeam.teamId,
    firstKills: 0,
    thrifties: 0,
    postPlantsWon: 0,
    postPlantsLost: 0,
    clutchesWon: 0
  };

  // Process rounds to populate team stats
  for (const round of match.roundResults) {
    // Count first kills
    const firstKill = getFirstKillInRound(round);
    if (firstKill) {
      const killerTeam = match.players.find(p => p.puuid === firstKill.killer)?.teamId;
      if (killerTeam === playerTeam.teamId) {
        yourTeamStat.firstKills++;
      } else {
        enemyTeamStat.firstKills++;
      }
    }

    // Process thrifties (winning a round with significantly lower economy)
    const yourTeamEconomy = calculateTeamEconomy(match, round, playerTeam.teamId);
    const enemyTeamEconomy = calculateTeamEconomy(match, round, enemyTeam.teamId);
    const economyThreshold = 0.6; // 60% threshold for thrifty

    if (round.winningTeam === playerTeam.teamId && yourTeamEconomy < enemyTeamEconomy * economyThreshold) {
      yourTeamStat.thrifties++;
    } else if (round.winningTeam === enemyTeam.teamId && enemyTeamEconomy < yourTeamEconomy * economyThreshold) {
      enemyTeamStat.thrifties++;
    }

    // Process post-plants (if bomb was planted)
    if (round.bombPlanter) {
      const planterTeam = match.players.find(p => p.puuid === round.bombPlanter)?.teamId;

      if (planterTeam === playerTeam.teamId) {
        if (round.winningTeam === playerTeam.teamId) {
          yourTeamStat.postPlantsWon++;
        } else {
          yourTeamStat.postPlantsLost++;
        }
      } else if (planterTeam === enemyTeam.teamId) {
        if (round.winningTeam === enemyTeam.teamId) {
          enemyTeamStat.postPlantsWon++;
        } else {
          enemyTeamStat.postPlantsLost++;
        }
      }
    }

    // Process clutches (last player alive winning the round)
    const yourTeamClutch = detectClutch(match, round, playerTeam.teamId);
    const enemyTeamClutch = detectClutch(match, round, enemyTeam.teamId);

    if (yourTeamClutch && round.winningTeam === playerTeam.teamId) {
      yourTeamStat.clutchesWon++;
    }

    if (enemyTeamClutch && round.winningTeam === enemyTeam.teamId) {
      enemyTeamStat.clutchesWon++;
    }
  }

  return [yourTeamStat, enemyTeamStat];
}

/**
 * Generate player vs player statistics
 */
function generatePlayerVsPlayerStats(match: MatchDetails, player: any, enemies: any[], puuid: string): PlayerVsPlayerStat {
  // Create user player object
  const userPlayer: any = {
    id: player.puuid,
    teamId: player.teamId,
    name: `${player.gameName}#${player.tagLine}`,
    stats: {
      name: `${player.gameName}#${player.tagLine}`,
      kills: player.stats.kills,
      deaths: player.stats.deaths,
      assists: player.stats.assists || 0,
      firstBloods: 0,
      clutchesWon: 0,
      clutchAttempts: 0,
      headshotPercentage: calculateHeadshotPercentage(match, player.puuid),
      damagePerRound: calculateDamagePerRound(match, player.puuid),
      kdRatio: player.stats.kills / Math.max(1, player.stats.deaths),
      aces: countAces(match, player.puuid),
      playtimeMillis: match.matchInfo.gameLengthMillis,
      roundsPlayed: player.stats.roundsPlayed,
      roundsWon: match.teams.find(team => team.teamId === player.teamId)?.roundsWon || 0,
      roundsLost: (player.stats.roundsPlayed || 0) - (match.teams.find(team => team.teamId === player.teamId)?.roundsWon || 0)
    }
  };

  // Create enemy player objects
  const enemyPlayers: any[] = enemies.map(enemy => ({
    id: enemy.puuid,
    teamId: enemy.teamId,
    name: `${enemy.gameName}#${enemy.tagLine}`,
    stats: {
      name: `${enemy.gameName}#${enemy.tagLine}`,
      kills: enemy.stats.kills,
      deaths: enemy.stats.deaths,
      assists: enemy.stats.assists || 0,
      firstBloods: 0,
      clutchesWon: 0,
      clutchAttempts: 0,
      headshotPercentage: calculateHeadshotPercentage(match, enemy.puuid),
      damagePerRound: calculateDamagePerRound(match, enemy.puuid),
      kdRatio: enemy.stats.kills / Math.max(1, enemy.stats.deaths),
      aces: countAces(match, enemy.puuid),
      playtimeMillis: match.matchInfo.gameLengthMillis,
      roundsPlayed: enemy.stats.roundsPlayed,
      roundsWon: match.teams.find(team => team.teamId === enemy.teamId)?.roundsWon || 0,
      roundsLost: (enemy.stats.roundsPlayed || 0) - (match.teams.find(team => team.teamId === enemy.teamId)?.roundsWon || 0)
    }
  }));

  // Generate kill events
  const killEvents: KillEvent[] = extractKillEvents(match, player.puuid);

  // Generate clutch events
  const clutchEvents: ClutchEvent[] = extractClutchEvents(match, player.puuid);

  // Generate map data for heat maps
  const mapData = generateMapData(match, player.puuid);

  // Get map coordinates from the match
  // This is a placeholder - you would need to fetch the actual coordinates
  const mapCoordinates = {
    xMultiplier: 1,
    yMultiplier: 1,
    xScalarToAdd: 0,
    yScalarToAdd: 0
  };

  // Update first bloods and clutch stats for user and enemies
  updateFirstBloodsAndClutches(userPlayer, enemyPlayers, killEvents, clutchEvents);

  return {
    user: userPlayer,
    enemies: enemyPlayers,
    killEvents,
    clutchEvents,
    mapData,
    mapCoordinates
  };
}

/**
 * Generate round performance data
 */
function generateRoundPerformance(match: MatchDetails, player: any): RoundPerformance[] {
  const roundPerformances: RoundPerformance[] = [];

  // Process each round
  for (let i = 0; i < match.roundResults.length; i++) {
    const round = match.roundResults[i];
    const playerStats = round.playerStats.find(stats => stats.puuid === player.puuid);

    if (!playerStats) continue;

    const playerTeam = player.teamId;
    const outcome = round.winningTeam === playerTeam ? "Won" : "Lost";

    // Calculate combat stats
    const combatStats: CombatStats = {
      kills: playerStats.kills.length,
      deaths: wasPlayerKilled(round, player.puuid),
      assists: countAssists(round, player.puuid),
      damageDealt: calculateDamageDealt(playerStats),
      headshotPercentage: calculateHeadshotPercentageForRound(playerStats),
      tradedKill: wasPlayerTradedKill(round, player.puuid),
      tradeKill: didPlayerTradeKill(round, player.puuid)
    };

    // Build economy stats
    const economyStats: EconomyStats = {
      weaponType: playerStats.economy.weapon || "",
      armorType: playerStats.economy.armor || "",
      creditSpent: playerStats.economy.spent || 0,
      loadoutValue: playerStats.economy.loadoutValue || 0,
      enemyLoadoutValue: calculateAverageEnemyLoadout(match, round, player.teamId)
    };

    // Positioning is more abstract and requires more detailed data
    // This is a simplification
    const positioningStats: PositioningStats = {
      site: determineSite(round, player.puuid),
      positionType: determinePositionType(round, player.puuid),
      firstContact: wasFirstContact(round, player.puuid),
      timeToFirstContact: calculateTimeToFirstContact(round, player.puuid)
    };

    // Utility stats
    const utilityStats: UtilityStats = {
      abilitiesUsed: countAbilitiesUsed(playerStats),
      totalAbilities: 4, // Typical number of abilities in Valorant
      utilityDamage: calculateUtilityDamage(playerStats)
    };

    // Generate improvement suggestions
    const improvement = generateImprovementSuggestions(
      combatStats,
      economyStats,
      positioningStats,
      utilityStats,
      outcome
    );

    // Calculate impact score (simplified approach)
    const impactScore = calculateImpactScore(
      combatStats,
      economyStats,
      positioningStats,
      utilityStats,
      outcome,
      round.winningTeam === playerTeam
    );

    roundPerformances.push({
      roundNumber: i + 1,
      outcome,
      impactScore,
      combat: combatStats,
      economy: economyStats,
      positioning: positioningStats,
      utility: utilityStats,
      improvement
    });
  }

  return roundPerformances;
}

// Helper functions for match stat generation
function getFirstKillInRound(round: any): any | null {
  let firstKill: any | null = null;
  let earliestTime = Infinity;

  for (const playerStat of round.playerStats) {
    for (const kill of playerStat.kills) {
      if (kill.timeSinceRoundStartMillis < earliestTime) {
        earliestTime = kill.timeSinceRoundStartMillis;
        firstKill = {
          ...kill,
          killer: playerStat.puuid
        };
      }
    }
  }

  return firstKill;
}

function calculateTeamEconomy(match: MatchDetails, round: any, teamId: string): number {
  let totalEconomy = 0;
  let playerCount = 0;

  for (const playerStat of round.playerStats) {
    const player = match.players.find(p => p.puuid === playerStat.puuid);
    if (player && player.teamId === teamId) {
      totalEconomy += playerStat.economy.loadoutValue || 0;
      playerCount++;
    }
  }

  return playerCount > 0 ? totalEconomy / playerCount : 0;
}

function detectClutch(match: MatchDetails, round: any, teamId: string): boolean {
  // This is a simplification. A proper clutch detection would need more detailed data
  // about when players died during the round
  const teamPlayers = match.players.filter(p => p.teamId === teamId);
  const aliveTeamPlayers = new Set(teamPlayers.map(p => p.puuid));

  // Count deaths from this team in the round
  for (const playerStat of round.playerStats) {
    for (const kill of playerStat.kills) {
      const victim = kill.victim;
      if (teamPlayers.some(p => p.puuid === victim)) {
        aliveTeamPlayers.delete(victim);
      }
    }
  }

  // If only one player remained alive and the team won, it's a clutch
  return aliveTeamPlayers.size === 1 && round.winningTeam === teamId;
}

function calculateHeadshotPercentage(match: MatchDetails, puuid: string): number {
  let totalShots = 0;
  let headshots = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    for (const damage of playerStats.damage) {
      totalShots += damage.legshots + damage.bodyshots + damage.headshots;
      headshots += damage.headshots;
    }
  }

  return totalShots > 0 ? (headshots / totalShots) * 100 : 0;
}

function calculateDamagePerRound(match: MatchDetails, puuid: string): number {
  let totalDamage = 0;
  let roundsPlayed = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    let roundDamage = 0;
    for (const damage of playerStats.damage) {
      roundDamage += damage.damage;
    }

    totalDamage += roundDamage;
    roundsPlayed++;
  }

  return roundsPlayed > 0 ? totalDamage / roundsPlayed : 0;
}

function countAces(match: MatchDetails, puuid: string): number {
  let aces = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find(stat => stat.puuid === puuid);
    if (!playerStats) continue;

    // An ace is 5 kills in a round
    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }

  return aces;
}

function extractKillEvents(match: MatchDetails, puuid: string): KillEvent[] {
  const killEvents: KillEvent[] = [];

  for (let roundIndex = 0; roundIndex < match.roundResults.length; roundIndex++) {
    const round = match.roundResults[roundIndex];

    for (const playerStat of round.playerStats) {
      for (const kill of playerStat.kills) {
        // Include kills where player is killer or victim
        if (playerStat.puuid === puuid || kill.victim === puuid) {
          // Find killer player object to get name
          const killerPlayer = match.players.find(p => p.puuid === playerStat.puuid);
          // Find victim player object to get name
          const victimPlayer = match.players.find(p => p.puuid === kill.victim);

          // Create killer and victim names with tag format
          const killerName = killerPlayer ? `${killerPlayer.gameName}#${killerPlayer.tagLine}` : playerStat.puuid;
          const victimName = victimPlayer ? `${victimPlayer.gameName}#${victimPlayer.tagLine}` : kill.victim;

          killEvents.push({
            killer: killerName,
            victim: victimName,
            weapon: kill.finishingDamage.damageItem,
            headshot: kill.finishingDamage.damageType.toLowerCase().includes('head'),
            timestamp: new Date(match.matchInfo.gameStartMillis + kill.timeSinceRoundStartMillis).toISOString(),
            round: roundIndex + 1
          });
        }
      }
    }
  }

  return killEvents;
}

function extractClutchEvents(match: MatchDetails, puuid: string): ClutchEvent[] {
  const clutchEvents: ClutchEvent[] = [];

  // Process each round
  for (let roundIndex = 0; roundIndex < match.roundResults.length; roundIndex++) {
    const round = match.roundResults[roundIndex];

    // First check if our player had a clutch situation
    const playerClutch = detectClutchSituationForPlayer(match, round, puuid);
    if (playerClutch) {
      const player = match.players.find(p => p.puuid === puuid);
      if (player) {
        const playerName = `${player.gameName}#${player.tagLine}`;
        clutchEvents.push({
          player: playerName,
          situation: playerClutch.situation,
          round: roundIndex + 1,
          won: playerClutch.won
        });
      }
    }

    // Then check if any enemy players had a clutch situation
    const enemyPlayers = match.players.filter(p => p.puuid !== puuid);
    for (const enemy of enemyPlayers) {
      const enemyClutch = detectClutchSituationForPlayer(match, round, enemy.puuid);
      if (enemyClutch) {
        const enemyName = `${enemy.gameName}#${enemy.tagLine}`;
        clutchEvents.push({
          player: enemyName,
          situation: enemyClutch.situation,
          round: roundIndex + 1,
          won: enemyClutch.won
        });
      }
    }
  }

  return clutchEvents;
}

function detectClutchSituationForPlayer(match: MatchDetails, round: any, puuid: string): { situation: string, won: boolean } | null {
  // Find the player and their team
  const player = match.players.find(p => p.puuid === puuid);
  if (!player) return null;

  const playerTeamId = player.teamId;

  // Get the teammates and enemies
  const teammates = match.players.filter(p => p.teamId === playerTeamId && p.puuid !== puuid);
  const enemies = match.players.filter(p => p.teamId !== playerTeamId);

  // Skip if not enough data
  if (teammates.length === 0 || enemies.length === 0) return null;

  // Check if the player is alive at the end of the round
  const playerDied = round.playerStats.some(stat =>
    stat.kills.some(kill => kill.victim === puuid)
  );

  if (playerDied) return null; // Player died, no clutch possible

  // Check if all teammates are dead
  const allTeammatesDead = teammates.every(teammate =>
    round.playerStats.some(stat =>
      stat.kills.some(kill => kill.victim === teammate.puuid)
    )
  );

  // A clutch situation exists if player is the only one alive on their team
  if (allTeammatesDead) {
    // Count how many enemies were alive when the clutch began
    // We'll simplify by counting enemies still alive at the end of the round
    const aliveEnemies = new Set(enemies.map(e => e.puuid));

    // Remove enemies who died during the round
    for (const playerStat of round.playerStats) {
      for (const kill of playerStat.kills) {
        aliveEnemies.delete(kill.victim);
      }
    }

    // We have a clutch situation if there was at least one enemy alive
    const enemyCount = aliveEnemies.size;
    if (enemyCount >= 1) {
      // Did the player win the clutch?
      const won = round.winningTeam === playerTeamId;

      // Return the situation (1v1, 1v2, etc.) and whether it was won
      return {
        situation: `1v${enemyCount}`,
        won
      };
    }
  }

  return null;
}

function generateMapData(match: MatchDetails, puuid: string): MapData {
  const kills: { [playerPuuid: string]: Coordinate[] } = {};
  const deaths: { [playerPuuid: string]: Coordinate[] } = {};

  // Initialize data structures for all players in the match with puuids as keys
  for (const player of match.players) {
    // Initialize empty arrays for each player using puuid
    kills[player.puuid] = [];
    deaths[player.puuid] = [];
  }

  // Process each round
  for (const round of match.roundResults) {
    // Process kills for all players
    for (const playerStat of round.playerStats) {
      const killerPuuid = playerStat.puuid;

      // Process each kill
      for (const kill of playerStat.kills) {
        const victimPuuid = kill.victim;

        // Record the death location (where the victim was)
        if (kill.victimLocation) {
          deaths[victimPuuid].push({
            x: kill.victimLocation.x,
            y: kill.victimLocation.y
          });
        }

        // Find killer's location from playerLocations
        if (kill.playerLocations) {
          const killerLocationData = kill.playerLocations.find(loc => loc.puuid === killerPuuid);

          if (killerLocationData && killerLocationData.location) {
            // Record the killer's location (where they were when they got the kill)

            kills[killerPuuid].push({
              x: killerLocationData.location.x,
              y: killerLocationData.location.y
            });
          } else {
            // If killer location not found in playerLocations, try approximating from other data
            // This is a fallback in case the expected data isn't available
            const anyLocation = kill.playerLocations[0]?.location;
            if (anyLocation) {
              // Use an approximation - not ideal but better than nothing
              kills[killerPuuid].push({
                x: anyLocation.x,
                y: anyLocation.y
              });
            }
          }
        }
      }
    }
  }

  return { kills, deaths };
}

function updateFirstBloodsAndClutches(userPlayer: any, enemyPlayers: any[], killEvents: KillEvent[], clutchEvents: ClutchEvent[]): void {
  // Count first bloods (first kills of each round)
  const roundFirstKills = new Map<number, string>();

  for (const kill of killEvents) {
    if (!roundFirstKills.has(kill.round)) {
      roundFirstKills.set(kill.round, kill.killer);

      // Update first blood count for the player who got it
      if (kill.killer === userPlayer.stats.name) { // Use name instead of ID
        userPlayer.stats.firstBloods++;
      } else {
        const enemyPlayer = enemyPlayers.find(e => e.stats.name === kill.killer);
        if (enemyPlayer) {
          enemyPlayer.stats.firstBloods++;
        }
      }
    }
  }

  // Update clutch stats - track both attempts and successful clutches
  for (const clutch of clutchEvents) {
    // Check if this clutch is for the user
    if (clutch.player === userPlayer.stats.name) {
      userPlayer.stats.clutchAttempts++;
      if (clutch.won) {
        userPlayer.stats.clutchesWon++;
      }
    } else {
      // Check if this clutch is for an enemy player
      const enemyPlayer = enemyPlayers.find(e => e.stats.name === clutch.player);
      if (enemyPlayer) {
        enemyPlayer.stats.clutchAttempts++;
        if (clutch.won) {
          enemyPlayer.stats.clutchesWon++;
        }
      }
    }
  }
}

// Helper functions for generateRoundPerformance

function wasPlayerKilled(round: any, puuid: string): number {
  // Check if any kill in the round has this player as victim
  return round.playerStats.some((stat:any) =>
    stat.kills.some((kill:any) => kill.victim === puuid)
  ) ? 1 : 0;
}

function countAssists(round: any, puuid: string): number {
  // This is a simplification - assist data might not be directly available
  // A more accurate implementation would need detailed assist data
  return 0;
}

function calculateDamageDealt(playerStats: any): number {
  return playerStats.damage.reduce((total:any, damage:any) => total + damage.damage, 0);
}

function calculateHeadshotPercentageForRound(playerStats: any): number {
  let totalShots = 0;
  let headshots = 0;

  for (const damage of playerStats.damage) {
    totalShots += damage.legshots + damage.bodyshots + damage.headshots;
    headshots += damage.headshots;
  }

  return totalShots > 0 ? (headshots / totalShots) * 100 : 0;
}

function wasPlayerTradedKill(round: any, puuid: string): boolean {
  // Check if player was killed and then their killer was killed shortly after
  // This is a simplification - proper trade kill detection would need timestamps
  const playerDeath = round.playerStats
    .flatMap((stat:any) => stat.kills)
    .find((kill:any) => kill.victim === puuid);

  if (!playerDeath) return false;

  const killerPuuid = round.playerStats.find((stat:any) =>
    stat.kills.some((kill:any) => kill.victim === puuid)
  )?.puuid;

  if (!killerPuuid) return false;

  // Check if killer was killed in this round
  return round.playerStats.some((stat:any) =>
    stat.kills.some((kill:any) => kill.victim === killerPuuid)
  );
}

function didPlayerTradeKill(round: any, puuid: string): boolean {
  // Check if player killed someone shortly after a teammate died
  // This is a simplification - proper trade kill detection would need timestamps
  const playerKills = round.playerStats.find((stat:any) => stat.puuid === puuid)?.kills || [];

  if (playerKills.length === 0) return false;

  // This is a very rough approximation without timestamps
  // In a real implementation, you'd check if the kill happened within ~5 seconds of a teammate's death
  return true;
}

function calculateAverageEnemyLoadout(match: MatchDetails, round: any, playerTeamId: string): number {
  let totalEconomy = 0;
  let playerCount = 0;

  for (const playerStat of round.playerStats) {
    const player = match.players.find(p => p.puuid === playerStat.puuid);
    if (player && player.teamId !== playerTeamId) {
      totalEconomy += playerStat.economy.loadoutValue || 0;
      playerCount++;
    }
  }

  return playerCount > 0 ? totalEconomy / playerCount : 0;
}

function determineSite(round: any, puuid: string): string {
  // This is a simplification - in a real implementation, you'd use player position data
  // and map data to determine which site they were playing
  return "Unknown";
}

function determinePositionType(round: any, puuid: string): string {
  // This is a simplification - in a real implementation, you'd analyze player positions
  // and movement patterns to determine aggressive/passive/etc.
  return "Balanced";
}

function wasFirstContact(round: any, puuid: string): boolean {
  // Check if player was involved in the first kill of the round
  const firstKill = getFirstKillInRound(round);
  return firstKill ? (firstKill.killer === puuid || firstKill.victim === puuid) : false;
}

function calculateTimeToFirstContact(round: any, puuid: string): number {
  // Find the earliest kill involving this player
  let earliestTime = Infinity;

  for (const playerStat of round.playerStats) {
    for (const kill of playerStat.kills) {
      if (playerStat.puuid === puuid || kill.victim === puuid) {
        if (kill.timeSinceRoundStartMillis < earliestTime) {
          earliestTime = kill.timeSinceRoundStartMillis;
        }
      }
    }
  }

  return earliestTime === Infinity ? 0 : earliestTime;
}

function countAbilitiesUsed(playerStats: any): number {
  // This is a simplification - in a real implementation, you'd count actual ability uses
  return 0;
}

function calculateUtilityDamage(playerStats: any): number {
  // This is a simplification - in a real implementation, you'd sum damage done by abilities
  return 0;
}

function generateImprovementSuggestions(
  combatStats: CombatStats,
  economyStats: EconomyStats,
  positioningStats: PositioningStats,
  utilityStats: UtilityStats,
  outcome: string
): string[] {
  const suggestions: string[] = [];

  // This is a simplified approach - in a real implementation, you'd have more
  // complex logic to generate meaningful suggestions based on the player's performance

  // Combat suggestions
  if (combatStats.kills === 0 && combatStats.deaths > 0) {
    suggestions.push("Work on crosshair placement and positioning to secure kills");
  }

  if (combatStats.headshotPercentage < 15) {
    suggestions.push("Practice aim to improve headshot accuracy");
  }

  // Economy suggestions
  if (economyStats.loadoutValue < economyStats.enemyLoadoutValue * 0.7) {
    suggestions.push("Improve economy management to match enemy loadout values");
  }

  // Positioning suggestions
  if (positioningStats.firstContact && combatStats.deaths > 0) {
    suggestions.push("Consider playing more passively when taking first contact");
  }

  // Utility suggestions
  if (utilityStats.abilitiesUsed / utilityStats.totalAbilities < 0.5) {
    suggestions.push("Use abilities more effectively to support your team");
  }

  return suggestions;
}

function calculateImpactScore(
  combatStats: CombatStats,
  economyStats: EconomyStats,
  positioningStats: PositioningStats,
  utilityStats: UtilityStats,
  outcome: string,
  roundWon: boolean
): number {
  // This is a simplified approach - in a real implementation, you'd have a more
  // sophisticated algorithm to calculate player impact

  let score = 0;

  // Base score from KDA
  score += combatStats.kills * 2;
  score += combatStats.assists * 1;
  score -= combatStats.deaths * 1.5;

  // Bonus for efficient trading
  if (combatStats.tradeKill) score += 1;
  if (!combatStats.tradedKill && combatStats.deaths > 0) score -= 1;

  // Bonus for headshots
  score += (combatStats.headshotPercentage / 100) * 2;

  // Economy impact
  const economyEfficiency = combatStats.damageDealt / Math.max(1, economyStats.loadoutValue);
  score += economyEfficiency * 0.01;

  // Positioning impact
  if (positioningStats.firstContact && !combatStats.deaths) score += 2;

  // Utility impact
  score += (utilityStats.utilityDamage / 100) * 0.5;
  score += (utilityStats.abilitiesUsed / utilityStats.totalAbilities) * 2;

  // Outcome bonus
  if (roundWon) score *= 1.2;

  return Math.max(0, Math.round(score));
}


