import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GameStats } from "@/services/gameService";
import { TrendingUp, TrendingDown, Brain, Users, CreditCard, Coins } from "lucide-react";

interface GameStatsProps {
  stats: GameStats;
}

export function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Dompet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.cash.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground mt-1">Cash on hand</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {stats.netWorth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.netWorth.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground mt-1">Total kekayaan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Mental Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{stats.mentalHealth}%</div>
            <Progress value={stats.mentalHealth} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.mentalHealth > 70 ? "Santai bos" : stats.mentalHealth > 40 ? "Agak pusing" : "Burnout parah!"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Reputation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{stats.reputation}%</div>
            <Progress value={stats.reputation} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.reputation > 70 ? "Orang baik" : stats.reputation > 40 ? "Biasa aja" : "Reputasi jelek"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Credit Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.creditScore}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.creditScore > 750 ? "Excellent" : stats.creditScore > 650 ? "Good" : "Poor"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-destructive">Total Hutang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">Rp {stats.totalDebt.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground mt-1">Harus dibayar!</p>
        </CardContent>
      </Card>
    </div>
  );
}