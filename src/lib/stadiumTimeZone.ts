import type { Stadium } from "@/api/types";

/**
 * API `local_date` is wall-clock time at the match venue, not the user's timezone.
 */
export function getStadiumTimeZone(stadium: Stadium | undefined): string {
  if (!stadium) {
    return "America/New_York";
  }

  if (stadium.country_en === "Mexico") {
    return "America/Mexico_City";
  }

  if (stadium.country_en === "Canada") {
    switch (stadium.region) {
      case "Pacific":
        return "America/Vancouver";
      case "Mountain":
        return "America/Edmonton";
      case "Central":
        return "America/Winnipeg";
      default:
        return "America/Toronto";
    }
  }

  if (stadium.country_en === "United States") {
    switch (stadium.region) {
      case "Pacific":
        return "America/Los_Angeles";
      case "Mountain":
        return "America/Denver";
      case "Central":
        return "America/Chicago";
      case "Eastern":
      default:
        return "America/New_York";
    }
  }

  return "UTC";
}
