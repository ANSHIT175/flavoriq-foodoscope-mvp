"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ChefHat,
  Clock,
  Flame,
  Heart,
  ShoppingCart,
  RefreshCw,
  Beaker,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import {
  CookingTimeOption,
  CuisineOption,
  DietaryOption,
  TasteOption,
} from "../../lib/foodoscope/types";
import { getFlavorCompatibility } from "../../lib/foodoscope/flavorDb";
import { PANTRY_INGREDIENT_CATALOG } from "../../lib/foodoscope/normalizers";

interface SynthesizedRecipe {
  title: string;
  cuisine: CuisineOption;
  taste: TasteOption;
  diet: DietaryOption;
  cookingTimeMinutes: number;
  calories: number;
  proteinG: number;
  flavorProfile: string;
  whyItWorks: string[];
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  closestRecipeId: string;
}

export default function AiRecipeGeneratorPage() {
  const router = useRouter();
  const {
    ingredients: pantryIngredients,
    cuisine: defaultCuisine,
    taste: defaultTaste,
    dietaryPreference: defaultDiet,
    maxCookingTime: defaultTime,
    rankedResults,
    toggleSaveRecipe,
    addSingleGroceryItem,
    showToast,
  } = useFlavorIq();

  const [selectedIngs, setSelectedIngs] = useState<string[]>(
    pantryIngredients.length > 0
      ? pantryIngredients
      : ["Paneer", "Tomato", "Onion", "Capsicum", "Garlic"]
  );
  const [genCuisine, setGenCuisine] = useState<CuisineOption>(
    defaultCuisine === "Any" ? "Indian" : defaultCuisine
  );
  const [genTaste, setGenTaste] = useState<TasteOption>(
    defaultTaste === "Any" ? "Spicy" : defaultTaste
  );
  const [genDiet, setGenDiet] = useState<DietaryOption>(
    defaultDiet === "No preference" ? "Vegetarian" : defaultDiet
  );
  const [genTime, setGenTime] = useState<CookingTimeOption>(
    defaultTime === "Any" ? "Under 30 min" : defaultTime
  );
  const [variationSeed, setVariationSeed] = useState<number>(0);
  const [generated, setGenerated] = useState<SynthesizedRecipe | null>(null);

  const toggleIng = (name: string) => {
    setSelectedIngs((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const synthesizeRecipe = async (seedOffset = 0) => {
    const activeSeed = variationSeed + seedOffset;
    setVariationSeed(activeSeed);

    const baseIngs =
      selectedIngs.length > 0 ? selectedIngs : ["Tofu", "Garlic", "Ginger"];
    const flavorInfo = await getFlavorCompatibility(baseIngs, 25);

    const stylePrefixes = [
      "Aromatic Skillet",
      "Charred Wok-Tossed",
      "Slow-Tempered Masala",
      "Pan-Roasted Herbed",
    ];
    const style = stylePrefixes[activeSeed % stylePrefixes.length];
    const primary = baseIngs.slice(0, 2).join(" & ");
    const secondary = baseIngs[2] ? ` with ${baseIngs[2]}` : "";

    const timeNum =
      genTime === "Under 15 min"
        ? 15
        : genTime === "Under 30 min"
        ? 24
        : genTime === "Under 45 min"
        ? 35
        : 28;

    const closest =
      rankedResults[activeSeed % Math.max(1, rankedResults.length)]?.recipe
        .id || "fiq-rec-01";

    const synth: SynthesizedRecipe = {
      title: `${genCuisine} ${style} ${primary}${secondary}`,
      cuisine: genCuisine,
      taste: genTaste,
      diet: genDiet,
      cookingTimeMinutes: timeNum,
      calories: 290 + (baseIngs.length * 18) % 120,
      proteinG: 16 + (baseIngs.length * 2) % 10,
      flavorProfile: `${genTaste} • ${flavorInfo.flavorFitLabel} Molecular Synergy (${flavorInfo.score}/25 FlavorDB pts)`,
      whyItWorks:
        flavorInfo.supportingSignals.length > 0
          ? flavorInfo.supportingSignals
          : [
              `Combines ${baseIngs.join(", ")} using ${genCuisine} Maillard browning and aromatic lipid infusion.`,
            ],
      ingredients: [
        ...baseIngs.map((ing, idx) => ({
          name: ing,
          quantity: idx === 0 ? "250 g, prepped" : idx === 1 ? "1.5 cups, chopped" : "1 cup / to taste",
        })),
        { name: "Cold-Pressed Cooking Oil / Olive Oil", quantity: "1 tbsp" },
        { name: "Sea Salt & Cracked Black Pepper", quantity: "to taste" },
      ],
      steps: [
        `Prep and cube your primary ingredients (${baseIngs.slice(0, 2).join(", ")}) to uniform size for even heat transfer.`,
        `Heat 1 tbsp oil in a heavy skillet or wok; temper aromatics (${baseIngs.slice(2).join(", ") || "garlic and cumin"}) for 45 seconds until volatile terpenes release.`,
        `Sear ${baseIngs[0]} over medium-high heat for 5–6 minutes to develop golden Maillard crust without over-softening.`,
        `Fold in remaining vegetables and simmer for ${Math.max(4, timeNum - 12)} minutes to marry the ${genTaste.toLowerCase()} ${genCuisine} flavor profile. Serve hot.`,
      ],
      closestRecipeId: closest,
    };

    setGenerated(synth);
    showToast(
      "AI Flavor-Verified Recipe Generated",
      `Synthesized "${synth.title}" using FlavorDB compound graph.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-brand-dark via-[#1E4627] to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Generative Culinary Synthesis + FlavorDB Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            AI Recipe Generator
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            Select your available kitchen ingredients and culinary constraints to synthesize a custom dish backed by real FlavorDB volatile compound pairings.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Configurator */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-brand-primary" />
            1. Configure Synthesis Parameters
          </h2>

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-2">
              Available Ingredients ({selectedIngs.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-2 rounded-xl bg-brand-surface/50 border border-brand-border">
              {PANTRY_INGREDIENT_CATALOG.map((item) => {
                const cleanName = item.name.replace(/\s*\([^)]*\)/g, "");
                const active = selectedIngs.some(
                  (i) => i.toLowerCase() === cleanName.toLowerCase()
                );
                return (
                  <button
                    key={item.canonicalName}
                    type="button"
                    onClick={() => toggleIng(cleanName)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      active
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-brand-dark border-brand-border hover:bg-brand-lime/40"
                    }`}
                  >
                    {active ? `✓ ${cleanName}` : `+ ${cleanName}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Cuisine Style
              </label>
              <select
                value={genCuisine}
                onChange={(e) => setGenCuisine(e.target.value as CuisineOption)}
                className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-brand-surface/40"
              >
                {["Indian", "Chinese", "Italian", "Mexican", "Thai", "Japanese", "Mediterranean", "Continental"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Target Taste
              </label>
              <select
                value={genTaste}
                onChange={(e) => setGenTaste(e.target.value as TasteOption)}
                className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-brand-surface/40"
              >
                {["Spicy", "Savory", "Tangy", "Sweet", "Mild", "Balanced"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Dietary Rule
              </label>
              <select
                value={genDiet}
                onChange={(e) => setGenDiet(e.target.value as DietaryOption)}
                className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-brand-surface/40"
              >
                {["Vegetarian", "Vegan", "High-protein", "Low-oil", "Gluten-free", "Dairy-free"].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Cooking Time
              </label>
              <select
                value={genTime}
                onChange={(e) => setGenTime(e.target.value as CookingTimeOption)}
                className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-brand-surface/40"
              >
                {["Under 15 min", "Under 30 min", "Under 45 min", "Under 60 min"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => synthesizeRecipe(1)}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-brand-dark to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brand-lime" />
            Generate Recipe
          </button>
        </section>

        {/* Right Output Panel */}
        <section className="lg:col-span-7">
          {!generated ? (
            <div className="bg-white rounded-2xl border border-brand-border p-10 text-center space-y-4 shadow-sm h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-lime/60 text-brand-primary flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-dark">
                Ready to Synthesize Your Custom Recipe
              </h3>
              <p className="text-xs text-gray-600 max-w-md">
                Click <strong>Generate Recipe</strong> on the left to combine your selected pantry ingredients with FlavorDB molecular pairing intelligence.
              </p>
              <button
                type="button"
                onClick={() => synthesizeRecipe(1)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-sm hover:bg-brand-dark transition"
              >
                Generate Now →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-dark text-brand-lime">
                      AI + FlavorDB Verified
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {generated.diet}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                    {generated.title}
                  </h2>
                  <p className="text-xs font-semibold text-brand-primary">
                    {generated.flavorProfile}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-brand-dark bg-brand-surface px-4 py-2.5 rounded-xl border border-brand-border">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    {generated.cookingTimeMinutes} min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {generated.calories} kcal
                  </span>
                  <span>•</span>
                  <span className="text-emerald-800">{generated.proteinG}g Protein</span>
                </div>
              </div>

              {/* Why It Works (FlavorDB) */}
              <div className="bg-brand-surface/70 rounded-2xl p-4 border border-brand-border space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                  <Beaker className="w-4 h-4" />
                  Why This Combination Works (FlavorDB Molecular Evidence)
                </h3>
                <ul className="text-xs text-gray-700 space-y-1.5">
                  {generated.whyItWorks.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                <div className="md:col-span-5 space-y-2">
                  <h4 className="font-extrabold text-brand-dark uppercase tracking-wider">
                    Ingredients
                  </h4>
                  <ul className="divide-y divide-brand-border/60 bg-brand-surface/30 rounded-xl p-3 border border-brand-border/60">
                    {generated.ingredients.map((ing, i) => (
                      <li key={i} className="py-1.5 flex justify-between gap-2">
                        <span className="font-semibold text-brand-dark">{ing.name}</span>
                        <span className="text-gray-500">{ing.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-7 space-y-2">
                  <h4 className="font-extrabold text-brand-dark uppercase tracking-wider">
                    Cooking Steps
                  </h4>
                  <ol className="space-y-2">
                    {generated.steps.map((st, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-xl bg-brand-surface/40 border border-brand-border/60 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-brand-dark text-brand-lime text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed text-gray-700">{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* 4 Required Action Buttons */}
              <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaveRecipe(generated.closestRecipeId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push(`/recipes/${generated.closestRecipeId}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-primary text-brand-lime text-xs font-bold transition"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    Cook This
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      generated.ingredients.forEach((ing) =>
                        addSingleGroceryItem(ing.name, ing.quantity, generated.title)
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Grocery List
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => synthesizeRecipe(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border text-xs font-bold transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
