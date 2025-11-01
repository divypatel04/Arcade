/**
 * Team Stats Generator Module
 * Handles generation of team-level statistics from match data
 */

import { MatchDetails } from '../../../types/MatchDetails';
import { TeamStat } from '../../../types/MatchStatsType';

/**
 * Generate team statistics for both player's team and enemy team
 * @param match - Complete match details
 * @param player - Player object for the current user
 * @param playerTeam - Player's team object
 * @param enemyTeam - Enemy team object
 * @returns Array containing stats for both teams
 */
export function generateTeamStats(
  match: MatchDetails,
  player: any,
  playerTeam: any,
  enemyTeam: any
): TeamStat[] {
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

  // Process each round to populate team stats
  for (const round of match.roundResults) {
    processFirstKills(round, match, playerTeam.teamId, enemyTeam.teamId, yourTeamStat, enemyTeamStat);
    processThrifties(round, match, playerTeam.teamId, enemyTeam.teamId, yourTeamStat, enemyTeamStat);
    processPostPlants(round, match, playerTeam.teamId, enemyTeam.teamId, yourTeamStat, enemyTeamStat);
    processClutches(round, match, playerTeam.teamId, enemyTeam.teamId, yourTeamStat, enemyTeamStat);
  }

  return [yourTeamStat, enemyTeamStat];
}

/**
 * Process first kills in a round and update team stats
 */
function processFirstKills(
  round: any,
  match: MatchDetails,
  playerTeamId: string,
  enemyTeamId: string,
  yourTeamStat: TeamStat,
  enemyTeamStat: TeamStat
): void {
  const firstKill = getFirstKillInRound(round);
  if (!firstKill) return;

  const killerTeam = match.players.find((p: any) => p.puuid === firstKill.killer)?.teamId;
  if (killerTeam === playerTeamId) {
    yourTeamStat.firstKills++;
  } else if (killerTeam === enemyTeamId) {
    enemyTeamStat.firstKills++;
  }
}

/**
 * Process thrifty rounds (winning with significantly lower economy)
 */
function processThrifties(
  round: any,
  match: MatchDetails,
  playerTeamId: string,
  enemyTeamId: string,
  yourTeamStat: TeamStat,
  enemyTeamStat: TeamStat
): void {
  const yourTeamEconomy = calculateTeamEconomy(match, round, playerTeamId);
  const enemyTeamEconomy = calculateTeamEconomy(match, round, enemyTeamId);
  const ECONOMY_THRESHOLD = 0.6; // 60% threshold for thrifty

  if (round.winningTeam === playerTeamId && yourTeamEconomy < enemyTeamEconomy * ECONOMY_THRESHOLD) {
    yourTeamStat.thrifties++;
  } else if (round.winningTeam === enemyTeamId && enemyTeamEconomy < yourTeamEconomy * ECONOMY_THRESHOLD) {
    enemyTeamStat.thrifties++;
  }
}

/**
 * Process post-plant situations
 */
function processPostPlants(
  round: any,
  match: MatchDetails,
  playerTeamId: string,
  enemyTeamId: string,
  yourTeamStat: TeamStat,
  enemyTeamStat: TeamStat
): void {
  if (!round.bombPlanter) return;

  const planterTeam = match.players.find((p: any) => p.puuid === round.bombPlanter)?.teamId;

  if (planterTeam === playerTeamId) {
    if (round.winningTeam === playerTeamId) {
      yourTeamStat.postPlantsWon++;
    } else {
      yourTeamStat.postPlantsLost++;
    }
  } else if (planterTeam === enemyTeamId) {
    if (round.winningTeam === enemyTeamId) {
      enemyTeamStat.postPlantsWon++;
    } else {
      enemyTeamStat.postPlantsLost++;
    }
  }
}

/**
 * Process clutch situations (last player alive winning the round)
 */
function processClutches(
  round: any,
  match: MatchDetails,
  playerTeamId: string,
  enemyTeamId: string,
  yourTeamStat: TeamStat,
  enemyTeamStat: TeamStat
): void {
  const yourTeamClutch = detectClutch(match, round, playerTeamId);
  const enemyTeamClutch = detectClutch(match, round, enemyTeamId);

  if (yourTeamClutch && round.winningTeam === playerTeamId) {
    yourTeamStat.clutchesWon++;
  }

  if (enemyTeamClutch && round.winningTeam === enemyTeamId) {
    enemyTeamStat.clutchesWon++;
  }
}

/**
 * Get the first kill event in a round
 * @param round - Round data
 * @returns First kill event or null
 */
export function getFirstKillInRound(round: any): any | null {
  if (!round.playerStats || round.playerStats.length === 0) {
    return null;
  }

  let firstKill = null;
  let earliestTime = Number.MAX_VALUE;

  for (const playerStat of round.playerStats) {
    if (playerStat.kills && playerStat.kills.length > 0) {
      for (const kill of playerStat.kills) {
        if (kill.timeSinceRoundStartMillis < earliestTime) {
          earliestTime = kill.timeSinceRoundStartMillis;
          firstKill = {
            killer: playerStat.puuid,
            victim: kill.victim,
            time: kill.timeSinceRoundStartMillis
          };
        }
      }
    }
  }

  return firstKill;
}

/**
 * Calculate total economy value for a team in a round
 * @param match - Match details
 * @param round - Round data
 * @param teamId - Team identifier
 * @returns Total economy value
 */
export function calculateTeamEconomy(match: MatchDetails, round: any, teamId: string): number {
  const teamPlayers = match.players.filter((p: any) => p.teamId === teamId);
  let totalEconomy = 0;

  for (const player of teamPlayers) {
    const playerStat = round.playerStats?.find((ps: any) => ps.puuid === player.puuid);
    if (playerStat && playerStat.economy) {
      totalEconomy += playerStat.economy.loadoutValue || 0;
    }
  }

  return totalEconomy;
}

/**
 * Detect if a clutch situation occurred for a team
 * @param match - Match details
 * @param round - Round data
 * @param teamId - Team identifier
 * @returns True if clutch situation was detected
 */
export function detectClutch(match: MatchDetails, round: any, teamId: string): boolean {
  if (!round.playerStats) return false;

  const teamPlayers = match.players.filter((p: any) => p.teamId === teamId);
  let aliveCount = 0;

  // Count alive players at end of round
  for (const player of teamPlayers) {
    const playerStat = round.playerStats.find((ps: any) => ps.puuid === player.puuid);
    if (playerStat && !playerStat.wasPenalized && playerStat.kills) {
      aliveCount++;
    }
  }

  // Clutch is when only 1 player is alive and they win
  return aliveCount === 1 && round.winningTeam === teamId;
}
