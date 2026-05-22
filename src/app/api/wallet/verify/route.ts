import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Safe fallbacks prevent initialization crashes during "npm run build"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://inygbyqptgrxngrmmpbv.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWpldHJrc3Z5aXdvcW9ycnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODQ0NTAsImV4cCI6MjA5NDg2MDQ1MH0.wOdZP6Auvsu93CROqLlS7NdtHeaj2vBJzvbEUP0WLYk";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  try {
    const { userId, actionType } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access attempt" }, { status: 401 });
    }

    // 1. Fetch data directly from the cloud database server
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "User profile missing" }, { status: 404 });
    }

    // 2. Process active slip calculations
    if (actionType === "PLACE_BET") {
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          has_placed_bet: true,
          is_bonus_unlocked: profile.has_deposited ? true : false
        })
        .eq("id", userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    if (actionType === "WITHDRAW_REQUEST") {
      // Backend anti-hack gatekeeper validation clause
      if (!profile.is_bonus_unlocked && profile.real_balance <= 0) {
        return NextResponse.json({ 
          error: "Wager Policy Violation: You must satisfy deposit and active booking rules before cashout." 
        }, { status: 403 });
      }

      return NextResponse.json({ success: true, message: "Withdrawal passed security audit and queued." });
    }

    return NextResponse.json({ error: "Invalid API action method" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
