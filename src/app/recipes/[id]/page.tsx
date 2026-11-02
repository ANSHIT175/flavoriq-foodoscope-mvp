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
  Award,
} from "lucide-react";
import { useFlavorIq } from "../../../context/FlavorIqContext";
import ScoreBreakdown, { ScoreRing } from "../../../components/ScoreBreakdown";
import IngredientChip from "../../../components/IngredientChip";
import { SMART_SUBSTITUTIONS_CATALOG } from "../../../lib/foodoscope/mockCatalog";

export default function FullRecipeDetailPage() {
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
    addIngredient,
    setSelectedNutritionRecipeId,
    setSelectedSubstitutionIngredient,
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

  const {
    recipe,
    scoreBreakdown,
    ingredientMatch,
    flavorCompatibility,
    explanations,
  } = evaluated;
  const saved = isRecipeSaved(recipe.id);
  const compared = isRecipeCompared(recipe.id);

  const substitutions =
    recipe.adaptations.length > 0
      ? recipe.adaptations
      : SMART_SUBSTITUTIONS_CATALOG.paneer;

  const relatedRecipes = rankedResults
    .filter((r) => r.recipe.id !== recipe.id)
    .slice(0, 3);

  const handleOpenSubstitute = () => {
    const firstTarget =
      recipe.adaptations[0]?.targetIngredient?.toLowerCase() ||
      recipe.ingredients[0]?.canonicalName ||
      "paneer";
    setSelectedSubstitutionIngredient(firstTarget);
    router.push(`/substitutions/${recipe.id}`);
  };

  const handleOpenNutrition = () => {
    setSelectedNutritionRecipeId(recipe.id);
    router.push(`/nutrition/${recipe.id}`);
  };

  const handleCompare = () => {
    if (!compared) toggleCompareRecipe(recipe.id);
    router.push("/compare");
  };

  const handleGrocery = () => {
    addMissingIngredientsToGrocery(recipe);
    router.push("/grocery");
  };

  const handleMealPlan = () => {
    quickAddToMealPlan(recipe.id);
    router.push("/meal-planner");
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-dark transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe Finder
        </Link>
        <span className="text-xs font-mono text-gray-500">
          RecipeDB ID: {recipe.recipeDbId}
        </span>
      </div>

      {/* 1. IMMERSIVE HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg border border-brand-border bg-brand-dark text-white min-h-[340px] flex items-end">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />

        <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/cuisines/${recipe.cuisine.toLowerCase()}`}
                className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-lime text-brand-dark"
              >
                {recipe.cuisine} • {recipe.region}
              </Link>
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {recipe.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-brand-lime font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {recipe.cookingTimeMinutes} Minutes
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                {recipe.nutrition.calories} kcal
              </span>
              <span>•</span>
              <span>{recipe.nutrition.proteinG}g Protein</span>
              <span>•</span>
              <span>Taste: {recipe.tasteProfile.join(", ")}</span>
            </div>
          </div>

          <div className="bg-white text-brand-dark rounded-2xl p-4 shadow-xl flex items-center gap-4 self-start lg:self-end shrink-0">
            <ScoreRing score={scoreBreakdown.totalScore} size={68} />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary block">
                Personalized Score
              </span>
              <span className="text-lg font-extrabold text-brand-dark block">
                {scoreBreakdown.totalScore} / 100
              </span>
              <span className="text-xs text-gray-500">
                Core Fit {ingredientMatch.fitDisplay} • FlavorDB {flavorCompatibility.flavorFitLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY THIS RECIPE FITS YOU */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-extrabold text-brand-dark uppercase tracking-wide">
            Why This Recipe Fits You
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
            <span className="font-extrabold text-brand-primary uppercase">
              1. Pantry Utilization
            </span>
            <p className="text-gray-700 leading-relaxed">
              {explanations.ingredientFitText}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
            <span className="font-extrabold text-brand-primary uppercase">
              2. Culinary &amp; Taste Fit
            </span>
            <p className="text-gray-700 leading-relaxed">
              {explanations.preferenceFitText}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
            <span className="font-extrabold text-brand-primary uppercase">
              3. Time &amp; Dietary Alignment
            </span>
            <p className="text-gray-700 leading-relaxed">
              {explanations.timeFitText} {explanations.dietaryFitText}
            </p>
          </div>
        </div>
      </section>

      {/* 3. LARGE 100-POINT MATCH ANALYSIS */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-extrabold text-brand-dark uppercase tracking-wide">
              100-Point Match Analysis
            </h2>
          </div>
          <span className="text-xs font-bold text-brand-primary">
            Hover any metric bar for algorithmic formula details
          </span>
        </div>
        <ScoreBreakdown breakdown={scoreBreakdown} />
      </section>

      {/* 4. FLAVORDB MOLECULAR INTELLIGENCE */}
      <section className="bg-gradient-to-br from-brand-dark to-[#1E4627] text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-brand-lime" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide">
              FlavorDB Molecular Intelligence ({scoreBreakdown.flavorCompatibility}/25 pts)
            </h2>
          </div>
          <Link
            href="/flavor-intelligence"
            className="px-3.5 py-1.5 rounded-xl bg-brand-lime text-brand-dark text-xs font-extrabold hover:bg-white transition"
          >
            Open Interactive Flavor Network →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flavorCompatibility.supportingSignals.map((sig, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs leading-relaxed text-brand-lime/95"
            >
              <Sparkles className="w-4 h-4 text-brand-lime inline mr-1.5 -mt-0.5" />
              {sig}
            </div>
          ))}
        </div>
      </section>

      {/* 5. INGREDIENTS & COOKING STEPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-primary" />
            Ingredients ({recipe.ingredients.length})
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 block mb-1.5">
                In Your Pantry ({ingredientMatch.matchedCoreIngredients.length} Core):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ingredientMatch.matchedCoreIngredients.map((ing) => (
                  <IngredientChip key={ing} name={ing} variant="matched" />
                ))}
              </div>
            </div>

            {ingredientMatch.missingCoreIngredients.length > 0 && (
              <div>
                <span className="text-xs font-bold text-amber-800 block mb-1.5">
                  Missing Core (Click to add to pantry):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ingredientMatch.missingCoreIngredients.map((ing) => (
                    <IngredientChip
                      key={ing}
                      name={ing}
                      variant="missing"
                      onClick={() => addIngredient(ing)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <ul className="divide-y divide-brand-border/60 text-xs pt-2 border-t border-brand-border">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.name}
                className="py-2.5 flex items-center justify-between gap-2"
              >
                <span className="font-bold text-brand-dark">
                  {ing.name}
                  {ing.isCore && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-brand-lime text-brand-dark">
                      Core
                    </span>
                  )}
                </span>
                <span className="text-gray-600 font-medium">{ing.quantity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-extrabold text-brand-dark">
              Cooking Steps
            </h2>
            <span className="text-xs font-bold text-brand-primary bg-brand-surface px-3 py-1 rounded-full border border-brand-border">
              Processes: {recipe.processes.join(" → ")}
            </span>
          </div>

          <ol className="space-y-3.5">
            {recipe.instructions.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-surface/50 border border-brand-border"
              >
                <span className="w-7 h-7 rounded-xl bg-brand-dark text-brand-lime text-xs font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-brand-dark leading-relaxed pt-0.5">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* 6. NUTRITION & SMART SUBSTITUTIONS GATEWAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Macro Profile
            </span>
            <h2 className="text-lg font-extrabold text-brand-dark">
              Nutrition Breakdown
            </h2>
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-brand-surface">
                <strong className="text-sm text-brand-dark block">
                  {recipe.nutrition.calories}
                </strong>
                kcal
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
                <strong className="text-sm block">{recipe.nutrition.proteinG}g</strong>
                Protein
              </div>
              <div className="p-3 rounded-xl bg-brand-surface">
                <strong className="text-sm text-brand-dark block">
                  {recipe.nutrition.carbsG}g
                </strong>
                Carbs
              </div>
              <div className="p-3 rounded-xl bg-brand-surface">
                <strong className="text-sm text-brand-dark block">
                  {recipe.nutrition.fatG}g
                </strong>
                Fat
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenNutrition}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
          >
            Open Full Nutrition Analytics Dashboard →
          </button>
        </section>

        <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              FlavorDB Adaptations
            </span>
            <h2 className="text-lg font-extrabold text-brand-dark">
              Smart Ingredient Substitutions
            </h2>
            <div className="space-y-2 pt-1">
              {substitutions.slice(0, 2).map((sub, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-brand-surface/60 border border-brand-border text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-brand-dark">
                      {sub.targetIngredient} → {sub.substituteIngredient}
                    </span>
                    <p className="text-[11px] text-gray-600 line-clamp-1">
                      {sub.reasoning}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-extrabold bg-brand-lime text-brand-dark shrink-0">
                    {sub.compatibilityScore || 92}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSubstitute}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-dark hover:bg-brand-primary text-brand-lime text-xs font-bold transition"
          >
            Open 3-Column Substitution Workspace →
          </button>
        </section>
      </div>

      {/* 7. RELATED RECIPES */}
      {relatedRecipes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-brand-dark">
            Related Recipes
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
                  <p className="text-[11px] text-gray-500">
                    {rel.recipe.cuisine} • {rel.recipe.cookingTimeMinutes}m
                  </p>
                  <span className="text-[11px] font-extrabold text-brand-primary">
                    {rel.scoreBreakdown.totalScore}/100 Match
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. STICKY FLOATING ACTION BAR */}
      <div className="fixed bottom-14 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-brand-dark/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-brand-lime/30 flex flex-wrap items-center justify-center gap-2 max-w-[95vw]">
        <button
          type="button"
          onClick={() => toggleSaveRecipe(recipe.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            saved
              ? "bg-red-500 text-white"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          ❤️ {saved ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={handleCompare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition"
        >
          <BarChart2 className="w-3.5 h-3.5 text-brand-lime" />
          📊 Compare
        </button>

        <button
          type="button"
          onClick={handleOpenSubstitute}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-lime" />
          🔄 Substitute
        </button>

        <button
          type="button"
          onClick={handleOpenNutrition}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition"
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          🥗 Nutrition
        </button>

        <button
          type="button"
          onClick={handleGrocery}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-brand-lime" />
          🛒 Grocery
        </button>

        <button
          type="button"
          onClick={handleMealPlan}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-brand-lime text-brand-dark hover:bg-white transition"
        >
          <Calendar className="w-3.5 h-3.5" />
          📅 Meal Plan
        </button>
      </div>
    </div>
  );
}
