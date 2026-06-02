import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MatchDetailContent } from "@/components/shared/MatchDetailContent";
import type { EnrichedMatch } from "@/api/types";

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

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        {displayMatch && (
          <>
            <SheetHeader>
              <SheetTitle className="text-left">
                Match #{displayMatch.id}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <MatchDetailContent match={displayMatch} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
