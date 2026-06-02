import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Team } from "@/api/types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="h-full transition-colors hover:bg-accent/30">
      <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
        <img
          src={team.flag}
          alt=""
          className="h-10 w-14 rounded object-cover shadow-sm"
          loading="lazy"
        />
        <p className="font-semibold leading-tight">{team.name_en}</p>
        <div className="flex gap-1.5">
          <Badge variant="outline">{team.fifa_code}</Badge>
          <Badge variant="secondary">Group {team.groups}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
