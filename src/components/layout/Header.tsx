import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/wc2026-logo.png"
            alt="FIFA World Cup 2026"
            className="h-10 w-10 shrink-0 rounded-md object-contain"
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight">
              FIFA World Cup 2026
            </h1>
            <p className="text-xs text-muted-foreground">
              USA · Mexico · Canada
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/search" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
