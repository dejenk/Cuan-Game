import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { initializeGame } from "@/services/gameService";
import { TrendingUp, TrendingDown, Brain, Users, Zap, Trophy } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      // Check if game already started
      const { data: gameState } = await supabase
        .from("game_state")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      if (gameState) {
        router.push("/game");
      }
    }
  }

  async function handleSignUp() {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password wajib diisi!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      toast({
        title: "Gagal daftar",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      toast({
        title: "Berhasil daftar!",
        description: "Silakan login untuk mulai bermain",
      });
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  }

  async function handleSignIn() {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password wajib diisi!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Gagal login",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      setUser(data.user);
      checkUser();
    }
    setLoading(false);
  }

  async function handleStartGame() {
    if (!user) {
      toast({
        title: "Error",
        description: "Login dulu bro!",
        variant: "destructive"
      });
      return;
    }

    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Nama pemain wajib diisi!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await initializeGame(user.id);
    
    if (result.success) {
      // Update player name in leaderboard
      await supabase
        .from("leaderboard")
        .update({ player_name: playerName })
        .eq("user_id", user.id);

      toast({
        title: "Game dimulai!",
        description: result.message,
      });
      router.push("/game");
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  if (user) {
    return (
      <>
        <SEO 
          title="Pejuang Rupiah - Start Your Journey"
          description="Financial life simulator satir Indonesia"
        />
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Siap Jadi Pejuang? 💪</CardTitle>
              <CardDescription>
                Masukkan nama kamu dan mulai petualangan finansial yang penuh drama!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Pejuang</Label>
                <Input 
                  placeholder="Masukkan nama kamu..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleStartGame}
                disabled={loading || !playerName.trim()}
              >
                {loading ? "Loading..." : "Mulai Perjuangan! 🚀"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => supabase.auth.signOut().then(() => setUser(null))}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Pejuang Rupiah - Financial Life Simulator"
        description="Text-based game simulator kehidupan finansial anak muda Indonesia. Cuan, hutang, investasi, mental health - semua ada!"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Pejuang Rupiah 💰
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Simulator kehidupan finansial satir anak muda Indonesia
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mulai dengan 5 juta di rekening. Bisa jadi sultan atau bangkrut? It's all up to you, Pejuang! 🎮
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Cari Cuan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Freelance, part-time, side hustle. Pilih mana yang paling nggak bikin burnout!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingDown className="w-8 h-8 mb-2 text-destructive" />
                <CardTitle>Kelola Hutang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cicilan motor, pinjol, CC... Bayar atau mental health yang bayar? 😰
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Mental Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Kerja keras = duit naik, mental drop. Balance is the key, Pejuang!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Mulai Perjuangan</CardTitle>
                <CardDescription className="text-center">
                  Login atau daftar untuk memulai game
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Daftar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleSignIn}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleSignUp}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Daftar"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Game Features:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Turn-based gameplay: 1 minggu = 1 turn, 3 action points per turn
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Kelola cash, hutang, investasi, mental health & reputation
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Investasi crypto & saham (volatil bro!)
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Liburan untuk restore mental health
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}