import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const DISMISS_THRESHOLD_PX = 72;
const DISMISS_VELOCITY_PX_PER_MS = 0.45;
const SNAP_BACK_ANIMATION_MS = 260;
const DISMISS_ANIMATION_MS = 300;

export type SheetDragReleasePhase =
  | null
  | "snap-back"
  | "dismiss"
  | "dismissed";

function findSheetScrollContainer(
  sheetRoot: HTMLElement,
  eventTarget: EventTarget | null,
): HTMLElement | null {
  if (!(eventTarget instanceof HTMLElement)) {
    return sheetRoot.scrollHeight > sheetRoot.clientHeight ? sheetRoot : null;
  }

  const markedScrollContainer = eventTarget.closest(
    "[data-sheet-scroll]",
  ) as HTMLElement | null;
  if (markedScrollContainer) {
    return markedScrollContainer;
  }

  return sheetRoot.scrollHeight > sheetRoot.clientHeight ? sheetRoot : null;
}

function canStartSheetDrag(
  sheetRoot: HTMLElement,
  eventTarget: EventTarget | null,
): boolean {
  if (!(eventTarget instanceof HTMLElement)) {
    return true;
  }

  if (eventTarget.closest("[data-sheet-drag-handle]")) {
    return true;
  }

  if (
    eventTarget.closest(
      "button, a, input, select, textarea, [role='button'], [role='tab']",
    )
  ) {
    return false;
  }

  const scrollContainer = findSheetScrollContainer(sheetRoot, eventTarget);
  if (!scrollContainer) {
    return true;
  }

  return scrollContainer.scrollTop <= 0;
}

function waitForTransformTransition(
  sheetRoot: HTMLElement | null,
  durationMs: number,
): Promise<void> {
  if (!sheetRoot) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      sheetRoot.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(fallbackTimeoutId);
      resolve();
    };

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== sheetRoot || event.propertyName !== "transform") {
        return;
      }
      finish();
    };

    const fallbackTimeoutId = window.setTimeout(finish, durationMs);
    sheetRoot.addEventListener("transitionend", handleTransitionEnd);
  });
}

interface UseBottomSheetDragOptions {
  onDismiss: () => void;
  enabled?: boolean;
  sheetOpen?: boolean;
}

