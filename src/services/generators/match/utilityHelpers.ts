/**
 * Utility Helpers Module
 * Helper functions for calculating utility usage statistics
 */

/**
 * Count number of abilities used in a round
 * @param playerStats - Player statistics for the round
 * @returns Number of abilities used
 */
export function countAbilitiesUsed(playerStats: any): number {
  if (!playerStats.ability || !Array.isArray(playerStats.ability)) {
    return 0;
  }

  return playerStats.ability.length;
}

/**
 * Calculate total utility damage dealt
 * @param playerStats - Player statistics for the round
 * @returns Total utility damage
 */
export function calculateUtilityDamage(playerStats: any): number {
  if (!playerStats.ability || !Array.isArray(playerStats.ability)) {
    return 0;
  }

  return playerStats.ability.reduce((total: number, ability: any) => {
    return total + (ability.damage || 0);
  }, 0);
}

/**
 * Check if player had first contact in the round
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns True if player had first contact
 */
export function wasFirstContact(round: any, puuid: string): boolean {
  if (!round.playerStats) return false;

  // Find the earliest kill or damage event
  let earliestTime = Number.MAX_VALUE;
  let earliestPuuid: string | null = null;

  for (const stat of round.playerStats) {
    // Check kills
    if (stat.kills && stat.kills.length > 0) {
      for (const kill of stat.kills) {
        const time = kill.timeSinceRoundStartMillis || 0;
        if (time < earliestTime) {
          earliestTime = time;
          earliestPuuid = stat.puuid;
        }
      }
    }

    // Check damage
    if (stat.damage && stat.damage.length > 0) {
      for (const dmg of stat.damage) {
        const time = dmg.timeSinceRoundStartMillis || 0;
        if (time < earliestTime) {
          earliestTime = time;
          earliestPuuid = stat.puuid;
        }
      }
    }
  }

  return earliestPuuid === puuid;
}

/**
 * Calculate time until first contact in the round
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns Time in milliseconds until first contact, or 0 if no contact
 */
export function calculateTimeToFirstContact(round: any, puuid: string): number {
  if (!round.playerStats) return 0;

  const playerStat = round.playerStats.find((stat: any) => stat.puuid === puuid);
  if (!playerStat) return 0;

  let firstContactTime = Number.MAX_VALUE;

  // Check kills
  if (playerStat.kills && playerStat.kills.length > 0) {
    for (const kill of playerStat.kills) {
      const time = kill.timeSinceRoundStartMillis || 0;
      if (time < firstContactTime) {
        firstContactTime = time;
      }
    }
  }

  // Check damage
  if (playerStat.damage && playerStat.damage.length > 0) {
    for (const dmg of playerStat.damage) {
      const time = dmg.timeSinceRoundStartMillis || 0;
      if (time < firstContactTime) {
        firstContactTime = time;
      }
    }
  }

  return firstContactTime === Number.MAX_VALUE ? 0 : firstContactTime;
}
