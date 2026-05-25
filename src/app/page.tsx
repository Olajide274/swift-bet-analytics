"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, CheckCircle, LogOut, User, Menu, X, Lock, Unlock, AlertCircle, Crown, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { currentUserProfile, BettingTip, PastResult } from "./dataStore";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [liveTips, setLiveTips] = useState<BettingTip[]>([]);
  const [pastResults, setPastResults] = useState<PastResult[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<"feed" | "invite">("feed");

  const [userProfile, setUserProfile] = useState(currentUserProfile);
  const [referralLink, setReferralLink] = useState<string>("");

  const [unlockedVipSlips, setUnlockedVipSlips] = useState<string[]>([]);
  const [paywallTargetSlip, setPaywallTargetSlip] = useState<BettingTip | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const vipUnlockCost = 1000; 

  useEffect(() => {
    if (!supabase) return;

    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoggedIn(false);
          router.push("/auth");
          return;
        }

        setIsLoggedIn(true);

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserProfile({
            username: profile.username,
            fullName: profile.full_name,
            email: user.email || "",
            phoneNumber: profile.phone_number || "",
            isEmailVerified: profile.is_email_verified || false,
            isPhoneVerified: profile.is_phone_verified || false,
            realBalance: Number(profile.real_balance || 0),    
            bonusBalance: Number(profile.bonus_balance || 0),  
            hasDeposited: profile.has_deposited || false,
            hasPlacedBet: profile.has_placed_bet || false,
            isBonusUnlocked: profile.is_bonus_unlocked || false,
            referredBy: profile.referred_by || null,
            tier1Referrals: Number(profile.tier_1_referrals || 0),
            tier2Referrals: Number(profile.tier_2_referrals || 0)
          });
        }

        const { data: dbTips, error: tipsError } = await supabase
          .from("betting_tips")
          .select("*")
          .order("created_at", { ascending: false });

        if (!tipsError && dbTips) {
          const mappedTips = dbTips.map((tip: any) => ({
            id: tip.id,
            fixture: tip.fixture,
            odds: tip.odds,
            prediction: tip.prediction,
            bookmaker: tip.bookmaker,
            bookingCode: tip.booking_code,
            isVIP: tip.is_vip
          }));
          setLiveTips(mappedTips);
        }

        const { data: dbResults, error: resultsError } = await supabase
          .from("historical_results")
          .select("*")
          .order("created_at", { ascending: false });

        if (!resultsError && dbResults) {
          const mappedResults = dbResults.map((res: any) => ({
            id: res.id,
            fixture: res.fixture,
            odds: res.odds,
            prediction: res.prediction,
            outcome: res.outcome
          }));
          setPastResults(mappedResults);
        }

        if (typeof window !== "undefined") {
          const domain = window.location.origin;
          setReferralLink(`${domain}/auth?ref=${profile?.username || userProfile.username}`);
        }
      } catch (err) {
        console.error("Dashboard data sync error:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [router]);

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

  const handlePurchaseVipSlip = (slipId: string) => {
    if (userProfile.realBalance >= vipUnlockCost) {
      const updatedProfile = {
        ...userProfile,
        realBalance: userProfile.realBalance - vipUnlockCost
      };
      setUserProfile(updatedProfile);
      setUnlockedVipSlips([...unlockedVipSlips, slipId]);
      setPaywallTargetSlip(null);
      alert("Success! The premium analytics booking code has been unlocked via your wallet balance.");
    } else {
      alert("Insufficient Funds: Please top up your Swift Wallet to purchase this premium ticket.");
      router.push("/deposit");
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", paddingBottom: "100px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      
      {/* Top Banner Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1E293B", backgroundColor: "#0F172A" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#06B6D4", margin: 0 }}>SwiftBet</h1>
        <button onClick={() => setIsMenuOpen(true)} style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer" }}>
          <Menu style={{ width: "24px", height: "24px" }} />
        </button>
      </nav>

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

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" }}>
              <button onClick={() => { setCurrentScreen("feed"); setIsMenuOpen(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: currentScreen === "feed" ? "#1E293B" : "none", border: "none", borderRadius: "12px", color: "#FFFFFF", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Analytics Feed</button>
              <button onClick={() => { setCurrentScreen("invite"); setIsMenuOpen(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: currentScreen === "invite" ? "#1E293B" : "none", border: "none", borderRadius: "12px", color: "#FFFFFF", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>Affiliate Center</button>
            </div>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/auth"); }} style={{ width: "100%", padding: "14px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", borderRadius: "14px", color: "#EF4444", fontWeight: "bold", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}><LogOut style={{ width: "16px", height: "16px" }} /> Sign Out Session</button>
        </div>
      )}
      {/* Main Container Content */}
      <main style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
        
        {/* Wallet Balance Metrics Box */}
        <section style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "24px", padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Wallet Account Balance</p>
            <h2 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#FFFFFF" }}>₦{userProfile.realBalance.toLocaleString()}</h2>
          </div>
          <button onClick={() => router.push("/deposit")} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#06B6D4", border: "none", borderRadius: "12px", padding: "10px 16px", color: "#0B0F19", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Fund <Wallet style={{ width: "14px", height: "14px" }} /></button>
        </section>

        {currentScreen === "feed" ? (
          <>
            {/* View Sorting Tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "#0F172A", padding: "4px", borderRadius: "14px", marginBottom: "20px", border: "1px solid #1E293B" }}>
              <button onClick={() => setActiveTab("active")} style={{ padding: "10px", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "12px", cursor: "pointer", backgroundColor: activeTab === "active" ? "#1E293B" : "transparent", color: activeTab === "active" ? "#06B6D4" : "#64748B" }}>Live Analytical slips</button>
              <button onClick={() => setActiveTab("history")} style={{ padding: "10px", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "12px", cursor: "pointer", backgroundColor: activeTab === "history" ? "#1E293B" : "transparent", color: activeTab === "history" ? "#06B6D4" : "#64748B" }}>Past Performance Log</button>
            </div>

            {/* Live Slips Tab View */}
            {activeTab === "active" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {isLoadingData ? (
                  <p style={{ textAlign: "center", color: "#64748B", fontSize: "12px" }}>Synchronizing data tables...</p>
                ) : liveTips.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748B", fontSize: "12px" }}>No betting combinations available today. Check back later.</p>
                ) : (
                  liveTips.map((tip) => {
                    const isLocked = tip.isVIP && !unlockedVipSlips.includes(tip.id);
                    return (
                      <div key={tip.id} style={{ backgroundColor: "#0F172A", borderRadius: "20px", border: tip.isVIP ? "1px solid #F59E0B" : "1px solid #1E293B", padding: "16px", position: "relative" }}>
                        {tip.isVIP && <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid #F59E0B", color: "#F59E0B", fontSize: "9px", fontWeight: "bold", padding: "2px 6px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px" }}><Crown style={{ width: "10px", height: "10px" }} /> VIP SLIP</span>}
                        <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" }}>{tip.fixture}</h4>
                        <div style={{ display: "flex", gap: "16px", margin: "12px 0" }}>
                          <div><span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>Prediction</span><span style={{ fontSize: "12px", fontWeight: "bold", color: "#06B6D4" }}>{tip.prediction}</span></div>
                          <div><span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>Total Odds</span><span style={{ fontSize: "12px", fontWeight: "bold", color: "#F59E0B" }}>{tip.odds}</span></div>
                          <div><span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>Platform</span><span style={{ fontSize: "12px", fontWeight: "bold", textTransform: "capitalize" }}>{tip.bookmaker}</span></div>
                        </div>
                        {isLocked ? (
                          <button onClick={() => setPaywallTargetSlip(tip)} style={{ width: "100%", padding: "12px", backgroundColor: "#F59E0B", border: "none", borderRadius: "12px", color: "#0B0F19", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}><Lock style={{ width: "14px", height: "14px" }} /> Unlock Booking Code (₦{vipUnlockCost})</button>
                        ) : (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input type="text" readOnly value={tip.bookingCode} style={{ flex: 1, backgroundColor: "#0B0F19", border: "1px solid #1E293B", borderRadius: "10px", padding: "8px 12px", color: "#FFFFFF", fontSize: "12px", fontFamily: "monospace" }} />
                            <button onClick={() => handleCopyBookingCode(tip.bookingCode, tip.id)} style={{ padding: "8px 14px", backgroundColor: copiedCodeId === tip.id ? "#10B981" : "#1E293B", border: "none", borderRadius: "10px", color: "#FFFFFF", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>{copiedCodeId === tip.id ? "Copied!" : "Copy"}</button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Past Results Tab View */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pastResults.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748B", fontSize: "12px" }}>No past results logged yet.</p>
                ) : (
                  pastResults.map((result) => (
                    <div key={result.id} style={{ backgroundColor: "#0F172A", borderRadius: "16px", border: "1px solid #1E293B", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h5 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "bold" }}>{result.fixture}</h5>
                        <span style={{ fontSize: "11px", color: "#64748B" }}>{result.prediction} @ {result.odds} odds</span>
                      </div>
                      <span style={{ backgroundColor: result.outcome === "won" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", border: result.outcome === "won" ? "1px solid #10B981" : "1px solid #EF4444", color: result.outcome === "won" ? "#10B981" : "#EF4444", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "8px", textTransform: "uppercase" }}>{result.outcome}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          /* Affiliate Center View Layout */
          <section style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "24px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "bold" }}>Affiliate Portal</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "11px", color: "#64748B" }}>Invite friends and earn 10% on every premium unlock down 2 tiers.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ backgroundColor: "#0B0F19", padding: "12px", borderRadius: "14px", border: "1px solid #1E293B" }}><span style={{ fontSize: "10px", color: "#64748B" }}>Tier 1 Invites</span><span style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#06B6D4" }}>{userProfile.tier1Referrals}</span></div>
              <div style={{ backgroundColor: "#0B0F19", padding: "12px", borderRadius: "14px", border: "1px solid #1E293B" }}><span style={{ fontSize: "10px", color: "#64748B" }}>Tier 2 Invites</span><span style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#06B6D4" }}>{userProfile.tier2Referrals}</span></div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" readOnly value={referralLink} style={{ flex: 1, backgroundColor: "#0B0F19", border: "1px solid #1E293B", borderRadius: "10px", padding: "8px 12px", color: "#FFFFFF", fontSize: "11px" }} />
              <button onClick={handleCopyReferral} style={{ padding: "8px 14px", backgroundColor: copiedLink ? "#10B981" : "#06B6D4", border: "none", borderRadius: "10px", color: "#0B0F19", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>{copiedLink ? "Copied!" : "Copy Link"}</button>
            </div>
          </section>
        )}
      </main>

      {/* Paywall Purchase Confirmation Modal Backdrop */}
      {paywallTargetSlip && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(11, 15, 25, 0.8)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "24px", padding: "24px", maxWidth: "400px", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Crown style={{ width: "20px", height: "20px", color: "#F59E0B" }} /></div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>Confirm VIP Unlock</h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748B" }}>This transaction will deduct ₦{vipUnlockCost} from your balance.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "20px" }}>
              <button onClick={() => setPaywallTargetSlip(null)} style={{ padding: "12px", backgroundColor: "transparent", border: "1px solid #1E293B", borderRadius: "12px", color: "#64748B", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handlePurchaseVipSlip(paywallTargetSlip.id)} style={{ padding: "12px", backgroundColor: "#F59E0B", border: "none", borderRadius: "12px", color: "#0B0F19", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
