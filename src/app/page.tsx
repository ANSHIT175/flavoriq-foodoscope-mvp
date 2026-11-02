"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Utensils,
  Sparkles,
  Beaker,
  Flame,
  ShoppingCart,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
  BookOpen,
  Play,
  Compass,
  RefreshCw,
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
    accent: "from-emerald-600 to-brand-primary",
  },
  {
    emoji: "🧠",
    label: "Generate Recipe",
    desc: "Creative AI culinary synthesis studio",
    href: "/generator",
    accent: "from-brand-dark to-emerald-800",
  },
  {
    emoji: "🔬",
    label: "Explore Flavors",
    desc: "Interactive FlavorDB molecular graph",
    href: "/flavor-intelligence",
    accent: "from-teal-700 to-emerald-700",
  },
  {
    emoji: "🥗",
    label: "Nutrition",
    desc: "Macro rings, protein score & optimizer",
    href: "/nutrition",
    accent: "from-amber-600 to-orange-600",
  },
  {
    emoji: "🛒",
    label: "Grocery List",
    desc: "Smart pantry gap shopping checklist",
    href: "/grocery",
    accent: "from-emerald-700 to-teal-800",
  },
  {
    emoji: "📅",
    label: "Meal Planner",
    desc: "7-day breakfast, lunch & dinner calendar",
    href: "/meal-planner",
    accent: "from-brand-primary to-brand-dark",
  },
];

