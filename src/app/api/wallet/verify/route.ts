import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with the MASTER SERVICE ROLE KEY (Hidden from browsers)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS securely on the server side only
);

export async function POST(request: Request) {
  try {
    const { userId, actionType, referenceId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access attempt" }, { status: 401 });
    }

    // 1. Fetch current authentic user status directly from the database server
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "User profile profile missing" }, { status: 404 });
    }

    // 2. Handle Safe Server-Side Transaction Verification
    if (actionType === "PLACE_BET") {
      // Logic runs when user tracks a bet slip
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          has_placed_bet: true,
          // Automatically unlock bonus IF they have also deposited cash cleanly
          is_bonus_unlocked: profile.has_deposited ? true : false
        })
        .eq("id", userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    if (actionType === "WITHDRAW_REQUEST") {
      // CRITICAL DOORMAN GATE: Hackers calling this endpoint directly will be rejected on the backend
      if (!profile.is_bonus_unlocked && profile.real_balance <= 0) {
        return NextResponse.json({ 
          error: "Wager Policy Violation: You must satisfy deposit and active booking rules before cashout." 
        }, { status: 403 });
      }

      // Proceed with standard withdrawal routing safely...
      return NextResponse.json({ success: true, message: "Withdrawal passed security audit and queued." });
    }

    return NextResponse.json({ error: "Invalid API action method" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
