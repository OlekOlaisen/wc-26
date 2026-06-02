import { formatInTimeZone } from "date-fns-tz";
import { getPreferences } from "@/stores/preferencesStore";

export function formatKickoffInUserTimezone(
  date: Date,
  pattern = "h:mm a",
): string {
  const { timezone } = getPreferences();
  return formatInTimeZone(date, timezone, pattern);
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
