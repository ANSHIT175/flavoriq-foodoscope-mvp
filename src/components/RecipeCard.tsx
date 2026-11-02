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
  Check,
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
    isRecipeInMealPlan,
    quickAddToMealPlan,
    groceryAddedRecipeIds,
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
  const inGrocery = groceryAddedRecipeIds.includes(recipe.id);
  const inMealPlan = isRecipeInMealPlan(recipe.id);

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

  return (
    <article
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-md ${
        compared
          ? "border-brand-primary ring-1 ring-brand-primary/30"
          : "border-brand-border shadow-sm"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Clickable Recipe Image */}
        <div className="md:col-span-4 relative min-h-[210px] bg-brand-dark/10 overflow-hidden group">
          <Link href={`/recipes/${recipe.id}`} className="block w-full h-full cursor-pointer">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover min-h-[210px] group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            {rank !== undefined && (
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-dark/90 text-brand-lime backdrop-blur-xs shadow">
                #{rank} Match
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-brand-dark shadow">
              {recipe.cuisine}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleSaveRecipe(recipe.id)}
            aria-label="Save Recipe"
            className={`absolute top-3 right-3 p-2 rounded-full shadow transition cursor-pointer ${
              saved
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Right Header Info */}
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
                className="text-lg sm:text-xl font-extrabold text-brand-dark hover:text-brand-primary transition block cursor-pointer"
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

            <Link
              href={`/recipes/${recipe.id}`}
              className="flex items-center gap-3 bg-white hover:bg-brand-surface/60 px-3.5 py-2.5 rounded-2xl border border-brand-border shadow-2xs self-start shrink-0 transition cursor-pointer"
            >
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
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border/60">
            <ScoreBreakdown breakdown={scoreBreakdown} />
          </div>
        </div>
      </div>

      {/* Matched vs Missing Strip */}
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

        <Link
          href="/flavor-intelligence"
          className="lg:col-span-5 bg-white hover:bg-brand-lime/30 rounded-xl p-2.5 border border-brand-border/80 flex items-start gap-2 transition cursor-pointer"
        >
          <Beaker className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-brand-dark block">
              FlavorDB Molecular Signal →
            </span>
            <p className="text-[11px] text-gray-600 line-clamp-2">
              {flavorCompatibility.supportingSignals[0] ||
                explanations.flavorCompatibilityText}
            </p>
          </div>
        </Link>
      </div>

      {/* Bottom Action Bar — Distinct Visual Hierarchy & Visible Feedback */}
      <div className="px-5 py-3.5 bg-white border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Action: Strong Filled Button */}
          <Link
            href={`/recipes/${recipe.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-extrabold transition shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-brand-lime" />
            View Recipe
          </Link>

          {/* Secondary Action: Outlined Button with Active State */}
          <button
            type="button"
            onClick={() => toggleCompareRecipe(recipe.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              compared
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white hover:bg-brand-surface text-brand-dark border-brand-border"
            }`}
          >
            {compared ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added to Compare
              </>
            ) : (
              <>
                <BarChart2 className="w-3.5 h-3.5 text-brand-primary" />
                Compare
              </>
            )}
          </button>

          {/* Secondary Action: Save with Visible State */}
          <button
            type="button"
            onClick={() => toggleSaveRecipe(recipe.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              saved
                ? "bg-red-50 text-red-700 border-red-300"
                : "bg-white hover:bg-brand-surface text-brand-dark border-brand-border"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                saved ? "fill-current text-red-600" : "text-gray-500"
              }`}
            />
            {saved ? "Saved ✓" : "Save"}
          </button>

          {/* Tertiary Actions: Subtle Text/Surface Style */}
          <button
            type="button"
            onClick={handleSubstitute}
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-surface transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Substitute
          </button>

          <button
            type="button"
            onClick={handleNutrition}
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-orange-700 hover:bg-orange-50 transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            Nutrition
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => addMissingIngredientsToGrocery(recipe)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              inGrocery
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
            }`}
          >
            {inGrocery ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Added to Grocery List
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Grocery
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => quickAddToMealPlan(recipe.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              inMealPlan
                ? "bg-brand-primary text-white"
                : "bg-brand-lime hover:bg-brand-primary hover:text-white text-brand-dark"
            }`}
          >
            {inMealPlan ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added to Meal Plan
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                Add to Meal Plan
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
