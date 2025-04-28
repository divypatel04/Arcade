import { WeaponStatsType, SeasonPerformance } from "../../types/WeaponStatsType";

/**
 * Processes weapon stats from match data
 */
export function processWeaponStats(
  weaponMap: Map<string, WeaponStatsType>,
  match: any,
  seasonId: string,
  puuid: string
) {
  // Collect all weapons used by the player in this match
  const weaponsUsed = new Set<string>();

  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
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
        id: `${puuid}_${weaponId}`,
        puuid,
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

/**
 * Creates a new weapon season performance object
 */
export function createWeaponSeasonPerformance(seasonId: string): SeasonPerformance {
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

/**
 * Updates weapon season statistics with new match data
 */
function updateWeaponSeasonStats(
  seasonPerformance: SeasonPerformance,
  match: any,
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
    const playerStat = round.playerStats.find((stat: any) => stat.puuid === puuid);
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
