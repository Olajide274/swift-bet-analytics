import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const userId = searchParams.get("userId");

  if (!reference || !userId) {
    return NextResponse.json({ error: "Missing verification queries" }, { status: 400 });
  }

  try {
    // Correct Paystack verification endpoint
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = await paystackResponse.json();

    if (paymentData.status && paymentData.data.status === "success") {
      const depositAmountNaira = paymentData.data.amount / 100;

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        await supabaseAdmin
          .from("profiles")
          .update({
            real_balance: Number(profile.real_balance) + depositAmountNaira,
            has_deposited: true,
            is_bonus_unlocked: profile.has_placed_bet ? true : false,
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
