"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Mail, Lock, User, UserPlus, Phone, KeyRound, AlertTriangle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../supabaseClient"; // Inject our new live client

function AuthFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [referrerCode, setReferrerCode] = useState<string>("");
  
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [phoneOtp, setPhoneOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferrerCode(refCode);
      setIsLogin(false); 
    }
  }, [searchParams]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (isLogin) {
        // LIVE SUPABASE SIGN-IN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;
        router.push("/");
      } else {
        // SIGN-UP VALIDATION CHECKS
        if (!termsAccepted) {
          alert("Verification Error: You must read and accept the Bonus Wagering Rules & Terms to proceed.");
          setLoading(false);
          return;
        }

        // LIVE SUPABASE AUTH USER CREATION TRIPS
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name,
              phone_number: phone,
              username: email.split("@")[0] + Math.floor(100 + Math.random() * 900), // Creates custom username handle
              referred_by: referrerCode || null
            }
          }
        });

        if (error) throw error;
        
        // Advance to live pin verification layout view box
        setIsVerifying(true);
      }
    } catch (err: any) {
      alert(`Account Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // LIVE SUPABASE OTP EMAIL CHALLENGE VERIFICATION
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: emailOtp,
        type: 'signup',
      });

      if (error) throw error;

      alert("Security Clear! Your user session account has been fully created, verified, and active.");
      router.push("/");
    } catch (err: any) {
      alert(`OTP Match Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", backgroundColor: "#1E293B", borderRadius: "16px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
            <KeyRound style={{ width: "24px", height: "24px", color: "#10B981" }} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>Verify Account</h1>
          <p style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>Input the authentication pin code sent to your credentials</p>
        </div>

        <section style={{ backgroundColor: "#1E293B", borderRadius: "24px", padding: "24px", border: "1px solid #334155", boxSizing: "border-box" }}>
          <form onSubmit={handleVerifyOTP} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>6-Digit Verification Code</label>
              <input type="text" maxLength={6} required placeholder="123456" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px", fontSize: "14px", color: "#FFFFFF", textAlign: "center", letterSpacing: "4px" }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#06B6D4", color: "#0B0F19", fontWeight: "bold", fontSize: "13px", padding: "12px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}>
              {loading ? "Processing..." : "Verify & Finalize Profile"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", backgroundColor: "#1E293B", borderRadius: "16px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)" }}><ShieldCheck style={{ width: "24px", height: "24px", color: "#06B6D4" }} /></div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0", letterSpacing: "-0.5px" }}>SwiftBet<span style={{ color: "#06B6D4" }}>Analytics</span></h1>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "6px", marginBottom: "0", lineHeight: "1.4" }}>{isLogin ? "Access your premium analytics portfolio" : "Claim your ₦2,000 locked wagering bonus balance"}</p>
      </div>

      <section style={{ backgroundColor: "#1E293B", borderRadius: "24px", padding: "24px", border: "1px solid #334155", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7)", boxSizing: "border-box" }}>
        <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Full Name</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><User style={{ width: "16px", height: "16px" }} /></span>
                <input type="text" required placeholder="Michael Olajide" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Email Address</label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Mail style={{ width: "16px", height: "16px" }} /></span>
              <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Mobile Number</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Phone style={{ width: "16px", height: "16px" }} /></span>
                <input type="tel" required placeholder="+234 80 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Secure Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Lock style={{ width: "16px", height: "16px" }} /></span>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Referral Code</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><UserPlus style={{ width: "16px", height: "16px" }} /></span>
                <input type="text" placeholder="friend55" value={referrerCode} onChange={(e) => setReferrerCode(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {!isLogin && (
            <div style={{ backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "12px", padding: "10px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <AlertTriangle style={{ width: "16px", height: "16px", color: "#F59E0B", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p style={{ fontSize: "10px", margin: 0, color: "#E2E8F0", fontWeight: "bold" }}>Bonus Wagering Policy</p>
                <p style={{ fontSize: "9px", margin: "2px 0 0 0", color: "#94A3B8", lineHeight: "1.3" }}>The ₦2,000 balance is locked. You cannot withdraw this value or secondary referral payouts until you fund a real deposit and book an active stake selection.</p>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "10px", color: "#06B6D4", cursor: "pointer", fontWeight: "bold" }}>
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} style={{ accentColor: "#06B6D4" }} /> I accept these terms
                </label>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#06B6D4", color: "#0B0F19", fontWeight: "bold", fontSize: "13px", padding: "12px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}>
            {loading ? "Connecting..." : isLogin ? "Sign In to Dashboard" : "Register Profile"}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button onClick={() => { setIsLogin(!isLogin); setIsVerifying(false); }} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
      <Suspense fallback={<p style={{ color: "#64748B", fontSize: "12px" }}>Loading security protocols...</p>}>
        <AuthFormContent />
      </Suspense>
    </div>
  );
}

