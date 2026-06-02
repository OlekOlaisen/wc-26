import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import type { EnrichedMatch } from "@/api/types";
import { enrichMatches } from "@/lib/enrichMatch";
import { hasAnyLiveMatch } from "@/lib/matchStatus";
import { useStadiums, useTeams } from "./useCatalog";

export function useEnrichedMatches() {
  const teamsQuery = useTeams();
  const stadiumsQuery = useStadiums();

  const gamesQuery = useQuery({
    queryKey: queryKeys.games,
    queryFn: async () => {
      const response = await getGames();
      return response.games;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const teams = teamsQuery.data ?? [];
      const stadiums = stadiumsQuery.data ?? [];
      const games = query.state.data ?? [];

      if (teams.length === 0 || stadiums.length === 0 || games.length === 0) {
        return false;
      }

      const enriched = enrichMatches(games, teams, stadiums);
      return hasAnyLiveMatch(enriched.map((match) => match.status))
        ? 30_000
        : false;
    },
    enabled: teamsQuery.isSuccess && stadiumsQuery.isSuccess,
  });

  const enrichedMatches: EnrichedMatch[] =
    gamesQuery.data &&
    teamsQuery.data &&
    stadiumsQuery.data
      ? enrichMatches(
          gamesQuery.data,
          teamsQuery.data,
          stadiumsQuery.data,
        )
      : [];

  return {
    matches: enrichedMatches,
    isLoading:
      teamsQuery.isLoading ||
      stadiumsQuery.isLoading ||
      gamesQuery.isLoading,
    isError:
      teamsQuery.isError ||
      stadiumsQuery.isError ||
      gamesQuery.isError,
    error:
      teamsQuery.error ??
      stadiumsQuery.error ??
      gamesQuery.error,
    dataUpdatedAt: gamesQuery.dataUpdatedAt,
    refetch: gamesQuery.refetch,
  };
}
