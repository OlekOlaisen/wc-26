export type MatchWinnerSide = "home" | "away";

export function getMatchWinnerSide(
  homeScore: string,
  awayScore: string,
): MatchWinnerSide | null {
  const homeGoals = Number.parseInt(homeScore, 10);
  const awayGoals = Number.parseInt(awayScore, 10);

  if (Number.isNaN(homeGoals) || Number.isNaN(awayGoals)) {
    return null;
  }

  if (homeGoals > awayGoals) {
    return "home";
  }

  if (awayGoals > homeGoals) {
    return "away";
  }

  return null;
}
