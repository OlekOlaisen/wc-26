import type { EnrichedMatch, Game, Stadium, Team } from "@/api/types";
import { deriveMatchStatus } from "./matchStatus";
import { parseMatchLocalDate, toDateKey } from "./parseMatchDate";
import { parseScorers } from "./parseScorers";
import { getStageLabel } from "./stageLabel";

function resolveTeamName(
  game: Game,
  side: "home" | "away",
  teamMap: Map<string, Team>,
): string {
  const teamId = side === "home" ? game.home_team_id : game.away_team_id;
  const label =
    side === "home" ? game.home_team_label : game.away_team_label;
  const apiName =
    side === "home" ? game.home_team_name_en : game.away_team_name_en;

  if (teamId === "0" && label) {
    return label;
  }

  if (apiName) {
    return apiName;
  }

  const team = teamMap.get(teamId);
  return team?.name_en ?? (label || "TBD");
}

function resolveTeamFlag(
  teamId: string,
  teamMap: Map<string, Team>,
): string | undefined {
  if (teamId === "0") {
    return undefined;
  }
  return teamMap.get(teamId)?.flag;
}

export function enrichMatch(
  game: Game,
  teamMap: Map<string, Team>,
  stadiumMap: Map<string, Stadium>,
): EnrichedMatch {
  const kickoffAt = parseMatchLocalDate(game.local_date);
  const status = deriveMatchStatus(
    game.finished,
    game.time_elapsed,
    kickoffAt,
  );

  return {
    ...game,
    kickoffAt,
    dateKey: toDateKey(kickoffAt),
    status,
    homeDisplayName: resolveTeamName(game, "home", teamMap),
    awayDisplayName: resolveTeamName(game, "away", teamMap),
    homeFlag: resolveTeamFlag(game.home_team_id, teamMap),
    awayFlag: resolveTeamFlag(game.away_team_id, teamMap),
    stadium: stadiumMap.get(game.stadium_id),
    homeScorersList: parseScorers(game.home_scorers),
    awayScorersList: parseScorers(game.away_scorers),
    stageLabel: getStageLabel(game),
  };
}

export function enrichMatches(
  games: Game[],
  teams: Team[],
  stadiums: Stadium[],
): EnrichedMatch[] {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const stadiumMap = new Map(
    stadiums.map((stadium) => [stadium.id, stadium]),
  );

  return games
    .map((game) => enrichMatch(game, teamMap, stadiumMap))
    .sort(
      (left, right) =>
        left.kickoffAt.getTime() - right.kickoffAt.getTime(),
    );
}
