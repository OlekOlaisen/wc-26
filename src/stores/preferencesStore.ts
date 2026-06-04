import { useSyncExternalStore } from "react";
import { readJsonStorage, writeJsonStorage } from "./storage";

const STORAGE_KEY = "wc2026-preferences";

export interface UserPreferences {
  timezone: string;
  use24HourClock: boolean;
  useExampleData: boolean;
}

export const DEFAULT_TIMEZONE = "Europe/Oslo";

function getDefaultTimezone(): string {
  return DEFAULT_TIMEZONE;
}

const defaultPreferences: UserPreferences = {
  timezone: getDefaultTimezone(),
  use24HourClock: true,
  useExampleData: false,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function loadPreferences(): UserPreferences {
  const stored = readJsonStorage<UserPreferences>(STORAGE_KEY, defaultPreferences);
  return {
    timezone: stored.timezone || defaultPreferences.timezone,
    use24HourClock: stored.use24HourClock ?? defaultPreferences.use24HourClock,
    useExampleData: stored.useExampleData ?? defaultPreferences.useExampleData,
  };
}

let preferencesSnapshot: UserPreferences = loadPreferences();

function getSnapshot(): UserPreferences {
  return preferencesSnapshot;
}

export function getPreferences(): UserPreferences {
  return preferencesSnapshot;
}

export function updatePreferences(
  partial: Partial<UserPreferences>,
): void {
  preferencesSnapshot = { ...preferencesSnapshot, ...partial };
  writeJsonStorage(STORAGE_KEY, preferencesSnapshot);
  emitChange();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePreferences(): UserPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaultPreferences);
}

export function useExampleDataEnabled(): boolean {
  return usePreferences().useExampleData;
}

export type TournamentDataSource = "api" | "example";

export function getTournamentDataSource(): TournamentDataSource {
  return getPreferences().useExampleData ? "example" : "api";
}

export const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern (US)" },
  { value: "America/Chicago", label: "Central (US)" },
  { value: "America/Denver", label: "Mountain (US)" },
  { value: "America/Los_Angeles", label: "Pacific (US)" },
  { value: "America/Mexico_City", label: "Mexico City" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "Europe/Oslo", label: "Norway (Oslo)" },
  { value: "Europe/London", label: "United Kingdom (London)" },
  { value: "Europe/Paris", label: "Central Europe (Paris)" },
  { value: "Europe/Berlin", label: "Central Europe (Berlin)" },
  { value: "Europe/Madrid", label: "Spain (Madrid)" },
  { value: "Europe/Rome", label: "Italy (Rome)" },
  { value: "Europe/Amsterdam", label: "Netherlands (Amsterdam)" },
  { value: "Europe/Stockholm", label: "Sweden (Stockholm)" },
  { value: "Europe/Copenhagen", label: "Denmark (Copenhagen)" },
  { value: "Asia/Tokyo", label: "Japan (Tokyo)" },
  { value: "Australia/Sydney", label: "Australia (Sydney)" },
  { value: "UTC", label: "UTC" },
] as const;
