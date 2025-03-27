import { AgentStatType, SeasonPerformance } from "../../types/AgentStatsType";

/**
 * Processes agent stats from match data
 */
export function processAgentStats(
  agentMap: Map<string, AgentStatType>,
  player: any,
  match: any,
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

/**
 * Creates a new agent season performance object
 */
export function createAgentSeasonPerformance(seasonId: string): SeasonPerformance {
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

/**
 * Updates agent season statistics with new match data
 */
function updateAgentSeasonStats(
  seasonPerformance: SeasonPerformance,
  player: any,
  match: any,
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

/**
 * Processes ability usage data
 */
function processAbilityCasts(
  seasonPerformance: SeasonPerformance,
  player: any,
  match: any,
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
      const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
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

        const damageContribution = damageEntry.damage;
        // Apply a portion of damage to abilities based on their usage ratio
        if (abilityImpact.kills > 0) {
          // Attribute damage proportionally to abilities that got kills
          const abilityKillsRatio = abilityImpact.kills / Math.max(1, playerStats.kills.length);
          abilityImpact.damage += Math.floor(damageContribution * abilityKillsRatio);
        }
      }
    }
  });
}

/**
 * Processes plant and defuse actions
 */
function processPlantsAndDefuses(
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
 * Processes first kill statistics
 */
function processFirstKills(
  seasonPerformance: SeasonPerformance,
  match: any,
  puuid: string
) {
  // Count first kills
  let firstKills = 0;

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Simple approach: assume first kill in the array might be first kill of the round
    firstKills++;
  }

  // Update stats
  seasonPerformance.stats.firstKills += firstKills;
}

/**
 * Processes ace statistics (5 kills in a round)
 */
function processAces(
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
 * Processes map statistics for the agent
 */
function processAgentMapStats(
  seasonPerformance: SeasonPerformance,
  match: any,
  matchWon: boolean
) {
  const mapId = match.matchInfo.mapId;

  // Find existing map stat or create new one
  let mapStat = seasonPerformance.mapStats.find(
    (stat: any) => stat.id === mapId
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

/**
 * Processes attack/defense statistics
 */
function processAttackDefenseStats(
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

    const sideStats = isAttackRound ? seasonPerformance.attackStats : seasonPerformance.defenseStats;

    // Count kills, deaths
    sideStats.kills += playerStats.kills.length;

    // Count deaths (check if player is a victim in anyone's kills)
    const died = round.playerStats.some((stat: any) =>
      stat.kills.some((kill: any) => kill.victim === puuid)
    );
    if (died) sideStats.deaths += 1;

    // Update rounds won/lost
    if (round.winningTeam === player.teamId) {
      sideStats.roundsWon += 1;
    } else {
      sideStats.roundsLost += 1;
    }
  });
}

/**
 * Processes clutch statistics
 */
function processClutchStats(
  seasonPerformance: SeasonPerformance,
  match: any,
  puuid: string
) {
  // Find the player's team
  const player = match.players.find((p: any) => p.puuid === puuid);
  if (!player) return;

  const playerTeamId = player.teamId;

  // Process each round for clutch situations
  for (const round of match.roundResults) {
    // Skip if the player's team didn't win the round
    if (round.winningTeam !== playerTeamId) continue;

    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats) continue;

    // Get all players from both teams in this round
    const teammateStats = round.playerStats.filter(
      (stat: any) => match.players.find((p: any) => p.puuid === stat.puuid)?.teamId === playerTeamId && stat.puuid !== puuid
    );

    const enemyStats = round.playerStats.filter(
      (stat: any) => match.players.find((p: any) => p.puuid === stat.puuid)?.teamId !== playerTeamId
    );

    // Check if all teammates are dead (had deaths in this round)
    const allTeammatesDead = teammateStats.every((teammate: any) =>
      round.playerStats.some((enemy: any) =>
        enemy.kills.some((kill: any) => kill.victim === teammate.puuid)
      )
    );

    // If all teammates are dead and the player's team won, it's a clutch
    if (allTeammatesDead && round.winningTeam === playerTeamId) {
      // Count how many enemies the player had to face in the clutch
      let enemiesAliveInClutch = 0;

      // Count enemies that weren't killed by teammates
      for (const enemy of enemyStats) {
        const killedByTeammates = teammateStats.some((teammate: any) =>
          teammate.kills.some((kill: any) => kill.victim === enemy.puuid)
        );

        if (!killedByTeammates) {
          enemiesAliveInClutch++;
        }
      }

      // Track the clutch based on how many enemies were faced
      const clutchStats =
        round.playerStats.find((stat: any) => stat.puuid === puuid)?.kills.length ?? -1 > 0
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
