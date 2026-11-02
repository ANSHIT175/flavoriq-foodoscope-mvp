"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Heart,
  Bell,
  Beaker,
  Sparkles,
  BarChart2,
  ShoppingCart,
  ChefHat,
} from "lucide-react";
import { useFlavorIq, JUDGE_DEMO_PRESETS } from "../context/FlavorIqContext";
import SearchBar from "./SearchBar";

export default function Navbar({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu: () => void;
}) {
  const {
    savedRecipeIds,
    compareRecipeIds,
    groceryItems,
    modeUsed,
    applyDemoPreset,
    rankedResults,
  } = useFlavorIq();

  const [notifOpen, setNotifOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const topMatch = rankedResults[0];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-brand-border text-brand-dark hover:bg-brand-surface"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <SearchBar />
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Quick Demo Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDemoOpen(!demoOpen);
              setNotifOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-lime/70 hover:bg-brand-lime text-brand-dark text-xs font-extrabold border border-brand-primary/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span className="hidden sm:inline">Quick Demo</span>
          </button>

          {demoOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-brand-border shadow-xl p-3 z-50 space-y-2">
              <div className="px-2 py-1 border-b border-brand-border/60">
                <p className="text-xs font-extrabold text-brand-dark">
                  Judge Live Demo Presets
                </p>
                <p className="text-[11px] text-gray-500">
                  Instantly populates pantry &amp; recalculates 0–100 scores
                </p>
              </div>
              {JUDGE_DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    applyDemoPreset(preset);
                    setDemoOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-brand-surface border border-transparent hover:border-brand-border transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark">
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-lime text-brand-dark">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Compare Indicator */}
        <Link
          href="/compare"
          title="Compare Recipes"
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition"
        >
          <BarChart2 className="w-4 h-4" />
          {compareRecipeIds.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center">
              {compareRecipeIds.length}
            </span>
          )}
        </Link>

        {/* Saved Recipes Indicator */}
        <Link
          href="/saved"
          title="Saved Recipes"
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition"
        >
          <Heart className="w-4 h-4 text-red-500" />
          {savedRecipeIds.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {savedRecipeIds.length}
            </span>
          )}
        </Link>

        {/* Grocery Indicator */}
        <Link
          href="/grocery"
          title="Smart Grocery List"
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition hidden sm:inline-flex"
        >
          <ShoppingCart className="w-4 h-4 text-brand-primary" />
          {groceryItems.filter((i) => !i.checked).length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {groceryItems.filter((i) => !i.checked).length}
            </span>
          )}
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDemoOpen(false);
            }}
            className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-brand-border pb-2">
                <span className="text-xs font-extrabold text-brand-dark">
                  Flavor Intelligence Feed
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  Live Engine
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {topMatch && (
                  <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border/80">
                    <p className="font-bold text-brand-dark">
                      Top Match: {topMatch.recipe.name} ({topMatch.scoreBreakdown.totalScore}/100)
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Core Fit {topMatch.ingredientMatch.fitDisplay} • FlavorDB{" "}
                      {topMatch.flavorCompatibility.flavorFitLabel}
                    </p>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-brand-surface/50 border border-brand-border/60">
                  <p className="font-semibold text-brand-dark">
                    FlavorDB Graph Ready
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    26 molecular pairing edges active across 12 global recipes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User / API Mode Badge */}
        <Link
          href="/settings"
          className="hidden md:inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl bg-brand-dark text-white text-xs font-bold hover:bg-brand-primary transition"
        >
          <Beaker className="w-3.5 h-3.5 text-brand-lime" />
          <span>{modeUsed.toUpperCase()}</span>
        </Link>
      </div>
    </header>
  );
}
