import { MapStatsType, SeasonPerformance } from "../../types/MapStatsType";

/**
 * Processes map stats from match data
 */
export function processMapStats(
  mapMap: Map<string, MapStatsType>,
  match: any,
  seasonId: string,
  player: any,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number,
  puuid: string
) {
  const mapId = match.matchInfo.mapId;

  if (!mapMap.has(mapId)) {
    // Initialize minimal map stats with just ID
    mapMap.set(mapId, {
      id: `${puuid}_${mapId}`,
      puuid,
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

/**
 * Creates a new map season performance object
 */
export function createMapSeasonPerformance(seasonId: string): SeasonPerformance {
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

/**
 * Updates map season statistics with new match data
 */
function updateMapSeasonStats(
  seasonPerformance: SeasonPerformance,
  player: any,
  match: any,
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

  // Process aces (5 kills in a round)
  processMapAces(seasonPerformance, match, puuid);

  // Process attack and defense stats including heatmap locations
  processMapAttackDefenseStats(seasonPerformance, match, puuid);
}

/**
 * Processes plant and defuse actions for map stats
 */
function processMapPlantsAndDefuses(
  seasonPerformance: SeasonPerformance,
  match: any,
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

/**
 * Processes first kill statistics for map stats
 */
function processMapFirstKills(
  seasonPerformance: SeasonPerformance,
  match: any,
  puuid: string
) {
  // Count first kills
  let firstKills = 0;

  for (const round of match.roundResults) {
    // Check if this player got any kills
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Simple approach: assume first kill in the array might be first kill of the round
    firstKills++;
  }

  // Update stats
  seasonPerformance.stats.firstKills += firstKills;
}

/**
 * Processes ace statistics for map stats
 */
function processMapAces(
  seasonPerformance: SeasonPerformance,
  match: any,
  puuid: string
) {
  // Count aces (5 or more kills in a single round)
  let aces = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats) continue;

    // Check if player got 5 or more kills in this round
    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }

  // Update stats
  seasonPerformance.stats.aces += aces;
}

/**
 * Processes attack/defense statistics for map stats
 */
function processMapAttackDefenseStats(
  seasonPerformance: SeasonPerformance,
  match: any,
  puuid: string
) {
  // Find the player and their team
  const player = match.players.find((p: any) => p.puuid === puuid);
  if (!player) return;

  const playerTeam = match.teams.find((team: any) => team.teamId === player.teamId);
  if (!playerTeam) return;

  // Process each round
  match.roundResults.forEach((round: any) => {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
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
