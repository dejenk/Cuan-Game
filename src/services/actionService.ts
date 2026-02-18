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
      category: "Work",
      description: "Freelance kerja keras",
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "opportunity", // using valid enum value
      title: "Freelance Success",
      description: `Freelance dapet Rp ${earnings.toLocaleString("id-ID")}! Mental -${mentalCost} (cape bro)`,
      turn_number: gameState.current_turn
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
      category: "Work",
      description: "Part-time job",
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "opportunity",
      title: "Part-time Job",
      description: `Part-time dapet Rp ${earnings.toLocaleString("id-ID")}. Mental -${mentalCost}`,
      turn_number: gameState.current_turn
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
      asset_type: "crypto", // Using lowercase to match CHECK constraint
      asset_name: "Crypto Random",
      quantity: 1, // Simplifying for now, 1 unit = invested amount
      buy_price: amount,
      current_price: amount,
      purchased_turn: gameState.current_turn
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "investment",
      amount: -amount,
      category: "Investment",
      description: "Invest Crypto (high risk!)",
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "opportunity",
      title: "Crypto Investment",
      description: `Invest Rp ${amount.toLocaleString("id-ID")} di Crypto. To the moon! 🚀`,
      turn_number: gameState.current_turn
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
      asset_type: "saham", // Lowercase to match check constraint
      asset_name: "Saham BUMN",
      quantity: 1,
      buy_price: amount,
      current_price: amount,
      purchased_turn: gameState.current_turn
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "investment",
      amount: -amount,
      category: "Investment",
      description: "Invest Saham",
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "opportunity",
      title: "Stock Investment",
      description: `Beli saham Rp ${amount.toLocaleString("id-ID")}. Sabar ya!`,
      turn_number: gameState.current_turn
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

    const payAmount = Math.min(amount, debt.current_balance);
    const newDebtBalance = debt.current_balance - payAmount;
    const newCash = gameState.cash - payAmount;

    await supabase
      .from("game_state")
      .update({ 
        cash: newCash,
        credit_score: Math.min(850, gameState.credit_score + 5)
      })
      .eq("user_id", userId);

    if (newDebtBalance <= 0) {
      await supabase.from("debts").delete().eq("id", debtId);
    } else {
      await supabase
        .from("debts")
        .update({ current_balance: newDebtBalance })
        .eq("id", debtId);
    }

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "debt_payment",
      amount: -payAmount,
      category: "Debt",
      description: `Bayar hutang ${debt.creditor_name}`,
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "achievement",
      title: "Debt Payment",
      description: `Bayar Rp ${payAmount.toLocaleString("id-ID")} ke ${debt.creditor_name}. Credit score +5!`,
      turn_number: gameState.current_turn
    });

    return {
      success: true,
      message: newDebtBalance <= 0 
        ? `Hutang lunas! Credit score +5` 
        : `Bayar Rp ${payAmount.toLocaleString("id-ID")}. Sisa ${newDebtBalance.toLocaleString("id-ID")}`
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
      turn_number: gameState.current_turn
    });

    await supabase.from("transactions").insert({
      user_id: userId,
      transaction_type: "expense",
      amount: -cost,
      category: "Lifestyle",
      description: `Liburan ke ${destination}`,
      turn_number: gameState.current_turn
    });

    await supabase.from("event_log").insert({
      user_id: userId,
      event_type: "achievement",
      title: "Vacation",
      description: `Liburan ke ${destination}! Mental +${mentalGain}. Worth it!`,
      turn_number: gameState.current_turn
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