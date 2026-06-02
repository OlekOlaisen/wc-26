export type FinishedFlag = "TRUE" | "FALSE";

export type MatchStatus = "live" | "upcoming" | "finished";

export interface Game {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string;
  persian_date?: string;
  stadium_id: string;
  finished: FinishedFlag;
  time_elapsed: string;
  type: string;
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
  home_team_label?: string;
  away_team_label?: string;
}

export interface Team {
  id: string;
  name_en: string;
  name_fa: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

export interface Stadium {
  id: string;
  name_en: string;
  name_fa: string;
  fifa_name: string;
  city_en: string;
  city_fa?: string;
  country_en: string;
  country_fa?: string;
  capacity: number;
  region?: string;
}

export interface GroupStandingEntry {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface Group {
  name: string;
  teams: GroupStandingEntry[];
}

export interface GoalScorer {
  name: string;
  minute: string;
}

export interface EnrichedMatch extends Game {
  kickoffAt: Date;
  dateKey: string;
  status: MatchStatus;
  homeDisplayName: string;
  awayDisplayName: string;
  homeFlag?: string;
  awayFlag?: string;
  stadium?: Stadium;
  homeScorersList: GoalScorer[];
  awayScorersList: GoalScorer[];
  stageLabel: string;
}

export type MatchFilter = "all" | "live" | "upcoming" | "finished";