export default function DashboardCommandCenter() {
  const router = useRouter();
  const {
    ingredients,
    rankedResults,
    allRecipes,
    savedRecipeIds,
    mealPlan,
    totalCandidatesEvaluated,
    applyDemoPreset,
  } = useFlavorIq();

  const topScore = rankedResults[0]?.scoreBreakdown.totalScore ?? 93;
  const topRecommendations = rankedResults.slice(0, 3);

  const savedRecipesList = useMemo(
    () => allRecipes.filter((r) => savedRecipeIds.includes(r.id)).slice(0, 3),
    [allRecipes, savedRecipeIds]
  );

  const weeklyNutrition = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let count = 0;
    for (const d of DAYS_OF_WEEK) {
      for (const s of MEAL_SLOTS) {
        const id = mealPlan[d]?.[s];
        if (id) {
          const rec = allRecipes.find((r) => r.id === id);
          if (rec) {
            calories += rec.nutrition.calories;
            protein += rec.nutrition.proteinG;
            carbs += rec.nutrition.carbsG;
            fat += rec.nutrition.fatG;
            count++;
          }
        }
      }
    }
    return { calories, protein, carbs, fat, count };
  }, [mealPlan, allRecipes]);

  const featuredFlavorPairs = useMemo(
    () => Object.values(FLAVORDB_PAIRING_GRAPH).slice(0, 3),
    []
  );

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-[#193D22] to-brand-primary text-white p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-brand-lime/30 text-brand-lime text-xs font-bold">
              <Beaker className="w-3.5 h-3.5" />
              <span>FLAVORIQ Command Center • RecipeDB + FlavorDB Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Turn Your Ingredients Into Something Amazing.
            </h1>

            <p className="text-sm sm:text-base text-brand-lime/90 max-w-2xl leading-relaxed">
              Discover recipes that match what you have, how you eat, and what you love. Navigate across our dedicated molecular pairing lab, recipe finder, nutrition analyzer, and smart substitution workspace.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-lime hover:bg-white text-brand-dark font-extrabold text-sm shadow-md transition"
              >
                <Utensils className="w-4 h-4 text-brand-primary" />
                Find My Recipes
              </Link>

              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-sm transition"
              >
                <Sparkles className="w-4 h-4 text-brand-lime" />
                Generate with AI
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-brand-lime hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                How FLAVORIQ Works →
              </Link>
            </div>
          </div>

          {/* Active Kitchen Context Summary Box */}
          <div className="lg:col-span-4 bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-lime">
                Active Kitchen Snapshot
              </span>
              <Link
                href="/recipes"
                className="text-[11px] font-bold text-white underline hover:text-brand-lime"
              >
                Edit Pantry →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.slice(0, 7).map((ing) => (
                <span
                  key={ing}
                  className="px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold"
                >
                  {ing}
                </span>
              ))}
              {ingredients.length > 7 && (
                <span className="px-2 py-1 rounded-lg bg-brand-lime text-brand-dark text-xs font-bold">
                  +{ingredients.length - 7} more
                </span>
              )}
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-brand-lime/90">Best Current Match:</span>
              <Link
                href={`/recipes/${rankedResults[0]?.recipe.id || "fiq-rec-01"}`}
                className="font-extrabold text-brand-lime hover:underline truncate max-w-[180px]"
              >
                {rankedResults[0]?.recipe.name || "Kadai Paneer"} ({topScore}/100)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI STATISTICS CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/recipes"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Recipes Analyzed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              {totalCandidatesEvaluated}
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
              Click to open Recipe Finder →
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <Utensils className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/flavor-intelligence"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Flavor Matches</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              26 Bridges
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
              Open Molecular Graph →
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <Beaker className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/grocery"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Ingredients Matched</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
              {ingredients.length} Items
            </p>
            <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
              View Pantry &amp; Grocery →
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/compare"
          className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs hover:shadow-md hover:border-brand-primary transition flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500">Personalized Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-primary mt-1">
              {topScore}/100
            </p>
            <p className="text-[11px] text-gray-600 font-semibold mt-0.5">
              Compare Top Recipes →
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-lime/60 flex items-center justify-center text-brand-dark">
            <Award className="w-5 h-5" />
          </div>
        </Link>
      </section>

      {/* 3. 6 QUICK ACTION LAUNCHPAD BUTTONS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-brand-dark">
            Quick Action Modules — Jump to Any Workspace
          </h2>
          <span className="text-xs text-gray-500">
            Each module opens its own dedicated interface
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_ACTIONS.map((act) => (
            <Link
              key={act.href}
              href={act.href}
              className="group bg-white rounded-2xl border border-brand-border p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-3"
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

      {/* 4. BENTO GRID: RECOMMENDED RECIPES + FLAVOR INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recommended Recipes Spotlight (Compact Analytics Cards) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                Live Engine Output
              </span>
              <h2 className="text-lg font-extrabold text-brand-dark">
                Top Recommended Recipes for Your Pantry
              </h2>
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
            >
              Open Recipe Finder <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topRecommendations.map((item, idx) => (
              <div
                key={item.recipe.id}
                className="p-3.5 rounded-2xl border border-brand-border/80 bg-brand-surface/30 hover:bg-white hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
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
                    <Link
                      href={`/recipes/${item.recipe.id}`}
                      className="text-sm font-extrabold text-brand-dark hover:text-brand-primary truncate block mt-0.5"
                    >
                      {item.recipe.name}
                    </Link>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Core Ingredients Matched: {item.ingredientMatch.fitDisplay} • FlavorDB:{" "}
                      {item.flavorCompatibility.flavorFitLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <ScoreRing score={item.scoreBreakdown.totalScore} size={48} />
                  <Link
                    href={`/recipes/${item.recipe.id}`}
                    className="px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Flavor Insights Widget */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
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

            <div className="space-y-3">
              {featuredFlavorPairs.map((pair) => (
                <Link
                  key={`${pair.ingredientA}-${pair.ingredientB}`}
                  href="/flavor-intelligence"
                  className="block p-3.5 rounded-xl bg-brand-surface/50 hover:bg-brand-lime/40 border border-brand-border transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-dark capitalize">
                      {pair.ingredientA} + {pair.ingredientB}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-dark text-brand-lime">
                      {pair.sharedMoleculeCount} Shared Molecules
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {pair.sensoryNote}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {pair.sharedCompounds.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-brand-border text-brand-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-brand-border flex items-center justify-between gap-2">
            <Link
              href="/substitutions"
              className="flex-1 py-2.5 px-3 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark text-xs font-bold text-center border border-brand-border transition"
            >
              🔄 Smart Substitutions
            </Link>
            <Link
              href="/cuisines"
              className="flex-1 py-2.5 px-3 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark text-xs font-bold text-center border border-brand-border transition"
            >
              🌍 Explore Cuisines
            </Link>
          </div>
        </section>
      </div>

      {/* 5. WEEKLY NUTRITION SUMMARY + SAVED / RECENT RECIPES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Nutrition Summary */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                Macro Analytics
              </span>
              <h2 className="text-lg font-extrabold text-brand-dark">
                Weekly Nutrition Summary
              </h2>
            </div>
            <div className="flex gap-2">
              <Link
                href="/nutrition"
                className="px-3 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark text-xs font-bold border border-brand-border transition"
              >
                Nutrition Lab →
              </Link>
              <Link
                href="/meal-planner"
                className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold transition"
              >
                Meal Planner →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-brand-surface/50 border border-brand-border">
              <span className="text-xl font-extrabold text-brand-dark block">
                {weeklyNutrition.calories.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">
                Weekly Calories (kcal)
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xl font-extrabold text-emerald-800 block">
                {weeklyNutrition.protein}g
              </span>
              <span className="text-[11px] text-emerald-900 font-semibold">
                Weekly Protein
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-brand-surface/50 border border-brand-border">
              <span className="text-xl font-extrabold text-brand-primary block">
                {weeklyNutrition.count} Meals
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">
                Scheduled in Planner
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-bold text-brand-dark">
              <span>Weekly Protein Goal Progress</span>
              <span className="text-brand-primary">
                {Math.min(100, Math.round((weeklyNutrition.protein / 220) * 100))}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((weeklyNutrition.protein / 220) * 100))}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Saved & Recent Cookbook Strip */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                Personal Cookbook
              </span>
              <h2 className="text-lg font-extrabold text-brand-dark">
                Saved &amp; Recent Recipes ({savedRecipeIds.length})
              </h2>
            </div>
            <Link
              href="/saved"
              className="px-3.5 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark text-xs font-bold border border-brand-border transition"
            >
              Open Saved Cookbook →
            </Link>
          </div>

          {savedRecipesList.length === 0 ? (
            <div className="p-6 rounded-xl bg-brand-surface/40 border border-brand-border text-center text-xs text-gray-600">
              No saved recipes yet. Bookmark dishes in the{" "}
              <Link href="/recipes" className="font-bold text-brand-primary underline">
                Recipe Finder
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {savedRecipesList.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/recipes/${rec.id}`}
                  className="group rounded-xl border border-brand-border overflow-hidden bg-brand-surface/30 hover:bg-white hover:shadow-xs transition"
                >
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2.5">
                    <p className="text-xs font-extrabold text-brand-dark truncate">
                      {rec.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {rec.cuisine} • {rec.cookingTimeMinutes}m
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 6. JUDGE QUICK DEMO BAR (Navigates directly to /recipes with preset loaded) */}
      <section className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold text-brand-dark flex items-center gap-1.5">
            <Play className="w-4 h-4 text-brand-primary" />
            Judge One-Click Live Demo Scenarios (Loads Pantry &amp; Opens Recipe Finder):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JUDGE_DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={async () => {
                await applyDemoPreset(preset);
                router.push("/recipes");
              }}
              className="text-left p-3.5 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-lime/50 hover:border-brand-primary transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-brand-dark">
                  {preset.label}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-dark text-brand-lime">
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-1">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
