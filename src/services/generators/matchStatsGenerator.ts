import { supabase } from "../../lib/supabase";
import { MatchDetails } from "../../types/MatchDetails";
import { ClutchEvent, CombatStats, Coordinate, EconomyStats, KillEvent, MapData, PositioningStats, RoundPerformance, TeamStat, UtilityStats } from "../../types/MatchStatType";

// Global cache for map callouts to avoid repeated database calls
const mapsDataCache: { [mapId: string]: any } = {};

/**
 * Generate match stats from match details
 */
export const generateMatchStats = async (matchDetails: any[], puuid: string): Promise<any[]> => {
  if (!Array.isArray(matchDetails) || !puuid) {
    console.error('[BackgroundProcess] Invalid input to generateMatchStats:', { matchDetailsLength: matchDetails?.length, puuid });
    return [];
  }

  const matchStats = [];

  await enrichMapCalloutsData(matchDetails);

  for (const match of matchDetails) {
    try {
      // Skip invalid match data
      if (!match?.matchInfo || !Array.isArray(match.players) || !Array.isArray(match.teams)) {
        console.warn('Skipping invalid match data:', match);
        continue;
      }

      // Find the player in this match
      const player = match.players.find((player: any) => player?.puuid === puuid);
      if (!player) {
        console.warn(`Player ${puuid} not found in match ${match.matchInfo.matchId}`);
        continue;
      }

      // Find player's team
      const playerTeam = match.teams.find((team: any) => team?.teamId === player.teamId);
      if (!playerTeam) {
        console.warn(`Player's team ${player.teamId} not found in match ${match.matchInfo.matchId}`);
        continue;
      }

      // Find enemy team
      const enemyTeam = match.teams.find((team: any) => team?.teamId !== player.teamId);
      if (!enemyTeam) {
        console.warn(`Enemy team not found in match ${match.matchInfo.matchId}`);
        continue;
      }



      // Get opponent players (enemy team)
      const enemyPlayers = match.players.filter((p: any) => p.teamId !== player.teamId);

      // Generate team stats
      const teamStats = generateTeamStats(match, player, playerTeam, enemyTeam);

      // Generate player vs player stats
      const playerVsPlayerStat = generatePlayerVsPlayerStats(match, player, enemyPlayers, puuid);

      // Generate round performance data (now async)
      const roundPerformance = await generateRoundPerformance(match, player);

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
        roundsPlayed: match.teams.reduce((sum: number, team: any) => sum + team.roundsPlayed, 0) / 2, // Divide by 2 since both teams play the same rounds
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
        matchDetails: match, // Store reference to original match object
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




  // // Now that we have the enriched data, generate detailed stats
  // for (const matchStat of matchStats) {
  //   try {
  //     const match = matchStat.matchDetails;
  //     if (!match) continue;

  //     const player = match.players.find((p: any) => p.puuid === puuid);
  //     if (!player) continue;

  //     const playerTeam = match.teams.find((t: any) => t.teamId === player.teamId);
  //     const enemyTeam = match.teams.find((t: any) => t.teamId !== player.teamId);
  //     const enemyPlayers = match.players.filter((p: any) => p.teamId !== player.teamId);

  //     // Generate stats using enriched match object that now has mapCallouts
  //     matchStat.stats.teamStats = generateTeamStats(match, player, playerTeam, enemyTeam);
  //     matchStat.stats.playerVsplayerStat = generatePlayerVsPlayerStats(match, player, enemyPlayers, puuid);
  //     matchStat.stats.roundPerformace = await generateRoundPerformance(match, player);
  //   } catch (error) {
  //     console.error(`Error generating detailed stats for match ${matchStat.id}:`, error);
  //   }
  // }

  // Enrich match stats with weapon and armor details
  // This will also populate the global mapsDataCache
  await enrichMatchStatsWithWeaponArmorDetails(matchStats);

  return matchStats;
};

/**
 * Generate team statistics
 */
function generateTeamStats(match: any, player: any, playerTeam: any, enemyTeam: any): TeamStat[] {
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
      const killerTeam = match.players.find((p: any) => p.puuid === firstKill.killer)?.teamId;
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
      const planterTeam = match.players.find((p: any) => p.puuid === round.bombPlanter)?.teamId;

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
function generatePlayerVsPlayerStats(match: any, player: any, enemies: any[], puuid: string): any {
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
      roundsWon: match.teams.find((team: any) => team.teamId === player.teamId)?.roundsWon || 0,
      roundsLost: (player.stats.roundsPlayed || 0) - (match.teams.find((team: any) => team.teamId === player.teamId)?.roundsWon || 0)
    }
  };

  // Create enemy player objects
  const enemyPlayers: any[] = enemies.map((enemy: any) => ({
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
      roundsWon: match.teams.find((team: any) => team.teamId === enemy.teamId)?.roundsWon || 0,
      roundsLost: (enemy.stats.roundsPlayed || 0) - (match.teams.find((team: any) => team.teamId === enemy.teamId)?.roundsWon || 0)
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
//  * Generate round performance data
//  */
async function generateRoundPerformance(match: MatchDetails, player: any): Promise<RoundPerformance[]> {
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

    // Store the weapon and armor IDs for later enrichment
    const weaponId = playerStats.economy.weapon || "";
    const armorId = playerStats.economy.armor || "";

    // Build economy stats
    const economyStats: EconomyStats = {
      weaponId,  // Store ID for later enrichment
      weaponType: weaponId, // Initially set to ID, will be enriched later
      armorId,   // Store ID for later enrichment
      armorType: armorId,  // Initially set to ID, will be enriched later
      creditSpent: playerStats.economy.spent || 0,
      loadoutValue: playerStats.economy.loadoutValue || 0,
      enemyLoadoutValue: calculateAverageEnemyLoadout(match, round, player.teamId)
    };

    // Get player location
    const playerLocation = findPlayerLocationInRound(round, player.puuid);

    // Initialize site and position type
    let site = "Unknown";
    let positionType = "Balanced";

    // If we have a player location, determine site and position type
    if (playerLocation) {
      // Get map ID to access the correct callouts from global cache
      const mapId = match.matchInfo.mapId;

      // We'll determine site and position type locally using the global cache
      const siteInfo = determinePositionInfoLocally(playerLocation, round, player, match, mapId);
      site = siteInfo.site;
      positionType = siteInfo.positionType;
    }

    // Enhanced positioning stats with callout data
    const positioningStats: PositioningStats = {
      site,
      positionType,
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

    // Calculate impact score
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

// Helper functions for match stats generation
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

function calculateTeamEconomy(match: any, round: any, teamId: string): number {
  let totalEconomy = 0;
  let playerCount = 0;

  for (const playerStat of round.playerStats) {
    const player = match.players.find((p: any) => p.puuid === playerStat.puuid);
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

          // Store the weaponId for later enrichment
          const weaponId = kill.finishingDamage.damageItem;

          killEvents.push({
            killer: killerName,
            victim: victimName,
            weaponId, // Store the ID for later enrichment
            weapon: weaponId, // Initially set to ID, will be enriched later
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
  const playerDied = round.playerStats.some((stat:any) =>
    stat.kills.some((kill:any) => kill.victim === puuid)
  );

  if (playerDied) return null; // Player died, no clutch possible

  // Check if all teammates are dead
  const allTeammatesDead = teammates.every(teammate =>
    round.playerStats.some((stat:any) =>
      stat.kills.some((kill:any) => kill.victim === teammate.puuid)
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

// Add a new function to enrich match stats with weapon, armor, and map details
async function enrichMatchStatsWithWeaponArmorDetails(matchStats: any[]): Promise<void> {
  try {
    // Fetch all weapons at once to minimize database calls
    const { data: weaponsData, error: weaponsError } = await supabase
      .from('weapons')
      .select('id, name, type');

    if (weaponsError) {
      console.error('Error fetching weapons data:', weaponsError);
      return;
    }

    // Create a map for quick weapon lookups
    const weaponsMap = new Map();
    if (weaponsData) {
      weaponsData.forEach(weapon => {
        weaponsMap.set(weapon.id, weapon);
      });
    }

    // Fetch all armor types
    const { data: armorData, error: armorError } = await supabase
      .from('weapons')
      .select('id, name, type');

    if (armorError) {
      console.error('Error fetching armor data:', armorError);
      return;
    }

    // Create a map for quick armor lookups
    if (armorData) {
      armorData.forEach(armor => {
        weaponsMap.set(armor.id, armor);
      });
    }

    // Collect all unique map IDs from the match stats
    const mapIds = new Set<string>();
    for (const matchStat of matchStats) {
      if (matchStat.stats?.general?.map?.id) {
        mapIds.add(matchStat.stats.general.map.id);
      }
    }

    // Fetch map data with callouts for all unique map IDs
    if (mapIds.size > 0) {
      const { data: fetchedMapsData, error: mapsError } = await supabase
        .from('maps')
        .select('id, callouts')
        .in('id', Array.from(mapIds));

      if (mapsError) {
        console.error('Error fetching maps data:', mapsError);
      } else if (fetchedMapsData) {
        // Store fetched map data in the global cache
        fetchedMapsData.forEach(map => {
          mapsDataCache[map.id] = map;
        });
      }
    }

    // Process each match stat
    for (const matchStat of matchStats) {
      try {
        // Store the map callouts in the match stats for later use
        const mapId = matchStat.stats?.general?.map?.id;
        if (mapId && mapsDataCache[mapId]) {
          // Add callouts to the map object
          matchStat.stats.general.map.callouts = mapsDataCache[mapId].callouts;

          // IMPORTANT: Also add callouts directly to the match object
          // This allows us to access the callouts during round performance generation
          if (matchStat.matchDetails) {
            matchStat.matchDetails.mapCallouts = mapsDataCache[mapId].callouts;
          }
        }

        // 1. Enrich kill events
        if (matchStat.stats?.playerVsplayerStat?.killEvents) {
          for (const killEvent of matchStat.stats.playerVsplayerStat.killEvents) {
            if (killEvent.weaponId && weaponsMap.has(killEvent.weaponId)) {
              killEvent.weapon = weaponsMap.get(killEvent.weaponId).name;
            }
          }
        }

        // 2. Enrich round performances
        if (matchStat.stats?.roundPerformace) {
          for (const round of matchStat.stats.roundPerformace) {
            if (round.economy) {
              // Enrich weapon name
              if (round.economy.weaponId && weaponsMap.has(round.economy.weaponId)) {
                round.economy.weaponType = weaponsMap.get(round.economy.weaponId).name;
              }

              // Enrich armor name
              if (round.economy.armorId && weaponsMap.has(round.economy.armorId)) {
                round.economy.armorType = weaponsMap.get(round.economy.armorId).name;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error enriching data for match ${matchStat.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in enrichMatchStatsWithWeaponArmorDetails:', error);
  }
}


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
    const player = match.players.find((p: any) => p.puuid === playerStat.puuid);
    if (player && player.teamId !== playerTeamId) {
      totalEconomy += playerStat.economy.loadoutValue || 0;
      playerCount++;
    }
  }

  return playerCount > 0 ? totalEconomy / playerCount : 0;
}

// Combined function to determine both site and position type locally without database calls
function determinePositionInfoLocally(
  playerLocation: {x: number, y: number},
  round: any,
  player: any,
  match: MatchDetails,
  mapId: string
): { site: string, positionType: string } {
  // Default values
  let site = "Unknown";
  let positionType = "Balanced";

  try {
    // Get callouts from global cache using mapId
    const callouts = mapsDataCache[mapId]?.callouts;

    // No callouts available, return defaults
    if (!callouts || !Array.isArray(callouts) || callouts.length === 0) {
      return { site, positionType };
    }

    // Find the closest callout to the player's position
    const closest = findClosestCallout(playerLocation, callouts);
    if (!closest) return { site, positionType };

    // Set the site based on the superRegionName
    site = closest.superRegionName || "Unknown";

    // Determine if player is attacker or defender
    const playerTeam = match.teams.find(team => team.teamId === player.teamId);
    if (!playerTeam) return { site, positionType };

    // Determine if player is attacker or defender
    const isAttacker = (round.roundNum < 12 && playerTeam.teamId === 'Red') ||
                      (round.roundNum >= 12 && playerTeam.teamId === 'Blue');

    // Categorize position type based on region and side
    const { regionName, superRegionName } = closest;

    // Determine position type based on player's role (attacker/defender) and location
    if (isAttacker) {
      if (superRegionName === 'A' || superRegionName === 'B') {
        if (regionName === 'Site') positionType = "Aggressive";
        else if (regionName === 'Main' || regionName === 'Window' || regionName === 'Garden') positionType = "Entry";
      } else if (superRegionName === 'Mid') {
        positionType = "Control";
      } else if (superRegionName === 'Defender Side') {
        positionType = "Lurk";
      }
    } else { // Defender
      if (superRegionName === 'Attacker Side') {
        positionType = "Aggressive";
      } else if (superRegionName === 'Mid') {
        positionType = "Control";
      } else if ((superRegionName === 'A' || superRegionName === 'B') && regionName !== 'Site') {
        positionType = "Forward";
      } else if (regionName === 'Site') {
        positionType = "Anchor";
      }
    }
  } catch (error) {
    console.error("Error determining position info:", error);
  }

  return { site, positionType };
}

function findPlayerLocationInRound(round: any, puuid: string): {x: number, y: number} | null {
  // Try to find location from player locations in kill events
  for (const playerStat of round.playerStats) {
    for (const kill of playerStat.kills) {
      // Check if player is killer or victim
      if (playerStat.puuid === puuid) {
        // Player is the killer
        const killerLocation = kill.playerLocations?.find((loc:any) => loc.puuid === puuid)?.location;
        if (killerLocation) return killerLocation;
      }

      if (kill.victim === puuid) {
        // Player is the victim
        return kill.victimLocation;
      }
    }
  }

  // If we couldn't find a location, return null
  return null;
}

function findClosestCallout(position: {x: number, y: number}, callouts: any[]): any {
  if (!position || !callouts?.length) return null;

  let closestCallout = null;
  let minDistance = Infinity;

  for (const callout of callouts) {
    if (!callout.location) continue;

    const distance = calculateDistance(position, callout.location);
    if (distance < minDistance) {
      minDistance = distance;
      closestCallout = callout;
    }
  }

  return closestCallout;
}

function calculateDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y; // Fixed the typo here: point2.y instead of point2.y
  return Math.sqrt(dx * dx + dy * dy);
}

function generateImprovementSuggestions(
  combatStats: CombatStats,
  economyStats: EconomyStats,
  positioningStats: PositioningStats,
  utilityStats: UtilityStats,
  outcome: string
): string[] {
  const suggestions: string[] = [];

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

  // Position-specific suggestions based on site and position type
  if (positioningStats.positionType === "Entry" && combatStats.deaths > 0 && combatStats.kills === 0) {
    suggestions.push("As an entry player, focus on trading opportunities and use utility before engaging");
  }

  if (positioningStats.positionType === "Aggressive" && combatStats.deaths > 0) {
    suggestions.push("Consider playing more passively or using utility to secure aggressive positions");
  }

  if (positioningStats.positionType === "Anchor" && combatStats.deaths > 0) {
    suggestions.push("Focus on delaying enemies and using utility to hold your position");
  }

  if (positioningStats.positionType === "Lurk" && outcome === "Lost") {
    suggestions.push("Coordinate lurks with team pushes to maximize effectiveness");
  }

  // Site-specific suggestions
  if ((positioningStats.site === "A" || positioningStats.site === "B") && positioningStats.firstContact && combatStats.deaths > 0) {
    suggestions.push(`When holding ${positioningStats.site} site, use defensive angles to survive first contact`);
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
  // Define weight factors for each category (total = 100)
  const weights = {
    combat: 40,      // Combat has highest weight
    economy: 20,     // Economy management
    position: 25,    // Positioning and map control
    utility: 15      // Utility usage
  };

  // Calculate Combat Score (0-100)
  let combatScore = 0;
  // Base kills contribution (up to 50 points)
  combatScore += Math.min(50, combatStats.kills * 25);
  // Reduce score for deaths
  combatScore -= Math.min(combatScore, combatStats.deaths * 15);
  // Add assists contribution
  combatScore += Math.min(20, combatStats.assists * 10);
  // Add headshot bonus
  combatScore += (combatStats.headshotPercentage / 100) * 20;
  // Normalize combat score to 0-100
  combatScore = Math.max(0, Math.min(100, combatScore));

  // Calculate Economy Score (0-100)
  let economyScore = 100;
  // Penalize for having much lower loadout than enemies
  const economyRatio = economyStats.loadoutValue / Math.max(1, economyStats.enemyLoadoutValue);
  economyScore *= Math.min(1, economyRatio + 0.3); // Allow for some disadvantage
  // Bonus for dealing damage relative to loadout value
  const damagePerCredit = combatStats.damageDealt / Math.max(1, economyStats.loadoutValue);
  economyScore += Math.min(30, damagePerCredit * 50);
  // Normalize economy score to 0-100
  economyScore = Math.max(0, Math.min(100, economyScore));

  // Calculate Position Score (0-100)
  let positionScore = 50; // Start at neutral
  // Reward or penalize first contact based on outcome
  if (positioningStats.firstContact) {
    if (combatStats.kills > 0 && combatStats.deaths === 0) {
      positionScore += 30;
    } else if (combatStats.deaths > 0) {
      positionScore -= 20;
    }
  }
  // Adjust based on position type and success
  switch (positioningStats.positionType) {
    case "Entry":
      positionScore += combatStats.kills * 15;
      positionScore -= combatStats.deaths * 10;
      break;
    case "Anchor":
      positionScore += combatStats.kills * 20;
      positionScore -= combatStats.deaths * 15;
      break;
    case "Lurk":
      positionScore += combatStats.kills * 25;
      positionScore -= combatStats.deaths * 10;
      break;
    default:
      positionScore += combatStats.kills * 10;
      positionScore -= combatStats.deaths * 10;
  }
  // Normalize position score to 0-100
  positionScore = Math.max(0, Math.min(100, positionScore));

  // Calculate Utility Score (0-100)
  let utilityScore = 0;
  // Base score from utility usage ratio
  const utilityUsageRatio = utilityStats.abilitiesUsed / Math.max(1, utilityStats.totalAbilities);
  utilityScore += utilityUsageRatio * 60;
  // Add score for utility damage
  utilityScore += Math.min(40, (utilityStats.utilityDamage / 300) * 40); // Assume 300 damage is excellent
  // Normalize utility score to 0-100
  utilityScore = Math.max(0, Math.min(100, utilityScore));

  // Calculate weighted average
  let finalScore = (
    (combatScore * weights.combat) +
    (economyScore * weights.economy) +
    (positionScore * weights.position) +
    (utilityScore * weights.utility)
  ) / 100;

  // Apply round outcome multiplier
  if (roundWon) {
    finalScore *= 1.15; // 15% bonus for winning
  } else if (combatStats.kills >= 2) {
    finalScore *= 1.05; // 5% bonus for good performance in lost round
  }

  // Handle special cases
  if (combatStats.kills >= 3 && combatStats.deaths === 0) {
    // Exceptional performance bonus (still keeping under 100)
    finalScore = Math.min(100, finalScore * 1.2);
  }

  // Ensure final score is between 0 and 100
  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

/**
 * Determines if player was involved in the first contact (first kill) of the round
 */
function wasFirstContact(round: any, puuid: string): boolean {
  // Get the first kill in the round based on time
  const firstKill = getFirstKillInRound(round);

  // Check if player was involved as either killer or victim
  if (!firstKill) return false;

  return firstKill.killer === puuid || firstKill.victim === puuid;
}

/**
 * Calculates how quickly the player was involved in combat during the round
 */
function calculateTimeToFirstContact(round: any, puuid: string): number {
  // Find the earliest kill or death involving this player
  let earliestTime = Infinity;

  // Check all player stats for kills involving the target player
  for (const playerStat of round.playerStats) {
    for (const kill of playerStat.kills) {
      // If player is the killer or victim, check the time
      if (playerStat.puuid === puuid || kill.victim === puuid) {
        if (kill.timeSinceRoundStartMillis < earliestTime) {
          earliestTime = kill.timeSinceRoundStartMillis;
        }
      }
    }
  }

  // Return the earliest time or 0 if player wasn't involved in any kills
  return earliestTime !== Infinity ? earliestTime : 0;
}

/**
 * Counts how many abilities the player used in the round
 */
function countAbilitiesUsed(playerStats: any): number {
  // Get ability usage from player stats
  const abilities = playerStats.ability;
  let abilitiesUsed = 0;

  // Count each non-empty ability effect as a used ability
  if (abilities) {
    if (abilities.grenadeEffects) abilitiesUsed++;
    if (abilities.ability1Effects) abilitiesUsed++;
    if (abilities.ability2Effects) abilitiesUsed++;
    if (abilities.ultimateEffects) abilitiesUsed++;
  }

  // If no abilities were found in effects, try to count from damage events
  if (abilitiesUsed === 0) {
    // Fallback to counting ability damage as before
    for (const kill of playerStats.kills) {
      const damageType = kill.finishingDamage.damageType?.toLowerCase() || '';
      const damageItem = kill.finishingDamage.damageItem?.toLowerCase() || '';

      if (
        damageType.includes('ability') ||
        damageType.includes('grenade') ||
        damageType.includes('ultimate') ||
        damageItem.includes('ability')
      ) {
        abilitiesUsed++;
      }
    }
  }

  // Return the count of abilities used, with a minimum of 1
  return Math.max(1, abilitiesUsed);
}

/**
 * Calculates damage done by player's abilities
 */
function calculateUtilityDamage(playerStats: any): number {
  // Sum up damage that might be from abilities
  let utilityDamage = 0;

  // Examine each kill for ability damage
  for (const kill of playerStats.kills) {
    const damageType = kill.finishingDamage.damageType?.toLowerCase() || '';
    const damageItem = kill.finishingDamage.damageItem?.toLowerCase() || '';

    // If kill was from ability, estimate damage (assume 150 per kill)
    if (
      damageType.includes('ability') ||
      damageType.includes('grenade') ||
      damageType.includes('ultimate') ||
      damageItem.includes('ability')
    ) {
      utilityDamage += 150; // Approximate damage for a kill
    }
  }

  // Look at damage entries to estimate non-lethal ability damage
  for (const damage of playerStats.damage) {
    // Apply a heuristic - assume about 20% of non-kill damage might be from abilities
    // This is a rough approximation since we don't have direct ability damage data
    if (damage.damage < 150) { // Not a kill, could be ability chip damage
      utilityDamage += damage.damage * 0.2;
    }
  }

  return Math.round(utilityDamage);
}


async function enrichMapCalloutsData(match: any[]): Promise<void> {
  // Collect all unique map IDs from the match stats
  const mapIds = new Set<string>();
  for (const m of match) {
    if (m.matchInfo.mapId) {
      mapIds.add(m.matchInfo.mapId);
    }
  }

  // Fetch map data with callouts for all unique map IDs
  if (mapIds.size > 0) {
    const { data: fetchedMapsData, error: mapsError } = await supabase
      .from('maps')
      .select('id, callouts')
      .in('id', Array.from(mapIds));

    if (mapsError) {
      console.error('Error fetching maps data:', mapsError);
    } else if (fetchedMapsData) {
      // Store fetched map data in the global cache
      fetchedMapsData.forEach(map => {
        mapsDataCache[map.id] = map;
      });
    }
  }
}