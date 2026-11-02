"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Utensils,
  Sparkles,
  Beaker,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Play,
  Check,
} from "lucide-react";
import {
  useFlavorIq,
  JUDGE_DEMO_PRESETS,
  DAYS_OF_WEEK,
  MEAL_SLOTS,
} from "../context/FlavorIqContext";
import { ScoreRing } from "../components/ScoreBreakdown";
import { FLAVORDB_PAIRING_GRAPH } from "../lib/foodoscope/mockCatalog";

const QUICK_ACTIONS = [
  {
    emoji: "🍳",
    label: "Find Recipes",
    desc: "Pantry + 100-pt recommendation engine",
    href: "/recipes",
  },
  {
    emoji: "🧠",
    label: "Generate Recipe",
    desc: "Creative AI culinary synthesis studio",
    href: "/generator",
  },
  {
    emoji: "🔬",
    label: "Explore Flavors",
    desc: "Interactive FlavorDB molecular graph",
    href: "/flavor-intelligence",
  },
  {
    emoji: "🥗",
    label: "Nutrition",
    desc: "Macro rings, protein score & optimizer",
    href: "/nutrition",
  },
  {
    emoji: "🛒",
    label: "Grocery List",
    desc: "Smart pantry gap shopping checklist",
    href: "/grocery",
  },
  {
    emoji: "📅",
    label: "Meal Planner",
    desc: "7-day breakfast, lunch & dinner calendar",
    href: "/meal-planner",
  },
];

