import type { Group } from "@/api/types";

export const EXAMPLE_GROUPS: Group[] = [
  {
    name: "A",
    teams: [
      {
        team_id: "ex-team-mex",
        mp: "3",
        w: "2",
        l: "0",
        d: "1",
        pts: "7",
        gf: "5",
        ga: "2",
        gd: "3",
      },
      {
        team_id: "ex-team-jpn",
        mp: "3",
        w: "1",
        l: "1",
        d: "1",
        pts: "4",
        gf: "4",
        ga: "4",
        gd: "0",
      },
      {
        team_id: "ex-team-bra",
        mp: "3",
        w: "0",
        l: "2",
        d: "1",
        pts: "1",
        gf: "2",
        ga: "5",
        gd: "-3",
      },
    ],
  },
  {
    name: "D",
    teams: [
      {
        team_id: "ex-team-usa",
        mp: "3",
        w: "2",
        l: "0",
        d: "1",
        pts: "7",
        gf: "6",
        ga: "3",
        gd: "3",
      },
      {
        team_id: "ex-team-eng",
        mp: "3",
        w: "1",
        l: "1",
        d: "1",
        pts: "4",
        gf: "3",
        ga: "3",
        gd: "0",
      },
      {
        team_id: "ex-team-ger",
        mp: "3",
        w: "0",
        l: "2",
        d: "1",
        pts: "1",
        gf: "2",
        ga: "5",
        gd: "-3",
      },
    ],
  },
];

export function getExampleGroups(): Group[] {
  return EXAMPLE_GROUPS;
}
