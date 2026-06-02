import {
  getExampleGames,
  getExampleGroups,
  getExampleStadiums,
  getExampleTeams,
} from "@/data/example";
import { getGames, getGroups, getStadiums, getTeams } from "@/api/endpoints";
import type { Game, Group, Stadium, Team } from "@/api/types";
import { getPreferences } from "@/stores/preferencesStore";

function useExampleData(): boolean {
  return getPreferences().useExampleData;
}

export async function loadTeams(): Promise<Team[]> {
  if (useExampleData()) {
    return getExampleTeams();
  }
  const response = await getTeams();
  return response.teams;
}

export async function loadStadiums(): Promise<Stadium[]> {
  if (useExampleData()) {
    return getExampleStadiums();
  }
  const response = await getStadiums();
  return response.stadiums;
}

export async function loadGames(): Promise<Game[]> {
  if (useExampleData()) {
    return getExampleGames();
  }
  const response = await getGames();
  return response.games;
}

export async function loadGroups(): Promise<Group[]> {
  if (useExampleData()) {
    return getExampleGroups();
  }
  const response = await getGroups();
  return response.groups;
}
