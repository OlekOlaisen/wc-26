import { MatchCardStageHeader } from "@/components/shared/MatchCardStageHeader";
import {
  finalMatchCardClassName,
  getWinnerGradientVariant,
  isFinalMatch,
  WinnerGradientOverlay,
} from "@/components/shared/WinnerGradientOverlay";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { EnrichedMatch } from "@/api/types";
import { getMatchWinnerSide } from "@/lib/matchWinner";
import {
  formatDateInUserTimezone,
  formatKickoffInUserTimezone,
} from "@/lib/formatMatchTime";
import { usePreferences } from "@/stores/preferencesStore";
import { cn } from "@/lib/utils";

interface SearchMatchCardProps {
  match: EnrichedMatch;
}

function CompactTeamRow({
  name,
  flag,
  score,
  align,
}: {
  name: string;
  flag?: string;
  score: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-1.5",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      {flag ? (
        <img
          src={flag}
          alt=""
          className="h-5 w-7 shrink-0 rounded object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-5 w-7 shrink-0 items-center justify-center rounded bg-muted text-[9px] text-muted-foreground">
          ?
        </div>
      )}
      <span className="truncate text-sm font-medium leading-tight">{name}</span>
      {score !== "" && (
        <span className="shrink-0 text-lg font-bold tabular-nums leading-none">
          {score}
        </span>
      )}
    </div>
  );
}

export function SearchMatchCard({ match }: SearchMatchCardProps) {
  usePreferences();
  const showScore =
    match.status === "live" || match.status === "finished";
  const winnerSide =
    match.status === "finished"
      ? getMatchWinnerSide(match.home_score, match.away_score)
      : null;
  const isFinal = isFinalMatch(match.type);

  return (
    <Link
      to={`/match/${match.id}`}
      className={cn(
        "relative block overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent/30",
        isFinal && finalMatchCardClassName,
      )}
    >
      <WinnerGradientOverlay
        winnerSide={winnerSide}
        variant={getWinnerGradientVariant(match.type)}
      />
      <div className="relative z-10 space-y-2">
        <MatchCardStageHeader
          stageLabel={match.stageLabel}
          matchType={match.type}
          group={match.group}
          winnerSide={winnerSide}
          badgeClassName="px-1.5 py-0 text-[10px] leading-tight"
          trailing={
            <>
              {match.status === "live" && (
                <Badge variant="live">LIVE</Badge>
              )}
              {!showScore && (
                <Badge
                  variant="secondary"
                  className="h-auto flex-col items-end gap-0 px-1.5 py-0.5 text-right text-[10px] leading-tight"
                >
                  <span>
                    {formatDateInUserTimezone(match.kickoffAt, "EEE, MMM d")}
                  </span>
                  <span className="font-normal text-muted-foreground">
                    {formatKickoffInUserTimezone(match.kickoffAt)}
                  </span>
                </Badge>
              )}
            </>
          }
        />

        <div className="flex items-center gap-2">
          <CompactTeamRow
            name={match.homeDisplayName}
            flag={match.homeFlag}
            score={showScore ? match.home_score : ""}
            align="left"
          />
          {showScore && (
            <span className="shrink-0 text-xs text-muted-foreground">–</span>
          )}
          <CompactTeamRow
            name={match.awayDisplayName}
            flag={match.awayFlag}
            score={showScore ? match.away_score : ""}
            align="right"
          />
        </div>
      </div>
    </Link>
  );
}
