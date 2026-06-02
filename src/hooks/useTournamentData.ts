import { useMemo } from "react";
import { useEnrichedMatches } from "./useGames";
import { useGroups } from "./useGroups";
import { useStadiums, useTeams } from "./useCatalog";
import type { Stadium, Team } from "@/api/types";

export function useTournamentData() {
  const matchesQuery = useEnrichedMatches();
  const teamsQuery = useTeams();
  const stadiumsQuery = useStadiums();
  const groupsQuery = useGroups();

  const teamMap = useMemo(() => {
    const teams = teamsQuery.data ?? [];
    return new Map<string, Team>(teams.map((team) => [team.id, team]));
  }, [teamsQuery.data]);

  const stadiumMap = useMemo(() => {
    const stadiums = stadiumsQuery.data ?? [];
    return new Map<string, Stadium>(
      stadiums.map((stadium) => [stadium.id, stadium]),
    );
  }, [stadiumsQuery.data]);

  const isLoading =
    matchesQuery.isLoading ||
    teamsQuery.isLoading ||
    stadiumsQuery.isLoading ||
    groupsQuery.isLoading;

  const isError =
    matchesQuery.isError ||
    teamsQuery.isError ||
    stadiumsQuery.isError ||
    groupsQuery.isError;

  return {
    matches: matchesQuery.matches,
    teams: teamsQuery.data ?? [],
    stadiums: stadiumsQuery.data ?? [],
    groups: groupsQuery.data ?? [],
    teamMap,
    stadiumMap,
    isLoading,
    isError,
    error:
      matchesQuery.error ??
      teamsQuery.error ??
      stadiumsQuery.error ??
      groupsQuery.error,
    dataUpdatedAt: matchesQuery.dataUpdatedAt,
    refetchMatches: matchesQuery.refetch,
  };
}
