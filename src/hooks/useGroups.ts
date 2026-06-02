import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import type { Group } from "@/api/types";

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: async () => {
      const response = await getGroups();
      return response.groups.sort((left, right) =>
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
