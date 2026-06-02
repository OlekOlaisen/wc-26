import { format, parse } from "date-fns";

/** Parses API `local_date` format: MM/DD/YYYY HH:mm */
export function parseMatchLocalDate(localDate: string): Date {
  return parse(localDate.trim(), "MM/dd/yyyy HH:mm", new Date());
}

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatKickoffTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatDateStripLabel(date: Date): string {
  return format(date, "MMM d");
}

export function formatWeekdayShort(date: Date): string {
  return format(date, "EEE");
}
