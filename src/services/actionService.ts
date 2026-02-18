import { supabase } from "@/integrations/supabase/client";
import type { ActionResult } from "./gameService";

// Helper to check and consume action points
async function consumeActionPoint(userId: string): Promise<boolean> {
  const { data: gameState } = await supabase
    .from("game_state")
    .select("action_points")
    .eq("user_id", userId)
    .single();

  if (!gameState || gameState.action_points <= 0) {
    return false;
  }

  await supabase
    .from("game_state")
    .update({ action_points: gameState.action_points - 1 })
    .eq("user_id", userId);

  return true;
}

// Cuan Actions
export async function freelanceWork(userId: string): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis! Akhiri turn dulu." };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");

    const earnings = Math.floor(Math.random() * 1000000) + 500000;
    const mentalCost = Math.floor(Math.random() * 10) + 5;
    const newCash = gameState.cash + earnings;
    const newMental = Math.max(0, gameState.mental_health - mentalCost);

    await supabase
      .from("game_state")
      .update({
        cash: newCash,
        mental_health: newMental,
        net_worth: gameState.net_worth + earnings
      })
      .eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "income",
      amount: earnings,
      description: "Freelance kerja keras",
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "income",
      description: `Freelance dapet Rp ${earnings.toLocaleString("id-ID")}! Mental -${mentalCost} (cape bro)`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: `Freelance berhasil! +Rp ${earnings.toLocaleString("id-ID")}, Mental -${mentalCost}`
    };
  } catch (error) {
    console.error("Freelance work error:", error);
    return { success: false, message: "Gagal freelance!" };
  }
}

export async function partTimeJob(userId: string): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis! Akhiri turn dulu." };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");

    const earnings = Math.floor(Math.random() * 500000) + 250000;
    const mentalCost = Math.floor(Math.random() * 5) + 2;
    const newCash = gameState.cash + earnings;
    const newMental = Math.max(0, gameState.mental_health - mentalCost);

    await supabase
      .from("game_state")
      .update({
        cash: newCash,
        mental_health: newMental,
        net_worth: gameState.net_worth + earnings
      })
      .eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "income",
      amount: earnings,
      description: "Part-time job",
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "income",
      description: `Part-time dapet Rp ${earnings.toLocaleString("id-ID")}. Mental -${mentalCost}`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: `Part-time selesai! +Rp ${earnings.toLocaleString("id-ID")}, Mental -${mentalCost}`
    };
  } catch (error) {
    console.error("Part-time job error:", error);
    return { success: false, message: "Gagal kerja part-time!" };
  }
}

// Lapak Actions
export async function investCrypto(userId: string, amount: number): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis!" };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");
    if (gameState.cash < amount) {
      return { success: false, message: "Duit gak cukup buat invest!" };
    }

    const newCash = gameState.cash - amount;
    await supabase
      .from("game_state")
      .update({ cash: newCash })
      .eq("user_id", userId);

    await supabase.from("portfolio").insert({
      user_id: userId,
      asset_type: "Crypto",
      amount: amount,
      current_value: amount
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "investment",
      amount: -amount,
      description: "Invest Crypto (high risk!)",
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "investment",
      description: `Invest Rp ${amount.toLocaleString("id-ID")} di Crypto. To the moon! 🚀`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: `Crypto dibeli Rp ${amount.toLocaleString("id-ID")}. Semoga naik!`
    };
  } catch (error) {
    console.error("Invest crypto error:", error);
    return { success: false, message: "Gagal invest crypto!" };
  }
}

export async function investSaham(userId: string, amount: number): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis!" };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");
    if (gameState.cash < amount) {
      return { success: false, message: "Duit gak cukup!" };
    }

    const newCash = gameState.cash - amount;
    await supabase
      .from("game_state")
      .update({ cash: newCash })
      .eq("user_id", userId);

    await supabase.from("portfolio").insert({
      user_id: userId,
      asset_type: "Saham",
      amount: amount,
      current_value: amount
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "investment",
      amount: -amount,
      description: "Invest Saham",
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "investment",
      description: `Beli saham Rp ${amount.toLocaleString("id-ID")}. Sabar ya!`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: `Saham dibeli Rp ${amount.toLocaleString("id-ID")}`
    };
  } catch (error) {
    console.error("Invest saham error:", error);
    return { success: false, message: "Gagal invest saham!" };
  }
}

// Pay debt
export async function payDebt(userId: string, debtId: string, amount: number): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis!" };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");
    if (gameState.cash < amount) {
      return { success: false, message: "Duit gak cukup buat bayar!" };
    }

    const { data: debt } = await supabase
      .from("debts")
      .select("*")
      .eq("id", debtId)
      .eq("user_id", userId)
      .single();

    if (!debt) {
      return { success: false, message: "Hutang tidak ditemukan!" };
    }

    const payAmount = Math.min(amount, debt.amount);
    const newDebtAmount = debt.amount - payAmount;
    const newCash = gameState.cash - payAmount;

    await supabase
      .from("game_state")
      .update({ 
        cash: newCash,
        credit_score: Math.min(850, gameState.credit_score + 5)
      })
      .eq("user_id", userId);

    if (newDebtAmount <= 0) {
      await supabase.from("debts").delete().eq("id", debtId);
    } else {
      await supabase
        .from("debts")
        .update({ amount: newDebtAmount })
        .eq("id", debtId);
    }

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "expense",
      amount: -payAmount,
      description: `Bayar hutang ${debt.source}`,
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "debt_payment",
      description: `Bayar Rp ${payAmount.toLocaleString("id-ID")} ke ${debt.source}. Credit score +5!`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: newDebtAmount <= 0 
        ? `Hutang lunas! Credit score +5` 
        : `Bayar Rp ${payAmount.toLocaleString("id-ID")}. Sisa ${newDebtAmount.toLocaleString("id-ID")}`
    };
  } catch (error) {
    console.error("Pay debt error:", error);
    return { success: false, message: "Gagal bayar hutang!" };
  }
}

// Vacation
export async function takeVacation(userId: string, destination: string, cost: number): Promise<ActionResult> {
  try {
    if (!(await consumeActionPoint(userId))) {
      return { success: false, message: "Action points habis!" };
    }

    const { data: gameState } = await supabase
      .from("game_state")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!gameState) throw new Error("Game state not found");
    if (gameState.cash < cost) {
      return { success: false, message: "Duit gak cukup buat liburan!" };
    }

    const newCash = gameState.cash - cost;
    const mentalGain = Math.floor(Math.random() * 20) + 10;
    const newMental = Math.min(100, gameState.mental_health + mentalGain);

    await supabase
      .from("game_state")
      .update({
        cash: newCash,
        mental_health: newMental
      })
      .eq("user_id", userId);

    await supabase.from("vacation_history").insert({
      user_id: userId,
      destination: destination,
      cost: cost,
      mental_gain: mentalGain,
      turn: gameState.turn
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "expense",
      amount: -cost,
      description: `Liburan ke ${destination}`,
      turn: gameState.turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "vacation",
      description: `Liburan ke ${destination}! Mental +${mentalGain}. Worth it!`,
      turn: gameState.turn
    });

    return {
      success: true,
      message: `Liburan ke ${destination} mantap! Mental +${mentalGain}`
    };
  } catch (error) {
    console.error("Take vacation error:", error);
    return { success: false, message: "Gagal liburan!" };
  }
}