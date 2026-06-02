import type { EnrichedMatch } from "@/api/types";

export function matchInvolvesFavoriteTeam(
  match: EnrichedMatch,
  favoriteTeamIds: string[],
): boolean {
  if (favoriteTeamIds.length === 0) {
    return false;
  }

  return (
    favoriteTeamIds.includes(match.home_team_id) ||
    favoriteTeamIds.includes(match.away_team_id)
  );
}

export function filterFavoriteMatches(
  matches: EnrichedMatch[],
  favoriteTeamIds: string[],
): EnrichedMatch[] {
  return matches.filter((match) =>
    matchInvolvesFavoriteTeam(match, favoriteTeamIds),
  );
}
