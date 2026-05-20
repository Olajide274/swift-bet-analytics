"use client";

import React, { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, Copy, CheckCircle, LogOut, User, Menu, X, Lock, Unlock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { sharedTipsList, historicalResultsList, currentUserProfile, BettingTip, PastResult } from "./dataStore";

export default function Dashboard() {
  const router = useRouter();
  
  // Security Check Gatekeeper: Defaults to false to force them through verification first
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [liveTips, setLiveTips] = useState<BettingTip[]>([]);
  const [pastResults, setPastResults] = useState<PastResult[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<"feed" | "invite">("feed");

  // Track state matching our user profile business model configurations
  const [userProfile, setUserProfile] = useState(currentUserProfile);
  const [referralLink, setReferralLink] = useState<string>("");

  useEffect(() => {
    // Security Gatekeeper Routing Rule
    if (!isLoggedIn) {
      router.push("/auth");
    }

    setLiveTips([...sharedTipsList]);
    setPastResults([...historicalResultsList]);

    if (typeof window !== "undefined") {
      const domain = window.location.origin;
      setReferralLink(`${domain}/auth?ref=${userProfile.username}`);
    }
  }, [isLoggedIn, router, userProfile.username]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0B0F19", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748B", fontSize: "12px", fontFamily: "sans-serif" }}>Verifying security protocol layer...</p>
      </div>
    );
  }

  const handleCopyBookingCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", paddingBottom: "100px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      
      {/* Account Settings Side Drawer Menu Overlay */}
      {isMenuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(11, 15, 25, 0.98)", zIndex: 100, padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", color: "#64748B", letterSpacing: "1px" }}>Account Settings</span>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer" }}><X style={{ width: "24px", height: "24px" }} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1E293B", padding: "16px", borderRadius: "16px", border: "1px solid #334155" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#06B6D4", display: "flex", alignItems: "center", justifyContent: "center" }}><User style={{ width: "20px", height: "20px", color: "#0B0F19" }} /></div>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>{userProfile.fullName}</h3>
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0, fontFamily: "monospace" }}>@{userProfile.username}</p>
              </div>
            </div>

            {/* Internal Simple Screen Navigation Swapper */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" }}>
              <button onClick={() => { setCurrentScreen("feed"); setIsMenuOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "12px", borderRadius: "12px", border: "none", backgroundColor: currentScreen === "feed" ? "#334155" : "transparent", color: "#FFFFFF", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>Analytics Feed Slips</button>
              <button onClick={() => { setCurrentScreen("invite"); setIsMenuOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "12px", borderRadius: "12px", border: "none", backgroundColor: currentScreen === "invite" ? "#334155" : "transparent", color: "#FFFFFF", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>Invite Friends & Earn</button>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={{ width: "100%", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "14px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}><LogOut style={{ width: "16px", height: "16px" }} /> Log Out</button>
        </div>
      )}

      {/* Main Top Header Navigation Ribbon */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1E293B", maxWidth: "420px", margin: "0 auto" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>SwiftBet<span style={{ color: "#06B6D4" }}>Analytics</span></h1>
          <p style={{ fontSize: "10px", color: "#64748B", margin: 0 }}>Premium Sports Insights</p>
        </div>
        <button onClick={() => setIsMenuOpen(true)} style={{ width: "38px", height: "38px", backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", cursor: "pointer" }}><Menu style={{ width: "18px", height: "18px" }} /></button>
      </header>

      {/* Core Body Container Wrapper */}
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Wallet Component Structure */}
        <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", alignItems: "center", justifyBox: "space-between", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Wallet style={{ width: "18px", height: "18px", color: "#10B981" }} />
              <h2 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#E2E8F0" }}>Your Swift Wallet</h2>
            </div>
            {userProfile.isBonusUnlocked ? (
              <span style={{ fontSize: "10px", color: "#10B981", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}><Unlock style={{ width: "12px", height: "12px" }} /> Bonus Active</span>
            ) : (
              <span style={{ fontSize: "10px", color: "#F59E0B", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}><Lock style={{ width: "12px", height: "12px" }} /> Bonus Locked</span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", color: "#64748B", margin: "0 0 4px 0" }}>Real Balance</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>₦{userProfile.realBalance}</p>
            </div>
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", color: "#10B981", margin: "0 0 4px 0" }}>Bonus Balance *</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#10B981" }}>₦{userProfile.bonusBalance}</p>
            </div>
          </div>

          {/* Conditional Warning notice about locked layout rules */}
          {!userProfile.isBonusUnlocked && (
            <div style={{ display: "flex", gap: "6px", backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "10px", padding: "10px", marginBottom: "16px", alignItems: "flex-start" }}>
              <AlertCircle style={{ width: "14px", height: "14px", color: "#F59E0B", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ fontSize: "9px", color: "#94A3B8", margin: 0, lineHeight: "1.3" }}>
                To cash out the ₦2,000 bonus balance or referral stakes, you must fulfill the wagering profile criteria: 
                <strong> {!userProfile.hasDeposited && " [Deposit Cash Required] "} </strong>
                <strong> {!userProfile.hasPlacedBet && " [Place First Bet Required] "}</strong>
              </p>
            </div>
          )}

          <button onClick={() => router.push("/deposit")} style={{ width: "100%", backgroundColor: "#10B981", color: "#0B0F19", fontWeight: "bold", fontSize: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            Deposit Cash <ArrowUpRight style={{ width: "14px", height: "14px" }} />
          </button>
        </section>

        {/* Dynamic Panel Screen Content Display Switcher */}
        {currentScreen === "feed" ? (
          <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
              <button onClick={() => setActiveTab("active")} style={{ flex: 1, backgroundColor: activeTab === "active" ? "#06B6D4" : "transparent", color: activeTab === "active" ? "#0B0F19" : "#94A3B8", border: "none", padding: "8px 0", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Open Slips</button>
              <button onClick={() => setActiveTab("history")} style={{ flex: 1, backgroundColor: activeTab === "history" ? "#06B6D4" : "transparent", color: activeTab === "history" ? "#0B0F19" : "#94A3B8", border: "none", padding: "8px 0", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Results History</button>
            </div>
            
            {/* REPAIRED: Clean, fully mapped data renderer loop blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeTab === "active" ? (
                liveTips.map((tip) => (
                  <div key={tip.id} style={{ backgroundColor: "#0B0F19", padding: "14px", borderRadius: "12px", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#334155", textTransform: "uppercase", color: "#06B6D4", fontWeight: "bold" }}>{tip.bookmaker}</span>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: "#10B981" }}>{tip.odds} Odds</span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 4px 0" }}>{tip.fixture}</p>
                    <p style={{ fontSize: "11px", color: "#94A3B8", margin: "0 0 12px 0" }}>Pick: <span style={{ color: "#FFFFFF" }}>{tip.prediction}</span></p>
                    <button onClick={() => handleCopyBookingCode(tip.bookingCode, tip.id)} style={{ width: "100%", backgroundColor: "rgba(6, 182, 212, 0.1)", border: "1px solid #06B6D4", color: "#06B6D4", padding: "8px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      {copiedCodeId === tip.id ? <><CheckCircle style={{ width: "12px", height: "12px" }} /> Booking Code Copied!</> : <>Copy Slip Booking Code</>}
                    </button>
                  </div>
                ))
              ) : (
                pastResults.map((res) => (
                  <div key={res.id} style={{ backgroundColor: "#0B0F19", padding: "14px", borderRadius: "12px", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>{res.fixture}</span>
                      <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", backgroundColor: res.outcome === "won" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: res.outcome === "won" ? "#10B981" : "#EF4444", textTransform: "uppercase" }}>{res.outcome}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Pick: {res.prediction} @ {res.odds}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          /* Referral Management Panel Box */
          <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 6px 0" }}>Affiliate Referral Program</h2>
            <p style={{ fontSize: "11px", color: "#94A3B8", margin: "0 0 16px 0", lineHeight: "1.4" }}>Invite secondary sports bettors using your direct credential link. Payout stakes are unlocked as soon as your referral fulfills the deposit terms.</p>
            
            <div style={{ backgroundColor: "#0B0F19", padding: "12px", borderRadius: "12px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "24px", flex: 1 }}>{referralLink}</span>
              <button onClick={handleCopyReferral} style={{ border: "none", backgroundColor: "#06B6D4", color: "#0B0F19", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginLeft: "8px" }}>
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

