"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Clock,
  Eye,
  Trash2,
  BarChart2,
  ChefHat,
  Flame,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import EmptyState from "../../components/EmptyState";
import { ScoreRing } from "../../components/ScoreBreakdown";

export default function SavedRecipesPage() {
  const router = useRouter();
  const {
    savedRecipeIds,
    toggleSaveRecipe,
    toggleCompareRecipe,
    isRecipeCompared,
    getRankedOrEvaluatedRecipe,
  } = useFlavorIq();

  const savedItems = savedRecipeIds
    .map((id) => getRankedOrEvaluatedRecipe(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-current" />
            Personal Recipe Collection
          </span>
          <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
            Saved Recipes ({savedItems.length})
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Your bookmarked dishes with live-calculated Match Scores based on your current kitchen pantry.
          </p>
        </div>
      </section>

      {savedItems.length === 0 ? (
        <EmptyState
          title="No saved recipes yet."
          description="Explore personalized recommendations and click the Save button on any recipe card to build your personal cookbook."
          actionLabel="Discover Recipes"
          onAction={() => router.push("/recipes")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map(({ recipe, scoreBreakdown }) => {
            const compared = isRecipeCompared(recipe.id);
            return (
              <article
                key={recipe.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-brand-dark/10">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-dark/90 text-brand-lime">
                      {recipe.cuisine}
                    </span>
                  </div>

                  <div className="p-5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-base font-extrabold text-brand-dark line-clamp-2">
                        {recipe.name}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-primary" />
                          {recipe.cookingTimeMinutes} min
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          {recipe.nutrition.calories} kcal
                        </span>
                      </div>
                    </div>
                    <ScoreRing score={scoreBreakdown.totalScore} size={50} />
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-brand-surface/50 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-dark hover:bg-brand-primary text-brand-lime text-xs font-bold transition"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Cook
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleCompareRecipe(recipe.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        compared
                          ? "bg-brand-lime text-brand-dark border-brand-primary"
                          : "bg-white text-brand-dark border-brand-border"
                      }`}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      Compare
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveRecipe(recipe.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
