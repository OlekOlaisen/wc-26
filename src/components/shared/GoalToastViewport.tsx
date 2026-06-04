import { X } from "lucide-react";
import { FootballIcon } from "@/components/shared/FootballIcon";
import {
  dismissGoalToast,
  useGoalToasts,
  type GoalToastVariant,
} from "@/stores/toastStore";
import { cn } from "@/lib/utils";

function GoalToastCard({
  toastId,
  title,
  description,
  variant,
  status,
}: {
  toastId: string;
  title: string;
  description: string;
  variant: GoalToastVariant;
  status: "enter" | "exit";
}) {
  const isEntering = status === "enter";
  const isFavoriteGoal = variant === "favorite";

  return (
    <div
      className={cn(
        "pointer-events-auto",
        isEntering ? "goal-toast-enter" : "goal-toast-exit",
      )}
      role="status"
    >
      <div
        className={cn(
          "goal-toast-panel relative overflow-hidden rounded-2xl",
          isFavoriteGoal
            ? "goal-toast-panel--favorite"
            : "goal-toast-panel--opponent",
        )}
      >
        <div
          className={cn(
            "goal-toast-top-bar",
            isFavoriteGoal
              ? "goal-toast-top-bar--favorite"
              : "goal-toast-top-bar--opponent",
          )}
          aria-hidden
        />
        {isEntering && isFavoriteGoal ? (
          <div className="goal-toast-shine" aria-hidden />
        ) : null}

        <div className="relative flex items-center gap-3 p-3.5 pr-2">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white",
              isFavoriteGoal
                ? "shadow-lg shadow-primary/50 ring-2 ring-primary/40"
                : "opacity-90 ring-1 ring-border/80 grayscale",
              isEntering && isFavoriteGoal && "goal-toast-icon-pop",
            )}
          >
            <FootballIcon />
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "goal-toast-badge mb-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em]",
                isFavoriteGoal
                  ? "goal-toast-badge--favorite"
                  : "goal-toast-badge--opponent",
              )}
            >
              {isFavoriteGoal ? "Goal!" : "Goal"}
            </span>
            <p
              className={cn(
                "text-base font-bold leading-tight tracking-tight",
                isFavoriteGoal ? "text-foreground" : "text-foreground/90",
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-snug",
                isFavoriteGoal
                  ? "font-medium text-foreground/75"
                  : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-white/10 hover:text-foreground"
            aria-label="Dismiss notification"
            onClick={() => dismissGoalToast(toastId)}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function GoalToastViewport() {
  const toasts = useGoalToasts();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] mx-auto flex max-w-lg flex-col gap-2 px-4",
        "pt-[calc(4.75rem+env(safe-area-inset-top,0px))]",
      )}
      aria-live="polite"
      aria-label="Goal notifications"
    >
      {toasts.map((toast) => (
        <GoalToastCard
          key={toast.id}
          toastId={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          status={toast.status}
        />
      ))}
    </div>
  );
}
