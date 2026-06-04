import { format } from "date-fns";

/** API `local_date` format: MM/dd/yyyy HH:mm */
export function formatExampleLocalDate(date: Date): string {
  return format(date, "MM/dd/yyyy HH:mm");
}

export function hoursFromNow(hours: number): string {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return formatExampleLocalDate(date);
}

export function daysFromNow(days: number, hour = 15): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatExampleLocalDate(date);
}

export function fixedExampleLocalDate(
  year: number,
  month: number,
  day: number,
  hour = 15,
): string {
  const date = new Date(year, month - 1, day, hour, 0, 0, 0);
  return formatExampleLocalDate(date);
}
