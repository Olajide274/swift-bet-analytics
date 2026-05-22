import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Safe fallbacks handle pre-build phases without throwing payload errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://inygbyqptgrxngrmmpbv.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWpldHJrc3Z5aXdvcW9ycnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODQ0NTAsImV4cCI6MjA5NDg2MDQ1MH0.wOdZP6Auvsu93CROqLlS7NdtHeaj2vBJzvbEUP0WLYk";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const userId = searchParams.get("userId");

  if (!reference || !userId) {
    return NextResponse.json({ error: "Missing verification queries" }, { status: 400 });
  }

  try {
    // Ping Paystack's validation servers securely from your backend
    const paystackResponse = await fetch(`https://paystack.co{reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = await paystackResponse.json();

    // Verify Paystack returns an authentic successful signature trace
    if (paymentData.status && paymentData.data.status === "success") {
      const depositAmountNaira = paymentData.data.amount / 100;

      const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single();

      if (profile) {
        // Safe backend database money increment updates
        await supabaseAdmin
          .from("profiles")
          .update({
            real_balance: Number(profile.real_balance) + depositAmountNaira,
            has_deposited: true,
            is_bonus_unlocked: profile.has_placed_bet ? true : false
          })
          .eq("id", userId);

        return NextResponse.json({ success: true, message: "Vault wallet funded safely." });
      }
    }

    return NextResponse.json({ error: "Payment authentication verification failed" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
