import type { ReactNode } from "react";
import { StageBadge } from "@/components/shared/StageBadge";
import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
import { Badge } from "@/components/ui/badge";
import { isFinalMatchType } from "@/lib/stageBadgeStyles";
import type { MatchWinnerSide } from "@/lib/matchWinner";
import { cn } from "@/lib/utils";

interface MatchCardStageHeaderProps {
  stageLabel: string;
  matchType: string;
  group?: string;
  winnerSide?: MatchWinnerSide | null;
  isFavorite?: boolean;
  trailing?: ReactNode;
  className?: string;
  badgeClassName?: string;
  crownClassName?: string;
}

export function MatchCardStageHeader({
  stageLabel,
  matchType,
  group,
  winnerSide = null,
  isFavorite = false,
  trailing,
  className,
  badgeClassName,
  crownClassName,
}: MatchCardStageHeaderProps) {
  const isFinal = isFinalMatchType(matchType);
  const resolvedCrownClassName = crownClassName ?? (isFinal ? "h-5 w-5" : "h-4 w-4");

  return (
    <div
      className={cn(
        "grid min-h-7 grid-cols-[1fr_auto_1fr] items-center gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-start gap-1.5">
        {isFavorite && (
          <Badge variant="outline" className="text-primary">
            ★
          </Badge>
        )}
        {winnerSide === "home" && (
          <WinnerTrophy className={resolvedCrownClassName} />
        )}
      </div>

      <StageBadge
        stageLabel={stageLabel}
        matchType={matchType}
        group={group}
        className={badgeClassName}
      />

      <div className="flex items-center justify-end gap-1.5">
        {winnerSide === "away" && (
          <WinnerTrophy className={resolvedCrownClassName} />
        )}
        {trailing}
      </div>
    </div>
  );
}
