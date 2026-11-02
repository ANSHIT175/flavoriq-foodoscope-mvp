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
  ArrowLeft,
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

export default function AiRecipeGeneratorStudioPage() {
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
      : ["Tofu", "Capsicum", "Ginger", "Garlic"]
  );
  const [genCuisine, setGenCuisine] = useState<CuisineOption>(
    defaultCuisine === "Any" ? "Chinese" : defaultCuisine
  );
  const [genTaste, setGenTaste] = useState<TasteOption>(
    defaultTaste === "Any" ? "Spicy" : defaultTaste
  );
  const [genDiet, setGenDiet] = useState<DietaryOption>(
    defaultDiet === "No preference" ? "Vegan" : defaultDiet
  );
  const [genTime, setGenTime] = useState<CookingTimeOption>(
    defaultTime === "Any" ? "Under 15 min" : defaultTime
  );
  const [variationSeed, setVariationSeed] = useState<number>(0);
  const [generated, setGenerated] = useState<SynthesizedRecipe | null>(null);
  const [studioMode, setStudioMode] = useState<"input" | "result">("input");

  const toggleIng = (name: string) => {
    setSelectedIngs((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const synthesizeRecipe = async (seedOffset = 1) => {
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
        ? 25
        : genTime === "Under 45 min"
        ? 35
        : 28;

    const closest =
      rankedResults[activeSeed % Math.max(1, rankedResults.length)]?.recipe
        .id || "fiq-rec-08";

    const synth: SynthesizedRecipe = {
      title: `${genCuisine} ${style} ${primary}${secondary}`,
      cuisine: genCuisine,
      taste: genTaste,
      diet: genDiet,
      cookingTimeMinutes: timeNum,
      calories: 285 + ((baseIngs.length * 19 + activeSeed * 13) % 110),
      proteinG: 16 + ((baseIngs.length * 2 + activeSeed) % 9),
      flavorProfile: `${genTaste} • ${flavorInfo.flavorFitLabel} Molecular Harmony (${flavorInfo.score}/25 FlavorDB pts)`,
      whyItWorks:
        flavorInfo.supportingSignals.length > 0
          ? flavorInfo.supportingSignals
          : [
              `Combines ${baseIngs.join(", ")} using ${genCuisine} Maillard browning and aromatic lipid infusion.`,
            ],
      ingredients: [
        ...baseIngs.map((ing, idx) => ({
          name: ing,
          quantity:
            idx === 0
              ? "250 g, cubed"
              : idx === 1
              ? "1.5 cups, sliced"
              : "2 tbsp, minced / prepped",
        })),
        { name: "Cold-Pressed Sesame / Cooking Oil", quantity: "1 tbsp" },
        { name: "Sea Salt & Cracked Black Pepper", quantity: "to taste" },
      ],
      steps: [
        `Prep and cube your primary ingredients (${baseIngs.slice(0, 2).join(", ")}) to uniform size for rapid heat transfer.`,
        `Heat 1 tbsp oil in a heavy wok or skillet; bloom aromatics (${baseIngs.slice(2).join(", ") || "garlic and ginger"}) for 40 seconds until volatile terpenes release.`,
        `Sear ${baseIngs[0]} over high flame for 4–5 minutes to lock in moisture and build a golden Maillard crust.`,
        `Toss in remaining vegetables and glaze for ${Math.max(3, timeNum - 10)} minutes to balance the ${genTaste.toLowerCase()} ${genCuisine} flavor profile. Plate warm.`,
      ],
      closestRecipeId: closest,
    };

    setGenerated(synth);
    setStudioMode("result");
    showToast(
      "AI Culinary Blueprint Ready",
      `Synthesized "${synth.title}" with FlavorDB verification.`
    );
  };

  if (studioMode === "result" && generated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStudioMode("input")}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-primary hover:text-brand-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio Configurator
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-dark text-brand-lime">
            Studio Blueprint #0{variationSeed}
          </span>
        </div>

        {/* Dedicated Chef Blueprint Result Layout */}
        <section className="rounded-3xl bg-gradient-to-br from-brand-dark via-[#173A20] to-[#0F2916] text-white p-6 sm:p-10 shadow-xl space-y-8 border border-brand-primary/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/15 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-lime text-brand-dark">
                  ✨ AI Synthesized + FlavorDB Verified
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white">
                  {generated.cuisine} • {generated.diet}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {generated.title}
              </h1>
              <p className="text-xs sm:text-sm text-brand-lime font-semibold">
                {generated.flavorProfile}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0">
              <div className="px-2">
                <Clock className="w-4 h-4 text-brand-lime mx-auto mb-1" />
                <span className="text-base font-extrabold block">
                  {generated.cookingTimeMinutes}m
                </span>
                <span className="text-[10px] text-white/70">Time</span>
              </div>
              <div className="px-2 border-x border-white/15">
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                <span className="text-base font-extrabold block">
                  {generated.calories}
                </span>
                <span className="text-[10px] text-white/70">kcal</span>
              </div>
              <div className="px-2">
                <ChefHat className="w-4 h-4 text-brand-lime mx-auto mb-1" />
                <span className="text-base font-extrabold block">
                  {generated.proteinG}g
                </span>
                <span className="text-[10px] text-white/70">Protein</span>
              </div>
            </div>
          </div>

          {/* Why It Works */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-lime flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              Why It Works — Molecular Aroma Synergy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/90">
              {generated.whyItWorks.map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-black/25 border border-white/10 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white text-brand-dark rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-primary">
                Measured Studio Ingredients
              </h3>
              <ul className="divide-y divide-brand-border text-xs">
                {generated.ingredients.map((ing, i) => (
                  <li key={i} className="py-2.5 flex justify-between gap-2">
                    <span className="font-bold">{ing.name}</span>
                    <span className="text-gray-600">{ing.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 bg-white text-brand-dark rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-primary">
                Chef Execution Timeline
              </h3>
              <ol className="space-y-3">
                {generated.steps.map((st, i) => (
                  <li
                    key={i}
                    className="p-3.5 rounded-xl bg-brand-surface border border-brand-border flex items-start gap-3 text-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-brand-dark text-brand-lime font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-gray-800">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 4 Required Studio Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleSaveRecipe(generated.closestRecipeId);
                  router.push("/saved");
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-dark hover:bg-brand-lime font-extrabold text-xs transition"
              >
                <Heart className="w-4 h-4 text-red-500" />
                Save
              </button>

              <button
                type="button"
                onClick={() => synthesizeRecipe(1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-extrabold text-xs transition"
              >
                <RefreshCw className="w-4 h-4 text-brand-lime" />
                Regenerate
              </button>

              <button
                type="button"
                onClick={() => {
                  generated.ingredients.forEach((ing) =>
                    addSingleGroceryItem(ing.name, ing.quantity, generated.title)
                  );
                  router.push("/grocery");
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-brand-dark font-extrabold text-xs transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Ingredients
              </button>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/recipes/${generated.closestRecipeId}`)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-lime hover:bg-white text-brand-dark font-extrabold text-xs shadow-lg transition"
            >
              <ChefHat className="w-4 h-4 text-brand-primary" />
              Cook This →
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Studio Input Canvas */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-dark via-[#173A20] to-brand-primary text-white p-8 sm:p-10 text-center space-y-3 shadow-xl">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
          <Sparkles className="w-3.5 h-3.5" />
          FLAVORIQ Creative Cooking Studio
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          What do you want to cook?
        </h1>
        <p className="text-xs sm:text-sm text-brand-lime/90 max-w-xl mx-auto">
          Select your ingredients and sensory mood below, then click Generate Recipe to craft a custom dish backed by FlavorDB volatile compound bridges.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-md space-y-6">
        {/* Step 1: Ingredient Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-dark">
              1. Select Studio Ingredients ({selectedIngs.length} chosen)
            </h2>
            <button
              type="button"
              onClick={() =>
                setSelectedIngs(["Tofu", "Capsicum", "Ginger", "Garlic"])
              }
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              Load Wok Favorites
            </button>
          </div>

          <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                    active
                      ? "bg-brand-dark text-brand-lime border-brand-dark shadow-xs"
                      : "bg-white text-brand-dark border-brand-border hover:bg-brand-lime/40"
                  }`}
                >
                  {active ? `✓ ${cleanName}` : `+ ${cleanName}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Cuisine & Taste Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-brand-border">
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-dark">
              2. Cuisine Selector
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Indian",
                  "Chinese",
                  "Italian",
                  "Mexican",
                  "Thai",
                  "Japanese",
                  "Mediterranean",
                ] as CuisineOption[]
              ).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setGenCuisine(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    genCuisine === c
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-brand-surface/50 text-brand-dark border-brand-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-dark">
              3. Taste Selector
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Spicy",
                  "Savory",
                  "Tangy",
                  "Sweet",
                  "Mild",
                  "Balanced",
                ] as TasteOption[]
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setGenTaste(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    genTaste === t
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-brand-surface/50 text-brand-dark border-brand-border"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Diet & Time Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-brand-border">
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-dark">
              4. Diet Selector
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Vegetarian",
                  "Vegan",
                  "High-protein",
                  "Low-oil",
                  "Gluten-free",
                  "Dairy-free",
                ] as DietaryOption[]
              ).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setGenDiet(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    genDiet === d
                      ? "bg-brand-dark text-brand-lime border-brand-dark"
                      : "bg-brand-surface/50 text-brand-dark border-brand-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-dark">
              5. Time Selector
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Under 15 min",
                  "Under 30 min",
                  "Under 45 min",
                  "Under 60 min",
                ] as CookingTimeOption[]
              ).map((tm) => (
                <button
                  key={tm}
                  type="button"
                  onClick={() => setGenTime(tm)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    genTime === tm
                      ? "bg-brand-dark text-brand-lime border-brand-dark"
                      : "bg-brand-surface/50 text-brand-dark border-brand-border"
                  }`}
                >
                  {tm}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Huge Generate Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => synthesizeRecipe(1)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-dark via-brand-primary to-emerald-600 hover:opacity-95 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-brand-lime" />
            ✨ GENERATE RECIPE
          </button>
        </div>
      </section>
    </div>
  );
}
