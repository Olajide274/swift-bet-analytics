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

export let sharedTipsList: BettingTip[] = [
  {
    id: "tip-1",
    fixture: "Chelsea vs Man City",
    odds: "3.45",
    prediction: "Over 2.5 Goals",
    bookmaker: "sportybet",
    bookingCode: "SB-CHMCI-2026",
    isVIP: false
  },
  {
    id: "tip-2",
    fixture: "Real Madrid vs Barcelona",
    odds: "1.95",
    prediction: "Home Win (1)",
    bookmaker: "bet9ja",
    bookingCode: "B9-RMBAR-9922",
    isVIP: false
  },
  {
    id: "tip-vip-3",
    fixture: "Liverpool vs Man United",
    odds: "4.85",
    prediction: "Handicap (0:1)",
    bookmaker: "sportybet",
    bookingCode: "SB-LIVMUN-551",
    isVIP: true
  }
];

export const historicalResultsList: PastResult[] = [
  {
    id: "hist-1",
    fixture: "Arsenal vs Liverpool",
    odds: "2.10",
    prediction: "Both Teams To Score",
    outcome: "won"
  },
  {
    id: "hist-2",
    fixture: "Bayern Munich vs Dortmund",
    odds: "1.75",
    prediction: "Over 3.5 Goals",
    outcome: "won"
  },
  {
    id: "hist-3",
    fixture: "Juventus vs AC Milan",
    odds: "3.10",
    prediction: "Draw (X)",
    outcome: "lost"
  }
]; // FIXED: Closed the array properly to clear the parsing error

export let currentUserProfile: UserProfile = {
  username: "michael55",
  fullName: "Michael Olajide",
  email: "michael@example.com",
  phoneNumber: "+2348012345678",
  isEmailVerified: false,
  isPhoneVerified: false,
  realBalance: 5000, // Added starter balance to test out the VIP purchase buttons!
  bonusBalance: 2000,
  hasDeposited: false,
  hasPlacedBet: false,
  isBonusUnlocked: false,
  referredBy: null,
  tier1Referrals: 4,  
  tier2Referrals: 12  
};

export const addBettingTip = (newTip: Omit<BettingTip, "id">) => {
  const tipWithId: BettingTip = {
    ...newTip,
    id: `tip-${Date.now()}`
  };
  sharedTipsList = [tipWithId, ...sharedTipsList];
};

export const evaluateBonusUnlockCondition = (profile: UserProfile): UserProfile => {
  if (profile.hasDeposited && profile.hasPlacedBet) {
    profile.isBonusUnlocked = true;
  } else {
    profile.isBonusUnlocked = false;
  }
  return profile;
};
