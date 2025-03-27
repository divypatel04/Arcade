/**
 * Type definitions for match details from the API
 */

export interface MatchDetails {
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
