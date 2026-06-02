import { parse } from "date-fns";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formatDateStripLabel,
  formatWeekdayShort,
} from "@/lib/parseMatchDate";
import { findTodayDateKey, getTournamentDays } from "@/lib/groupByDate";
import { cn } from "@/lib/utils";

interface DateStripProps {
  selectedDateKey: string | null;
  onSelectDateKey: (dateKey: string) => void;
}

export function DateStrip({
  selectedDateKey,
  onSelectDateKey,
}: DateStripProps) {
  const days = getTournamentDays();
  const todayKey = findTodayDateKey();
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDateKey]);

  return (
    <div className="space-y-2">
      {todayKey && selectedDateKey && todayKey !== selectedDateKey && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onSelectDateKey(todayKey)}
        >
          Jump to today
        </Button>
      )}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {days.map((day) => {
            const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
            const isSelected = dateKey === selectedDateKey;
            const isToday = dateKey === todayKey;

            return (
              <button
                key={dateKey}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                onClick={() => onSelectDateKey(dateKey)}
                className={cn(
                  "flex min-w-[4.5rem] cursor-pointer flex-col items-center rounded-lg border px-3 py-2 text-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card hover:bg-accent",
                  isToday && !isSelected && "ring-1 ring-primary/40",
                )}
              >
                <span className="text-[10px] uppercase text-muted-foreground">
                  {formatWeekdayShort(day)}
                </span>
                <span className="text-sm font-semibold">
                  {formatDateStripLabel(day)}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export function dateKeyToDate(dateKey: string): Date {
  return parse(dateKey, "yyyy-MM-dd", new Date());
}
