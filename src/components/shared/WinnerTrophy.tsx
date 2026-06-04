import { Crown, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export type WinnerTrophyProps = LucideProps;

export function WinnerTrophy({ className, ...props }: WinnerTrophyProps) {
  return (
    <Crown
      aria-label="Winner"
      className={cn(
        "shrink-0 fill-amber-400/25 text-amber-400 drop-shadow-sm",
        className,
      )}
      strokeWidth={2}
      {...props}
    />
  );
}
