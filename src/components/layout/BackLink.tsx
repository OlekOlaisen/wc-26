import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function BackLink({ to, children, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      <ChevronLeft className="-ml-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </Link>
  );
}
