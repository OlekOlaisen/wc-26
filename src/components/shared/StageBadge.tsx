import { Badge } from "@/components/ui/badge";
import {
  getStageBadgeClassName,
  isFinalMatchType,
} from "@/lib/stageBadgeStyles";
import { cn } from "@/lib/utils";

interface StageBadgeProps {
  stageLabel: string;
  matchType: string;
  group?: string;
  className?: string;
}

export function StageBadge({
  stageLabel,
  matchType,
  group,
  className,
}: StageBadgeProps) {
  if (isFinalMatchType(matchType)) {
    return (
      <span
        className={cn("final-stage-badge shrink-0", className)}
      >
        {stageLabel}
      </span>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0",
        getStageBadgeClassName(matchType, group),
        className,
      )}
    >
      {stageLabel}
    </Badge>
  );
}
