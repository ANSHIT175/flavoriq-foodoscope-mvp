"use client";

import React from "react";
import {
  Settings,
  Beaker,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useFlavorIq, JUDGE_DEMO_PRESETS } from "../../context/FlavorIqContext";
import { SCORING_WEIGHTS } from "../../lib/recommendation/scoring";

export default function SettingsAndHelpPage() {
  const {
    modeUsed,
    scoreLabel,
    restoreDefaultPantry,
    applyDemoPreset,
    clearGroceryList,
    clearCompare,
    showToast,
  } = useFlavorIq();

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
          <Settings className="w-4 h-4" />
          Platform Configuration &amp; Judge Reference
        </span>
        <h1 className="text-2xl font-extrabold text-brand-dark">
          Settings, Scoring Transparency &amp; Help
        </h1>
        <p className="text-xs text-gray-600">
          Manage execution mode, inspect the deterministic 100-point scoring weights, or reset demo state for a fresh hackathon walkthrough.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Mode & Demo Reset */}
        <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <Beaker className="w-5 h-5 text-brand-primary" />
            Foodoscope API Execution Mode
          </h2>

          <div className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-dark">Current Active Mode:</span>
              <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-brand-dark text-brand-lime uppercase">
                API_MODE: {modeUsed}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{scoreLabel}</p>
            <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Server-side proxy route (/api/recommend) active — zero native C++ dependencies.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              One-Click Demo Controls
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyDemoPreset(JUDGE_DEMO_PRESETS[0])}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Default Judge Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreDefaultPantry();
                  clearGroceryList();
                  clearCompare();
                  showToast("Workspace Reset", "Restored default pantry and cleared temporary lists.");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border text-xs font-bold transition"
              >
                Reset All Lists
              </button>
            </div>
          </div>
        </section>

        {/* Transparent 100-Point Formula Reference */}
        <section id="help" className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-primary" />
            100-Point Multi-Factor Scoring Formula
          </h2>
          <p className="text-xs text-gray-600">
            Configured in <code className="font-mono bg-brand-surface px-1.5 py-0.5 rounded">src/lib/recommendation/scoring.ts</code>:
          </p>
          <div className="divide-y divide-brand-border/60 text-xs">
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">1. Pantry Ingredient Coverage</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.ingredientCoverage} pts</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">2. FlavorDB Molecular Compatibility</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.flavorCompatibility} pts</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">3. Cuisine Preference Fit</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.cuisineFit} pts</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">4. Sensory Taste Profile Fit</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.tasteFit} pts</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">5. Maximum Cooking Time Fit</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.timeFit} pts</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-bold text-brand-dark">6. Dietary Compliance Fit</span>
              <span className="font-extrabold text-brand-primary">{SCORING_WEIGHTS.dietaryFit} pts</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Deterministic 0–100 sum — dynamically recalculates on every pantry or preference change.
          </div>
        </section>
      </div>
    </div>
  );
}
