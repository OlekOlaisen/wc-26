import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
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
  isWinner,
}: {
  name: string;
  flag?: string;
  score: string;
  align: "left" | "right";
  isWinner?: boolean;
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
      {isWinner && <WinnerTrophy className="h-4 w-4" />}
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

  return (
    <Link
      to={`/match/${match.id}`}
      className="block rounded-lg border p-3 transition-colors hover:bg-accent/30"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] leading-tight"
            >
              {match.stageLabel}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              #{match.id}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CompactTeamRow
            name={match.homeDisplayName}
            flag={match.homeFlag}
            score={showScore ? match.home_score : ""}
            align="left"
            isWinner={winnerSide === "home"}
          />
          {showScore && (
            <span className="shrink-0 text-xs text-muted-foreground">–</span>
          )}
          <CompactTeamRow
            name={match.awayDisplayName}
            flag={match.awayFlag}
            score={showScore ? match.away_score : ""}
            align="right"
            isWinner={winnerSide === "away"}
          />
        </div>
      </div>
    </Link>
  );
}
