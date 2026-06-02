import { apiFetch } from "./client";
import type { Game, Group, Stadium, Team } from "./types";

export function getGames() {
  return apiFetch<{ games: Game[] }>("/get/games");
}

export function getTeams() {
  return apiFetch<{ teams: Team[] }>("/get/teams");
}

export function getStadiums() {
  return apiFetch<{ stadiums: Stadium[] }>("/get/stadiums");
}

export function getGroups() {
  return apiFetch<{ groups: Group[] }>("/get/groups");
}

export function getGame(gameId: string) {
  return apiFetch<{ game: Game }>(`/get/game/${gameId}`);
}

export function getTeam(teamId: string) {
  return apiFetch<{ team: Team }>(`/get/team/${teamId}`);
}

export function getStadium(stadiumId: string) {
  return apiFetch<{ stadium: Stadium }>(`/get/stadium/${stadiumId}`);
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
  version?: string;
  environment?: string;
}

export function getHealth() {
  return apiFetch<HealthResponse>("/health");
}