export function useBottomSheetDrag({
  onDismiss,
  enabled = true,
  sheetOpen = true,
}: UseBottomSheetDragOptions) {
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [releasePhase, setReleasePhase] = useState<SheetDragReleasePhase>(null);
  const [dismissActive, setDismissActive] = useState(false);
  const [sheetSettled, setSheetSettled] = useState(false);
  const sheetRootRef = useRef<HTMLDivElement | null>(null);
  const dragStartClientY = useRef(0);
  const lastMoveClientY = useRef(0);
  const lastMoveTimestamp = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const isAnimatingRelease = useRef(false);

  const resetDragState = useCallback(() => {
    activePointerId.current = null;
    isAnimatingRelease.current = false;
    setDragOffsetY(0);
    setReleasePhase(null);
    setDismissActive(false);
  }, []);

  const runSnapBackAnimation = useCallback(async () => {
    isAnimatingRelease.current = true;
    setReleasePhase("snap-back");

    requestAnimationFrame(() => {
      setDragOffsetY(0);
    });

    await waitForTransformTransition(sheetRootRef.current, SNAP_BACK_ANIMATION_MS);
    setSheetSettled(true);
    resetDragState();
  }, [resetDragState]);

  const runDismissAnimation = useCallback(async () => {
    isAnimatingRelease.current = true;
    setReleasePhase("dismiss");
    setDismissActive(false);

    requestAnimationFrame(() => {
      setDismissActive(true);
    });

    await waitForTransformTransition(sheetRootRef.current, DISMISS_ANIMATION_MS);
    setReleasePhase("dismissed");
    activePointerId.current = null;
    isAnimatingRelease.current = false;
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!sheetOpen) {
      return;
    }

    setSheetSettled(false);
    resetDragState();
  }, [resetDragState, sheetOpen]);

  useLayoutEffect(() => {
    if (!sheetOpen || sheetSettled) {
      return;
    }

    let cleanup: (() => void) | undefined;
    const frameId = requestAnimationFrame(() => {
      const sheetRoot = sheetRootRef.current;
      if (!sheetRoot) {
        return;
      }

      const markSheetSettled = () => {
        setSheetSettled(true);
      };

      const handleAnimationEnd = (event: AnimationEvent) => {
        if (event.target !== sheetRoot) {
          return;
        }
        markSheetSettled();
      };

      sheetRoot.addEventListener("animationend", handleAnimationEnd);
      const fallbackTimeoutId = window.setTimeout(markSheetSettled, 420);

      cleanup = () => {
        sheetRoot.removeEventListener("animationend", handleAnimationEnd);
        window.clearTimeout(fallbackTimeoutId);
      };
    });

    return () => {
      cancelAnimationFrame(frameId);
      cleanup?.();
    };
  }, [sheetOpen, sheetSettled]);

  const finishDrag = useCallback(
    (pointerId: number, clientY: number) => {
      const sheetRoot = sheetRootRef.current;
      if (
        activePointerId.current === null ||
        pointerId !== activePointerId.current ||
        isAnimatingRelease.current
      ) {
        return;
      }

      if (sheetRoot?.hasPointerCapture(pointerId)) {
        sheetRoot.releasePointerCapture(pointerId);
      }

      activePointerId.current = null;

      const deltaY = Math.max(0, clientY - dragStartClientY.current);
      const elapsedMs = Math.max(
        1,
        performance.now() - lastMoveTimestamp.current,
      );
      const velocityY =
        (clientY - lastMoveClientY.current) / elapsedMs;

      const shouldDismiss =
        deltaY >= DISMISS_THRESHOLD_PX ||
        velocityY >= DISMISS_VELOCITY_PX_PER_MS;

      if (shouldDismiss) {
        void runDismissAnimation();
        return;
      }

      if (deltaY > 0) {
        void runSnapBackAnimation();
        return;
      }

      resetDragState();
    },
    [resetDragState, runDismissAnimation, runSnapBackAnimation],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleWindowPointerMove(event: PointerEvent) {
      if (
        activePointerId.current === null ||
        event.pointerId !== activePointerId.current ||
        isAnimatingRelease.current
      ) {
        return;
      }

      const deltaY = event.clientY - dragStartClientY.current;
      if (deltaY <= 0) {
        if (deltaY < 0) {
          const sheetRoot = sheetRootRef.current;
          if (sheetRoot?.hasPointerCapture(event.pointerId)) {
            sheetRoot.releasePointerCapture(event.pointerId);
          }
          resetDragState();
        }
        return;
      }

      setDragOffsetY(deltaY);
      lastMoveClientY.current = event.clientY;
      lastMoveTimestamp.current = performance.now();
    }

    function handleWindowPointerEnd(event: PointerEvent) {
      finishDrag(event.pointerId, event.clientY);
    }

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerEnd);
    window.addEventListener("pointercancel", handleWindowPointerEnd);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerEnd);
      window.removeEventListener("pointercancel", handleWindowPointerEnd);
    };
  }, [enabled, finishDrag, resetDragState]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.button !== 0 || isAnimatingRelease.current) {
        return;
      }

      const sheetRoot = sheetRootRef.current;
      if (!sheetRoot || !canStartSheetDrag(sheetRoot, event.target)) {
        return;
      }

      setSheetSettled(true);
      activePointerId.current = event.pointerId;
      dragStartClientY.current = event.clientY;
      lastMoveClientY.current = event.clientY;
      lastMoveTimestamp.current = performance.now();
      sheetRoot.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [enabled],
  );

  const isDraggingSheet =
    dragOffsetY > 0 || releasePhase === "snap-back" || releasePhase === "dismiss";

  const overlayOpacity =
    releasePhase === "dismiss" || releasePhase === "dismissed"
      ? 0
      : dragOffsetY > 0
        ? Math.max(0.35, 1 - dragOffsetY / 420)
        : undefined;

  return {
    sheetRootRef,
    dragOffsetY,
    releasePhase,
    dismissActive,
    sheetSettled,
    isDraggingSheet,
    overlayOpacity,
    dragHandleProps: {
      "data-sheet-drag-handle": true,
      "aria-hidden": true as const,
      style: { touchAction: "none" } as const,
    },
    sheetPointerHandlers: enabled
      ? {
          onPointerDown: handlePointerDown,
        }
      : {},
  };
}
