import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const userId = searchParams.get("userId");

  if (!reference || !userId) {
    return NextResponse.json({ error: "Missing verification queries" }, { status: 400 });
  }

  try {
    // Ping Paystack's secure verification nodes directly from your server
    const paystackResponse = await fetch(`https://paystack.co{reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Never show this to clients!
      },
    });

    const paymentData = await paystackResponse.json();

    // Verify Paystack explicitly returns an authenticated "success" text payload status
    if (paymentData.status && paymentData.data.status === "success") {
      const depositAmountNaira = paymentData.data.amount / 100;

      // Pull current details
      const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single();

      if (profile) {
        // Upgrade balances inside your cloud vault
        await supabaseAdmin
          .from("profiles")
          .update({
            real_balance: Number(profile.real_balance) + depositAmountNaira,
            has_deposited: true,
            is_bonus_unlocked: profile.has_placed_bet ? true : false // Unlock if bet is already placed
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
// Next.js automatically grabs the hidden key from the environment
const secretKey = process.env.PAYSTACK_SECRET_KEY;
