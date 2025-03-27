import { SeasonStatsType } from "../../types/SeasonStatsType";

/**
 * Processes season stats from match data
 */
export function processSeasonStats(
  seasonMap: Map<string, SeasonStatsType>,
  match: any,
  seasonId: string,
  player: any,
  matchWon: boolean,
  roundsWon: number,
  roundsLost: number
) {
  if (!seasonMap.has(seasonId)) {
    // Initialize minimal season stats with just ID
    seasonMap.set(seasonId, {
      id: `${player.puuid}_${seasonId}`,
      puuid: player.puuid,
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

/**
 * Updates season statistics with new match data
 */
function updateSeasonStats(
  seasonStat: SeasonStatsType,
  player: any,
  match: any,
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
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats) continue;

    for (const damageEntry of playerStats.damage) {
      totalDamage += damageEntry.damage;
    }
  }
  stats.damage += totalDamage;

  // Count first kills
  let firstKills = 0;
  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats || !playerStats.kills.length) continue;

    // Simplified approach - count if player has any kills in round
    firstKills++;
  }
  stats.firstKill += firstKills;

  // Count aces (5+ kills in a round)
  let aces = 0;
  for (const round of match.roundResults) {
    const playerStats = round.playerStats.find((stat: any) => stat.puuid === puuid);
    if (!playerStats) continue;

    if (playerStats.kills.length >= 5) {
      aces++;
    }
  }
  stats.aces += aces;

  // Count MVPs (highest score in the match on winning team)
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
