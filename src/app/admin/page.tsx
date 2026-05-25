
"use client";

import React, { useState } from "react";
import { PlusCircle, ShieldAlert, Tag, Percent, KeyRound, Crown } from "lucide-react";
import { addBettingTip } from "../dataStore";

export default function AdminInputForm() {
  const [fixture, setFixture] = useState("");
  const [odds, setOdds] = useState("");
  const [prediction, setPrediction] = useState("");
  const [bookmaker, setBookmaker] = useState<"sportybet" | "bet9ja">("sportybet");
  const [bookingCode, setBookingCode] = useState("");
  const [isVIP, setIsVIP] = useState<boolean>(false);
  // Track database loading state to prevent double-submitting
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Safely await the database insertion loop
      await addBettingTip({
        fixture,
        odds,
        prediction,
        bookmaker,
        bookingCode: bookingCode.trim() || `SWIFT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        isVIP: isVIP
      });

      alert(
        `Successfully Saved to Database:\n${fixture} listed on ${
          bookmaker === "sportybet" ? "SportyBet" : "Bet9ja"
        }\nTier Status: ${isVIP ? "👑 VIP Locked Paywall" : "🔓 Public Free Feed"}`
      );
      
      // Reset form inputs completely for the next tip entry
      setFixture("");
      setOdds("");
      setPrediction("");
      setBookingCode("");
      setIsVIP(false);
    } catch (error) {
      console.error(error);
      alert("Database saving failed! Check your connection settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto sm:max-w-xl">
      {/* Admin Panel Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-500" /> Admin Tip Creator
        </h1>
        <p className="text-xs text-slate-500">Post new vetted analytics data to the platform user feed</p>
      </header>

      {/* Entry Management Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Match Fixture / Ticket Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Chelsea vs Man City"
            value={fixture}
            onChange={(e) => setFixture(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Total Odds
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono"><Percent className="w-3.5 h-3.5"/></span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="1.85"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Bookmaker
            </label>
            <select
              value={bookmaker}
              onChange={(e) => setBookmaker(e.target.value as "sportybet" | "bet9ja")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer transition"
            >
              <option value="sportybet">SportyBet</option>
              <option value="bet9ja">Bet9ja</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Market Prediction
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-500"><Tag className="w-3.5 h-3.5"/></span>
            <input
              type="text"
              required
              placeholder="e.g., Over 2.5 Goals"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Booking Code
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-500"><KeyRound className="w-3.5 h-3.5"/></span>
            <input
              type="text"
              required
              placeholder="e.g., BC55-XYZ7"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition uppercase"
            />
          </div>
        </div>

        {/* High-Yield Premium VIP Content Toggle Box */}
        <div 
          onClick={() => setIsVIP(!isVIP)}
          className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer select-none ${
            isVIP 
              ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5" 
              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Crown className={`w-4 h-4 ${isVIP ? "text-amber-500 animate-pulse" : "text-slate-500"}`} />
            <div>
              <p className="text-xs font-bold text-white">VIP Subscription Paywall</p>
              <p className="text-[10px] text-slate-500">Lock this premium high-odds slip from free users</p>
            </div>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isVIP ? "bg-amber-500" : "bg-slate-800"}`}>
            <div className={`w-3 h-3 rounded-full bg-slate-950 transform transition-transform duration-200 ${isVIP ? "translate-x-4" : "translate-x-0"}`} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 text-slate-950 font-bold text-xs py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle className="w-4 h-4" /> {isSubmitting ? "Connecting to Storage..." : "Publish Tip to Dashboard"}
        </button>
      </form>
    </main>
  );
}
