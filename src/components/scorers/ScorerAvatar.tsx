import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScorerAvatarProps {
  playerName: string;
  photoUrl?: string;
  className?: string;
}

function getInitials(playerName: string): string {
  const parts = playerName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function ScorerAvatar({
  playerName,
  photoUrl,
  className,
}: ScorerAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {getInitials(playerName)}
        </span>
      )}
    </div>
  );
}
