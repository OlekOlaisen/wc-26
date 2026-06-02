import { useQuery } from "@tanstack/react-query";
import { getStadiums, getTeams } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import type { Stadium, Team } from "@/api/types";

const catalogStaleTime = 1000 * 60 * 60;

export function useTeams() {
  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: async () => {
      const response = await getTeams();
      return response.teams;
    },
    staleTime: catalogStaleTime,
  });
}

export function useStadiums() {
  return useQuery({
    queryKey: queryKeys.stadiums,
    queryFn: async () => {
      const response = await getStadiums();
      return response.stadiums;
    },
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
