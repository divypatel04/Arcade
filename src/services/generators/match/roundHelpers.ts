/**
 * Round Helpers Module
 * Helper functions for round-level calculations and positioning
 */

import { MatchDetails } from '../../../types/MatchDetails';

// Global cache for map callouts
declare const mapsDataCache: { [mapId: string]: any };

/**
 * Calculate average enemy loadout value for a round
 * @param match - Match details
 * @param round - Round data
 * @param playerTeamId - Player's team identifier
 * @returns Average loadout value of enemy team
 */
export function calculateAverageEnemyLoadout(
  match: MatchDetails,
  round: any,
  playerTeamId: string
): number {
  let totalEconomy = 0;
  let playerCount = 0;

  for (const playerStat of round.playerStats) {
    const player = match.players.find((p: any) => p.puuid === playerStat.puuid);
    if (player && player.teamId !== playerTeamId) {
      totalEconomy += playerStat.economy?.loadoutValue || 0;
      playerCount++;
    }
  }

  return playerCount > 0 ? totalEconomy / playerCount : 0;
}

/**
 * Find player's location in a round
 * @param round - Round data
 * @param puuid - Player unique identifier
 * @returns Player location coordinates or null
 */
export function findPlayerLocationInRound(round: any, puuid: string): { x: number; y: number } | null {
  if (!round.playerStats) return null;

  // Try to find location from kill events
  for (const playerStat of round.playerStats) {
    if (!playerStat.kills) continue;

    for (const kill of playerStat.kills) {
      // Check if player is the killer
      if (playerStat.puuid === puuid) {
        const killerLocation = kill.playerLocations?.find((loc: any) => loc.puuid === puuid)?.location;
        if (killerLocation) return killerLocation;
      }

      // Check if player is the victim
      if (kill.victim === puuid) {
        return kill.victimLocation;
      }
    }
  }

  return null;
}

/**
 * Determine site and position type based on player location
 * @param playerLocation - Player coordinates
 * @param round - Round data
 * @param player - Player object
 * @param match - Match details
 * @param mapId - Map identifier for callout lookup
 * @returns Site name and position type
 */
export function determinePositionInfoLocally(
  playerLocation: { x: number; y: number },
  round: any,
  player: any,
  match: MatchDetails,
  mapId: string
): { site: string; positionType: string } {
  const defaults = { site: "Unknown", positionType: "Balanced" };

  try {
    // Get callouts from global cache using mapId
    const callouts = (globalThis as any).mapsDataCache?.[mapId]?.callouts;

    if (!callouts || !Array.isArray(callouts) || callouts.length === 0) {
      return defaults;
    }

    // Find the closest callout to the player's position
    const closest = findClosestCallout(playerLocation, callouts);
    if (!closest) return defaults;

    const site = closest.superRegionName || "Unknown";
    const positionType = determinePositionType(closest, round, player, match);

    return { site, positionType };
  } catch (error) {
    console.error("Error determining position info:", error);
    return defaults;
  }
}

/**
 * Determine position type based on callout and player role
 */
function determinePositionType(
  callout: any,
  round: any,
  player: any,
  match: MatchDetails
): string {
  const playerTeam = match.teams.find((team: any) => team.teamId === player.teamId);
  if (!playerTeam) return "Balanced";

  // Determine if player is attacker or defender
  const isAttacker =
    (round.roundNum < 12 && playerTeam.teamId === 'Red') ||
    (round.roundNum >= 12 && playerTeam.teamId === 'Blue');

  const { regionName, superRegionName } = callout;

  if (isAttacker) {
    return determineAttackerPositionType(superRegionName, regionName);
  } else {
    return determineDefenderPositionType(superRegionName, regionName);
  }
}

/**
 * Determine attacker position type
 */
function determineAttackerPositionType(superRegionName: string, regionName: string): string {
  if (superRegionName === 'A' || superRegionName === 'B') {
    if (regionName === 'Site') return "Aggressive";
    if (regionName === 'Main' || regionName === 'Window' || regionName === 'Garden') return "Entry";
  }

  if (superRegionName === 'Mid') return "Control";
  if (superRegionName === 'Defender Side') return "Lurk";

  return "Balanced";
}

/**
 * Determine defender position type
 */
function determineDefenderPositionType(superRegionName: string, regionName: string): string {
  if (superRegionName === 'Attacker Side') return "Aggressive";
  if (superRegionName === 'Mid') return "Control";

  if ((superRegionName === 'A' || superRegionName === 'B') && regionName !== 'Site') {
    return "Forward";
  }

  if (regionName === 'Site') return "Anchor";

  return "Balanced";
}

/**
 * Find closest callout to a position
 */
function findClosestCallout(
  position: { x: number; y: number },
  callouts: any[]
): any | null {
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

/**
 * Calculate distance between two points
 */
function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
