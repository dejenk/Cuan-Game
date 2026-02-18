import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";

interface TurnInfoProps {
  turn: number;
  actionPoints: number;
  onEndTurn: () => void;
  isLoading?: boolean;
}

export function TurnInfo({ turn, actionPoints, onEndTurn, isLoading }: TurnInfoProps) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-80">Minggu</p>
                <p className="text-2xl font-bold">{turn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-80">Action Points</p>
                <p className="text-2xl font-bold">{actionPoints}/3</p>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={onEndTurn}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Akhiri Minggu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}