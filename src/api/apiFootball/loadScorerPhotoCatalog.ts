import type { ScorerLeaderboardEntry } from "@/lib/aggregateScorers";
import {
  buildScorerApiLookup,
  findMatchedScorerApiEntry,
  normalizeScorerLookupText,
} from "@/lib/matchScorerPhotos";
import { apiFootballFetch } from "./client";
import {
  API_FOOTBALL_PHOTO_LOOKUP_SEASONS,
  API_FOOTBALL_PLAYERS_PATH,
  API_FOOTBALL_TEAMS_PATH,
  API_FOOTBALL_WORLD_CUP_LEAGUE_ID,
} from "./constants";
import { loadApiFootballTopScorers } from "./loadTopScorers";
import type {
  ApiFootballPlayerSearchEntry,
  ApiFootballPlayersResponse,
  ApiFootballTeamEntry,
  ApiFootballTeamsResponse,
  ApiFootballTopScorerEntry,
} from "./types";

const maxPlayerSearchLookups = 12;

const teamNameAliases: Record<string, string[]> = {
  usa: ["united states", "usa", "us"],
  "south korea": ["korea republic", "south korea", "korea"],
};

function hasApiFootballErrors(
  errors: ApiFootballPlayersResponse["errors"],
): boolean {
  if (Array.isArray(errors)) {
    return errors.length > 0;
  }
  return Object.keys(errors).length > 0;
}

function getLastNameToken(playerName: string): string | undefined {
  const tokens = normalizeScorerLookupText(playerName).split(" ").filter(Boolean);
  return tokens.at(-1);
}

function registerTeamId(
  teamIdByNormalizedName: Map<string, number>,
  label: string,
  teamId: number,
): void {
  const normalized = normalizeScorerLookupText(label);
  if (normalized) {
    teamIdByNormalizedName.set(normalized, teamId);
  }
}

function buildWorldCupTeamIdLookup(
  teams: ApiFootballTeamEntry[],
): Map<string, number> {
  const teamIdByNormalizedName = new Map<string, number>();

  for (const { team } of teams) {
    registerTeamId(teamIdByNormalizedName, team.name, team.id);
    if (team.country) {
      registerTeamId(teamIdByNormalizedName, team.country, team.id);
    }
  }

  for (const [canonical, aliases] of Object.entries(teamNameAliases)) {
    const teamId = teamIdByNormalizedName.get(canonical);
    if (!teamId) {
      continue;
    }
    for (const alias of aliases) {
      registerTeamId(teamIdByNormalizedName, alias, teamId);
    }
  }

  return teamIdByNormalizedName;
}

async function loadWorldCupTeamIdLookup(): Promise<Map<string, number>> {
  const season = API_FOOTBALL_PHOTO_LOOKUP_SEASONS[0];
  const search = new URLSearchParams({
    league: String(API_FOOTBALL_WORLD_CUP_LEAGUE_ID),
    season: String(season),
  });

  const response = await apiFootballFetch<ApiFootballTeamsResponse>(
    `${API_FOOTBALL_TEAMS_PATH}?${search.toString()}`,
  );

  if (hasApiFootballErrors(response.errors)) {
    return new Map();
  }

  return buildWorldCupTeamIdLookup(response.response);
}

function resolveTeamId(
  teamName: string,
  teamIdByNormalizedName: Map<string, number>,
): number | undefined {
  const normalizedTeam = normalizeScorerLookupText(teamName);
  return teamIdByNormalizedName.get(normalizedTeam);
}

async function searchPlayerPhotoEntry(
  entry: ScorerLeaderboardEntry,
  teamId: number,
  season: number,
): Promise<ApiFootballTopScorerEntry | undefined> {
  const searchTerm = getLastNameToken(entry.playerName);
  if (!searchTerm) {
    return undefined;
  }

  const search = new URLSearchParams({
    team: String(teamId),
    search: searchTerm,
    season: String(season),
  });

  const response = await apiFootballFetch<ApiFootballPlayersResponse>(
    `${API_FOOTBALL_PLAYERS_PATH}?${search.toString()}`,
  );

  if (hasApiFootballErrors(response.errors) || response.response.length === 0) {
    return undefined;
  }

  const match = pickBestPlayerSearchMatch(entry, response.response);
  if (!match?.player.photo?.trim()) {
    return undefined;
  }

  return {
    player: match.player,
    statistics: match.statistics,
  };
}

function pickBestPlayerSearchMatch(
  entry: ScorerLeaderboardEntry,
  candidates: ApiFootballPlayerSearchEntry[],
): ApiFootballPlayerSearchEntry | undefined {
  const normalizedTarget = normalizeScorerLookupText(entry.playerName);
  const lastName = getLastNameToken(entry.playerName);

  for (const candidate of candidates) {
    const candidateNames = [
      candidate.player.name,
      `${candidate.player.firstname} ${candidate.player.lastname}`.trim(),
      candidate.player.lastname,
    ].map(normalizeScorerLookupText);

    if (candidateNames.some((name) => name === normalizedTarget)) {
      return candidate;
    }
  }

  if (lastName) {
    return candidates.find((candidate) => {
      const names = [
        candidate.player.name,
        candidate.player.lastname,
      ].map(normalizeScorerLookupText);
      return names.some((name) => name.endsWith(` ${lastName}`) || name === lastName);
    });
  }

  return candidates[0];
}

async function loadSearchFallbackEntries(
  leaderboard: ScorerLeaderboardEntry[],
  catalog: ApiFootballTopScorerEntry[],
): Promise<ApiFootballTopScorerEntry[]> {
  const lookup = buildScorerApiLookup(catalog);
  const missingEntries = leaderboard.filter(
    (entry) => !findMatchedScorerApiEntry(entry, lookup),
  );

  if (missingEntries.length === 0) {
    return [];
  }

  const teamIdByNormalizedName = await loadWorldCupTeamIdLookup();
  if (teamIdByNormalizedName.size === 0) {
    return [];
  }

  const season = API_FOOTBALL_PHOTO_LOOKUP_SEASONS[0];
  const searchResults: ApiFootballTopScorerEntry[] = [];

  for (const entry of missingEntries.slice(0, maxPlayerSearchLookups)) {
    const teamId = resolveTeamId(entry.teamName, teamIdByNormalizedName);
    if (!teamId) {
      continue;
    }

    const photoEntry = await searchPlayerPhotoEntry(entry, teamId, season);
    if (photoEntry) {
      searchResults.push(photoEntry);
    }
  }

  return searchResults;
}

export async function loadScorerPhotoCatalog(
  leaderboard: ScorerLeaderboardEntry[],
): Promise<ApiFootballTopScorerEntry[]> {
  const topScorerEntries = await loadApiFootballTopScorers();

  if (leaderboard.length === 0) {
    return topScorerEntries;
  }

  const searchFallbackEntries = await loadSearchFallbackEntries(
    leaderboard,
    topScorerEntries,
  );

  if (searchFallbackEntries.length === 0) {
    return topScorerEntries;
  }

  const merged = new Map<number, ApiFootballTopScorerEntry>();
  for (const entry of [...topScorerEntries, ...searchFallbackEntries]) {
    merged.set(entry.player.id, entry);
  }

  return [...merged.values()];
}
