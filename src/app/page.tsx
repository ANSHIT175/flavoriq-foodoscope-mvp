"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChefHat,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Flame,
  Utensils,
  Beaker,
  Info,
} from "lucide-react";
import type {
  CookingTimeOption,
  CuisineOption,
  DietaryOption,
  TasteOption,
  UserCookingContext,
} from "../lib/foodoscope/types";
import type { RankedRecipeResult } from "../lib/recommendation/scoring";

interface RecommendApiResponse {
  mode: "live" | "mock";
  scoreLabel: string;
  context: UserCookingContext;
  results: RankedRecipeResult[];
  totalCandidatesEvaluated: number;
  error?: string;
  details?: string;
}

const QUICK_INGREDIENTS = [
  "Paneer",
  "Tomato",
  "Onion",
  "Capsicum",
  "Spinach",
  "Garlic",
  "Ginger",
  "Potato",
  "Dal",
  "Rice",
  "Chickpeas",
  "Pasta",
  "Mushroom",
  "Tofu",
  "Black Beans",
  "Cumin",
  "Coriander",
];

const CUISINE_OPTIONS: CuisineOption[] = [
  "Any",
  "Indian",
  "Italian",
  "Mexican",
  "Chinese",
  "Continental",
];

const TASTE_OPTIONS: TasteOption[] = [
  "Any",
  "Spicy",
  "Savory",
  "Mild",
  "Tangy",
  "Sweet",
];

const TIME_OPTIONS: CookingTimeOption[] = [
  "Any",
  "Under 15 min",
  "Under 30 min",
  "Under 45 min",
  "Under 60 min",
];

const DIETARY_OPTIONS: DietaryOption[] = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Low-oil",
  "Gluten-free",
];

const DEMO_PRESETS: {
  label: string;
  context: UserCookingContext;
}[] = [
  {
    label: "North Indian Paneer Pantry",
    context: {
      ingredients: ["Paneer", "Tomato", "Onion", "Capsicum", "Garlic", "Ginger"],
      cuisine: "Indian",
      taste: "Spicy",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegetarian",
      allowAdditionalIngredients: true,
    },
  },
  {
    label: "Comfort Dal & Jeera Rice",
    context: {
      ingredients: ["Dal", "Rice", "Tomato", "Onion", "Cumin", "Garlic"],
      cuisine: "Indian",
      taste: "Savory",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegan",
      allowAdditionalIngredients: true,
    },
  },
  {
    label: "Quick Italian Pasta Night",
    context: {
      ingredients: ["Pasta", "Tomato", "Garlic", "Capsicum", "Spinach"],
      cuisine: "Italian",
      taste: "Tangy",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegetarian",
      allowAdditionalIngredients: true,
    },
  },
  {
    label: "15-Min Ginger Tofu Wok",
    context: {
      ingredients: ["Tofu", "Capsicum", "Ginger", "Garlic", "Onion"],
      cuisine: "Chinese",
      taste: "Spicy",
      maxCookingTime: "Under 15 min",
      dietaryPreference: "Vegan",
      allowAdditionalIngredients: true,
    },
  },
];

