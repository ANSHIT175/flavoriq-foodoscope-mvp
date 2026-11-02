"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Flame,
  Heart,
  RefreshCw,
  BarChart2,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  Beaker,
  Utensils,
  Sparkles,
} from "lucide-react";
import { useFlavorIq } from "../../../context/FlavorIqContext";
import ScoreBreakdown, { ScoreRing } from "../../../components/ScoreBreakdown";
import IngredientChip from "../../../components/IngredientChip";
import NutritionCard from "../../../components/NutritionCard";
import SubstitutionCard from "../../../components/SubstitutionCard";
import { SMART_SUBSTITUTIONS_CATALOG } from "../../../lib/foodoscope/mockCatalog";

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "fiq-rec-01");

  const {
    getRankedOrEvaluatedRecipe,
    rankedResults,
    isRecipeSaved,
    toggleSaveRecipe,
    isRecipeCompared,
    toggleCompareRecipe,
    addMissingIngredientsToGrocery,
    quickAddToMealPlan,
    applySubstituteToPantry,
    addIngredient,
    showToast,
    setSelectedNutritionRecipeId,
  } = useFlavorIq();

  const evaluated = getRankedOrEvaluatedRecipe(id);

  if (!evaluated) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border p-10 text-center space-y-4">
        <h1 className="text-xl font-bold text-brand-dark">Recipe not found</h1>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recipe Finder
        </Link>
      </div>
    );
  }

  const { recipe, scoreBreakdown, ingredientMatch, flavorCompatibility, explanations } =
    evaluated;
  const saved = isRecipeSaved(recipe.id);
  const compared = isRecipeCompared(recipe.id);

  const substitutions =
    recipe.adaptations.length > 0
      ? recipe.adaptations
      : SMART_SUBSTITUTIONS_CATALOG.paneer;

  const relatedRecipes = rankedResults
    .filter((r) => r.recipe.id !== recipe.id)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-dark transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ranked Recommendations
        </Link>
        <span className="text-xs font-mono text-gray-500">
          RecipeDB ID: {recipe.recipeDbId}
        </span>
      </div>

      {/* Hero Recipe Card */}
      <section className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative min-h-[280px]">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover min-h-[280px]"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-dark text-brand-lime shadow">
                {recipe.cuisine} • {recipe.region}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                  {recipe.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    {recipe.cookingTimeMinutes} min
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-600" />
                    {recipe.nutrition.calories} kcal
                  </span>
                  <span>•</span>
                  <span className="text-emerald-800 font-bold">
                    {recipe.nutrition.proteinG}g Protein
                  </span>
                  <span>•</span>
                  <span>{recipe.nutrition.fiberG || 6}g Fiber</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recipe.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tasteProfile.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-brand-surface px-4 py-3 rounded-2xl border border-brand-border shrink-0 self-start">
                <ScoreRing score={scoreBreakdown.totalScore} size={68} />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary block">
                    Match Score
                  </span>
                  <span className="text-sm font-extrabold text-brand-dark block">
                    Core Fit: {ingredientMatch.fitDisplay}
                  </span>
                  <span className="text-xs text-gray-600">
                    FlavorDB: {flavorCompatibility.flavorFitLabel}
                  </span>
                </div>
              </div>
            </div>

            <ScoreBreakdown breakdown={scoreBreakdown} />

            {/* 6 Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-border">
              <button
                type="button"
                onClick={() => toggleSaveRecipe(recipe.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                  saved
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border-brand-border"
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Saved Recipe" : "Save Recipe"}
              </button>

              <a
                href="#substitutions-section"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
              >
                <RefreshCw className="w-4 h-4 text-brand-primary" />
                Find Substitutions
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedNutritionRecipeId(recipe.id);
                  router.push("/nutrition");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
              >
                <Flame className="w-4 h-4 text-orange-600" />
                Analyze Nutrition
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleCompareRecipe(recipe.id);
                  router.push("/compare");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
              >
                <BarChart2 className="w-4 h-4 text-brand-primary" />
                {compared ? "View in Compare" : "Compare Recipe"}
              </button>

              <button
                type="button"
                onClick={() => addMissingIngredientsToGrocery(recipe)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Ingredients to Grocery List
              </button>

              <button
                type="button"
                onClick={() => quickAddToMealPlan(recipe.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-dark text-white transition"
              >
                <Calendar className="w-4 h-4" />
                Add to Meal Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Recipe Fits You + FlavorDB Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-primary" />
            Why This Recipe Fits You
          </h2>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="p-3 rounded-xl bg-brand-surface/50 border border-brand-border/60">
              <strong className="text-brand-dark block">Pantry Coverage:</strong>
              {explanations.ingredientFitText}
            </li>
            <li className="p-3 rounded-xl bg-brand-surface/50 border border-brand-border/60">
              <strong className="text-brand-dark block">Culinary &amp; Sensory Fit:</strong>
              {explanations.preferenceFitText}
            </li>
            <li className="p-3 rounded-xl bg-brand-surface/50 border border-brand-border/60">
              <strong className="text-brand-dark block">Time &amp; Dietary Alignment:</strong>
              {explanations.timeFitText} {explanations.dietaryFitText}
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
              <Beaker className="w-5 h-5 text-brand-primary" />
              FlavorDB Molecular Pairing Intelligence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-lime text-brand-dark">
              {flavorCompatibility.flavorFitLabel} Synergy
            </span>
          </div>
          <div className="space-y-2.5 text-xs text-gray-700">
            {flavorCompatibility.supportingSignals.map((sig, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-brand-surface border border-brand-border leading-relaxed"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-primary inline mr-1.5 -mt-0.5" />
                {sig}
              </div>
            ))}
          </div>
          <Link
            href="/flavor-intelligence"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline pt-1"
          >
            Open Interactive Flavor Pairing Network →
          </Link>
        </section>
      </div>

      {/* Matched vs Missing Ingredients + Full Ingredients & Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-primary" />
            Ingredients &amp; Pantry Match
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 block mb-1.5">
                Matched Core Ingredients ({ingredientMatch.matchedCoreIngredients.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ingredientMatch.matchedCoreIngredients.length > 0 ? (
                  ingredientMatch.matchedCoreIngredients.map((ing) => (
                    <IngredientChip key={ing} name={ing} variant="matched" />
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">None in pantry</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-800 block mb-1.5">
                Missing Core Ingredients ({ingredientMatch.missingCoreIngredients.length} — click to add to pantry):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ingredientMatch.missingCoreIngredients.length > 0 ? (
                  ingredientMatch.missingCoreIngredients.map((ing) => (
                    <IngredientChip
                      key={ing}
                      name={ing}
                      variant="missing"
                      onClick={() => addIngredient(ing)}
                    />
                  ))
                ) : (
                  <span className="text-xs font-semibold text-emerald-700">
                    You have all core ingredients!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
              Complete Measured Ingredient List
            </span>
            <ul className="divide-y divide-brand-border/50 text-xs">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-brand-dark">
                    {ing.name}{" "}
                    {ing.isCore && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-lime/70 text-brand-dark ml-1">
                        Core
                      </span>
                    )}
                  </span>
                  <span className="text-gray-600">{ing.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cooking Steps */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-extrabold text-brand-dark">
              Step-by-Step Cooking Instructions
            </h2>
            <span className="text-xs font-semibold text-brand-primary bg-brand-surface px-3 py-1 rounded-full border border-brand-border">
              Processes: {recipe.processes.join(" → ")}
            </span>
          </div>

          <ol className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-brand-surface/50 border border-brand-border/80"
              >
                <span className="w-6 h-6 rounded-full bg-brand-dark text-brand-lime text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-brand-dark leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="font-bold text-brand-dark">Utensils Needed:</span>
            {recipe.utensils.map((u) => (
              <span
                key={u}
                className="px-2.5 py-0.5 rounded-md bg-white border border-brand-border capitalize"
              >
                {u}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Nutrition Section */}
      <section>
        <NutritionCard
          recipe={recipe}
          onOptimizeToast={(msg) => showToast("Nutrition Updated", msg)}
        />
      </section>

      {/* Smart Substitutions Section */}
      <section id="substitutions-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark">
              Smart Ingredient Substitutions (FlavorDB-Supported)
            </h2>
            <p className="text-xs text-gray-600">
              Swap missing or restricted ingredients using shared aroma volatile compounds
            </p>
          </div>
          <Link
            href="/substitutions"
            className="text-xs font-bold text-brand-primary hover:underline"
          >
            Open Full Substitution Lab →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {substitutions.map((sub, i) => (
            <SubstitutionCard
              key={i}
              sub={sub}
              onUseSubstitute={(target, substitute) =>
                applySubstituteToPantry(target, substitute)
              }
            />
          ))}
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-brand-dark">
            Related Personalized Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedRecipes.map((rel) => (
              <Link
                key={rel.recipe.id}
                href={`/recipes/${rel.recipe.id}`}
                className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs hover:shadow-md transition flex items-center gap-3.5"
              >
                <img
                  src={rel.recipe.image}
                  alt={rel.recipe.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-brand-dark truncate">
                    {rel.recipe.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {rel.recipe.cuisine} • {rel.recipe.cookingTimeMinutes} min
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-extrabold text-brand-primary">
                    Match Score: {rel.scoreBreakdown.totalScore}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
