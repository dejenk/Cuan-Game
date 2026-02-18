import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameStats } from "@/components/game/GameStats";
import { CompactStats } from "@/components/game/CompactStats";
import { TurnInfo } from "@/components/game/TurnInfo";
import { EventFeed } from "@/components/game/EventFeed";
import { MobileNav } from "@/components/game/MobileNav";
import { BottomNav } from "@/components/game/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { getGameStats, endTurn, type GameStats as GameStatsType } from "@/services/gameService";
import { freelanceWork, partTimeJob, investCrypto, investSaham, payDebt, takeVacation } from "@/services/actionService";
import { Briefcase, TrendingUp, Users, Plane, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GamePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<GameStatsType | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [playerName, setPlayerName] = useState("");
  const [activeTab, setActiveTab] = useState("cuan");

  // Investment amounts
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [sahamAmount, setSahamAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedDebt, setSelectedDebt] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }
    setUser(session.user);
    await loadGameData(session.user.id);
  }

  async function loadGameData(userId: string) {
    setLoading(true);
    const gameStats = await getGameStats(userId);
    
    if (!gameStats) {
      toast({
        title: "Game belum dimulai",
        description: "Mulai game baru dari landing page!",
        variant: "destructive"
      });
      router.push("/");
      return;
    }

    setStats(gameStats);

    // Load player name
    const { data: leaderboard } = await supabase
      .from("leaderboard")
      .select("player_name")
      .eq("user_id", userId)
      .single();
    
    if (leaderboard) {
      setPlayerName(leaderboard.player_name);
    }

    // Load events
    const { data: eventsData } = await supabase
      .from("event_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    setEvents(eventsData || []);

    // Load debts
    const { data: debtsData } = await supabase
      .from("debts")
      .select("*")
      .eq("user_id", userId);

    setDebts(debtsData || []);

    // Load portfolio
    const { data: portfolioData } = await supabase
      .from("portfolio")
      .select("*")
      .eq("user_id", userId);

    setPortfolio(portfolioData || []);

    setLoading(false);
  }

  async function handleEndTurn() {
    if (!user) return;
    setActionLoading(true);
    const result = await endTurn(user.id);
    
    toast({
      title: result.success ? "Turn selesai!" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      await loadGameData(user.id);
    }
    setActionLoading(false);
  }

  async function handleAction(actionFn: () => Promise<any>) {
    if (!user) return;
    setActionLoading(true);
    const result = await actionFn();
    
    toast({
      title: result.success ? "Berhasil!" : "Gagal",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      await loadGameData(user.id);
    }
    setActionLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading game...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <>
      <SEO 
        title="Pejuang Rupiah - Game Dashboard"
        description="Financial life simulator Indonesia"
      />
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        {/* Header - Mobile & Desktop */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MobileNav stats={stats} playerName={playerName} onLogout={handleLogout} />
              <h1 className="text-xl md:text-2xl font-bold">Pejuang Rupiah 💰</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
          {/* Turn Info */}
          <TurnInfo 
            turn={stats.turn}
            actionPoints={stats.actionPoints}
            onEndTurn={handleEndTurn}
            isLoading={actionLoading}
          />

          {/* Stats - Responsive */}
          <div className="block md:hidden">
            <CompactStats stats={stats} />
          </div>
          <div className="hidden md:block">
            <GameStats stats={stats} />
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="cuan">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Cuan
                </TabsTrigger>
                <TabsTrigger value="lapak">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lapak
                </TabsTrigger>
                <TabsTrigger value="hutang">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Hutang
                </TabsTrigger>
                <TabsTrigger value="komunitas">
                  <Users className="w-4 h-4 mr-2" />
                  Komunitas
                </TabsTrigger>
                <TabsTrigger value="liburan">
                  <Plane className="w-4 h-4 mr-2" />
                  Liburan
                </TabsTrigger>
              </TabsList>

              <TabContent 
                value={activeTab}
                stats={stats}
                actionLoading={actionLoading}
                handleAction={handleAction}
                user={user}
                portfolio={portfolio}
                debts={debts}
                cryptoAmount={cryptoAmount}
                setCryptoAmount={setCryptoAmount}
                sahamAmount={sahamAmount}
                setSahamAmount={setSahamAmount}
                paymentAmount={paymentAmount}
                setPaymentAmount={setPaymentAmount}
                selectedDebt={selectedDebt}
                setSelectedDebt={setSelectedDebt}
              />
            </Tabs>
          </div>

          {/* Mobile Content */}
          <div className="block md:hidden">
            <TabContent 
              value={activeTab}
              stats={stats}
              actionLoading={actionLoading}
              handleAction={handleAction}
              user={user}
              portfolio={portfolio}
              debts={debts}
              cryptoAmount={cryptoAmount}
              setCryptoAmount={setCryptoAmount}
              sahamAmount={sahamAmount}
              setSahamAmount={setSahamAmount}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              selectedDebt={selectedDebt}
              setSelectedDebt={setSelectedDebt}
            />
          </div>

          {/* Event Feed */}
          <EventFeed events={events} />
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}

// Extracted Tab Content Component
interface TabContentProps {
  value: string;
  stats: GameStatsType;
  actionLoading: boolean;
  handleAction: (fn: () => Promise<any>) => void;
  user: any;
  portfolio: any[];
  debts: any[];
  cryptoAmount: string;
  setCryptoAmount: (val: string) => void;
  sahamAmount: string;
  setSahamAmount: (val: string) => void;
  paymentAmount: string;
  setPaymentAmount: (val: string) => void;
  selectedDebt: string;
  setSelectedDebt: (val: string) => void;
}

function TabContent({
  value,
  stats,
  actionLoading,
  handleAction,
  user,
  portfolio,
  debts,
  cryptoAmount,
  setCryptoAmount,
  sahamAmount,
  setSahamAmount,
  paymentAmount,
  setPaymentAmount,
  selectedDebt,
  setSelectedDebt
}: TabContentProps) {
  if (value === "cuan") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cari Cuan</CardTitle>
          <CardDescription>Kerja keras untuk dapat rupiah! (1 Action Point)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start" 
            size="lg"
            onClick={() => handleAction(() => freelanceWork(user.id))}
            disabled={actionLoading || stats.actionPoints <= 0}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            <div className="text-left flex-1">
              <p className="font-semibold">Freelance</p>
              <p className="text-xs opacity-80">Rp 500k - 1.5M | Mental -5 to -15</p>
            </div>
          </Button>
          <Button 
            className="w-full justify-start" 
            size="lg"
            variant="outline"
            onClick={() => handleAction(() => partTimeJob(user.id))}
            disabled={actionLoading || stats.actionPoints <= 0}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            <div className="text-left flex-1">
              <p className="font-semibold">Part-time Job</p>
              <p className="text-xs opacity-80">Rp 250k - 750k | Mental -2 to -7</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (value === "lapak") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invest di Lapak</CardTitle>
          <CardDescription>Tanem modal, tunggu panen! (1 Action Point)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Invest Crypto 🚀
            </Label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Jumlah (Rp)" 
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
              />
              <Button 
                onClick={() => {
                  const amount = parseInt(cryptoAmount);
                  if (amount > 0) {
                    handleAction(() => investCrypto(user.id, amount));
                    setCryptoAmount("");
                  }
                }}
                disabled={actionLoading || stats.actionPoints <= 0 || !cryptoAmount}
              >
                Beli
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">High risk, high return! To the moon! 🚀</p>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Invest Saham 📈
            </Label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Jumlah (Rp)" 
                value={sahamAmount}
                onChange={(e) => setSahamAmount(e.target.value)}
              />
              <Button 
                onClick={() => {
                  const amount = parseInt(sahamAmount);
                  if (amount > 0) {
                    handleAction(() => investSaham(user.id, amount));
                    setSahamAmount("");
                  }
                }}
                disabled={actionLoading || stats.actionPoints <= 0 || !sahamAmount}
              >
                Beli
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Lebih stabil, sabar ya profit-nya!</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Portfolio Kamu:
            </h4>
            {portfolio.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum punya investasi</p>
            ) : (
              <ScrollArea className="h-[300px] md:h-auto">
                <div className="space-y-2 pr-4">
                  {portfolio.map((item) => {
                    const totalValue = item.current_price * Number(item.quantity);
                    const profit = totalValue - (item.buy_price * Number(item.quantity));
                    const profitPercent = (profit / (item.buy_price * Number(item.quantity))) * 100;
                    
                    return (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.asset_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity}x @ Rp {(item.current_price / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            Rp {(totalValue / 1000000).toFixed(2)}M
                          </p>
                          <p className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {profit >= 0 ? "+" : ""}Rp {(profit / 1000).toFixed(0)}k ({profitPercent.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (value === "hutang") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bayar Hutang</CardTitle>
          <CardDescription>Lunasi hutang biar credit score naik! (1 Action Point)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {debts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Selamat! Kamu gak punya hutang 🎉</p>
          ) : (
            <>
              <div className="space-y-3">
                <Label>Pilih Hutang</Label>
                <select 
                  className="w-full p-2 border rounded bg-background"
                  value={selectedDebt}
                  onChange={(e) => setSelectedDebt(e.target.value)}
                >
                  <option value="">-- Pilih Hutang --</option>
                  {debts.map((debt) => (
                    <option key={debt.id} value={debt.id}>
                      {debt.creditor_name} - Rp {(debt.current_balance / 1000000).toFixed(1)}M ({debt.interest_rate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label>Jumlah Bayar</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Jumlah (Rp)" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <Button 
                    onClick={() => {
                      const amount = parseInt(paymentAmount);
                      if (amount > 0 && selectedDebt) {
                        handleAction(() => payDebt(user.id, selectedDebt, amount));
                        setPaymentAmount("");
                        setSelectedDebt("");
                      }
                    }}
                    disabled={actionLoading || stats.actionPoints <= 0 || !paymentAmount || !selectedDebt}
                  >
                    Bayar
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Daftar Hutang:</h4>
                <div className="space-y-2">
                  {debts.map((debt) => (
                    <div key={debt.id} className="flex justify-between items-center p-3 border rounded border-destructive/50 bg-destructive/5">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{debt.creditor_name}</p>
                        <p className="text-xs text-muted-foreground">Bunga: {debt.interest_rate}% per minggu</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive text-sm">
                          Rp {(debt.current_balance / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (value === "komunitas") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Komunitas Pejuang</CardTitle>
          <CardDescription>Chat & share tips dengan pejuang lain!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <Users className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Fitur chat komunitas coming soon...</p>
            <p className="text-sm text-muted-foreground">
              Nanti kamu bisa sharing tips, ngeluh, atau flaunting kekayaan di sini! 😎
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (value === "liburan") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liburan Healing</CardTitle>
          <CardDescription>Refreshing buat mental health! (1 Action Point)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start" 
            size="lg"
            onClick={() => handleAction(() => takeVacation(user.id, "Bali", 2000000))}
            disabled={actionLoading || stats.actionPoints <= 0}
          >
            <Plane className="w-4 h-4 mr-2" />
            <div className="text-left flex-1">
              <p className="font-semibold">Bali 🏝️</p>
              <p className="text-xs opacity-80">Rp 2M | Mental +15 to +35</p>
            </div>
          </Button>
          <Button 
            className="w-full justify-start" 
            size="lg"
            variant="outline"
            onClick={() => handleAction(() => takeVacation(user.id, "Bandung", 1000000))}
            disabled={actionLoading || stats.actionPoints <= 0}
          >
            <Plane className="w-4 h-4 mr-2" />
            <div className="text-left flex-1">
              <p className="font-semibold">Bandung 🏔️</p>
              <p className="text-xs opacity-80">Rp 1M | Mental +10 to +30</p>
            </div>
          </Button>
          <Button 
            className="w-full justify-start" 
            size="lg"
            variant="outline"
            onClick={() => handleAction(() => takeVacation(user.id, "Puncak", 500000))}
            disabled={actionLoading || stats.actionPoints <= 0}
          >
            <Plane className="w-4 h-4 mr-2" />
            <div className="text-left flex-1">
              <p className="font-semibold">Puncak 🌄</p>
              <p className="text-xs opacity-80">Rp 500k | Mental +10 to +30</p>
            </div>
          </Button>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Tips: Mental health penting! Jangan lupa healing kalau mental udah di bawah 50%
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}