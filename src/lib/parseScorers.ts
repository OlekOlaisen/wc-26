import type { GoalScorer } from "@/api/types";

export function parseScorers(raw: string | undefined | null): GoalScorer[] {
  if (!raw || raw === "null" || raw.trim() === "") {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(
        (entry): entry is GoalScorer =>
          typeof entry === "object" &&
          entry !== null &&
          "name" in entry &&
          "minute" in entry,
      )
      .map((entry) => ({
        name: String(entry.name),
        minute: String(entry.minute),
      }));
  } catch {
    return [];
  }
}
