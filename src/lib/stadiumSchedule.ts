import type { EnrichedMatch } from "@/api/types";
import { sortMatchesByKickoff } from "@/lib/groupByDate";

export function getStadiumMatches(
  matches: EnrichedMatch[],
  stadiumId: string,
): EnrichedMatch[] {
  return sortMatchesByKickoff(
    matches.filter((match) => match.stadium_id === stadiumId),
  );
}
