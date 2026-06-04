import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { useBottomSheetDrag } from "@/hooks/useBottomSheetDrag";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
    dragOpacity?: number;
  }
>(({ className, dragOpacity, style, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn("sheet-overlay fixed inset-0 z-50 bg-black/80", className)}
    style={
      dragOpacity !== undefined
        ? { ...style, opacity: dragOpacity }
        : style
    }
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  onSwipeClose?: () => void;
  sheetOpen?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, onSwipeClose, sheetOpen = true, style, ...props }, ref) => {
  const {
    sheetRootRef,
    dragOffsetY,
    releasePhase,
    dismissActive,
    sheetSettled,
    isDraggingSheet,
    overlayOpacity,
    dragHandleProps,
    sheetPointerHandlers,
  } = useBottomSheetDrag({
    onDismiss: () => onSwipeClose?.(),
    enabled: Boolean(onSwipeClose),
    sheetOpen,
  });

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      sheetRootRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, sheetRootRef],
  );

  return (
    <SheetPortal>
      <SheetOverlay dragOpacity={overlayOpacity} />
      <SheetPrimitive.Content
        ref={mergedRef}
        className={cn(
          "sheet-content fixed inset-x-0 bottom-0 z-50 max-h-[85vh] gap-4 overflow-y-auto rounded-t-2xl border-t bg-background p-6 shadow-lg",
          isDraggingSheet && "sheet-content--dragging",
          releasePhase === "snap-back" && "sheet-content--snapping-back",
          releasePhase === "dismiss" && "sheet-content--dismissing",
          dismissActive && "sheet-content--dismiss-active",
          releasePhase === "dismissed" && "sheet-content--drag-dismissed",
          sheetSettled && "sheet-content--settled",
          className,
        )}
        style={{
          ...style,
          ...(isDraggingSheet
            ? { ["--sheet-drag-y" as string]: `${dragOffsetY}px` }
            : {}),
        }}
        {...sheetPointerHandlers}
        {...props}
      >
        {onSwipeClose ? (
          <div
            {...dragHandleProps}
            className="mx-auto mb-1 mt-2 flex h-5 w-full shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
          >
            <span className="h-1 w-10 rounded-full bg-muted-foreground/45" />
          </div>
        ) : null}
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 z-20 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
};
