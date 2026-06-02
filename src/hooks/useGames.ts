import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { loadGames } from "@/api/tournamentData";
import type { EnrichedMatch } from "@/api/types";
import { enrichMatches } from "@/lib/enrichMatch";
import { hasAnyLiveMatch } from "@/lib/matchStatus";
import {
  getTournamentDataSource,
  useExampleDataEnabled,
} from "@/stores/preferencesStore";
import { useStadiums, useTeams } from "./useCatalog";

export function useEnrichedMatches() {
  const useExampleData = useExampleDataEnabled();
  const source = getTournamentDataSource();
  const teamsQuery = useTeams();
  const stadiumsQuery = useStadiums();

  const gamesQuery = useQuery({
    queryKey: queryKeys.games(source),
    queryFn: loadGames,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: !useExampleData,
    refetchInterval: (query) => {
      if (useExampleData) {
        return false;
      }

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
      gamesQuery.error ??
      teamsQuery.error ??
      stadiumsQuery.error,
    dataUpdatedAt: gamesQuery.dataUpdatedAt,
    refetch: gamesQuery.refetch,
  };
}
