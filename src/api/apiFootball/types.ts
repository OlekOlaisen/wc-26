export interface ApiFootballPaging {
  current: number;
  total: number;
}

export interface ApiFootballTopScorerPlayer {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  photo: string;
}

export interface ApiFootballTopScorerTeam {
  id: number;
  name: string;
  logo: string;
}

export interface ApiFootballTopScorerEntry {
  player: ApiFootballTopScorerPlayer;
  statistics: Array<{
    team: ApiFootballTopScorerTeam;
  }>;
}

export interface ApiFootballTopScorersResponse {
  errors: Record<string, string> | string[];
  paging: ApiFootballPaging;
  response: ApiFootballTopScorerEntry[];
}

export interface ApiFootballTeamEntry {
  team: ApiFootballTopScorerTeam & { country?: string };
}

export interface ApiFootballTeamsResponse {
  errors: Record<string, string> | string[];
  response: ApiFootballTeamEntry[];
}

export interface ApiFootballPlayerSearchEntry {
  player: ApiFootballTopScorerPlayer;
  statistics: Array<{
    team: ApiFootballTopScorerTeam;
  }>;
}

export interface ApiFootballPlayersResponse {
  errors: Record<string, string> | string[];
  response: ApiFootballPlayerSearchEntry[];
}
