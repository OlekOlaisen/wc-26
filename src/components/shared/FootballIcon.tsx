import { cn } from "@/lib/utils";

interface FootballIconProps {
  className?: string;
}

const SOCCER_BALL_IMAGE_SRC = "/images/soccer-ball.png";

export function FootballIcon({ className }: FootballIconProps) {
  return (
    <img
      src={SOCCER_BALL_IMAGE_SRC}
      alt=""
      width={36}
      height={36}
      className={cn("h-9 w-9 object-contain", className)}
      aria-hidden
      decoding="async"
    />
  );
}
