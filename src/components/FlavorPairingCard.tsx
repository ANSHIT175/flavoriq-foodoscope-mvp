"use client";

import React from "react";
import { Beaker, Sparkles } from "lucide-react";
import { FlavorPairingRelationship } from "../lib/foodoscope/types";

export default function FlavorPairingCard({
  pair,
  onSelectPair,
}: {
  pair: FlavorPairingRelationship;
  onSelectPair?: (a: string, b: string) => void;
}) {
  const strength =
    pair.pairingStrength ||
    Math.min(98, 65 + pair.sharedMoleculeCount * 1.5);

  return (
    <div
      onClick={() => onSelectPair && onSelectPair(pair.ingredientA, pair.ingredientB)}
      className={`bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md transition-all space-y-3.5 ${
        onSelectPair ? "cursor-pointer hover:border-brand-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-dark">
            <Beaker className="w-3 h-3 text-brand-primary" />
            {pair.sharedMoleculeCount} Shared Flavor Molecules
          </span>
          <h3 className="text-base font-extrabold text-brand-dark capitalize mt-1.5">
            {pair.ingredientA} + {pair.ingredientB}
          </h3>
          {pair.flavorProfile && (
            <p className="text-xs font-semibold text-brand-primary">
              {pair.flavorProfile}
            </p>
          )}
        </div>

        <div className="text-right shrink-0 bg-brand-surface px-3 py-1.5 rounded-xl border border-brand-border">
          <span className="text-base font-extrabold text-brand-primary block leading-none">
            {Math.round(strength)}%
          </span>
          <span className="text-[10px] font-semibold text-gray-500">
            Pairing Index
          </span>
        </div>
      </div>

      {/* Strength bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-emerald-500 rounded-full"
          style={{ width: `${Math.min(100, strength)}%` }}
        />
      </div>

      {/* Shared chemical compounds */}
      <div>
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
          Key Bridging Aroma Compounds (FlavorDB):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {pair.sharedCompounds.map((comp) => (
            <span
              key={comp}
              className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-brand-surface text-brand-dark border border-brand-border"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed bg-brand-surface/40 p-3 rounded-xl border border-brand-border/60">
        <Sparkles className="w-3.5 h-3.5 text-brand-primary inline mr-1 -mt-0.5" />
        {pair.sensoryNote}
      </p>
    </div>
  );
}
