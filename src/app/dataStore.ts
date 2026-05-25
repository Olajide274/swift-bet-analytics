// 1. Clean import for the TypeScript types from the node_modules package
import { createClient } from "@supabase/supabase-js"; 

// 2. Clean import pointing to YOUR local configuration file
import { supabase } from "./superbaseClient"; 


export interface BettingTip {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  bookmaker: "sportybet" | "bet9ja";
  bookingCode: string;
  isVIP: boolean; 
}

export interface PastResult {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  outcome: "won" | "lost";
}

export interface UserProfile {
  id?: string; // Links back to Supabase auth user reference metadata
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  realBalance: number;
  bonusBalance: number;
  hasDeposited: boolean;      
  hasPlacedBet: boolean;      
  isBonusUnlocked: boolean;   
  referredBy: string | null;  
  tier1Referrals: number;
  tier2Referrals: number;
}

// FETCH LIVE DATA FROM SUPABASE (Call this inside your Client Components / Dashboards)
export async function getLiveBettingTips(): Promise<BettingTip[]> {
  const { data, error } = await supabase
    .from('betting_tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tips:", error.message);
    return [];
  }

  // Maps database snake_case keys back to your frontend camelCase parameters smoothly
  return data.map((tip: any) => ({
    id: tip.id,
    fixture: tip.fixture,
    odds: tip.odds,
    prediction: tip.prediction,
    bookmaker: tip.bookmaker,
    bookingCode: tip.booking_code,
    isVIP: tip.is_vip
  }));
}

// ADD NEW BETTING TIP VIA ADMIN PANEL DIRECTLY INTO SUPABASE
export async function addBettingTip(newTip: Omit<BettingTip, "id">) {
  const { data, error } = await supabase
    .from('betting_tips')
    .insert([
      {
        fixture: newTip.fixture,
        odds: newTip.odds,
        prediction: newTip.prediction,
        bookmaker: newTip.bookmaker,
        booking_code: newTip.bookingCode,
        is_vip: newTip.isVIP || false
      }
    ]);

  if (error) {
    console.error("Failed writing tip directly to Supabase storage instance:", error.message);
    throw error;
  }
  return data;
}

// LOGIC UTILITY RULE: Evaluation logic functions remain clean & calculations fast
export const evaluateBonusUnlockCondition = (profile: UserProfile): UserProfile => {
  if (profile.hasDeposited && profile.hasPlacedBet) {
    profile.isBonusUnlocked = true;
  } else {
    profile.isBonusUnlocked = false;
  }
  return profile;
};
