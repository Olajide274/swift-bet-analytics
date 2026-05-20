"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { currentUserProfile, evaluateBonusUnlockCondition } from "../dataStore";

// Declare Paystack on the global window scope to satisfy TypeScript compiler rules
declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function DepositGateway() {
  const [amount, setAmount] = useState<string>("1000");
  const [email, setEmail] = useState<string>("customer@example.com");

  // Fetch the key safely from environment storage fallback templates
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder_key";

  const handleProcessDeposit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined" && window.PaystackPop) {
      // Direct native engine checkout launcher initialization
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: email,
        amount: Number(amount) * 100, // Paystack reads transaction metrics in Kobo (₦1,000 = 100,000 Kobo)
        currency: "NGN",
        ref: `SB-REF-${Date.now()}`,
        callback: function(response: any) {
          // MODIFIED: State sync update variables on success block
          currentUserProfile.realBalance += Number(amount);
          currentUserProfile.hasDeposited = true;
          evaluateBonusUnlockCondition(currentUserProfile);

          alert(`Payment Successful!\nRef ID: ${response.reference}\n\n₦${Number(amount).toLocaleString()} credited to your wallet. Balance rules updated!`);
          window.location.href = "/";
        },
        onClose: function() {
          alert("Transaction window closed securely by customer.");
        }
      });
      handler.openIframe();
    } else {
      alert("Paystack secure script engine is still loading... Please wait a quick second and try again.");
    }
  };

  return (
    <div 
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#0B0F19",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}
    >
      {/* FIXED: Changed to the precise, standard official Paystack Inline script CDN */}
      <Script src="https://paystack.co" strategy="lazyOnload" />

      <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Navigation Top Header Link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Link href="/" style={{ color: "#06B6D4", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowLeft style={{ width: "14px", height: "14px" }} /> Back to Feed
          </Link>
          <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "bold" }}>Secure Checkout</span>
        </div>

        {/* Central Card Form Window */}
        <section 
          style={{
            backgroundColor: "#1E293B",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid #334155",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7)",
            boxSizing: "border-box"
          }}
        >
          <form onSubmit={handleProcessDeposit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Account Profile Billing Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                Billing Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#0B0F19",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Numerical Capital Amount Value Box */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                Deposit Amount (NGN)
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "11px", color: "#10B981", fontWeight: "bold", fontSize: "14px" }}>₦</span>
                <input
                  type="number"
                  required
                  min="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#0B0F19",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "10px 12px 10px 28px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Incremental Selector Presets Matrix Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {["1000", "2500", "5000"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  style={{
                    backgroundColor: amount === preset ? "rgba(6, 182, 212, 0.15)" : "#0B0F19",
                    border: amount === preset ? "1px solid #06B6D4" : "1px solid #334155",
                    borderRadius: "10px",
                    color: amount === preset ? "#06B6D4" : "#94A3B8",
                    padding: "8px 0",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  +₦{Number(preset).toLocaleString()}
                </button>
              ))}
            </div>

            {/* Gateway Brand Selector Row Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                Active Payment Gateway
              </label>
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#0B0F19",
                  border: "1px solid #10B981",
                  borderRadius: "12px",
                  padding: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CreditCard style={{ width: "16px", height: "16px", color: "#06B6D4" }} />
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>Paystack Secure Checkout</span>
                </div>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              </div>
            </div>

            {/* FIXED: Restructured cut-off block and populated the button hierarchy safely */}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#10B981",
                color: "#0B0F19",
                fontWeight: "bold",
                fontSize: "12px",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <ShieldCheck style={{ width: "16px", height: "16px" }} /> Initialize Gateway Checkout
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
