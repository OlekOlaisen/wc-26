import { useQuery } from "@tanstack/react-query";
import { loadScorerPhotoCatalog } from "@/api/apiFootball/loadScorerPhotoCatalog";
import type { ApiFootballTopScorerEntry } from "@/api/apiFootball/types";
import { queryKeys } from "@/api/queryKeys";
import { EXAMPLE_SCORER_PHOTO_ENTRIES } from "@/data/example/scorerProfiles";
import type { ScorerLeaderboardEntry } from "@/lib/aggregateScorers";
import { useExampleDataEnabled } from "@/stores/preferencesStore";

const scorerPhotosStaleTime = 1000 * 60 * 60;

async function loadExampleScorerPhotos(): Promise<ApiFootballTopScorerEntry[]> {
  return EXAMPLE_SCORER_PHOTO_ENTRIES;
}

export function useScorerPhotos(leaderboard: ScorerLeaderboardEntry[]) {
  const useExampleData = useExampleDataEnabled();
  const leaderboardSignature = leaderboard
    .map((entry) => `${entry.playerName}:${entry.teamName}`)
    .join("|");

  return useQuery({
    queryKey: useExampleData
      ? queryKeys.exampleScorerPhotos
      : queryKeys.apiFootballScorerPhotos(leaderboardSignature),
    queryFn: useExampleData
      ? loadExampleScorerPhotos
      : () => loadScorerPhotoCatalog(leaderboard),
    staleTime: scorerPhotosStaleTime,
    retry: useExampleData ? 0 : 1,
    enabled: useExampleData || leaderboard.length > 0,
  });
}
