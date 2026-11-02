"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Heart,
  Bell,
  Sparkles,
  BarChart2,
  ShoppingCart,
  Settings,
  Check,
  ArrowRight,
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
    activePresetId,
    applyDemoPreset,
    rankedResults,
  } = useFlavorIq();

  const [notifOpen, setNotifOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const navActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        navActionsRef.current &&
        !navActionsRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
        setDemoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const topMatch = rankedResults[0];
  const uncheckedGroceryCount = groceryItems.filter((i) => !i.checked).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-brand-border text-brand-dark hover:bg-brand-surface cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <SearchBar />
      </div>

      <div
        ref={navActionsRef}
        className="flex items-center gap-2 sm:gap-2.5 shrink-0"
      >
        {/* Quick Demo Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDemoOpen(!demoOpen);
              setNotifOpen(false);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              demoOpen
                ? "bg-brand-dark text-brand-lime border-brand-dark"
                : "bg-brand-lime/80 hover:bg-brand-lime text-brand-dark border-brand-primary/30"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span className="hidden sm:inline">Quick Demo</span>
          </button>

          {demoOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-xl p-3 z-50 space-y-2">
              <div className="px-2 py-1 border-b border-brand-border/60">
                <p className="text-xs font-extrabold text-brand-dark">
                  Judge Live Demo Presets
                </p>
                <p className="text-[11px] text-gray-500">
                  Updates pantry, cuisine, taste, diet &amp; 0–100 match scores
                </p>
              </div>
              {JUDGE_DEMO_PRESETS.map((preset) => {
                const isCurrent = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      applyDemoPreset(preset);
                      setDemoOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer ${
                      isCurrent
                        ? "bg-brand-lime/50 border-brand-primary"
                        : "hover:bg-brand-surface border-transparent hover:border-brand-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-dark flex items-center gap-1">
                        {isCurrent && (
                          <Check className="w-3.5 h-3.5 text-brand-primary" />
                        )}
                        {preset.label}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-dark text-brand-lime shrink-0">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Compare Indicator */}
        <Link
          href="/compare"
          title="Compare Recipes"
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition cursor-pointer"
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
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition cursor-pointer"
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
          title="Smart Grocery Planner"
          className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-brand-primary" />
          {uncheckedGroceryCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {uncheckedGroceryCount}
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
            className="relative p-2 rounded-xl border border-brand-border bg-brand-surface/50 hover:bg-brand-lime/50 text-brand-dark transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-brand-border pb-2">
                <span className="text-xs font-extrabold text-brand-dark">
                  Flavor Intelligence Activity
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  API_MODE: {modeUsed.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {topMatch && (
                  <Link
                    href={`/recipes/${topMatch.recipe.id}`}
                    onClick={() => setNotifOpen(false)}
                    className="block p-2.5 rounded-xl bg-brand-surface hover:bg-brand-lime/50 border border-brand-border/80 transition"
                  >
                    <p className="font-bold text-brand-dark flex items-center justify-between">
                      <span>#1 Match: {topMatch.recipe.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Score: {topMatch.scoreBreakdown.totalScore}/100 • Core Fit{" "}
                      {topMatch.ingredientMatch.fitDisplay}
                    </p>
                  </Link>
                )}
                <Link
                  href="/flavor-intelligence"
                  onClick={() => setNotifOpen(false)}
                  className="block p-2.5 rounded-xl bg-brand-surface/50 hover:bg-brand-lime/40 border border-brand-border/60 transition"
                >
                  <p className="font-semibold text-brand-dark">
                    Explore FlavorDB Molecular Graph →
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Inspect shared aroma compounds across 26 pairing bridges.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Settings Button */}
        <Link
          href="/settings"
          title="Settings & Scoring Formula"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-brand-lime" />
          <span className="hidden md:inline">{modeUsed.toUpperCase()}</span>
        </Link>
      </div>
    </header>
  );
}
