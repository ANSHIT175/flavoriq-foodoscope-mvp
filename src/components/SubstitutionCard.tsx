"use client";

import React from "react";
import { RefreshCw, CheckCircle2, Beaker, ShieldCheck } from "lucide-react";
import { SubstitutionSuggestion } from "../lib/foodoscope/types";
import { ScoreRing } from "./ScoreBreakdown";

export default function SubstitutionCard({
  sub,
  onUseSubstitute,
}: {
  sub: SubstitutionSuggestion;
  onUseSubstitute: (target: string, substitute: string) => void;
}) {
  const compatibility = sub.compatibilityScore || 90;

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Missing: {sub.targetIngredient}
            </span>
            <h3 className="text-lg font-extrabold text-brand-dark mt-2 flex items-center gap-2">
              <span>{sub.substituteIngredient}</span>
            </h3>
            {sub.proteinPer100g && (
              <span className="text-xs font-semibold text-brand-primary block mt-0.5">
                {sub.proteinPer100g} •{" "}
                {sub.sourceType === "flavordb-supported"
                  ? "FlavorDB Molecular Match"
                  : "Culinary Functional Match"}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center shrink-0">
            <ScoreRing score={compatibility} size={56} />
            <span className="text-[10px] font-bold text-brand-primary mt-1">
              {compatibility}% Match
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed">
          {sub.reasoning}
        </p>

        {sub.sharedCompounds && sub.sharedCompounds.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Beaker className="w-3 h-3 text-brand-primary" />
              Shared Flavor Molecules:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sub.sharedCompounds.map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-brand-dark"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {sub.dietaryCompatibility && sub.dietaryCompatibility.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sub.dietaryCompatibility.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onUseSubstitute(sub.targetIngredient, sub.substituteIngredient)
        }
        className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Use This Substitute (Swap in Pantry)
      </button>
    </div>
  );
}
