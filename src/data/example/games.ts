import type { Game } from "@/api/types";
import { parseScorers } from "@/lib/parseScorers";
import { daysFromNow, fixedExampleLocalDate, hoursFromNow } from "./dateHelpers";

let exampleGamesCache: Game[] | null = null;

function buildExampleGames(): Game[] {
  return [
    {
      id: "ex-1",
      home_team_id: "ex-team-mex",
      away_team_id: "ex-team-jpn",
      home_score: "2",
      away_score: "1",
      home_scorers: '[{"name":"Lozano","minute":"23"},{"name":"Martin","minute":"67"}]',
      away_scorers: '[{"name":"Minamino","minute":"41"}]',
      group: "A",
      matchday: "3",
      local_date: hoursFromNow(-2),
      stadium_id: "ex-stadium-azteca",
      finished: "FALSE",
      time_elapsed: "67",
      type: "group",
    },
    {
      id: "ex-2",
      home_team_id: "ex-team-usa",
      away_team_id: "ex-team-eng",
      home_score: "0",
      away_score: "2",
      home_scorers: "",
      away_scorers: '[{"name":"Kane","minute":"12"},{"name":"Saka","minute":"58"}]',
      group: "D",
      matchday: "3",
      local_date: daysFromNow(-2, 19),
      stadium_id: "ex-stadium-sofi",
      finished: "TRUE",
      time_elapsed: "90",
      type: "group",
    },
    {
      id: "ex-3",
      home_team_id: "ex-team-bra",
      away_team_id: "ex-team-ger",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "C",
      matchday: "1",
      local_date: daysFromNow(0, 14),
      stadium_id: "ex-stadium-bmo",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "group",
    },
    {
      id: "ex-4",
      home_team_id: "ex-team-fra",
      away_team_id: "ex-team-can",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "I",
      matchday: "1",
      local_date: daysFromNow(1, 16),
      stadium_id: "ex-stadium-bmo",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "group",
    },
    {
      id: "ex-5",
      home_team_id: "ex-team-mex",
      away_team_id: "ex-team-bra",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "A",
      matchday: "2",
      local_date: daysFromNow(3, 20),
      stadium_id: "ex-stadium-azteca",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "group",
    },
    {
      id: "ex-6",
      home_team_id: "ex-team-usa",
      away_team_id: "ex-team-ger",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "D",
      matchday: "2",
      local_date: daysFromNow(5, 18),
      stadium_id: "ex-stadium-sofi",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "group",
    },
    {
      id: "ex-73",
      home_team_id: "0",
      away_team_id: "0",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "",
      matchday: "",
      local_date: daysFromNow(14, 10),
      stadium_id: "ex-stadium-sofi",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "r32",
      home_team_label: "Runner-up Group A",
      away_team_label: "Runner-up Group B",
    },
    {
      id: "ex-74",
      home_team_id: "ex-team-fra",
      away_team_id: "ex-team-jpn",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "",
      matchday: "",
      local_date: daysFromNow(15, 14),
      stadium_id: "ex-stadium-sofi",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "r32",
    },
    {
      id: "ex-75",
      home_team_id: "ex-team-usa",
      away_team_id: "ex-team-eng",
      home_score: "3",
      away_score: "2",
      home_scorers: '[{"name":"Pulisic","minute":"34"},{"name":"Reyna","minute":"71"},{"name":"Weah","minute":"88"}]',
      away_scorers: '[{"name":"Kane","minute":"45"},{"name":"Saka","minute":"62"}]',
      group: "",
      matchday: "",
      local_date: daysFromNow(-5, 16),
      stadium_id: "ex-stadium-sofi",
      finished: "TRUE",
      time_elapsed: "90",
      type: "r32",
    },
    {
      id: "ex-89",
      home_team_id: "0",
      away_team_id: "0",
      home_score: "0",
      away_score: "0",
      home_scorers: "",
      away_scorers: "",
      group: "",
      matchday: "",
      local_date: daysFromNow(21, 19),
      stadium_id: "ex-stadium-azteca",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "r16",
      home_team_label: "Winner Match 75",
      away_team_label: "Winner Match 76",
    },
    {
      id: "ex-99",
      home_team_id: "ex-team-usa",
      away_team_id: "ex-team-fra",
      home_score: "2",
      away_score: "1",
      home_scorers: '[{"name":"Pulisic","minute":"34"},{"name":"Reyna","minute":"89"}]',
      away_scorers: '[{"name":"Griezmann","minute":"62"}]',
      group: "",
      matchday: "",
      local_date: fixedExampleLocalDate(2026, 7, 9, 16),
      stadium_id: "ex-stadium-sofi",
      finished: "TRUE",
      time_elapsed: "90",
      type: "final",
    },
  ];
}

function getMutableExampleGames(): Game[] {
  if (!exampleGamesCache) {
    exampleGamesCache = buildExampleGames();
  }
  return exampleGamesCache;
}

export function getExampleGames(): Game[] {
  return getMutableExampleGames().map((game) => ({ ...game }));
}

export function resetExampleGames(): void {
  exampleGamesCache = buildExampleGames();
}

function parseMatchScore(score: string): number {
  const parsed = Number.parseInt(score, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function resolveGoalMinute(timeElapsed: string): string {
  const elapsed = Number.parseInt(timeElapsed, 10);
  if (Number.isNaN(elapsed) || elapsed <= 0) {
    return "1";
  }
  return String(Math.min(elapsed + 1, 120));
}

export function simulateExampleGoal(
  matchId: string,
  side: "home" | "away",
): boolean {
  const game = getMutableExampleGames().find((entry) => entry.id === matchId);
  if (!game || game.finished === "TRUE") {
    return false;
  }

  const scoreField = side === "home" ? "home_score" : "away_score";
  const scorersField = side === "home" ? "home_scorers" : "away_scorers";
  const nextScore = parseMatchScore(game[scoreField]) + 1;
  const scorers = parseScorers(game[scorersField]);
  const goalMinute = resolveGoalMinute(game.time_elapsed);

  game[scoreField] = String(nextScore);
  scorers.push({ name: "Test Goal", minute: goalMinute });
  game[scorersField] = JSON.stringify(scorers);

  if (game.time_elapsed === "notstarted" || game.time_elapsed === "") {
    game.time_elapsed = goalMinute;
  }

  return true;
}
