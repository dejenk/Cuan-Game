import { supabase } from "@/integrations/supabase/client";

export interface PlayerProfile {
  id: string;
  email: string;
  playerName: string;
  totalGamesPlayed: number;
  highestNetWorth: number;
  totalVacations: number;
  totalTransactions: number;
  createdAt: string;
}

// Update player name in leaderboard
export async function updatePlayerName(userId: string, newName: string) {
  try {
    const { error } = await supabase
      .from("leaderboard")
      .update({ player_name: newName })
      .eq("user_id", userId);

    if (error) {
      console.error("Update player name error:", error);
      return { success: false, message: "Gagal update nama pemain!" };
    }

    return { success: true, message: "Nama pemain berhasil diubah!" };
  } catch (error) {
    console.error("Update player name error:", error);
    return { success: false, message: "Gagal update nama pemain!" };
  }
}

// Get player profile with stats
export async function getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
  try {
    // Get basic profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get player name from leaderboard
    const { data: leaderboard } = await supabase
      .from("leaderboard")
      .select("player_name, net_worth, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    // Get game stats
    const { data: gameState } = await supabase
      .from("game_state")
      .select("current_turn")
      .eq("user_id", userId)
      .maybeSingle();

    // Get vacation count
    const { count: vacationCount } = await supabase
      .from("vacation_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Get transaction count
    const { count: transactionCount } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Get highest net worth from leaderboard history
    const { data: highestNetWorth } = await supabase
      .from("leaderboard")
      .select("net_worth")
      .eq("user_id", userId)
      .order("net_worth", { ascending: false })
      .limit(1)
      .maybeSingle();

    const profile: PlayerProfile = {
      id: userId,
      email: user.email || "",
      playerName: leaderboard?.player_name || "Pejuang",
      totalGamesPlayed: gameState?.current_turn || 0,
      highestNetWorth: highestNetWorth?.net_worth || leaderboard?.net_worth || 0,
      totalVacations: vacationCount || 0,
      totalTransactions: transactionCount || 0,
      createdAt: leaderboard?.updated_at || new Date().toISOString()
    };

    return profile;
  } catch (error) {
    console.error("Get player profile error:", error);
    return null;
  }
}

// Delete account (soft delete - just remove game data, keep auth)
export async function deleteGameData(userId: string) {
  try {
    // Delete in order to respect foreign keys
    await supabase.from("transactions").delete().eq("user_id", userId);
    await supabase.from("event_log").delete().eq("user_id", userId);
    await supabase.from("vacation_history").delete().eq("user_id", userId);
    await supabase.from("portfolio").delete().eq("user_id", userId);
    await supabase.from("debts").delete().eq("user_id", userId);
    await supabase.from("community_chat").delete().eq("user_id", userId);
    await supabase.from("leaderboard").delete().eq("user_id", userId);
    await supabase.from("game_state").delete().eq("user_id", userId);

    return { success: true, message: "Data game berhasil dihapus!" };
  } catch (error) {
    console.error("Delete game data error:", error);
    return { success: false, message: "Gagal menghapus data game!" };
  }
}