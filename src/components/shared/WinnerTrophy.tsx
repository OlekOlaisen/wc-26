import * as React from "react";
import { cn } from "@/lib/utils";

const WINNER_TROPHY_SRC = "/images/winner-trophy.svg";

export type WinnerTrophyProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
>;

export function WinnerTrophy({ className, ...props }: WinnerTrophyProps) {
  return (
    <img
      src={WINNER_TROPHY_SRC}
      alt="Winner"
      className={cn("shrink-0 object-contain drop-shadow-sm", className)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
