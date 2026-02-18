import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  updatePassword, 
  updateEmail, 
  getCurrentUserProfile 
} from "@/services/authService";
import { 
  getPlayerProfile, 
  updatePlayerName, 
  deleteGameData,
  type PlayerProfile 
} from "@/services/profileService";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Trophy, 
  Calendar,
  TrendingUp,
  Plane,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  // Form states
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    await loadProfile(session.user.id);
  }

  async function loadProfile(userId: string) {
    setLoading(true);
    
    const profileData = await getPlayerProfile(userId);
    if (profileData) {
      setProfile(profileData);
      setPlayerName(profileData.playerName);
      setEmail(profileData.email);
    }

    setLoading(false);
  }

  async function handleUpdatePlayerName() {
    if (!user || !playerName.trim()) {
      toast({
        title: "Error",
        description: "Nama pemain tidak boleh kosong!",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const result = await updatePlayerName(user.id, playerName.trim());
    
    toast({
      title: result.success ? "Berhasil!" : "Gagal",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      await loadProfile(user.id);
    }
    setSaving(false);
  }

  async function handleUpdateEmail() {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email tidak boleh kosong!",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const result = await updateEmail(email.trim());
    
    toast({
      title: result.success ? "Berhasil!" : "Gagal",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    setSaving(false);
  }

  async function handleUpdatePassword() {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak boleh kosong!",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi tidak sama!",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter!",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const result = await updatePassword(newPassword);
    
    toast({
      title: result.success ? "Berhasil!" : "Gagal",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setSaving(false);
  }

  async function handleDeleteGameData() {
    if (!user) return;

    setSaving(true);
    const result = await deleteGameData(user.id);
    
    toast({
      title: result.success ? "Berhasil!" : "Gagal",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Profil - Pejuang Rupiah"
        description="Kelola profil dan pengaturan akun Pejuang Rupiah"
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push("/game")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Profil Pejuang</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-muted-foreground">Net Worth Tertinggi</p>
                </div>
                <p className="text-lg font-bold">
                  Rp {(profile.highestNetWorth / 1000000).toFixed(1)}M
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Turn Dimainkan</p>
                </div>
                <p className="text-lg font-bold">{profile.totalGamesPlayed}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-muted-foreground">Total Liburan</p>
                </div>
                <p className="text-lg font-bold">{profile.totalVacations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <p className="text-xs text-muted-foreground">Total Transaksi</p>
                </div>
                <p className="text-lg font-bold">{profile.totalTransactions}</p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Update nama pemain dan informasi profil kamu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Nama Pemain</Label>
                    <Input
                      id="playerName"
                      placeholder="Masukkan nama pemain"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Member Sejak</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>

                  <Button 
                    onClick={handleUpdatePlayerName}
                    disabled={saving || playerName === profile.playerName}
                    className="w-full"
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Tab */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Email</CardTitle>
                  <CardDescription>
                    Update email akun kamu. Kamu akan menerima email verifikasi di alamat baru.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Baru</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdateEmail}
                    disabled={saving || email === profile.email}
                    className="w-full"
                  >
                    {saving ? "Menyimpan..." : "Update Email"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Password</CardTitle>
                  <CardDescription>
                    Ganti password untuk keamanan akun kamu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ketik ulang password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdatePassword}
                    disabled={saving || !newPassword || !confirmPassword}
                    className="w-full"
                  >
                    {saving ? "Menyimpan..." : "Ubah Password"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Tindakan berikut tidak dapat dibatalkan. Harap berhati-hati!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Hapus Semua Data Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Yakin mau hapus semua data game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus SEMUA data game kamu termasuk:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Stats & progress game</li>
                        <li>Portfolio investasi</li>
                        <li>History transaksi</li>
                        <li>Event log</li>
                        <li>Leaderboard entry</li>
                      </ul>
                      <p className="mt-3 font-semibold">
                        Tindakan ini TIDAK BISA dibatalkan!
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGameData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ya, Hapus Semua Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}