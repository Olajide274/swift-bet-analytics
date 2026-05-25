// 1. Clean import for the TypeScript types from the node_modules package
import { createClient } from "@supabase/supabase-js"; 

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
  id?: string; 
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

// FETCH LIVE DATA FROM SUPABASE
export async function getLiveBettingTips(): Promise<BettingTip[]> {
  const { data, error } = await supabase
    .from('betting_tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tips:", error.message);
    return [];
  }

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

// ADD NEW BETTING TIP VIA ADMIN PANEL
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

export const evaluateBonusUnlockCondition = (profile: UserProfile): UserProfile => {
  if (profile.hasDeposited && profile.hasPlacedBet) {
    profile.isBonusUnlocked = true;
  } else {
    profile.isBonusUnlocked = false;
  }
  return profile;
};

// FALLBACK EXPORTS FOR COMPILATION COMPATIBILITY
export let sharedTipsList: BettingTip[] = [
  {
    id: "tip-1",
    fixture: "Chelsea vs Man City",
    odds: "3.45",
    prediction: "Over 2.5 Goals",
    bookmaker: "sportybet",
    bookingCode: "SB-CHMCI-2026",
    isVIP: false
  }
];

export const historicalResultsList: PastResult[] = [
  {
    id: "hist-1",
    fixture: "Arsenal vs Liverpool",
    odds: "2.10",
    prediction: "Both Teams To Score",
    outcome: "won"
  }
];

export let currentUserProfile: UserProfile = {
  username: "michael55",
  fullName: "Michael Olajide",
  email: "michael@example.com",
  phoneNumber: "+2348012345678",
  isEmailVerified: false,
  isPhoneVerified: false,
  realBalance: 5000,
  bonusBalance: 2000,
  hasDeposited: false,
  hasPlacedBet: false,
  isBonusUnlocked: false,
  referredBy: null,
  tier1Referrals: 4,  
  tier2Referrals: 12  
};
