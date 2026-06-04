import { useEffect, useState } from "react";
import { WinnerTrophy } from "@/components/shared/WinnerTrophy";
import { StageBadge } from "@/components/shared/StageBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MatchDetailContent } from "@/components/shared/MatchDetailContent";
import type { EnrichedMatch } from "@/api/types";
import { isFinalMatchType } from "@/lib/stageBadgeStyles";
import { cn } from "@/lib/utils";

const SHEET_CLOSE_ANIMATION_MS = 300;

interface MatchDetailSheetProps {
  match: EnrichedMatch | null;
  onClose: () => void;
}

export function MatchDetailSheet({ match, onClose }: MatchDetailSheetProps) {
  const [open, setOpen] = useState(false);
  const [displayMatch, setDisplayMatch] = useState<EnrichedMatch | null>(null);

  useEffect(() => {
    if (!match) {
      setOpen(false);
      return;
    }
    setDisplayMatch(match);
    const frameId = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frameId);
  }, [match]);

  useEffect(() => {
    if (open) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setDisplayMatch(null);
    }, SHEET_CLOSE_ANIMATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose();
    }
  }

  const isFinal = displayMatch ? isFinalMatchType(displayMatch.type) : false;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        sheetOpen={open}
        onSwipeClose={() => handleOpenChange(false)}
        className={cn(
          isFinal &&
            "final-match-sheet flex h-[85vh] max-h-[85vh] flex-col overflow-hidden p-0",
        )}
      >
        {displayMatch && isFinal ? (
          <>
            <div aria-hidden className="final-match-sheet-bg" />
            <div
              data-sheet-scroll
              className="final-match-sheet-scroll relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-transparent px-6 pb-10 pt-2 [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
            >
              <SheetHeader className="items-center space-y-3 pb-2 text-center">
                <SheetTitle className="sr-only">
                  {displayMatch.stageLabel}
                </SheetTitle>
                <div className="flex flex-col items-center gap-2.5">
                  <WinnerTrophy className="h-8 w-8" />
                  <StageBadge
                    stageLabel={displayMatch.stageLabel}
                    matchType={displayMatch.type}
                    group={displayMatch.group}
                    className="final-stage-badge--prominent"
                  />
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-200/55">
                    Championship match
                  </p>
                </div>
              </SheetHeader>

              <div className="mt-4">
                <MatchDetailContent
                  match={displayMatch}
                  showStageHeader={false}
                  layout="drawer"
                  onNavigateAway={() => handleOpenChange(false)}
                />
              </div>
            </div>
          </>
        ) : null}

        {displayMatch && !isFinal ? (
          <>
            <SheetHeader>
              <SheetTitle className="text-left">
                {displayMatch.stageLabel}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <MatchDetailContent
                match={displayMatch}
                layout="drawer"
                onNavigateAway={() => handleOpenChange(false)}
              />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
