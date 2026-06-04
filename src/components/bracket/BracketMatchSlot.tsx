import { Link } from "react-router-dom";
import { MatchCardStageHeader } from "@/components/shared/MatchCardStageHeader";
import {
  finalMatchCardClassName,
  getWinnerGradientVariant,
  isFinalMatch,
  WinnerGradientOverlay,
} from "@/components/shared/WinnerGradientOverlay";
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
import { cn } from "@/lib/utils";

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
  const isFinal = isFinalMatch(match.type);

  return (
    <Link to={`/match/${match.id}`} className="block cursor-pointer">
      <Card
        className={cn(
          "relative overflow-hidden transition-colors hover:bg-accent/30",
          isFinal && finalMatchCardClassName,
        )}
      >
        <WinnerGradientOverlay
          winnerSide={winnerSide}
          variant={getWinnerGradientVariant(match.type)}
        />
        <CardContent className="relative z-10 space-y-2 p-3">
          <MatchCardStageHeader
            stageLabel={match.stageLabel}
            matchType={match.type}
            group={match.group}
            winnerSide={winnerSide}
            badgeClassName="px-1.5 py-0 text-[10px] leading-tight"
            trailing={
              match.status === "live" ? (
                <Badge variant="live">LIVE</Badge>
              ) : (
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
              )
            }
          />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="flex min-w-0 flex-1 items-center justify-end text-right leading-tight">
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
            <span className="flex min-w-0 flex-1 items-center leading-tight">
              <span className="line-clamp-2">{match.awayDisplayName}</span>
            </span>
          </div>
          {match.stadium && <StadiumVenueLine stadium={match.stadium} />}
        </CardContent>
      </Card>
    </Link>
  );
}
