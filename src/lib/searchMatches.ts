import type { EnrichedMatch, Stadium, Team } from "@/api/types";

export interface SearchResults {
  matches: EnrichedMatch[];
  teams: Team[];
  stadiums: Stadium[];
}

export function searchTournament(
  query: string,
  matches: EnrichedMatch[],
  teams: Team[],
  stadiums: Stadium[],
): SearchResults {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { matches: [], teams: [], stadiums: [] };
  }

  const filteredMatches = matches.filter((match) => {
    const haystack = [
      match.id,
      match.homeDisplayName,
      match.awayDisplayName,
      match.stageLabel,
      match.group,
      match.stadium?.name_en,
      match.stadium?.city_en,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });

  const filteredTeams = teams.filter((team) =>
    [team.name_en, team.fifa_code, team.groups]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );

  const filteredStadiums = stadiums.filter((stadium) =>
    [stadium.name_en, stadium.fifa_name, stadium.city_en, stadium.country_en]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );

  return {
    matches: filteredMatches.slice(0, 20),
    teams: filteredTeams.slice(0, 12),
    stadiums: filteredStadiums.slice(0, 12),
  };
}
