import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, TrendingUp } from "lucide-react";
import type { GameStats } from "@/services/gameService";

interface MobileNavProps {
  stats: GameStats;
  playerName?: string;
  onLogout: () => void;
}

export function MobileNav({ stats, playerName, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu Pejuang</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Player Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{playerName || "Pejuang"}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <div>
                <p className="text-xs text-muted-foreground">Net Worth</p>
                <p className="font-bold">Rp {stats.netWorth.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Cash</p>
                <p className="font-bold text-sm">Rp {(stats.cash / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Mental</p>
                <p className="font-bold text-sm">{stats.mentalHealth}%</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Credit</p>
                <p className="font-bold text-sm">{stats.creditScore}</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded">
                <p className="text-xs text-destructive">Hutang</p>
                <p className="font-bold text-sm text-destructive">
                  Rp {(stats.totalDebt / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}