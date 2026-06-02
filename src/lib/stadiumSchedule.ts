import type { EnrichedMatch } from "@/api/types";

export function getStadiumMatches(
  matches: EnrichedMatch[],
  stadiumId: string,
): EnrichedMatch[] {
  return matches.filter((match) => match.stadium_id === stadiumId);
}
