"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Mail, Lock, User, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Form contents separated to comply with Next.js strict Suspense compilation rules
function AuthFormContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [referrerCode, setReferrerCode] = useState<string>("");

  // Automatically read the URL parameters when the page loads
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferrerCode(refCode); // Autofill the form input box
      setIsLogin(false); // Force switch view to "Register" since they used a sign-up invite link
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      alert(`Logging in: ${email}`);
    } else {
      alert(`Account Created!\nReferrer Tracked: ${referrerCode || "None"}\n₦2,000 Welcome bonus credited to your wallet.`);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div 
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#1E293B",
            borderRadius: "16px",
            border: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)"
          }}
        >
          <ShieldCheck style={{ width: "24px", height: "24px", color: "#06B6D4" }} />
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0", letterSpacing: "-0.5px" }}>
          SwiftBet<span style={{ color: "#06B6D4" }}>Analytics</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "6px", marginBottom: "0", lineHeight: "1.4" }}>
          {isLogin ? "Access your premium analytics portfolio" : "Claim your ₦2,000 locked wagering bonus balance"}
        </p>
      </div>

      {/* Centralized Form Panel Card */}
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Full Name Input Slot (Sign Up Only) */}
          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                Full Name
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><User style={{ width: "16px", height: "16px" }} /></span>
                <input
                  type="text"
                  required
                  placeholder="Michael Olajide"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#0B0F19",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "10px 12px 10px 38px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Address Input Slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
              Email Address
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Mail style={{ width: "16px", height: "16px" }} /></span>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#0B0F19",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "10px 12px 10px 38px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Secure Password Input Slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
              Secure Password
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Lock style={{ width: "16px", height: "16px" }} /></span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#0B0F19",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "10px 12px 10px 38px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Referral Parameter Input Slot (Sign Up Only) */}
          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94A3B8" }}>
                  Referral Code
                </label>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><UserPlus style={{ width: "16px", height: "16px" }} /></span>
                <input
                  type="text"
                  placeholder="e.g., friend55"
                  value={referrerCode}
                  onChange={(e) => setReferrerCode(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#0B0F19",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "10px 12px 10px 38px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          )}

          {/* Main Action Submission Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#06B6D4",
              color: "#0B0F19",
              fontWeight: "bold",
              fontSize: "12px",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              marginTop: "8px",
              letterSpacing: "0.5px"
            }}
          >
            {isLogin ? "Sign In to Feed" : "Create Account & Claim Bonus"}
          </button>
        </form>

        {/* Interface Mode Switcher Navigation Footer */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#94A3B8", borderTop: "1px solid #334155", paddingTop: "16px" }}>
          {isLogin ? "First time using SwiftBet? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#06B6D4",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
              padding: "0",
              marginLeft: "4px"
            }}
          >
            {isLogin ? "Register Here" : "Log In"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Authentication() {
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
      <Suspense fallback={<p style={{ fontSize: "12px", color: "#64748B" }}>Loading secure tracker...</p>}>
        <AuthFormContent />
      </Suspense>
    </div>
  );
}
