import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameStats } from "@/components/game/GameStats";
import { TurnInfo } from "@/components/game/TurnInfo";
import { EventFeed } from "@/components/game/EventFeed";
import { useToast } from "@/hooks/use-toast";
import { getGameStats, endTurn, type GameStats as GameStatsType } from "@/services/gameService";
import { freelanceWork, partTimeJob, investCrypto, investSaham, payDebt, takeVacation } from "@/services/actionService";
import { Briefcase, TrendingUp, Users, Plane, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Pejuang Rupiah 💰</h1>
            <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => router.push("/"))}>
              Logout
            </Button>
          </div>

          <TurnInfo 
            turn={stats.turn}
            actionPoints={stats.actionPoints}
            onEndTurn={handleEndTurn}
            isLoading={actionLoading}
          />

          <GameStats stats={stats} />

          <Tabs defaultValue="cuan" className="w-full">
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

            <TabsContent value="cuan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cari Cuan</CardTitle>
                  <CardDescription>Kerja keras untuk dapat rupiah! (1 Action Point)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    size="lg"
                    onClick={() => handleAction(() => freelanceWork(user.id))}
                    disabled={actionLoading || stats.actionPoints <= 0}
                  >
                    Freelance (Rp 500k - 1.5M)
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    size="lg"
                    variant="outline"
                    onClick={() => handleAction(() => partTimeJob(user.id))}
                    disabled={actionLoading || stats.actionPoints <= 0}
                  >
                    Part-time Job (Rp 250k - 750k)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lapak" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invest di Lapak</CardTitle>
                  <CardDescription>Tanem modal, tunggu panen! (1 Action Point)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Invest Crypto 🚀</Label>
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
                  </div>

                  <div className="space-y-3">
                    <Label>Invest Saham 📈</Label>
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
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Portfolio Kamu:</h4>
                    {portfolio.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Belum punya investasi</p>
                    ) : (
                      <div className="space-y-2">
                        {portfolio.map((item) => {
                          const totalValue = item.current_price * Number(item.quantity);
                          const profit = totalValue - (item.buy_price * Number(item.quantity));
                          const profitPercent = (profit / (item.buy_price * Number(item.quantity))) * 100;
                          
                          return (
                            <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                              <div>
                                <p className="font-medium">{item.asset_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} @ Rp {item.current_price.toLocaleString("id-ID")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Rp {totalValue.toLocaleString("id-ID")}</p>
                                <p className={`text-sm ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {profit >= 0 ? "+" : ""}Rp {profit.toLocaleString("id-ID")} ({profitPercent.toFixed(1)}%)
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hutang" className="space-y-4">
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
                          className="w-full p-2 border rounded"
                          value={selectedDebt}
                          onChange={(e) => setSelectedDebt(e.target.value)}
                        >
                          <option value="">-- Pilih Hutang --</option>
                          {debts.map((debt) => (
                            <option key={debt.id} value={debt.id}>
                              {debt.creditor_name} - Rp {debt.current_balance.toLocaleString("id-ID")} ({debt.interest_rate}% bunga)
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
                            <div key={debt.id} className="flex justify-between items-center p-3 border rounded border-destructive/50">
                              <div>
                                <p className="font-medium">{debt.creditor_name}</p>
                                <p className="text-sm text-muted-foreground">Bunga: {debt.interest_rate}% per minggu</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-destructive">Rp {debt.current_balance.toLocaleString("id-ID")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="komunitas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Komunitas</CardTitle>
                  <CardDescription>Coming soon - Chat dengan pejuang lain!</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">Fitur chat akan segera hadir...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="liburan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Liburan</CardTitle>
                  <CardDescription>Refreshing buat mental health! (1 Action Point)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    size="lg"
                    onClick={() => handleAction(() => takeVacation(user.id, "Bali", 2000000))}
                    disabled={actionLoading || stats.actionPoints <= 0}
                  >
                    Bali (Rp 2M) - Mental +15-35
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    size="lg"
                    variant="outline"
                    onClick={() => handleAction(() => takeVacation(user.id, "Bandung", 1000000))}
                    disabled={actionLoading || stats.actionPoints <= 0}
                  >
                    Bandung (Rp 1M) - Mental +10-30
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    size="lg"
                    variant="outline"
                    onClick={() => handleAction(() => takeVacation(user.id, "Puncak", 500000))}
                    disabled={actionLoading || stats.actionPoints <= 0}
                  >
                    Puncak (Rp 500k) - Mental +10-30
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <EventFeed events={events} />
        </div>
      </div>
    </>
  );
}