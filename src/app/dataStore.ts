export interface BettingTip {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  bookmaker: "sportybet" | "bet9ja";
  bookingCode: string; // Added to prevent runtime errors in your Dashboard UI copy action
}

export interface PastResult {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  outcome: "won" | "lost";
}

// New: Defines the state profile of a SwiftBet user
export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  realBalance: number;
  bonusBalance: number;
  hasDeposited: boolean;      // True only when they deposit cash
  hasPlacedBet: boolean;      // True only when they place an actual bet
  isBonusUnlocked: boolean;   // True ONLY when hasDeposited AND hasPlacedBet are true
  referredBy: string | null;  // Tracks who invited them
}

export let sharedTipsList: BettingTip[] = [
  {
    id: "tip-1",
    fixture: "Chelsea vs Man City",
    odds: "3.45",
    prediction: "Over 2.5 Goals",
    bookmaker: "sportybet",
    bookingCode: "SB-CHMCI-2026"
  },
  {
    id: "tip-2",
    fixture: "Real Madrid vs Barcelona",
    odds: "1.95",
    prediction: "Home Win (1)",
    bookmaker: "bet9ja",
    bookingCode: "B9-RMBAR-9922"
  }
];

// High-integrity historical performance results log
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
];

// New: Mock default profile matching 'michael55' from your original UI state
export let currentUserProfile: UserProfile = {
  username: "michael55",
  fullName: "Michael Olajide",
  email: "michael@example.com",
  phoneNumber: "+2348012345678",
  isEmailVerified: false,
  isPhoneVerified: false,
  realBalance: 0,
  bonusBalance: 2000,
  hasDeposited: false,
  hasPlacedBet: false,
  isBonusUnlocked: false, // Locked until real deposit & bet occurs
  referredBy: null
};

export const addBettingTip = (newTip: Omit<BettingTip, "id">) => {
  const tipWithId: BettingTip = {
    ...newTip,
    id: `tip-${Date.now()}`
  };
  sharedTipsList = [tipWithId, ...sharedTipsList];
};

// New: Evaluation engine to check if a user is legally allowed to withdraw their bonus balance
export const evaluateBonusUnlockCondition = (profile: UserProfile): UserProfile => {
  if (profile.hasDeposited && profile.hasPlacedBet) {
    profile.isBonusUnlocked = true;
  } else {
    profile.isBonusUnlocked = false;
  }
  return profile;
};
