import { format, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

/** Parses API `local_date` format: MM/dd/yyyy HH:mm (wall clock at the venue). */
export function parseMatchLocalDate(
  localDate: string,
  venueTimeZone: string,
): Date {
  const parsed = parse(localDate.trim(), "MM/dd/yyyy HH:mm", new Date());
  const wallClock = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    parsed.getHours(),
    parsed.getMinutes(),
    0,
    0,
  );
  return fromZonedTime(wallClock, venueTimeZone);
}

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatKickoffTime(date: Date): string {
  return format(date, "HH:mm");
}

export function formatDateStripLabel(date: Date): string {
  return format(date, "MMM d");
}

export function formatWeekdayShort(date: Date): string {
  return format(date, "EEE");
}
