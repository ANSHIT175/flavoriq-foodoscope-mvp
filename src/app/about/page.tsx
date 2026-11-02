"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowDown,
  Beaker,
  Utensils,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const STAGES = [
  {
    num: "01",
    name: "PANTRY",
    title: "Kitchen Inventory Capture",
    detail:
      "Users input raw ingredients available in their kitchen (e.g., Paneer, Tamatar, Palak, Garlic, Tofu) without needing exact measurements or recipe titles.",
    href: "/recipes",
    cta: "Try Pantry Input",
  },
  {
    num: "02",
    name: "NORMALIZATION",
    title: "Bilingual & Culinary Synonym Resolution",
    detail:
      "Our normalizer maps regional Indian and global aliases (e.g., 'tamatar' → 'tomato', 'palak' → 'spinach', 'shimla mirch' → 'capsicum', 'daal' → 'dal') to canonical RecipeDB & FlavorDB entities.",
    href: "/recipes",
    cta: "Test Synonym Matching",
  },
  {
    num: "03",
    name: "RECIPE MATCHING",
    title: "Core vs. Secondary Ingredient Coverage (30 pts)",
    detail:
      "Evaluates candidate recipes from RecipeDB by weighing core dish ingredients (75% weight) alongside overall pantry utilization efficiency (25% weight).",
    href: "/recipes",
    cta: "Explore Matched Recipes",
  },
  {
    num: "04",
    name: "FLAVORDB",
    title: "Molecular Volatile Compound Pairing (25 pts)",
    detail:
      "Queries the FlavorDB pairing graph across active recipe ingredients to count shared volatile aroma molecules (such as hexanal, diallyl disulfide, zingiberene, and cuminaldehyde).",
    href: "/flavor-intelligence",
    cta: "Open Molecular Graph",
  },
  {
    num: "05",
    name: "PREFERENCE MATCHING",
    title: "Cuisine, Sensory Taste, Time & Dietary Alignment (45 pts)",
    detail:
      "Scores regional cuisine fit (15 pts), sensory taste profile (10 pts), cooking time buffer (10 pts), and strict dietary compliance (10 pts).",
    href: "/cuisines",
    cta: "Explore Cuisines",
  },
  {
    num: "06",
    name: "MULTI-FACTOR SCORING",
    title: "Transparent 0–100 Deterministic Ranking",
    detail:
      "Combines all 6 dimensions into an explainable 100-point score with zero black-box randomness, generating human-readable explanations for every rank decision.",
    href: "/compare",
    cta: "Compare Multi-Factor Scores",
  },
  {
    num: "07",
    name: "PERSONALIZED RECOMMENDATION",
    title: "Actionable Cooking, Substitution, Grocery & Meal Planning",
    detail:
      "Connects ranked recommendations directly to Smart Ingredient Substitutions, Nutrition Analytics, Pantry-Gap Grocery Checklists, and the 7-Day Meal Planner.",
    href: "/meal-planner",
    cta: "Open Weekly Meal Planner",
  },
];

export default function AboutHowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Storytelling Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-dark via-[#193E23] to-brand-primary text-white p-8 sm:p-10 shadow-xl space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
          <BookOpen className="w-3.5 h-3.5" />
          Product Vision &amp; Algorithmic Architecture
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          From What You Have to What You&apos;ll Love.
        </h1>

        {/* THE PROBLEM vs FLAVORIQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-black/30 border border-white/15 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-300">
              The Problem • Traditional Recipe Apps
            </span>
            <p className="text-lg font-extrabold text-white">
              &ldquo;What recipe do you want?&rdquo;
            </p>
            <p className="text-xs text-white/75 leading-relaxed">
              Forces users to search for a dish first, only to discover they are missing half the ingredients or that the dish violates their time or dietary goals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-lime text-brand-dark space-y-2 shadow-lg">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">
              The FLAVORIQ Paradigm
            </span>
            <p className="text-lg font-extrabold text-brand-dark">
              &ldquo;What can you create from what you already have?&rdquo;
            </p>
            <p className="text-xs text-brand-dark/85 leading-relaxed">
              Starts from your actual kitchen pantry, evaluates molecular compound synergy via FlavorDB, and ranks recipes with a transparent 100-point score.
            </p>
          </div>
        </div>
      </section>

      {/* Vertical 7-Stage Pipeline */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
            End-to-End Intelligence Pipeline
          </span>
          <h2 className="text-2xl font-extrabold text-brand-dark">
            How the 7-Stage Recommendation Engine Works
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {STAGES.map((stage, idx) => (
            <React.Fragment key={stage.num}>
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-dark text-brand-lime font-extrabold text-sm flex items-center justify-center shrink-0">
                    {stage.num}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">
                      {stage.name}
                    </span>
                    <h3 className="text-base font-extrabold text-brand-dark">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                      {stage.detail}
                    </p>
                  </div>
                </div>

                <Link
                  href={stage.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-primary hover:text-white text-brand-dark text-xs font-extrabold border border-brand-border transition shrink-0 self-start sm:self-center"
                >
                  {stage.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-brand-primary" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
