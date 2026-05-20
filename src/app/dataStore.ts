export interface BettingTip {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  bookmaker: "sportybet" | "bet9ja";
}

export interface PastResult {
  id: string;
  fixture: string;
  odds: string;
  prediction: string;
  outcome: "won" | "lost";
}

export let sharedTipsList: BettingTip[] = [
  {
    id: "tip-1",
    fixture: "Chelsea vs Man City",
    odds: "3.45",
    prediction: "Over 2.5 Goals",
    bookmaker: "sportybet"
  },
  {
    id: "tip-2",
    fixture: "Real Madrid vs Barcelona",
    odds: "1.95",
    prediction: "Home Win (1)",
    bookmaker: "bet9ja"
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

export const addBettingTip = (newTip: Omit<BettingTip, "id">) => {
  const tipWithId: BettingTip = {
    ...newTip,
    id: `tip-${Date.now()}`
  };
  sharedTipsList = [tipWithId, ...sharedTipsList];
};
