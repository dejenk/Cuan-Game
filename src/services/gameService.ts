import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type GameState = Database["public"]["Tables"]["game_state"]["Row"];
export type Portfolio = Database["public"]["Tables"]["portfolio"]["Row"];
export type Debt = Database["public"]["Tables"]["debts"]["Row"];

export interface GameStats {
  cash: number;
  netWorth: number;
  mentalHealth: number;
  reputation: number;
  creditScore: number;
  totalDebt: number;
  turn: number;
  actionPoints: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  newStats?: GameStats;
  event?: string;
}

// Initialize new game for user
export async function initializeGame(userId: string): Promise<ActionResult> {
  try {
    // Check if game already exists
    const { data: existing } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return {
        success: false,
        message: "Game sudah dimulai sebelumnya!"
      };
    }

    // Create initial game state
    const { data: gameState, error: gameError } = await supabase
      .from("game_state")
      .insert({
        user_id: userId,
        cash: 5000000,
        net_worth: 5000000,
        mental_health: 100,
        reputation: 50,
        credit_score: 650,
        current_turn: 1,
        action_points: 3
      })
      .select()
      .single();

    if (gameError) throw gameError;

    // Create leaderboard entry
    await supabase.from("leaderboard").insert({
      user_id: userId,
      player_name: "Pejuang Baru",
      net_worth: 5000000,
      current_turn: 1
    });

    // Log initial event
    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "random",
      title: "Game Start",
      description: "Selamat datang di dunia Pejuang Rupiah! Kamu punya 5 juta di rekening. Jangan boros ya!",
      turn_number: 1
    });

    return {
      success: true,
      message: "Game dimulai! Good luck, Pejuang!",
      newStats: {
        cash: gameState.cash,
        netWorth: gameState.net_worth,
        mentalHealth: gameState.mental_health,
        reputation: gameState.reputation,
        creditScore: gameState.credit_score,
        totalDebt: 0,
        turn: gameState.current_turn,
        actionPoints: gameState.action_points
      }
    };
  } catch (error) {
    console.error("Initialize game error:", error);
    return {
      success: false,
      message: "Gagal memulai game. Coba lagi!"
    };
  }
}

// Get current game stats
export async function getGameStats(userId: string): Promise<GameStats | null> {
  try {
    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) return null;

    // Calculate total debt
    const { data: debts } = await supabase
      .from("debts")
      .select("current_balance")
      .eq("user_id", userId);

    const totalDebt = Array.isArray(debts) 
      ? debts.reduce((sum, d) => sum + d.current_balance, 0) 
      : 0;

    return {
      cash: gameState.cash,
      netWorth: gameState.net_worth,
      mentalHealth: gameState.mental_health,
      reputation: gameState.reputation,
      creditScore: gameState.credit_score,
      totalDebt,
      turn: gameState.current_turn,
      actionPoints: gameState.action_points
    };
  } catch (error) {
    console.error("Get game stats error:", error);
    return null;
  }
}

