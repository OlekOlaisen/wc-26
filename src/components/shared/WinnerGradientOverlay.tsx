import { FinalMatchAtmosphere } from "@/components/shared/FinalMatchAtmosphere";
import type { MatchWinnerSide } from "@/lib/matchWinner";
import { cn } from "@/lib/utils";

export type WinnerGradientVariant = "default" | "final";

interface WinnerGradientOverlayProps {
  winnerSide: MatchWinnerSide | null;
  variant?: WinnerGradientVariant;
}

export function WinnerGradientOverlay({
  winnerSide,
  variant = "default",
}: WinnerGradientOverlayProps) {
  if (variant === "final") {
    return <FinalMatchAtmosphere winnerSide={winnerSide} />;
  }

  if (!winnerSide) {
    return null;
  }

  return (
    <div
      aria-hidden
      className={cn(
        "winner-gradient-overlay pointer-events-none absolute inset-0 rounded-[inherit]",
        winnerSide === "home"
          ? "bg-gradient-to-r from-primary/25 via-primary/10 to-transparent"
          : "bg-gradient-to-l from-primary/25 via-primary/10 to-transparent",
      )}
    />
  );
}

export function getWinnerGradientVariant(
  matchType: string,
): WinnerGradientVariant {
  return matchType === "final" ? "final" : "default";
}

export { isFinalMatchType as isFinalMatch } from "@/lib/stageBadgeStyles";

export const finalMatchCardClassName = "final-match-card";
