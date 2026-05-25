"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Mail, Lock, User, UserPlus, Phone, KeyRound, AlertTriangle, Users } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { supabase } from "../superbaseClient";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  // NEW PASSWORD RECOVERY STATE HOOKS
  const [isRecoveryView, setIsRecoveryView] = useState<boolean>(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1); 
  const [recoveryPin, setRecoveryPin] = useState<string>("");

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
      if (isRecoveryView) {
        if (recoveryStep === 1) {
          // PASSWORD RESET STEP 1: DISPATCH PIN NUMBER CODE
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
          if (error) throw error;
          alert("A unique secure recovery pin code has been sent to your email box!");
          setRecoveryStep(2);
        } else {
          // PASSWORD RESET STEP 2: CLEAR ACCESS TOKEN
          const { error: verifyError } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: recoveryPin,
            type: "recovery",
          });
          if (verifyError) throw verifyError;

          // PASSWORD RESET STEP 3: SUBMIT NEW USER PASSWORD STRING
          const { error: updateError } = await supabase.auth.updateUser({ password: password });
          if (updateError) throw updateError;

          alert("Security Verification Clear! New login password configured successfully.");
          setIsRecoveryView(false);
          setRecoveryStep(1);
          setIsLogin(true);
        }
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
        router.push("/");
      } else {
        if (!termsAccepted) {
          alert("Verification Error: You must read and accept the Bonus Wagering Rules & Terms to proceed.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name,
              phone_number: phone,
              username: email.split("@")[0] + Math.floor(100 + Math.random() * 900),
              referred_by: referrerCode.trim() || null
            }
          }
        });
        if (error) throw error;
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
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: emailOtp,
        type: "signup",
      });
      if (error) throw error;

      alert("Security Clear! Account verified successfully.");
      router.push("/");
    } catch (err: any) {
      alert(`OTP Match Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px", margin: "0 auto" }}>
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
      {/* Brand Header Display */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "48px", height: "48px", backgroundColor: "#1E293B", borderRadius: "16px", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)" }}>
          <ShieldCheck style={{ width: "24px", height: "24px", color: "#06B6D4" }} />
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0", letterSpacing: "-0.5px" }}>
          SwiftBet<span style={{ color: "#06B6D4" }}>Analytics</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "6px", marginBottom: "0", lineHeight: "1.4" }}>
          {isRecoveryView 
            ? recoveryStep === 1 
              ? "Request a secure password recovery code" 
              : "Enter your verification code and choose a new password"
            : isLogin 
              ? "Access your premium analytics portfolio" 
              : "Claim your ₦2,000 locked wagering bonus balance"}
        </p>
      </div>

      {/* Central Interactive Panel Card */}
      <section style={{ backgroundColor: "#1E293B", borderRadius: "24px", padding: "24px", border: "1px solid #334155", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7)", boxSizing: "border-box" }}>
        <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Full Name Field slot (Register only) */}
          {!isLogin && !isRecoveryView && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Full Name</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><User style={{ width: "16px", height: "16px" }} /></span>
                <input type="text" required placeholder="eg. John Doe" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {/* Email Address Field slot */}
          {!(isRecoveryView && recoveryStep === 2) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Email Address</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Mail style={{ width: "16px", height: "16px" }} /></span>
                <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {/* Phone Number Field slot (Register only) */}
          {!isLogin && !isRecoveryView && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Phone Number</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Phone style={{ width: "16px", height: "16px" }} /></span>
                <input type="tel" required placeholder="+234..." value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}
          {/* Recovery Code PIN Input Field (Recovery step 2 only) */}
          {isRecoveryView && recoveryStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>6-Digit Recovery Pin</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><KeyRound style={{ width: "16px", height: "16px" }} /></span>
                <input type="text" maxLength={6} required placeholder="123456" value={recoveryPin} onChange={(e) => setRecoveryPin(e.target.value.replace(/\D/g, ""))} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box", letterSpacing: "2px" }} />
              </div>
            </div>
          )}

          {/* Password Input Field slot (Hidden on recovery step 1) */}
          {!(isRecoveryView && recoveryStep === 1) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>
                {isRecoveryView ? "New Password" : "Password"}
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Lock style={{ width: "16px", height: "16px" }} /></span>
                <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {/* Referral Code Field slot (Register only) */}
          {!isLogin && !isRecoveryView && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#94A3B8" }}>Referral Code (Optional)</label>
              <div style={{ position: "relative", width: "100%" }}>
                <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", display: "flex" }}><Users style={{ width: "16px", height: "16px" }} /></span>
                <input type="text" placeholder="e.g., michael55" value={referrerCode} onChange={(e) => setReferrerCode(e.target.value)} style={{ width: "100%", backgroundColor: "#0B0F19", border: "1px solid #334155", borderRadius: "12px", padding: "10px 12px 10px 38px", fontSize: "12px", color: "#FFFFFF", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {/* Inline Forgot Password Toggle Link (Login view only) */}
          {isLogin && !isRecoveryView && (
            <div style={{ textAlign: "right" }}>
              <button type="button" onClick={() => { setIsRecoveryView(true); setRecoveryStep(1); }} style={{ background: "none", border: "none", color: "#64748B", fontSize: "11px", cursor: "pointer", padding: 0 }}>
                Forgot Password?
              </button>
            </div>
          )}

          {/* Terms Agreement Checkbox Box (Register only) */}
          {!isLogin && !isRecoveryView && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "4px" }}>
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} style={{ marginTop: "2px", accentColor: "#06B6D4" }} />
              <label htmlFor="terms" style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.4" }}>
                I accept the <span onClick={() => setShowTermsModal(true)} style={{ color: "#06B6D4", cursor: "pointer", textDecoration: "underline" }}>Bonus Rules & Platforms Policy</span>
              </label>
            </div>
          )}

          {/* Action Submission Button */}
          <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#06B6D4", color: "#0B0F19", fontWeight: "bold", fontSize: "13px", padding: "12px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {loading 
              ? "Processing..." 
              : isRecoveryView 
                ? recoveryStep === 1 ? "Send Reset Code" : "Update Password"
                : isLogin ? "Sign In to Account" : "Secure Welcome Bonus"}
          </button>
        </form>

        {/* View Switching Links Controller Layout */}
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #334155", textAlign: "center" }}>
          {isRecoveryView ? (
            <p style={{ margin: 0 }}>
              Remembered your password? <button onClick={() => { setIsRecoveryView(false); setIsLogin(true); }} style={{ background: "none", border: "none", color: "#06B6D4", fontWeight: "bold", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Sign In</button>
            </p>
          ) : isLogin ? (
            <p style={{ margin: 0 }}>
              Don't have an account? <button onClick={() => setIsLogin(false)} style={{ background: "none", border: "none", color: "#06B6D4", fontWeight: "bold", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Register Here</button>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Already have an account? <button onClick={() => setIsLogin(true)} style={{ background: "none", border: "none", color: "#06B6D4", fontWeight: "bold", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Sign In</button>
            </p>
          )}
        </div>
      </section>

      {/* Basic Wagering Terms Policy Modal Backdrop Popup */}
      {showTermsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(11,15,25,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000, boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "24px", padding: "24px", maxWidth: "360px", width: "100%", boxSizing: "border-box" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#06B6D4" }}>Bonus & Wagering Rules</h3>
            <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.6", maxHeight: "200px", overflowY: "auto", marginBottom: "20px", paddingRight: "4px" }}>
              <p style={{ marginTop: 0 }}>1. The ₦2,000 welcome credit remains locked inside your system account bonus ledger until specific turnover constraints are cleared.</p>
              <p>2. To unlock bonus assets, users must perform at least one verified wallet fund deposit and complete an analytical bet placement activity.</p>
              <p>3. Referral benefits track automatically down 2 tiers (10% Tier 1, 5% Tier 2) on premium VIP subscription plan activations.</p>
            </div>
            <button onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }} style={{ width: "100%", padding: "12px", backgroundColor: "#06B6D4", color: "#0B0F19", fontWeight: "bold", border: "none", borderRadius: "12px", fontSize: "12px", cursor: "pointer" }}>Agree & Accept Terms</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0B0F19", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <Suspense fallback={<p style={{ color: "#64748B", fontSize: "12px" }}>Loading secure gateway interface...</p>}>
        <AuthFormContent />
      </Suspense>
    </main>
  );
}
