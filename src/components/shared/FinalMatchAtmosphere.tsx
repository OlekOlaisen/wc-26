import type { MatchWinnerSide } from "@/lib/matchWinner";
import { cn } from "@/lib/utils";

interface FinalMatchAtmosphereProps {
  winnerSide: MatchWinnerSide | null;
}

export function FinalMatchAtmosphere({ winnerSide }: FinalMatchAtmosphereProps) {
  return (
    <>
      <div
        aria-hidden
        className="final-match-ambience pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      {winnerSide ? (
        <div
          aria-hidden
          className={cn(
            "final-match-winner-glow winner-gradient-overlay pointer-events-none absolute inset-0 rounded-[inherit]",
            winnerSide === "home"
              ? "bg-gradient-to-r from-amber-400/35 via-amber-500/15 to-transparent"
              : "bg-gradient-to-l from-amber-400/35 via-amber-500/15 to-transparent",
          )}
        />
      ) : null}
      <div
        aria-hidden
        className="final-match-shine pointer-events-none absolute inset-x-0 top-0 h-px rounded-[inherit]"
      />
    </>
  );
}
