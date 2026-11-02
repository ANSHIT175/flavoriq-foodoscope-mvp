"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Flame,
  Heart,
  BarChart2,
  RefreshCw,
  Calendar,
  Beaker,
  Eye,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { RankedRecipeResult } from "../lib/recommendation/scoring";
import { useFlavorIq } from "../context/FlavorIqContext";
import ScoreBreakdown, { ScoreRing } from "./ScoreBreakdown";
import IngredientChip from "./IngredientChip";

export default function RecipeCard({
  item,
  rank,
}: {
  item: RankedRecipeResult;
  rank?: number;
}) {
  const router = useRouter();
  const {
    isRecipeSaved,
    toggleSaveRecipe,
    isRecipeCompared,
    toggleCompareRecipe,
    quickAddToMealPlan,
    addMissingIngredientsToGrocery,
    setSelectedNutritionRecipeId,
    setSelectedSubstitutionIngredient,
    addIngredient,
  } = useFlavorIq();

  const {
    recipe,
    scoreBreakdown,
    ingredientMatch,
    flavorCompatibility,
    explanations,
  } = item;
  const saved = isRecipeSaved(recipe.id);
  const compared = isRecipeCompared(recipe.id);

  const handleCompare = () => {
    if (!compared) {
      toggleCompareRecipe(recipe.id);
    }
    router.push("/compare");
  };

  const handleNutrition = () => {
    setSelectedNutritionRecipeId(recipe.id);
    router.push(`/nutrition/${recipe.id}`);
  };

  const handleSubstitute = () => {
    const firstTarget =
      recipe.adaptations[0]?.targetIngredient?.toLowerCase() ||
      recipe.ingredients[0]?.canonicalName ||
      "paneer";
    setSelectedSubstitutionIngredient(firstTarget);
    router.push(`/substitutions/${recipe.id}`);
  };

  const handleAddToGrocery = () => {
    addMissingIngredientsToGrocery(recipe);
    router.push("/grocery");
  };

  const handleAddToMealPlan = () => {
    quickAddToMealPlan(recipe.id);
    router.push("/meal-planner");
  };

  return (
    <article className="bg-white rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-4 relative min-h-[210px] bg-brand-dark/10 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover min-h-[210px] hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {rank !== undefined && (
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-dark/90 text-brand-lime backdrop-blur-xs shadow">
                #{rank} Match
              </span>
            )}
            <Link
              href={`/cuisines/${recipe.cuisine.toLowerCase()}`}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 hover:bg-brand-lime text-brand-dark shadow transition"
            >
              {recipe.cuisine}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => toggleSaveRecipe(recipe.id)}
            aria-label="Save Recipe"
            className={`absolute top-3 right-3 p-2 rounded-full shadow transition ${
              saved
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="md:col-span-8 p-5 flex flex-col justify-between bg-gradient-to-br from-white to-brand-surface/40">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-medium">
                <span className="text-brand-primary font-bold">
                  {recipe.region}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  {recipe.cookingTimeMinutes} min
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  {recipe.nutrition.calories} kcal
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">
                  {recipe.nutrition.proteinG}g Protein
                </span>
              </div>

              <Link
                href={`/recipes/${recipe.id}`}
                className="text-lg sm:text-xl font-extrabold text-brand-dark hover:text-brand-primary transition block"
              >
                {recipe.name}
              </Link>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {recipe.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900"
                  >
                    {tag}
                  </span>
                ))}
                {recipe.tasteProfile.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-2xl border border-brand-border shadow-2xs self-start shrink-0">
              <ScoreRing score={scoreBreakdown.totalScore} size={58} />
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                  Match Score
                </span>
                <span className="text-xs font-bold text-brand-dark block">
                  Core Fit: {ingredientMatch.fitDisplay}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  FlavorDB: {flavorCompatibility.flavorFitLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <ScoreBreakdown breakdown={scoreBreakdown} />
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 bg-brand-surface/40 border-t border-brand-border/70 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
        <div className="lg:col-span-7 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-brand-dark mr-1">
              Matched Core ({ingredientMatch.matchedCoreIngredients.length}):
            </span>
            {ingredientMatch.matchedCoreIngredients.length > 0 ? (
              ingredientMatch.matchedCoreIngredients.map((ing) => (
                <IngredientChip key={ing} name={ing} variant="matched" />
              ))
            ) : (
              <span className="text-gray-500 italic">None in pantry yet</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-brand-dark mr-1">
              Missing Core ({ingredientMatch.missingCoreIngredients.length}):
            </span>
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
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Core Ingredients Available!
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl p-2.5 border border-brand-border/80 flex items-start gap-2">
          <Beaker className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-brand-dark block">
              FlavorDB Molecular Signal
            </span>
            <p className="text-[11px] text-gray-600 line-clamp-2">
              {flavorCompatibility.supportingSignals[0] ||
                explanations.flavorCompatibilityText}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar — Every Button Navigates to Its Dedicated Route */}
      <div className="px-5 py-3 bg-white border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/recipes/${recipe.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-brand-lime" />
            View Full Recipe
          </Link>

          <button
            type="button"
            onClick={handleCompare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
          >
            <BarChart2 className="w-3.5 h-3.5 text-brand-primary" />
            Compare
          </button>

          <button
            type="button"
            onClick={handleNutrition}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            Nutrition
          </button>

          <button
            type="button"
            onClick={handleSubstitute}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
            Substitute
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddToGrocery}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Grocery
          </button>

          <button
            type="button"
            onClick={handleAddToMealPlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-lime hover:bg-brand-primary hover:text-white text-brand-dark transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            Meal Plan
          </button>
        </div>
      </div>
    </article>
  );
}
