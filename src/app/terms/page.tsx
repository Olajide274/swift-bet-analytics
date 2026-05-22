"use client";

import React from "react";
import { ShieldCheck, Scale, ArrowLeft, AlertTriangle, Coins, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", padding: "24px 16px 80px 16px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Navigation Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1E293B", paddingBottom: "16px" }}>
          <Link href="/auth" style={{ color: "#06B6D4", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowLeft style={{ width: "14px", height: "14px" }} /> Back to Sign Up
          </Link>
          <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Legal Framework</span>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "48px", height: "48px", backgroundColor: "#1E293B", borderRadius: "16px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
            <Scale style={{ width: "24px", height: "24px", color: "#06B6D4" }} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>Terms of Service</h1>
          <p style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", margin: 0 }}>SwiftBetAnalytics Platform Rules & Wagering Policies</p>
        </div>

        {/* Core Policy Section 1: The Welcome Bonus Lock */}
        <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Coins style={{ width: "18px", height: "18px", color: "#10B981" }} />
            <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#E2E8F0" }}>1. ₦2,000 Bonus Roll Over Rule</h2>
          </div>
          <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: "1.5" }}>
            Upon successful Two-Way verification, accounts are credited with a complimentary <strong>₦2,000 Bonus Balance</strong>. This token configuration is structurally locked inside the platform ledger network.
          </p>
          <div style={{ backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "12px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <AlertTriangle style={{ width: "16px", height: "16px", color: "#F59E0B", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "11px", color: "#E2E8F0", margin: 0, lineHeight: "1.4" }}>
              <strong>Unlocking Matrix Trigger:</strong> You cannot execute a withdrawal request on the welcome bonus or associated rewards until your account records at least <strong>one (1) real fiat capital deposit</strong> via the payment gateway AND handles <strong>one (1) active wagers selection stake</strong>.
            </p>
          </div>
        </section>

        {/* Core Policy Section 2: Referral Terms */}
        <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw style={{ width: "18px", height: "18px", color: "#06B6D4" }} />
            <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#E2E8F0" }}>2. Anti-Exploit Affiliate Program</h2>
          </div>
          <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: "1.5" }}>
            Users can invite secondary participants using their tracking generation link. To protect our liquidity pools against bot automation scripts and fake dummy profile creations, secondary payouts conform to strict compliance validation gates:
          </p>
          <ul style={{ fontSize: "11px", color: "#94A3B8", margin: "0 0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: "6px", lineHeight: "1.4" }}>
            <li>Affiliate commission metrics only activate after your referral processes their primary ledger deposit.</li>
            <li>System algorithms run continuous hardware signatures analysis to detect duplicate network registrations.</li>
            <li>Violations of the referral pipeline result in immediate profile suspension and wallet balance cancellation.</li>
          </ul>
        </section>

        {/* Core Policy Section 3: General Disclaimers */}
        <section style={{ backgroundColor: "#1E293B", borderRadius: "20px", padding: "20px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck style={{ width: "18px", height: "18px", color: "#64748B" }} />
            <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, color: "#E2E8F0" }}>3. Data Analytics Disclaimer</h2>
          </div>
          <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: "1.5" }}>
            SwiftBetAnalytics serves purely as a mathematical forecasting portfolio. We deliver analytics and data parameters designed for sports research. We do not provide gambling services, and the platform bears no accountability for capital losses sustained on third-party bookmaker nodes (SportyBet, Bet9ja, etc.). 
          </p>
        </section>

        {/* Footer Note */}
        <p style={{ fontSize: "10px", color: "#64748B", textAlign: "center", margin: 0 }}>
          By establishing a user node profile on SwiftBetAnalytics, you bound yourself entirely to these validation terms.
        </p>

      </div>
    </div>
  );
}
