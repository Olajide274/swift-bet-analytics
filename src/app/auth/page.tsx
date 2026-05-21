"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  // Ignore the unused state value by replacing it with "_"
  const [_, setIsVerifying] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // your submit logic here
  };

  return (
    <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", backgroundColor: "#1E293B", borderRadius: "12px" }} />
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>Welcome</h1>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>
          {isLogin ? "Sign in to continue" : "Create your account"}
        </p>
      </div>

      <section style={{ backgroundColor: "#1E293B", borderRadius: "24px", padding: "16px", marginTop: "16px" }}>
        <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Full Name</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>👤</span>
                <input type="text" required placeholder="Michael Olajide" style={{ width: "100%", padding: "12px 12px 12px 36px" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Email</label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>📧</span>
              <input type="email" required placeholder="name@example.com" style={{ width: "100%", padding: "12px 12px 12px 36px" }} />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Phone</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>📱</span>
                <input type="tel" required placeholder="+234 80 1234 5678" style={{ width: "100%", padding: "12px 12px 12px 36px" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>🔒</span>
              <input type="password" required placeholder="••••••••" style={{ width: "100%", padding: "12px 12px 12px 36px" }} />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Referral Code</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>🎁</span>
                <input
                  type="text"
                  placeholder="friend55"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  style={{ width: "100%", padding: "12px 12px 12px 36px" }}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div style={{ backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid #F59E0B", borderRadius: "8px", padding: "8px", display: "flex", gap: "8px" }}>
              <AlertTriangle style={{ width: "16px", height: "16px", color: "#F59E0B" }} />
              <div>
                <p style={{ fontSize: "10px", margin: 0, color: "#E2E8F0" }}>Please accept terms & conditions</p>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", color: "#E2E8F0" }}>
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                  I agree to the terms
                </label>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#2563EB", color: "#fff", fontWeight: "bold" }}>
            {loading ? "Connecting..." : isLogin ? "Sign In to Dashboard" : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setIsVerifying(false);
            }}
            style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer" }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </div>
  );
}
