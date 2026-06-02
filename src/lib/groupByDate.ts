import type { EnrichedMatch } from "@/api/types";
import { addDays, eachDayOfInterval, isSameDay } from "date-fns";

export const TOURNAMENT_START = new Date(2026, 5, 11);
export const TOURNAMENT_END = new Date(2026, 6, 19);

export function getTournamentDays(): Date[] {
  return eachDayOfInterval({
    start: TOURNAMENT_START,
    end: TOURNAMENT_END,
  });
}

export function groupMatchesByDate(
  matches: EnrichedMatch[],
): Map<string, EnrichedMatch[]> {
  const grouped = new Map<string, EnrichedMatch[]>();

  for (const match of matches) {
    const existing = grouped.get(match.dateKey) ?? [];
    existing.push(match);
    grouped.set(match.dateKey, existing);
  }

  return grouped;
}

export function getDefaultSelectedDateKey(
  matches: EnrichedMatch[],
): string {
  const todayKey = findTodayDateKey();
  if (todayKey) {
    return todayKey;
  }

  const upcoming = matches.find((match) => match.status === "upcoming");
  if (upcoming) {
    return upcoming.dateKey;
  }

  const last = matches[matches.length - 1];
  return last?.dateKey ?? "2026-06-11";
}

export function findTodayDateKey(): string | null {
  const today = new Date();
  const days = getTournamentDays();
  const matchDay = days.find((day) => isSameDay(day, today));
  if (!matchDay) {
    return null;
  }
  return `${matchDay.getFullYear()}-${String(matchDay.getMonth() + 1).padStart(2, "0")}-${String(matchDay.getDate()).padStart(2, "0")}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const shifted = addDays(new Date(year, month - 1, day), deltaDays);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}-${String(shifted.getDate()).padStart(2, "0")}`;
}
