import type { ApiFootballTopScorerEntry } from "@/api/apiFootball/types";

function apiSportsPlayerPhoto(playerId: number): string {
  return `https://media.api-sports.io/football/players/${playerId}.png`;
}

function buildExampleScorerEntry(
  playerId: number,
  shortName: string,
  firstname: string,
  lastname: string,
  teamName: string,
): ApiFootballTopScorerEntry {
  return {
    player: {
      id: playerId,
      name: shortName,
      firstname,
      lastname,
      photo: apiSportsPlayerPhoto(playerId),
    },
    statistics: [
      {
        team: {
          id: 0,
          name: teamName,
          logo: "",
        },
      },
    ],
  };
}

/** National-team players with API-Sports photo URLs for example-data mode. */
export const EXAMPLE_SCORER_PHOTO_ENTRIES: ApiFootballTopScorerEntry[] = [
  buildExampleScorerEntry(
    17,
    "C. Pulisic",
    "Christian",
    "Pulisic",
    "United States",
  ),
  buildExampleScorerEntry(
    10329,
    "G. Reyna",
    "Giovanni",
    "Reyna",
    "United States",
  ),
  buildExampleScorerEntry(
    1138,
    "T. Weah",
    "Timothy",
    "Weah",
    "United States",
  ),
  buildExampleScorerEntry(184, "H. Kane", "Harry", "Kane", "England"),
  buildExampleScorerEntry(1460, "B. Saka", "Bukayo", "Saka", "England"),
  buildExampleScorerEntry(248, "H. Lozano", "Hirving", "Lozano", "Mexico"),
  buildExampleScorerEntry(
    3581,
    "H. Martín",
    "Henry",
    "Martín",
    "Mexico",
  ),
  buildExampleScorerEntry(
    1101,
    "T. Minamino",
    "Takumi",
    "Minamino",
    "Japan",
  ),
];
