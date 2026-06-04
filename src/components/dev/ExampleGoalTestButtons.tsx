import { useQueryClient } from "@tanstack/react-query";
import { Goal } from "lucide-react";
import { queryKeys } from "@/api/queryKeys";
import type { EnrichedMatch } from "@/api/types";
import { Button } from "@/components/ui/button";
import { getExampleGames, simulateExampleGoal } from "@/data/example/games";
import { useExampleDataEnabled } from "@/stores/preferencesStore";

interface ExampleGoalTestButtonsProps {
  match: EnrichedMatch;
}

export function ExampleGoalTestButtons({ match }: ExampleGoalTestButtonsProps) {
  const useExampleData = useExampleDataEnabled();
  const queryClient = useQueryClient();

  if (!useExampleData || match.status !== "live") {
    return null;
  }

  function handleSimulateGoal(side: "home" | "away") {
    const didScore = simulateExampleGoal(match.id, side);
    if (!didScore) {
      return;
    }

    queryClient.setQueryData(queryKeys.games("example"), getExampleGames());
  }

  return (
    <div
      className="pointer-events-auto flex flex-wrap gap-2 border-t border-dashed border-border/80 pt-3"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <p className="w-full text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Example: simulate goal
      </p>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-8 gap-1.5 text-xs"
        onClick={() => handleSimulateGoal("home")}
      >
        <Goal className="h-3.5 w-3.5" aria-hidden />
        {match.homeDisplayName} scores
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-8 gap-1.5 text-xs"
        onClick={() => handleSimulateGoal("away")}
      >
        <Goal className="h-3.5 w-3.5" aria-hidden />
        {match.awayDisplayName} scores
      </Button>
    </div>
  );
}
