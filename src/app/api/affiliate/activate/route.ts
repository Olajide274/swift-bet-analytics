import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 1. Define the safe environment targets with generic text placeholders
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-placeholder-service-key-string";

// 2. Initialize the client using the defined variables from above
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
export async function POST(request: Request) {
  try {
    const { newUserUuid } = await request.json();

    // Find the referral link associated with the new profile setup
    const { data: networkRow } = await supabaseAdmin
      .from("referral_network")
      .select("*")
      .eq("user_id", newUserUuid)
      .single();

    if (!networkRow || networkRow.is_activated) {
      return NextResponse.json({ message: "Network route already processed or invalid." });
    }

    // Mark the referral connection as fully activated
    await supabaseAdmin.from("referral_network").update({ is_activated: true }).eq("user_id", newUserUuid);

    // Tier 1 Payout: ₦500 reward for the direct invite context link
    if (networkRow.parent_id) {
      const { data: parent } = await supabaseAdmin.from("profiles").select("real_balance, tier_1_referrals").eq("id", networkRow.parent_id).single();
      if (parent) {
        await supabaseAdmin.from("profiles").update({
          real_balance: Number(parent.real_balance) + 500,
          tier_1_referrals: parent.tier_1_referrals + 1
        }).eq("id", networkRow.parent_id);
      }
    }

    // Tier 2 Payout: ₦150 reward for the indirect ancestral grandparent link
    if (networkRow.grandparent_id) {
      const { data: grandparent } = await supabaseAdmin.from("profiles").select("real_balance, tier_2_referrals").eq("id", networkRow.grandparent_id).single();
      if (grandparent) {
        await supabaseAdmin.from("profiles").update({
          real_balance: Number(grandparent.real_balance) + 150,
          tier_2_referrals: grandparent.tier_2_referrals + 1
        }).eq("id", networkRow.grandparent_id);
      }
    }

    return NextResponse.json({ success: true, message: "Multi-tier ledger distributions paid cleanly." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