// End turn - advance to next week
export async function endTurn(userId: string): Promise<ActionResult> {
  try {
    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) {
      return { success: false, message: "Game state tidak ditemukan!" };
    }

    const newTurn = gameState.current_turn + 1;
    const events: string[] = [];

    // Calculate weekly changes
    let newCash = gameState.cash;
    let newMental = gameState.mental_health;
    let newReputation = gameState.reputation;

    // Weekly expenses (10% of cash, min 50k)
    const weeklyExpense = Math.max(newCash * 0.1, 50000);
    newCash -= weeklyExpense;
    events.push(`Pengeluaran mingguan: Rp ${weeklyExpense.toLocaleString("id-ID")}`);

    // Process debts - calculate interest
    const { data: debts } = await supabase
      .from("debts")
      .select("*")
      .eq("user_id", userId);

    if (Array.isArray(debts) && debts.length > 0) {
      for (const debt of debts) {
        const interest = debt.current_balance * (debt.interest_rate / 100);
        await supabase
          .from("debts")
          .update({ current_balance: debt.current_balance + Math.floor(interest) })
          .eq("id", debt.id);

        events.push(`Hutang ${debt.creditor_name}: +Rp ${Math.floor(interest).toLocaleString("id-ID")} bunga`);
        
        // Mental stress from debt
        newMental -= 2;
      }
    }

    // Process portfolio - calculate returns
    const { data: portfolio } = await supabase
      .from("portfolio")
      .select("*")
      .eq("user_id", userId);

    if (Array.isArray(portfolio) && portfolio.length > 0) {
      for (const asset of portfolio) {
        const weeklyReturn = Math.random() * 0.05 - 0.02; // -2% to +3% per week
        const currentVal = asset.current_price * Number(asset.quantity); // Approximate total value
        const returnAmount = currentVal * weeklyReturn;
        
        // Update current price per unit
        const newPricePerUnit = asset.current_price * (1 + weeklyReturn);

        await supabase
          .from("portfolio")
          .update({ 
            current_price: Math.floor(newPricePerUnit)
          })
          .eq("id", asset.id);

        const sign = returnAmount >= 0 ? "+" : "";
        events.push(`${asset.asset_type}: ${sign}Rp ${Math.floor(returnAmount).toLocaleString("id-ID")}`);
      }
    }

    // Random events
    const randomEvent = Math.random();
    if (randomEvent < 0.1) {
      const bonus = Math.floor(Math.random() * 500000) + 100000;
      newCash += bonus;
      newReputation += 5;
      events.push(`🎉 Bonus! Dapet Rp ${bonus.toLocaleString("id-ID")} dari temen! Reputasi +5`);
    } else if (randomEvent < 0.15) {
      const loss = Math.floor(Math.random() * 300000) + 50000;
      newCash -= loss;
      newMental -= 10;
      events.push(`😭 Kena tilang/denda Rp ${loss.toLocaleString("id-ID")}. Mental -10`);
    }

    // Mental health recovery
    if (newMental < 100) {
      newMental = Math.min(100, newMental + 5);
    }

    // Calculate new net worth
    const { data: updatedPortfolio } = await supabase
      .from("portfolio")
      .select("*")
      .eq("user_id", userId);

    const portfolioValue = Array.isArray(updatedPortfolio)
      ? updatedPortfolio.reduce((sum, p) => sum + (p.current_price * Number(p.quantity)), 0)
      : 0;

    const { data: updatedDebts } = await supabase
      .from("debts")
      .select("current_balance")
      .eq("user_id", userId);

    const totalDebt = Array.isArray(updatedDebts)
      ? updatedDebts.reduce((sum, d) => sum + d.current_balance, 0)
      : 0;

    const newNetWorth = newCash + portfolioValue - totalDebt;

    // Update game state
    const { data: updatedState, error } = await supabase
      .from("game_state")
      .update({
        current_turn: newTurn,
        action_points: 3,
        cash: Math.floor(newCash),
        net_worth: Math.floor(newNetWorth),
        mental_health: Math.max(0, newMental),
        reputation: Math.max(0, Math.min(100, newReputation))
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Update leaderboard
    await supabase
      .from("leaderboard")
      .update({
        net_worth: Math.floor(newNetWorth),
        current_turn: newTurn
      })
      .eq("user_id", userId);

    // Log event
    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "random", // Using generic 'random' type since 'turn_end' isn't in enum
      title: `Minggu ${newTurn}`,
      description: `Minggu ${newTurn} dimulai!\n${events.join("\n")}`,
      turn_number: newTurn
    });

    return {
      success: true,
      message: `Minggu ${newTurn} dimulai!`,
      event: events.join("\n"),
      newStats: {
        cash: updatedState.cash,
        netWorth: updatedState.net_worth,
        mentalHealth: updatedState.mental_health,
        reputation: updatedState.reputation,
        creditScore: updatedState.credit_score,
        totalDebt,
        turn: updatedState.current_turn,
        actionPoints: updatedState.action_points
      }
    };
  } catch (error) {
    console.error("End turn error:", error);
    return {
      success: false,
      message: "Gagal mengakhiri turn!"
    };
  }
}