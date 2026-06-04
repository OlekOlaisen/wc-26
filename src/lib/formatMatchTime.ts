import { formatInTimeZone } from "date-fns-tz";
import { getPreferences } from "@/stores/preferencesStore";

export function getKickoffTimePattern(use24HourClock?: boolean): string {
  const preferences = getPreferences();
  const use24Hour =
    use24HourClock ?? preferences.use24HourClock ?? true;
  return use24Hour ? "HH:mm" : "h:mm a";
}

export function formatKickoffInUserTimezone(
  date: Date,
  pattern?: string,
): string {
  const { timezone } = getPreferences();
  const resolvedPattern = pattern ?? getKickoffTimePattern();
  return formatInTimeZone(date, timezone, resolvedPattern);
}

export function formatDateInUserTimezone(
  date: Date,
  pattern = "EEEE, MMM d, yyyy",
): string {
  const { timezone } = getPreferences();
  return formatInTimeZone(date, timezone, pattern);
}

export function formatDateTimeInUserTimezone(date: Date): string {
  return `${formatDateInUserTimezone(date)} at ${formatKickoffInUserTimezone(date)}`;
}

/** Calendar day for schedule grouping, in the user's selected timezone. */
export function getMatchDateKey(kickoffAt: Date): string {
  const { timezone } = getPreferences();
  return formatInTimeZone(kickoffAt, timezone, "yyyy-MM-dd");
}
