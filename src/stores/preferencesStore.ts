import { useSyncExternalStore } from "react";
import { readJsonStorage, writeJsonStorage } from "./storage";

const STORAGE_KEY = "wc2026-preferences";

export interface UserPreferences {
  timezone: string;
}

function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

const defaultPreferences: UserPreferences = {
  timezone: getDefaultTimezone(),
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

export const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern (US)" },
  { value: "America/Chicago", label: "Central (US)" },
  { value: "America/Denver", label: "Mountain (US)" },
  { value: "America/Los_Angeles", label: "Pacific (US)" },
  { value: "America/Mexico_City", label: "Mexico City" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "UTC", label: "UTC" },
] as const;
