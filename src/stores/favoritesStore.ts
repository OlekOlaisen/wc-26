import { useSyncExternalStore } from "react";
import { readJsonStorage, writeJsonStorage } from "./storage";

const STORAGE_KEY = "wc2026-favorite-teams";
const EMPTY_FAVORITES: string[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function loadFavoriteTeamIds(): string[] {
  const stored = readJsonStorage<string[]>(STORAGE_KEY, EMPTY_FAVORITES);
  return stored.length > 0 ? stored : EMPTY_FAVORITES;
}

let favoriteTeamIdsSnapshot: string[] = loadFavoriteTeamIds();

function getSnapshot(): string[] {
  return favoriteTeamIdsSnapshot;
}

export function getFavoriteTeamIds(): string[] {
  return favoriteTeamIdsSnapshot;
}

export function isFavoriteTeam(teamId: string): boolean {
  return favoriteTeamIdsSnapshot.includes(teamId);
}

export function toggleFavoriteTeam(teamId: string): void {
  const current =
    favoriteTeamIdsSnapshot === EMPTY_FAVORITES
      ? []
      : [...favoriteTeamIdsSnapshot];
  const next = current.includes(teamId)
    ? current.filter((id) => id !== teamId)
    : [...current, teamId];
  favoriteTeamIdsSnapshot = next.length > 0 ? next : EMPTY_FAVORITES;
  writeJsonStorage(STORAGE_KEY, next);
  emitChange();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFavoriteTeamIds(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_FAVORITES);
}

export function useIsFavoriteTeam(teamId: string): boolean {
  const favorites = useFavoriteTeamIds();
  return favorites.includes(teamId);
}
