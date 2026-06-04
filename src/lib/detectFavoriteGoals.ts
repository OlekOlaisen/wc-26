import type { EnrichedMatch, GoalScorer } from "@/api/types";

export interface MatchScoreSnapshot {
  homeScore: number;
  awayScore: number;
  homeScorerKeys: string[];
  awayScorerKeys: string[];
}

export interface FavoriteGoalEvent {
  match: EnrichedMatch;
  teamName: string;
  scoringTeamId: string;
  scoredByFavorite: boolean;
  scorer?: GoalScorer;
}

const GOAL_SCORER_KEY_SEPARATOR = "\u0000";

function parseScore(score: string): number {
  const parsed = Number.parseInt(score, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toScorerKey(scorer: GoalScorer): string {
  return `${scorer.name}${GOAL_SCORER_KEY_SEPARATOR}${scorer.minute}`;
}

export function createMatchScoreSnapshot(
  match: EnrichedMatch,
): MatchScoreSnapshot {
  return {
    homeScore: parseScore(match.home_score),
    awayScore: parseScore(match.away_score),
    homeScorerKeys: match.homeScorersList.map(toScorerKey),
    awayScorerKeys: match.awayScorersList.map(toScorerKey),
  };
}

function findNewScorers(
  scorers: GoalScorer[],
  previousKeys: string[],
): GoalScorer[] {
  const previousKeySet = new Set(previousKeys);
  return scorers.filter((scorer) => !previousKeySet.has(toScorerKey(scorer)));
}

function collectSideGoalEvents(
  match: EnrichedMatch,
  previous: MatchScoreSnapshot,
  side: "home" | "away",
  favoriteTeamIds: string[],
): FavoriteGoalEvent[] {
  const isHome = side === "home";
  const scorers = isHome ? match.homeScorersList : match.awayScorersList;
  const previousKeys = isHome
    ? previous.homeScorerKeys
    : previous.awayScorerKeys;
  const previousScore = isHome ? previous.homeScore : previous.awayScore;
  const currentScore = parseScore(isHome ? match.home_score : match.away_score);
  const teamName = isHome ? match.homeDisplayName : match.awayDisplayName;
  const scoringTeamId = isHome ? match.home_team_id : match.away_team_id;
  const scoredByFavorite = favoriteTeamIds.includes(scoringTeamId);

  const eventBase = {
    match,
    teamName,
    scoringTeamId,
    scoredByFavorite,
  };

  const newScorers = findNewScorers(scorers, previousKeys);
  if (newScorers.length > 0) {
    return newScorers.map((scorer) => ({
      ...eventBase,
      scorer,
    }));
  }

  if (currentScore > previousScore) {
    return [eventBase];
  }

  return [];
}

export function detectFavoriteGoalEvents(
  match: EnrichedMatch,
  previous: MatchScoreSnapshot | undefined,
  favoriteTeamIds: string[],
): FavoriteGoalEvent[] {
  if (!previous || match.status !== "live") {
    return [];
  }

  const favoriteIsPlaying =
    favoriteTeamIds.includes(match.home_team_id) ||
    favoriteTeamIds.includes(match.away_team_id);

  if (!favoriteIsPlaying) {
    return [];
  }

  return [
    ...collectSideGoalEvents(match, previous, "home", favoriteTeamIds),
    ...collectSideGoalEvents(match, previous, "away", favoriteTeamIds),
  ];
}
