import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stadium } from "@/api/types";

interface StadiumCardProps {
  stadium: Stadium;
}

export function StadiumCard({ stadium }: StadiumCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {stadium.name_en}
          </CardTitle>
          {stadium.region && (
            <Badge variant="outline" className="shrink-0">
              {stadium.region}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{stadium.fifa_name}</p>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>
          {stadium.city_en}, {stadium.country_en}
        </p>
        <p className="text-muted-foreground">
          Capacity: {stadium.capacity.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
