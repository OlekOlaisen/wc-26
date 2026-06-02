import type { EnrichedMatch } from "@/api/types";

function formatIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildCalendarIcs(matches: EnrichedMatch[]): string {
  const events = matches.map((match) => {
    const end = new Date(match.kickoffAt.getTime() + 2 * 60 * 60 * 1000);
    const summary = `${match.homeDisplayName} vs ${match.awayDisplayName}`;
    const location = match.stadium
      ? `${match.stadium.name_en}, ${match.stadium.city_en}`
      : "";
    const description = `FIFA World Cup 2026 — Match #${match.id} (${match.stageLabel})`;

    return [
      "BEGIN:VEVENT",
      `UID:wc2026-match-${match.id}@worldcup2026`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(match.kickoffAt)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      location ? `LOCATION:${escapeIcsText(location)}` : "",
      `DESCRIPTION:${escapeIcsText(description)}`,
      "END:VEVENT",
    ]
      .filter(Boolean)
      .join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//World Cup 2026 PWA//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:FIFA World Cup 2026",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadCalendarIcs(
  matches: EnrichedMatch[],
  filename = "world-cup-2026.ics",
): void {
  const content = buildCalendarIcs(matches);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
