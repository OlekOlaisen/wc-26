import type { FinishedFlag, MatchStatus } from "@/api/types";

export function deriveMatchStatus(
  finished: FinishedFlag,
  timeElapsed: string,
  kickoffAt: Date,
  now: Date = new Date(),
): MatchStatus {
  if (finished === "TRUE") {
    return "finished";
  }

  const elapsed = timeElapsed.toLowerCase().trim();

  if (elapsed !== "notstarted" && elapsed !== "") {
    return "live";
  }

  if (kickoffAt.getTime() <= now.getTime()) {
    return "live";
  }

  return "upcoming";
}

export function hasAnyLiveMatch(
  statuses: MatchStatus[],
): boolean {
  return statuses.some((status) => status === "live");
}
