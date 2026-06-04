import type {
  ApiFootballTopScorerEntry,
  ApiFootballTopScorerPlayer,
} from "@/api/apiFootball/types";
import type { ScorerLeaderboardEntry } from "@/lib/aggregateScorers";

export function normalizeScorerLookupText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getNameTokens(name: string): string[] {
  return normalizeScorerLookupText(name).split(" ").filter(Boolean);
}

function getLastNameToken(name: string): string | undefined {
  const tokens = getNameTokens(name);
  return tokens.at(-1);
}

export interface ScorerApiLookup {
  byFullName: Map<string, ApiFootballTopScorerEntry>;
  byLastNameAndTeam: Map<string, ApiFootballTopScorerEntry>;
}

function registerScorerApiEntry(
  lookup: ScorerApiLookup,
  candidateName: string,
  teamName: string,
  entry: ApiFootballTopScorerEntry,
): void {
  const normalizedName = normalizeScorerLookupText(candidateName);
  if (normalizedName) {
    lookup.byFullName.set(normalizedName, entry);
  }

  const lastName = getLastNameToken(candidateName);
  const normalizedTeam = normalizeScorerLookupText(teamName);
  if (lastName && normalizedTeam) {
    lookup.byLastNameAndTeam.set(`${lastName}::${normalizedTeam}`, entry);
  }
}

export function buildScorerApiLookup(
  apiEntries: ApiFootballTopScorerEntry[],
): ScorerApiLookup {
  const byFullName = new Map<string, ApiFootballTopScorerEntry>();
  const byLastNameAndTeam = new Map<string, ApiFootballTopScorerEntry>();
  const lookup: ScorerApiLookup = { byFullName, byLastNameAndTeam };

  for (const entry of apiEntries) {
    const teamName = entry.statistics[0]?.team.name ?? "";
    const candidateNames = [
      entry.player.name,
      `${entry.player.firstname} ${entry.player.lastname}`.trim(),
      entry.player.lastname,
    ].filter(Boolean);

    for (const candidateName of candidateNames) {
      registerScorerApiEntry(lookup, candidateName, teamName, entry);
    }
  }

  return lookup;
}

export function formatApiFootballPlayerFullName(
  player: ApiFootballTopScorerPlayer,
): string {
  const fullName = `${player.firstname} ${player.lastname}`.trim();
  return fullName || player.name;
}

export function findMatchedScorerApiEntry(
  entry: ScorerLeaderboardEntry,
  lookup: ScorerApiLookup,
): ApiFootballTopScorerEntry | undefined {
  const normalizedPlayer = normalizeScorerLookupText(entry.playerName);
  const directMatch = lookup.byFullName.get(normalizedPlayer);
  if (directMatch) {
    return directMatch;
  }

  for (const [apiName, apiEntry] of lookup.byFullName) {
    if (apiName.endsWith(` ${normalizedPlayer}`) || apiName === normalizedPlayer) {
      return apiEntry;
    }
    if (
      normalizedPlayer.length >= 3 &&
      apiName.includes(` ${normalizedPlayer}`)
    ) {
      return apiEntry;
    }
  }

  const lastName = getLastNameToken(entry.playerName);
  const normalizedTeam = normalizeScorerLookupText(entry.teamName);
  if (lastName && normalizedTeam) {
    const teamKeys = [
      normalizedTeam,
      normalizedTeam === "united states" ? "usa" : undefined,
    ].filter(Boolean) as string[];

    for (const teamKey of teamKeys) {
      const match = lookup.byLastNameAndTeam.get(`${lastName}::${teamKey}`);
      if (match) {
        return match;
      }
    }
  }

  return undefined;
}

export function findScorerPhotoUrl(
  entry: ScorerLeaderboardEntry,
  lookup: ScorerApiLookup,
): string | undefined {
  const photoUrl = findMatchedScorerApiEntry(entry, lookup)?.player.photo?.trim();
  return photoUrl || undefined;
}

export function enrichLeaderboardWithPhotos(
  entries: ScorerLeaderboardEntry[],
  apiEntries: ApiFootballTopScorerEntry[],
): ScorerLeaderboardEntry[] {
  if (apiEntries.length === 0) {
    return entries;
  }

  const lookup = buildScorerApiLookup(apiEntries);

  return entries.map((entry) => {
    const matchedEntry = findMatchedScorerApiEntry(entry, lookup);

    return {
      ...entry,
      displayName: matchedEntry
        ? formatApiFootballPlayerFullName(matchedEntry.player)
        : entry.displayName,
      photoUrl:
        matchedEntry?.player.photo?.trim() ??
        findScorerPhotoUrl(entry, lookup) ??
        entry.photoUrl,
    };
  });
}
