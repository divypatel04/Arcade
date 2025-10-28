import ENV from '@config/env';
import type { Match } from '@context/DataContext';

const VALORANT_API_BASE = 'https://api.henrikdev.xyz/valorant/v3';
const API_KEY = ENV.VALORANT_API_KEY;

interface ValorantMatch {
  metadata: {
    matchid: string;
    map: string;
    game_mode: string;
    game_start: number;
    game_length: number;
    rounds_played: number;
  };
  players: {
    all_players: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
      character: string;
      stats: {
        kills: number;
        deaths: number;
        assists: number;
        score: number;
      };
      tier: number;
      damage: {
        headshots: number;
        bodyshots: number;
        legshots: number;
      };
    }>;
  };
  teams: {
    red: {
      has_won: boolean;
      rounds_won: number;
    };
    blue: {
      has_won: boolean;
      rounds_won: number;
    };
  };
}

interface ValorantMatchHistory {
  data: ValorantMatch[];
}

class ValorantAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = VALORANT_API_BASE;
    this.apiKey = API_KEY;
  }

  /**
   * Fetch match history for a player
   */
  async getMatchHistory(
    region: string,
    puuid: string,
    mode: string = 'competitive',
    size: number = 20
  ): Promise<ValorantMatch[]> {
    try {
      const url = `${this.baseUrl}/matches/${region}/${puuid}?mode=${mode}&size=${size}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: ValorantMatchHistory = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching match history:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed match data
   */
  async getMatchDetails(matchId: string): Promise<ValorantMatch | null> {
    try {
      const url = `${this.baseUrl}/match/${matchId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error fetching match details:', error);
      return null;
    }
  }

  /**
   * Convert Valorant API match to app Match format
   */
  convertToMatch(valorantMatch: ValorantMatch, userPuuid: string): Match | null {
    try {
      const player = valorantMatch.players.all_players.find(p => p.puuid === userPuuid);
      if (!player) return null;

      const isRedTeam = player.team === 'Red';
      const playerTeamWon = isRedTeam ? valorantMatch.teams.red.has_won : valorantMatch.teams.blue.has_won;
      const score = isRedTeam
        ? `${valorantMatch.teams.red.rounds_won}-${valorantMatch.teams.blue.rounds_won}`
        : `${valorantMatch.teams.blue.rounds_won}-${valorantMatch.teams.red.rounds_won}`;

      return {
        matchId: valorantMatch.metadata.matchid,
        map: valorantMatch.metadata.map,
        mapImage: '',
        mode: this.normalizeGameMode(valorantMatch.metadata.game_mode),
        date: new Date(valorantMatch.metadata.game_start).toISOString(),
        result: playerTeamWon ? 'victory' : 'defeat',
        score,
        duration: this.formatDuration(valorantMatch.metadata.game_length),
        agent: player.character,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        combatScore: player.stats.score,
        rank: this.getRankName(player.tier),
        rr: 0, // TODO: Get RR from API if available
        rrChange: undefined,
      };
    } catch (error) {
      console.error('Error converting match:', error);
      return null;
    }
  }

  /**
   * Normalize game mode name
   */
  private normalizeGameMode(mode: string): 'competitive' | 'unrated' | 'deathmatch' | 'spike rush' {
    const normalized = mode.toLowerCase();
    if (normalized.includes('competitive')) return 'competitive';
    if (normalized.includes('unrated')) return 'unrated';
    if (normalized.includes('deathmatch')) return 'deathmatch';
    if (normalized.includes('spike')) return 'spike rush';
    return 'unrated';
  }

  /**
   * Format duration from milliseconds to MM:SS
   */
  private formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get rank name from tier number
   */
  private getRankName(tier: number): string {
    const ranks = [
      'Unranked',
      'Iron 1', 'Iron 2', 'Iron 3',
      'Bronze 1', 'Bronze 2', 'Bronze 3',
      'Silver 1', 'Silver 2', 'Silver 3',
      'Gold 1', 'Gold 2', 'Gold 3',
      'Platinum 1', 'Platinum 2', 'Platinum 3',
      'Diamond 1', 'Diamond 2', 'Diamond 3',
      'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
      'Immortal 1', 'Immortal 2', 'Immortal 3',
      'Radiant',
    ];
    
    return ranks[tier] || 'Unranked';
  }

  /**
   * Batch fetch matches with rate limiting
   */
  async batchFetchMatches(
    region: string,
    puuid: string,
    batchSize: number = 20,
    maxBatches: number = 5,
    delayMs: number = 1000
  ): Promise<Match[]> {
    const allMatches: Match[] = [];

    for (let i = 0; i < maxBatches; i++) {
      try {
        const matches = await this.getMatchHistory(region, puuid, 'competitive', batchSize);
        
        for (const match of matches) {
          const converted = this.convertToMatch(match, puuid);
          if (converted) {
            allMatches.push(converted);
          }
        }

        // Rate limiting delay
        if (i < maxBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Error fetching batch ${i + 1}:`, error);
        break;
      }
    }

    return allMatches;
  }
}

export const valorantApi = new ValorantAPI();
export default valorantApi;
