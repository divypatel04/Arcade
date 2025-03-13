export interface UserData {
  puuid: string;
  name: string;
  tagline: string;
  region: string;
  matchesid: string[];
  createdat: string;
  lastupdated: string;
}

export interface AgentStat {
  puuid: string;
  agent: string;
  matches_played: number;
  matches_won: number;
  rounds_played: number;
  rounds_won: number;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  // Add other fields as needed
}

export interface MapStat {
  puuid: string;
  map: string;
  matches_played: number;
  matches_won: number;
  rounds_played: number;
  rounds_won: number;
  // Add other fields as needed
}

export interface WeaponStat {
  puuid: string;
  weapon: string;
  kills: number;
  deaths: number;
  // Add other fields as needed
}

export interface SeasonStat {
  puuid: string;
  season: string;
  rank: string;
  // Add other fields as needed
}

export interface MatchStat {
  puuid: string;
  match_id: string;
  // Add other fields as needed
}

export interface DataContextState {
  userData: UserData | null;
  agentStats: AgentStat[];
  mapStats: MapStat[];
  weaponStats: WeaponStat[];
  seasonStats: SeasonStat[];
  matchStats: MatchStat[];
  isLoading: boolean;
  error: Error | null;
  isDataReady: boolean;
}

export interface DataContextValue extends DataContextState {
  fetchUserData: (puuid: string) => Promise<void>;
}
