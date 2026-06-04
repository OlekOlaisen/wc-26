import { useSyncExternalStore } from "react";

export const GOAL_TOAST_DURATION_MS = 10_000;
export const GOAL_TOAST_EXIT_MS = 320;

export type GoalToastStatus = "enter" | "exit";

export type GoalToastVariant = "favorite" | "opponent";

export interface GoalToast {
  id: string;
  title: string;
  description: string;
  variant: GoalToastVariant;
  status: GoalToastStatus;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let goalToastsSnapshot: GoalToast[] = [];
const dismissTimeouts = new Map<string, number>();
const exitTimeouts = new Map<string, number>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): GoalToast[] {
  return goalToastsSnapshot;
}

export function useGoalToasts(): GoalToast[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}

function removeGoalToast(toastId: string): void {
  const nextToasts = goalToastsSnapshot.filter((toast) => toast.id !== toastId);
  if (nextToasts.length !== goalToastsSnapshot.length) {
    goalToastsSnapshot = nextToasts;
    emitChange();
  }
}

function beginGoalToastExit(toastId: string): void {
  const toastIndex = goalToastsSnapshot.findIndex((toast) => toast.id === toastId);
  if (toastIndex === -1) {
    return;
  }

  const toast = goalToastsSnapshot[toastIndex];
  if (toast.status === "exit") {
    return;
  }

  goalToastsSnapshot = goalToastsSnapshot.map((entry) =>
    entry.id === toastId ? { ...entry, status: "exit" as const } : entry,
  );
  emitChange();

  const existingExitTimeout = exitTimeouts.get(toastId);
  if (existingExitTimeout !== undefined) {
    return;
  }

  const exitTimeoutId = window.setTimeout(() => {
    exitTimeouts.delete(toastId);
    removeGoalToast(toastId);
  }, GOAL_TOAST_EXIT_MS);
  exitTimeouts.set(toastId, exitTimeoutId);
}

export function dismissGoalToast(toastId: string): void {
  const autoDismissTimeout = dismissTimeouts.get(toastId);
  if (autoDismissTimeout !== undefined) {
    window.clearTimeout(autoDismissTimeout);
    dismissTimeouts.delete(toastId);
  }

  beginGoalToastExit(toastId);
}

export function pushGoalToast(
  title: string,
  description: string,
  variant: GoalToastVariant,
): void {
  const toastId = crypto.randomUUID();
  goalToastsSnapshot = [
    ...goalToastsSnapshot,
    { id: toastId, title, description, variant, status: "enter" },
  ];
  emitChange();

  const timeoutId = window.setTimeout(() => {
    dismissGoalToast(toastId);
  }, GOAL_TOAST_DURATION_MS);
  dismissTimeouts.set(toastId, timeoutId);
}
