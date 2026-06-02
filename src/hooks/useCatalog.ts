import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { loadStadiums, loadTeams } from "@/api/tournamentData";
import type { Stadium, Team } from "@/api/types";
import {
  getTournamentDataSource,
  useExampleDataEnabled,
} from "@/stores/preferencesStore";

const catalogStaleTime = 1000 * 60 * 60;

export function useTeams() {
  useExampleDataEnabled();
  const source = getTournamentDataSource();

  return useQuery({
    queryKey: queryKeys.teams(source),
    queryFn: loadTeams,
    staleTime: catalogStaleTime,
  });
}

export function useStadiums() {
  useExampleDataEnabled();
  const source = getTournamentDataSource();

  return useQuery({
    queryKey: queryKeys.stadiums(source),
    queryFn: loadStadiums,
    staleTime: catalogStaleTime,
  });
}

export function useTeamMap(): Map<string, Team> {
  const { data: teams = [] } = useTeams();
  return new Map(teams.map((team) => [team.id, team]));
}

export function useStadiumMap(): Map<string, Stadium> {
  const { data: stadiums = [] } = useStadiums();
  return new Map(stadiums.map((stadium) => [stadium.id, stadium]));
}
