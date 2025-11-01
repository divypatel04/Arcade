/**
 * Combat Helpers Module
 * Helper functions for calculating combat-related statistics
 */

/**
 * Check if player was killed in a round
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns 1 if killed, 0 if survived
 */
export function wasPlayerKilled(round: any, puuid: string): number {
  if (!round.playerStats) return 0;

  return round.playerStats.some((stat: any) =>
    stat.kills?.some((kill: any) => kill.victim === puuid)
  ) ? 1 : 0;
}

/**
 * Count assists for a player in a round
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns Number of assists
 */
export function countAssists(round: any, puuid: string): number {
  const playerStat = round.playerStats?.find((stat: any) => stat.puuid === puuid);
  // If assist data is available in playerStat, use it
  // Otherwise return 0 as fallback
  return playerStat?.assists || 0;
}

/**
 * Calculate total damage dealt by player in a round
 * @param playerStats - Player statistics for the round
 * @returns Total damage dealt
 */
export function calculateDamageDealt(playerStats: any): number {
  if (!playerStats.damage || !Array.isArray(playerStats.damage)) {
    return 0;
  }

  return playerStats.damage.reduce((total: number, damage: any) => {
    return total + (damage.damage || 0);
  }, 0);
}

/**
 * Calculate headshot percentage for a round
 * @param playerStats - Player statistics for the round
 * @returns Headshot percentage (0-100)
 */
export function calculateHeadshotPercentageForRound(playerStats: any): number {
  if (!playerStats.damage || !Array.isArray(playerStats.damage)) {
    return 0;
  }

  let totalShots = 0;
  let headshots = 0;

  for (const damage of playerStats.damage) {
    const shots = (damage.legshots || 0) + (damage.bodyshots || 0) + (damage.headshots || 0);
    totalShots += shots;
    headshots += damage.headshots || 0;
  }

  return totalShots > 0 ? (headshots / totalShots) * 100 : 0;
}

/**
 * Check if player's death was traded (killer was killed shortly after)
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns True if death was traded
 */
export function wasPlayerTradedKill(round: any, puuid: string): boolean {
  if (!round.playerStats) return false;

  // Find if player was killed
  const playerDeath = round.playerStats
    .flatMap((stat: any) => stat.kills || [])
    .find((kill: any) => kill.victim === puuid);

  if (!playerDeath) return false;

  // Find who killed the player
  const killerPuuid = round.playerStats.find((stat: any) =>
    stat.kills?.some((kill: any) => kill.victim === puuid)
  )?.puuid;

  if (!killerPuuid) return false;

  // Check if killer was killed in this round
  return round.playerStats.some((stat: any) =>
    stat.kills?.some((kill: any) => kill.victim === killerPuuid)
  );
}

/**
 * Check if player got a trade kill (killed enemy shortly after teammate died)
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns True if player got a trade kill
 */
export function didPlayerTradeKill(round: any, puuid: string): boolean {
  if (!round.playerStats) return false;

  const playerStat = round.playerStats.find((stat: any) => stat.puuid === puuid);
  const playerKills = playerStat?.kills || [];

  if (playerKills.length === 0) return false;

  // Check if any kill has a short timestamp after a teammate's death
  // This is a simplified version - proper implementation would use precise timestamps
  // and check for kills within 5 seconds of teammate deaths

  const TRADE_WINDOW_MS = 5000; // 5 second window for trade kills

  for (const kill of playerKills) {
    const killTime = kill.timeSinceRoundStartMillis || 0;

    // Check if any teammate died shortly before this kill
    const recentTeammateDeath = round.playerStats
      .filter((stat: any) => stat.puuid !== puuid && stat.teamId === playerStat.teamId)
      .some((stat: any) => {
        const death = stat.kills?.find((k: any) => k.victim === stat.puuid);
        if (!death) return false;

        const deathTime = death.timeSinceRoundStartMillis || 0;
        return killTime - deathTime <= TRADE_WINDOW_MS && killTime >= deathTime;
      });

    if (recentTeammateDeath) return true;
  }

  return false;
}