export default function DashboardCommandCenter() {
  const {
    ingredients,
    cuisine,
    taste,
    dietaryPreference,
    maxCookingTime,
    activePresetId,
    rankedResults,
    allRecipes,
    savedRecipeIds,
    mealPlan,
    totalCandidatesEvaluated,
    applyDemoPreset,
  } = useFlavorIq();

  const topMatch = rankedResults[0];
  const topScore = topMatch?.scoreBreakdown.totalScore ?? 93;
  const topRecommendations = rankedResults.slice(0, 4);

  const activeFlavorMatchesCount = useMemo(
    () =>
      rankedResults.reduce(
        (acc, r) => acc + r.flavorCompatibility.matchedRelationships.length,
        0
      ),
    [rankedResults]
  );

  const savedRecipesList = useMemo(
    () => allRecipes.filter((r) => savedRecipeIds.includes(r.id)).slice(0, 3),
    [allRecipes, savedRecipeIds]
  );

  const weeklyNutrition = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let count = 0;
    for (const d of DAYS_OF_WEEK) {
      for (const s of MEAL_SLOTS) {
        const id = mealPlan[d]?.[s];
        if (id) {
          const rec = allRecipes.find((r) => r.id === id);
          if (rec) {
            calories += rec.nutrition.calories;
            protein += rec.nutrition.proteinG;
            count++;
          }
        }
      }
    }
    return { calories, protein, count };
  }, [mealPlan, allRecipes]);

  const featuredFlavorPairs = useMemo(
    () => Object.values(FLAVORDB_PAIRING_GRAPH).slice(0, 3),
    []
  );

  return (
    <div className="space-y-8">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-[#193D22] to-brand-primary text-white p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-brand-lime/30 text-brand-lime text-xs font-bold">
              <Beaker className="w-3.5 h-3.5" />
              <span>RecipeDB + FlavorDB Molecular Recommendation Engine</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Turn Your Ingredients Into Something Amazing.
            </h1>

            <p className="text-sm sm:text-base text-brand-lime/90 max-w-2xl leading-relaxed">
              Discover recipes that match what you have, how you eat, and what you love — powered by transparent 100-point multi-factor scoring and shared volatile flavor compound intelligence.
            </p>

            {/* Primary, Secondary, and Tertiary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-lime hover:bg-white text-brand-dark font-extrabold text-sm shadow-md transition cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-brand-primary" />
                Find My Recipes
              </Link>

              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-brand-lime" />
                Generate with AI
              </Link>

              <Link
                href="/flavor-intelligence"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-brand-lime hover:text-white hover:underline transition cursor-pointer"
              >
                Explore Flavor Network
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Hero Card: Active Top Recommendation */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-lime">
                Active Top Recommendation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-lime text-brand-dark">
                {topScore}/100 Score
              </span>
            </div>

            {topMatch ? (
              <>
                <Link
                  href={`/recipes/${topMatch.recipe.id}`}
                  className="text-base font-extrabold text-white hover:text-brand-lime line-clamp-1 block transition"
                >
                  {topMatch.recipe.name}
                </Link>
                <p className="text-xs text-brand-lime/90">
                  {topMatch.recipe.cuisine} • {topMatch.recipe.cookingTimeMinutes} min • Core Fit{" "}
                  {topMatch.ingredientMatch.fitDisplay}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-black/25 rounded-xl p-2">
                    <span className="text-sm font-extrabold text-brand-lime block">
                      {topMatch.scoreBreakdown.ingredientCoverage}/30
                    </span>
                    <span className="text-[10px] text-white/75">Pantry</span>
                  </div>
                  <div className="bg-black/25 rounded-xl p-2">
                    <span className="text-sm font-extrabold text-brand-lime block">
                      {topMatch.scoreBreakdown.flavorCompatibility}/25
                    </span>
                    <span className="text-[10px] text-white/75">FlavorDB</span>
                  </div>
                  <div className="bg-black/25 rounded-xl p-2">
                    <span className="text-sm font-extrabold text-brand-lime block">
                      {topMatch.scoreBreakdown.preferenceFitCombined}/25
                    </span>
                    <span className="text-[10px] text-white/75">Context</span>
                  </div>
                </div>
                <Link
                  href={`/recipes/${topMatch.recipe.id}`}
                  className="w-full mt-2 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-brand-lime hover:text-brand-dark text-xs font-extrabold text-center block transition cursor-pointer"
                >
                  Inspect Molecular Breakdown →
                </Link>
              </>
            ) : (
              <p className="text-xs text-white/80">
                Select a Demo Preset below or open Recipe Finder to compute recommendations.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. 4 KPI STATISTICS CARDS (Dynamically Reactive to Active Pantry & Context) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/recipes"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Recipes Analyzed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              {rankedResults.length}/{totalCandidatesEvaluated}
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
              {cuisine} • {maxCookingTime}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <Utensils className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/flavor-intelligence"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Flavor Matches</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              {activeFlavorMatchesCount} Pairs
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
              Active FlavorDB Bridges →
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <Beaker className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/recipes"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Ingredients Matched</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              {ingredients.length}
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5 truncate max-w-[160px]">
              {ingredients.slice(0, 3).join(", ")}...
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href={`/recipes/${topMatch?.recipe.id || "fiq-rec-01"}`}
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Personalized Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-primary mt-1">
              {topScore}/100
            </p>
            <p className="text-[11px] text-gray-600 font-semibold mt-0.5 truncate max-w-[160px]">
              #1: {topMatch?.recipe.name || "Kadai Paneer"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-lime/60 flex items-center justify-center text-brand-dark">
            <Award className="w-5 h-5" />
          </div>
        </Link>
      </section>

      {/* 3. INTERACTIVE JUDGE DEMO PRESETS (Updates State, Pantry, Scores & Metrics Immediately!) */}
      <section className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              Interactive Judge Demo Mode
            </span>
            <h2 className="text-base font-extrabold text-brand-dark mt-0.5">
              Quick Demo Scenarios — Click Any Preset to Update Pantry, Context &amp; Top Matches Live
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-500">Active Context:</span>
            <span className="px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border font-bold text-brand-dark">
              {cuisine} • {taste} • {dietaryPreference} • {maxCookingTime}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JUDGE_DEMO_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyDemoPreset(preset)}
                className={`group text-left p-4 rounded-2xl border transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-brand-lime/50 border-brand-primary ring-2 ring-brand-primary/30 shadow-xs"
                    : "bg-brand-surface/40 border-brand-border hover:bg-brand-lime/30 hover:border-brand-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-brand-dark flex items-center gap-1">
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      )}
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-dark text-brand-lime shrink-0">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1.5 leading-snug">
                    {preset.description}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-brand-primary flex items-center gap-1 pt-1">
                  {isSelected
                    ? "✓ Active Scenario Loaded"
                    : "Load Preset & Recalculate →"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. 6 QUICK ACTION LAUNCHPAD BUTTONS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-brand-dark">
            Application Modules — Click Any Workspace to Open
          </h2>
          <Link
            href="/about"
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" /> View 7-Stage Pipeline
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_ACTIONS.map((act) => (
            <Link
              key={act.href}
              href={act.href}
              className="group bg-white rounded-2xl border border-brand-border p-4 shadow-2xs hover:shadow-md hover:border-brand-primary hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-surface group-hover:bg-brand-lime flex items-center justify-center text-lg transition">
                {act.emoji}
              </div>
              <div>
                <p className="text-sm font-extrabold text-brand-dark group-hover:text-brand-primary transition">
                  {act.label}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {act.desc}
                </p>
              </div>
              <span className="text-[11px] font-bold text-brand-primary flex items-center gap-1">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BENTO GRID: LIVE TOP RECOMMENDED RECIPES + FLAVORDB INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recommended Recipes Spotlight (Changes Live When Presets/Pantry Change!) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                Live Recommendation Output ({cuisine} • {maxCookingTime})
              </span>
              <h2 className="text-lg font-extrabold text-brand-dark">
                Top Ranked Matches for Your Active Pantry
              </h2>
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-extrabold transition cursor-pointer"
            >
              Customize Pantry in Recipe Finder <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topRecommendations.map((item, idx) => (
              <div
                key={item.recipe.id}
                className="p-3.5 rounded-2xl border border-brand-border/80 bg-brand-surface/30 hover:bg-white hover:border-brand-primary hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <Link
                  href={`/recipes/${item.recipe.id}`}
                  className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                >
                  <img
                    src={item.recipe.image}
                    alt={item.recipe.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-brand-border"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-dark text-brand-lime">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-brand-primary">
                        {item.recipe.cuisine}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {item.recipe.cookingTimeMinutes} min •{" "}
                        {item.recipe.nutrition.calories} kcal
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-brand-dark hover:text-brand-primary truncate mt-0.5">
                      {item.recipe.name}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Matched Core: {item.ingredientMatch.matchedCoreIngredients.join(", ") || "None"} ({item.ingredientMatch.fitDisplay})
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <ScoreRing score={item.scoreBreakdown.totalScore} size={48} />
                  <Link
                    href={`/recipes/${item.recipe.id}`}
                    className="px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition cursor-pointer"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Flavor Insights & Weekly Summary */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                  Molecular Intelligence
                </span>
                <h2 className="text-lg font-extrabold text-brand-dark">
                  FlavorDB Pairing Insights
                </h2>
              </div>
              <Link
                href="/flavor-intelligence"
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                Open Network <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {featuredFlavorPairs.map((pair) => (
                <Link
                  key={`${pair.ingredientA}-${pair.ingredientB}`}
                  href="/flavor-intelligence"
                  className="block p-3 rounded-xl bg-brand-surface/50 hover:bg-brand-lime/40 border border-brand-border transition space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-dark capitalize">
                      {pair.ingredientA} + {pair.ingredientB}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-dark text-brand-lime">
                      {pair.sharedMoleculeCount} Shared Molecules
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-1">
                    {pair.sensoryNote}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Planner &amp; Cookbook
                </span>
                <h2 className="text-base font-extrabold text-brand-dark">
                  Weekly Nutrition &amp; Saved Status
                </h2>
              </div>
              <Link
                href="/meal-planner"
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Meal Planner →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <Link
                href="/nutrition"
                className="p-3 rounded-xl bg-brand-surface/60 hover:bg-brand-lime/40 border border-brand-border transition"
              >
                <span className="text-base font-extrabold text-brand-dark block">
                  {weeklyNutrition.calories.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Weekly kcal
                </span>
              </Link>
              <Link
                href="/nutrition"
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              >
                <span className="text-base font-extrabold text-emerald-800 block">
                  {weeklyNutrition.protein}g
                </span>
                <span className="text-[10px] text-emerald-900 font-semibold">
                  Weekly Protein
                </span>
              </Link>
              <Link
                href="/saved"
                className="p-3 rounded-xl bg-red-50/70 hover:bg-red-100 border border-red-200 transition"
              >
                <span className="text-base font-extrabold text-red-700 block">
                  {savedRecipesList.length}
                </span>
                <span className="text-[10px] text-red-800 font-semibold">
                  Saved Recipes
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
