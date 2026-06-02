import type { EnrichedMatch } from "@/api/types";

export function getTeamFixtures(
  matches: EnrichedMatch[],
  teamId: string,
): EnrichedMatch[] {
  return matches.filter(
    (match) =>
      match.home_team_id === teamId || match.away_team_id === teamId,
  );
}
