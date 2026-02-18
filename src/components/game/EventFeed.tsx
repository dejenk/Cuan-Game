import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, TrendingUp, Trophy, Sparkles } from "lucide-react";

interface Event {
  id: string;
  event_type: string;
  title: string;
  description: string;
  turn_number: number;
  created_at: string;
}

interface EventFeedProps {
  events: Event[];
}

export function EventFeed({ events }: EventFeedProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-4 h-4" />;
      case "opportunity":
        return <TrendingUp className="w-4 h-4" />;
      case "random":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada event</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex gap-3 pb-3 border-b last:border-0">
                  <div className="mt-1">{getEventIcon(event.event_type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Minggu {event.turn_number}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}