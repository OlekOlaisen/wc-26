import { apiFootballFetch } from "./client";
import {
  API_FOOTBALL_PHOTO_LOOKUP_SEASONS,
  API_FOOTBALL_TOP_SCORERS_PATH,
  API_FOOTBALL_WORLD_CUP_LEAGUE_ID,
} from "./constants";
import type {
  ApiFootballTopScorerEntry,
  ApiFootballTopScorersResponse,
} from "./types";

function hasApiFootballErrors(
  errors: ApiFootballTopScorersResponse["errors"],
): boolean {
  if (Array.isArray(errors)) {
    return errors.length > 0;
  }
  return Object.keys(errors).length > 0;
}

async function fetchTopScorersPage(
  season: number,
  page: number,
): Promise<ApiFootballTopScorersResponse> {
  const search = new URLSearchParams({
    league: String(API_FOOTBALL_WORLD_CUP_LEAGUE_ID),
    season: String(season),
    page: String(page),
  });

  return apiFootballFetch<ApiFootballTopScorersResponse>(
    `${API_FOOTBALL_TOP_SCORERS_PATH}?${search.toString()}`,
  );
}

async function loadTopScorersForSeason(
  season: number,
): Promise<ApiFootballTopScorerEntry[]> {
  const firstPage = await fetchTopScorersPage(season, 1);

  if (hasApiFootballErrors(firstPage.errors)) {
    return [];
  }

  const allEntries = [...firstPage.response];
  const totalPages = firstPage.paging?.total ?? 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await fetchTopScorersPage(season, page);
    if (hasApiFootballErrors(nextPage.errors)) {
      break;
    }
    allEntries.push(...nextPage.response);
  }

  return allEntries;
}

function dedupeTopScorerEntries(
  entries: ApiFootballTopScorerEntry[],
): ApiFootballTopScorerEntry[] {
  const byPlayerId = new Map<number, ApiFootballTopScorerEntry>();

  for (const entry of entries) {
    byPlayerId.set(entry.player.id, entry);
  }

  return [...byPlayerId.values()];
}

export async function loadApiFootballTopScorers(): Promise<
  ApiFootballTopScorerEntry[]
> {
  const seasonResults = await Promise.all(
    API_FOOTBALL_PHOTO_LOOKUP_SEASONS.map((season) =>
      loadTopScorersForSeason(season),
    ),
  );

  return dedupeTopScorerEntries(seasonResults.flat());
}
