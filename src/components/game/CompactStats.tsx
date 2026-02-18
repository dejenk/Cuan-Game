import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GameStats } from "@/services/gameService";
import { TrendingUp, Brain, CreditCard, DollarSign } from "lucide-react";

interface CompactStatsProps {
  stats: GameStats;
}

export function CompactStats({ stats }: CompactStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Cash & Net Worth */}
      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cash</p>
              <p className="text-lg font-bold">
                Rp {(stats.cash / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                <p className="text-xs text-muted-foreground">Net Worth</p>
              </div>
              <p className="text-lg font-bold">
                Rp {(stats.netWorth / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4" />
            <p className="text-xs text-muted-foreground">Mental</p>
          </div>
          <p className="text-xl font-bold mb-2">{stats.mentalHealth}%</p>
          <Progress value={stats.mentalHealth} className="h-1.5" />
        </CardContent>
      </Card>

      {/* Credit Score */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4" />
            <p className="text-xs text-muted-foreground">Credit</p>
          </div>
          <p className="text-xl font-bold">{stats.creditScore}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.creditScore > 750 ? "Excellent" : stats.creditScore > 650 ? "Good" : "Poor"}
          </p>
        </CardContent>
      </Card>

      {/* Total Debt - Full width if exists */}
      {stats.totalDebt > 0 && (
        <Card className="col-span-2 border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-destructive" />
                <p className="text-xs text-destructive">Total Hutang</p>
              </div>
              <p className="text-lg font-bold text-destructive">
                Rp {(stats.totalDebt / 1000000).toFixed(1)}M
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}