export default function FlavorIqHomePage() {
  const [ingredients, setIngredients] = useState<string[]>([
    "Paneer",
    "Tomato",
    "Onion",
    "Capsicum",
    "Garlic",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [cuisine, setCuisine] = useState<CuisineOption>("Indian");
  const [taste, setTaste] = useState<TasteOption>("Spicy");
  const [maxCookingTime, setMaxCookingTime] =
    useState<CookingTimeOption>("Under 30 min");
  const [dietaryPreference, setDietaryPreference] =
    useState<DietaryOption>("Vegetarian");
  const [allowAdditionalIngredients, setAllowAdditionalIngredients] =
    useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<RecommendApiResponse | null>(null);

  const fetchRecommendations = useCallback(
    async (ctxOverride?: UserCookingContext) => {
      const payload: UserCookingContext = ctxOverride || {
        ingredients,
        cuisine,
        taste,
        maxCookingTime,
        dietaryPreference,
        allowAdditionalIngredients,
      };

      if (payload.ingredients.length === 0) {
        setError("Add at least one pantry ingredient to compute recommendations.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as RecommendApiResponse;
        if (!res.ok) {
          setError(data.error || "Failed to fetch recommendations.");
        } else {
          setResponse(data);
        }
      } catch (err: any) {
        setError(err?.message || "Network error while contacting /api/recommend.");
      } finally {
        setLoading(false);
      }
    },
    [
      ingredients,
      cuisine,
      taste,
      maxCookingTime,
      dietaryPreference,
      allowAdditionalIngredients,
    ]
  );

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddIngredient = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (
      !ingredients.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())
    ) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const handleRemoveIngredient = (target: string) => {
    setIngredients((prev) => prev.filter((item) => item !== target));
  };

  const applyPreset = (preset: (typeof DEMO_PRESETS)[number]) => {
    setIngredients(preset.context.ingredients);
    setCuisine(preset.context.cuisine);
    setTaste(preset.context.taste);
    setMaxCookingTime(preset.context.maxCookingTime);
    setDietaryPreference(preset.context.dietaryPreference);
    setAllowAdditionalIngredients(Boolean(preset.context.allowAdditionalIngredients));
    fetchRecommendations(preset.context);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-dark text-white border-b border-brand-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-primary flex items-center justify-center shadow-sm">
              <ChefHat className="w-6 h-6 text-brand-lime" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight">FLAVORIQ</h1>
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-dark">
                  RecipeDB + FlavorDB MVP
                </span>
              </div>
              <p className="text-xs text-brand-lime/90 mt-0.5">
                From What You Have to What You&apos;ll Love • Team CodeXIT (Foodoscope Fork It Challenge 2026)
              </p>
            </div>
          </div>

          {response && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-brand-lime border border-brand-lime/30">
                <Beaker className="w-3.5 h-3.5" />
                API_MODE: {response.mode.toUpperCase()}
              </span>
              <span className="text-xs text-white/80 hidden md:inline">
                {response.totalCandidatesEvaluated} recipes evaluated
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6 bg-white rounded-2xl border border-brand-border p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              One-Click Demo Cooking Contexts
            </span>
            <span className="text-xs text-gray-500">
              Click any preset to recalculate 0–100 multi-factor scores &amp; FlavorDB molecule pairings
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs font-medium px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-brand-dark flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-brand-primary" />
                  1. Available Pantry Ingredients
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Normalized via Indian &amp; global synonym mapping (e.g., tamatar → tomato, palak → spinach).
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddIngredient(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., Paneer, Tamatar, Palak..."
                  className="flex-1 rounded-xl border border-brand-border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-lime text-brand-dark"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ing)}
                      className="hover:text-red-700"
                      aria-label={`Remove ${ing}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {ingredients.length === 0 && (
                  <span className="text-xs text-gray-500 italic">
                    No ingredients selected. Click below to add some.
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-brand-border/60">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Quick-add common ingredients:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_INGREDIENTS.map((item) => {
                    const isSelected = ingredients.some(
                      (i) => i.toLowerCase() === item.toLowerCase()
                    );
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          isSelected
                            ? handleRemoveIngredient(item)
                            : handleAddIngredient(item)
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-brand-surface text-brand-dark border-brand-border hover:bg-brand-lime/40"
                        }`}
                      >
                        {isSelected ? `✓ ${item}` : `+ ${item}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-brand-border">
                <h3 className="text-sm font-bold text-brand-dark">
                  2. Personalize Cooking Context
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Preferred Cuisine (15 pts)
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value as CuisineOption)}
                    className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
                  >
                    {CUISINE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Taste Profile (10 pts)
                  </label>
                  <select
                    value={taste}
                    onChange={(e) => setTaste(e.target.value as TasteOption)}
                    className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
                  >
                    {TASTE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Cooking Time (10 pts)
                  </label>
                  <select
                    value={maxCookingTime}
                    onChange={(e) =>
                      setMaxCookingTime(e.target.value as CookingTimeOption)
                    }
                    className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dietary Preference (10 pts + strict filter)
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) =>
                      setDietaryPreference(e.target.value as DietaryOption)
                    }
                    className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
                  >
                    {DIETARY_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={allowAdditionalIngredients}
                    onChange={(e) =>
                      setAllowAdditionalIngredients(e.target.checked)
                    }
                    className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  />
                  Include recipes requiring extra core ingredients
                </label>
              </div>

              <button
                type="button"
                onClick={() => fetchRecommendations()}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                {loading
                  ? "Scoring & Ranking Recipes..."
                  : "Compute Flavor-Aware Recommendations"}
              </button>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Unable to compute recommendations</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {response && (
              <div className="bg-white rounded-2xl border border-brand-border px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-brand-dark">
                  <Info className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{response.scoreLabel}</span>
                </div>
                <span className="text-xs font-semibold text-brand-primary">
                  Showing Top {response.results.length} Ranked Matches
                </span>
              </div>
            )}

            {response && response.results.length === 0 && (
              <div className="bg-white rounded-2xl border border-brand-border p-8 text-center space-y-2">
                <p className="text-base font-bold text-brand-dark">
                  No recipes matched all strict dietary or ingredient constraints.
                </p>
                <p className="text-xs text-gray-600">
                  Try adding more pantry staples, relaxing your dietary filter, or enabling &ldquo;Include recipes requiring extra core ingredients&rdquo;.
                </p>
              </div>
            )}

            {response?.results.map((item, idx) => (
              <article
                key={item.recipe.id}
                className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/50">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-dark text-brand-lime">
                        #{idx + 1} Match
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-lime text-brand-dark">
                        {item.recipe.cuisine} • {item.recipe.region}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                        {item.recipe.cookingTimeMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                        <Flame className="w-3.5 h-3.5 text-orange-600" />
                        {item.recipe.nutrition.calories} kcal ({item.recipe.nutrition.proteinG}g protein)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark">
                      {item.recipe.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.recipe.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-brand-border text-brand-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.recipe.tasteProfile.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0 bg-white px-4 py-3 rounded-2xl border border-brand-border">
                    <div>
                      <div className="text-2xl font-extrabold text-brand-primary leading-none">
                        {item.scoreBreakdown.totalScore}
                        <span className="text-xs font-semibold text-gray-500">
                          /100
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600 mt-1">
                        Core Fit: {item.ingredientMatch.fitDisplay} • Flavor:{" "}
                        {item.flavorCompatibility.flavorFitLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                      Transparent 100-Point Multi-Factor Score Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                      <ScorePill
                        label="Ingredients"
                        score={item.scoreBreakdown.ingredientCoverage}
                        max={30}
                      />
                      <ScorePill
                        label="FlavorDB"
                        score={item.scoreBreakdown.flavorCompatibility}
                        max={25}
                      />
                      <ScorePill
                        label="Cuisine Fit"
                        score={item.scoreBreakdown.cuisineFit}
                        max={15}
                      />
                      <ScorePill
                        label="Taste Fit"
                        score={item.scoreBreakdown.tasteFit}
                        max={10}
                      />
                      <ScorePill
                        label="Time Fit"
                        score={item.scoreBreakdown.timeFit}
                        max={10}
                      />
                      <ScorePill
                        label="Dietary Fit"
                        score={item.scoreBreakdown.dietaryFit}
                        max={10}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-surface rounded-xl p-4 border border-brand-border/80 space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Why This Recipe Fits Your Context
                      </h5>
                      <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                        <li>{item.explanations.ingredientFitText}</li>
                        <li>{item.explanations.preferenceFitText}</li>
                        <li>{item.explanations.timeFitText}</li>
                        <li>{item.explanations.dietaryFitText}</li>
                      </ul>
                    </div>

                    <div className="bg-brand-surface rounded-xl p-4 border border-brand-border/80 space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                        <Beaker className="w-3.5 h-3.5" />
                        FlavorDB Molecular Pairing Intelligence
                      </h5>
                      <ul className="text-xs text-gray-700 space-y-1.5">
                        {item.flavorCompatibility.supportingSignals.map(
                          (sig, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">
                              • {sig}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-brand-dark block mb-1">
                        Matched Core Ingredients ({item.ingredientMatch.matchedCoreIngredients.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ingredientMatch.matchedCoreIngredients.length > 0 ? (
                          item.ingredientMatch.matchedCoreIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-2.5 py-1 rounded-md bg-brand-lime/80 text-brand-dark font-semibold"
                            >
                              ✓ {ing}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-brand-dark block mb-1">
                        Missing Core Ingredients ({item.ingredientMatch.missingCoreIngredients.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ingredientMatch.missingCoreIngredients.length > 0 ? (
                          item.ingredientMatch.missingCoreIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-medium"
                            >
                              + {ing}
                            </span>
                          ))
                        ) : (
                          <span className="text-brand-primary font-semibold">
                            All core ingredients in your pantry!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h5 className="font-bold text-brand-dark mb-1.5">
                        Cooking Steps ({item.recipe.processes.join(" → ")})
                      </h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {item.recipe.instructions.map((step, stepIdx) => (
                          <li key={stepIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {item.recipe.adaptations.length > 0 && (
                      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                        <h5 className="font-bold text-amber-950">
                          Smart Ingredient Substitution (FlavorDB-Supported)
                        </h5>
                        {item.recipe.adaptations.map((adap, aIdx) => (
                          <div key={aIdx} className="text-amber-900 space-y-0.5">
                            <p className="font-semibold">
                              Swap {adap.targetIngredient} → {adap.substituteIngredient}
                            </p>
                            <p className="text-[11px]">{adap.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

function ScorePill({
  label,
  score,
  max,
}: {
  label: string;
  score: number;
  max: number;
}) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface/40 p-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-brand-dark">
        <span>{label}</span>
        <span className="text-brand-primary">
          {score}/{max}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5">
        <div
          className="h-full bg-brand-primary rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
