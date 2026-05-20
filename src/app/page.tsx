"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Users, ArrowUpRight, Copy, CheckCircle, TrendingUp, Award, LogOut, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { sharedTipsList, historicalResultsList, BettingTip } from "./dataStore";

export default function Dashboard() {
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [liveTips, setLiveTips] = useState<BettingTip[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [currentUser, setCurrentUser] = useState<string>("michael55");
  const [referralLink, setReferralLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<"feed" | "invite">("feed");

  const sportyBetId = process.env.NEXT_PUBLIC_SPORTYBET_AFFILIATE_ID || "DEFAULT_FALLBACK";
  const bet9jaId = process.env.NEXT_PUBLIC_BET9JA_AFFILIATE_ID || "DEFAULT_FALLBACK";

  useEffect(() => {
    setLiveTips([...sharedTipsList]);
    if (typeof window !== "undefined") {
      const domain = window.location.origin;
      setReferralLink(`${domain}/auth?ref=${currentUser}`);
    }
  }, [currentUser]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBookingCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", paddingBottom: "80px", boxSizing: "border-box" }}>
      
      {/* Drawer Overlay Settings */}
      {isMenuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(11, 15, 25, 0.95)", zIndex: 100, padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", color: "#64748B" }}>Account Settings</span>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X style={{ width: "24px", height: "24px" }} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1E293B", padding: "16px", borderRadius: "16px", border: "1px solid #334155" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#06B6D4", display: "flex", alignItems: "center", justifyContent: "center" }}><User style={{ width: "20px", height: "20px", color: "#0B0F19" }} /></div>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>Michael Olajide</h3>
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0, fontFamily: "monospace" }}>@{currentUser}</p>
              </div>
            </div>
          </div>
          <button onClick={() => router.push("/auth")} style={{ width: "100%", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "14px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}><LogOut style={{ width: "16px", height: "16px" }} /> Log Out</button>
        </div>
      )}

      {/* Main Top Header Ribbon */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1E293B", maxWidth: "420px", margin: "0 auto" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>SwiftBet<span style={{ color: "#06B6D4" }}>Analytics</span></h1>
          <p style={{ fontSize: "10px", color: "#64748B", margin: 0 }}>Premium Sports Insights</p>
        </div>
        <button onClick={() => setIsMenuOpen(true)} style={{ width: "38px", height: "38px", backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", cursor: "pointer" }}><Menu style={{ width: "18px", height: "18px" }} /></button>
      </header>

      {/* Core Body Container Wrapper */}
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Wallet Component */}
        <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}><Wallet style={{ width: "18px", height: "18px", color: "#10B981" }} /><h2 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#E2E8F0" }}>Your Swift Wallet</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "16px" }}>
            <div><p style={{ fontSize: "10px", textTransform: "uppercase", color: "#64748B", margin: "0 0 4px 0" }}>Real Balance</p><p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>₦0</p></div>
            <div><p style={{ fontSize: "10px", textTransform: "uppercase", color: "#10B981", margin: "0 0 4px 0" }}>Bonus Balance *</p><p style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#10B981" }}>₦2,000</p></div>
          </div>
          <button onClick={() => router.push("/deposit")} style={{ width: "100%", backgroundColor: "#10B981", color: "#0B0F19", fontWeight: "bold", fontSize: "12px", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>Deposit Cash <ArrowUpRight style={{ width: "14px", height: "14px" }} /></button>
        </section>

        {currentScreen === "feed" ? (
          <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
              <button onClick={() => setActiveTab("active")} style={{ flex: 1, backgroundColor: activeTab === "active" ? "#06B6D4" : "transparent", color: activeTab === "active" ? "#0B0F19" : "#94A3B8", border: "none", padding: "8px 0", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Open Slips</button>
              <button onClick={() => setActiveTab("history")} style={{ flex: 1, backgroundColor: activeTab === "history" ? "#06B6D4" : "transparent", color: activeTab === "history" ? "#0B0F19" : "#94A3B8", border: "none", padding: "8px 0", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Results History</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeTab === "active" ? (
                liveTips.map((tip: any) => ( // Cast to any to satisfy historical compile definitions
                  <div key={tip.id} style={{ backgroundColor: "#0B0F19", padding: "16px", borderRadius: "12px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "10px", color: "#F59E0B", fontWeight: "bold", textTransform: "uppercase" }}>Premium Analysis</span><span style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>Odds: {tip.odds}</span></div>
                    <h4 style={{ fontSize: "12px", margin: 0 }}>{tip.fixture}</h4>
                    <p style={{ fontSize: "11px", color: "#06B6D4", margin: 0 }}>Market: {tip.prediction}</p>
                    
                    {tip.bookingCode && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1E293B", padding: "8px 12px", borderRadius: "8px", border: "1px dashed #334155" }}>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>Code: <strong style={{ color: "#FFFFFF", fontFamily: "monospace", fontSize: "12px" }}>{tip.bookingCode}</strong></span>
                        <button onClick={() => handleCopyBookingCode(tip.bookingCode!, tip.id)} style={{ background: "none", border: "none", color: "#06B6D4", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                          {copiedCodeId === tip.id ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                    )}

                    <a href={tip.bookmaker === "sportybet" ? `https://sportybet.com{sportyBetId}` : `https://bet9ja.com{bet9jaId}`} target="_blank" rel="noopener noreferrer" style={{ width: "100%", textAlign: "center", color: "#FFFFFF", fontWeight: "bold", fontSize: "11px", padding: "11px 0", borderRadius: "12px", textDecoration: "none", backgroundColor: tip.bookmaker === "sportybet" ? "#E51B24" : "#31802E" }}>Stake via {tip.bookmaker === "sportybet" ? "SportyBet" : "Bet9ja"}</a>
                  </div>
                ))
              ) : (
                historicalResultsList.map((result) => (
                  <div key={result.id} style={{ backgroundColor: "#0B0F19", padding: "14px", borderRadius: "12px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><h4 style={{ fontSize: "12px", margin: "0 0 4px 0" }}>{result.fixture}</h4><p style={{ fontSize: "10px", color: "#64748B", margin: 0 }}>{result.prediction} ({result.odds} Odds)</p></div>
                    <span style={{ fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "6px", backgroundColor: result.outcome === "won" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: result.outcome === "won" ? "#10B981" : "#EF4444", textTransform: "uppercase" }}>{result.outcome}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Users style={{ width: "18px", height: "18px", color: "#06B6D4" }} /><h2 style={{ fontSize: "13px", fontWeight: "bold", margin: 0 }}>Invite Friends & Earn</h2></div>
            <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0, lineHeight: "1.5" }}>Share your custom gateway registration link to earn referral allocations as soon as your invites perform their initial deposit.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0B0F19", padding: "8px", borderRadius: "12px", border: "1px solid #334155" }}>
              <input type="text" readOnly value={referralLink} style={{ background: "none", border: "none", color: "#CBD5E1", fontSize: "11px", flex: 1, outline: "none", padding: "0 4px", fontFamily: "monospace" }} />
              <button onClick={handleCopyLink} style={{ backgroundColor: "rgba(6, 182, 212, 0.1)", border: "none", color: "#06B6D4", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex" }}>{copied ? <CheckCircle style={{ width: "14px", height: "14px", color: "#10B981" }} /> : <Copy style={{ width: "14px", height: "14px" }} />}</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748B", borderTop: "1px solid #334155", paddingTop: "12px" }}>
              <span>Total Network Referrals: <strong style={{ color: "#FFFFFF" }}>3 Users</strong></span>
              <button onClick={() => setCurrentUser(currentUser === "michael55" ? "chidi_analytics" : "michael55")} style={{ background: "none", border: "none", color: "#06B6D4", textDecoration: "underline", fontSize: "11px", cursor: "pointer" }}>Simulate Switch</button>
            </div>
          </section>
        )}

      </div>

      {/* Bottom Menu Navigation Bar */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "#1E293B", borderTop: "1px solid #334155", display: "grid", gridTemplateColumns: "1fr 1fr", height: "56px", zIndex: 90 }}>
        <button onClick={() => setCurrentScreen("feed")} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", color: currentScreen === "feed" ? "#06B6D4" : "#64748B", cursor: "pointer" }}><TrendingUp style={{ width: "18px", height: "18px" }} /><span style={{ fontSize: "10px", fontWeight: "bold" }}>Analytics Feed</span></button>
        <button onClick={() => setCurrentScreen("invite")} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", color: currentScreen === "invite" ? "#06B6D4" : "#64748B", cursor: "pointer" }}><Users style={{ width: "18px", height: "18px" }} /><span style={{ fontSize: "10px", fontWeight: "bold" }}>Invite & Earn</span></button>
      </nav>

    </div>
  );
}

