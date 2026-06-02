import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { loadGroups } from "@/api/tournamentData";
import type { Group } from "@/api/types";
import {
  getTournamentDataSource,
  useExampleDataEnabled,
} from "@/stores/preferencesStore";

export function useGroups() {
  useExampleDataEnabled();
  const source = getTournamentDataSource();

  return useQuery({
    queryKey: queryKeys.groups(source),
    queryFn: async () => {
      const groups = await loadGroups();
      return groups.sort((left, right) =>
        left.name.localeCompare(right.name),
      );
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

export function sortGroupStandings(group: Group) {
  return [...group.teams].sort((left, right) => {
    const pointsDiff = Number(right.pts) - Number(left.pts);
    if (pointsDiff !== 0) {
      return pointsDiff;
    }
    return Number(right.gd) - Number(left.gd);
  });
}
