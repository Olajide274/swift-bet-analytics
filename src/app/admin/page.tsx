"use client"; // 👈 ONLY keep use client here

import React, { useState } from "react";
import { PlusCircle, ShieldAlert, Tag, Percent, KeyRound, Star } from "lucide-react";
import { addBettingTip } from "../dataStore";

export default function AdminInputForm() {
  const [fixture, setFixture] = useState("");
  const [odds, setOdds] = useState("");
  const [prediction, setPrediction] = useState("");
  const [bookmaker, setBookmaker] = useState<"sportybet" | "bet9ja">("sportybet");
  const [bookingCode, setBookingCode] = useState("");
  // NEW: Premium authorization classification toggle state
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addBettingTip({
      fixture,
      odds,
      prediction,
      bookmaker,
      bookingCode: bookingCode.trim() || `SWIFT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isPremium: isPremium // NEW: Passes the monetized status flag to your global database store
    });

    alert(`Successfully Published:\n${fixture} listed as a ${isPremium ? "⭐ VIP PREMIUM" : "🆓 FREE"} slip!`);

    setFixture("");
    setOdds("");
    setPrediction("");
    setBookingCode("");
    setIsPremium(false); // Resets premium configuration status back to default free selection
  };

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto sm:max-w-xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-500" /> Admin Tip Creator
        </h1>
        <p className="text-xs text-slate-500">Post new vetted analytics data to the platform user feed</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        {/* Match Fixture */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Match Fixture
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
              {/* FIXED: Input changed to type text to safely feed string tokens into your data model */}
              <input
                type="text"
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

        {/* Market Prediction */}
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

        {/* Booking Code */}
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

        {/* NEW ADDITION: Premium Content Selector Interface Wrapper */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${isPremium ? "text-cyan-500 fill-cyan-500" : "text-slate-600"}`} />
            <div>
              <p className="text-xs font-bold text-white">VIP Premium Feed Slip</p>
              <p className="text-[10px] text-slate-500">Requires paid premium account status subscription tier to unlock</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="w-4 h-4 accent-cyan-500 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-slate-950 font-bold text-xs py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Publish Tip to Dashboard
        </button>
      </form>
    </main>
  );
}
