import { Link } from "react-router-dom";
import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
import { StadiumVenueLine } from "@/components/stadiums/StadiumMeta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedMatch } from "@/api/types";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import { usePreferences } from "@/stores/preferencesStore";

interface BracketMatchSlotProps {
  match: EnrichedMatch;
}

export function BracketMatchSlot({ match }: BracketMatchSlotProps) {
  usePreferences();
  const showScore =
    match.status === "live" || match.status === "finished";
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;

  return (
    <Link to={`/match/${match.id}`} className="block cursor-pointer">
      <Card className="transition-colors hover:bg-accent/30">
        <CardContent className="space-y-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted-foreground">#{match.id}</span>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
              {match.status === "live" && (
                <Badge variant="live">LIVE</Badge>
              )}
              <Badge
                variant="secondary"
                className="h-auto flex-col items-end gap-0 py-0.5 text-right text-[10px] leading-tight"
              >
                <span>
                  {formatDateInUserTimezone(match.kickoffAt, "EEE, MMM d")}
                </span>
                <span className="font-normal text-muted-foreground">
                  {formatKickoffInUserTimezone(match.kickoffAt)}
                </span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="flex min-w-0 flex-1 items-center justify-end gap-1 text-right leading-tight">
              {winnerSide === "home" && (
                <WinnerTrophy className="h-4 w-4" />
              )}
              <span className="line-clamp-2">{match.homeDisplayName}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
              {showScore ? (
                <>
                  <span className="font-bold tabular-nums text-foreground">
                    {match.home_score}
                  </span>
                  <span aria-hidden>–</span>
                  <span className="font-bold tabular-nums text-foreground">
                    {match.away_score}
                  </span>
                </>
              ) : (
                <span aria-hidden>–</span>
              )}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1 leading-tight">
              {winnerSide === "away" && (
                <WinnerTrophy className="h-4 w-4" />
              )}
              <span className="line-clamp-2">{match.awayDisplayName}</span>
            </span>
          </div>
          {match.stadium && <StadiumVenueLine stadium={match.stadium} />}
        </CardContent>
      </Card>
    </Link>
  );
}
