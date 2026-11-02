"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Clock,
  Trash2,
  BarChart2,
  ChefHat,
  Flame,
  BookOpen,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import EmptyState from "../../components/EmptyState";

const SAVED_FILTERS = [
  "All",
  "Indian",
  "Chinese",
  "Italian",
  "Vegan",
  "High Protein",
] as const;

export default function SavedCookbookGalleryPage() {
  const router = useRouter();
  const {
    savedRecipeIds,
    toggleSaveRecipe,
    toggleCompareRecipe,
    isRecipeCompared,
    getRankedOrEvaluatedRecipe,
  } = useFlavorIq();

  const [activeFilter, setActiveFilter] =
    useState<(typeof SAVED_FILTERS)[number]>("All");

  const savedItems = useMemo(() => {
    const raw = savedRecipeIds
      .map((id) => getRankedOrEvaluatedRecipe(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (activeFilter === "All") return raw;
    if (activeFilter === "Vegan") {
      return raw.filter((r) => r.recipe.dietaryTags.includes("Vegan"));
    }
    if (activeFilter === "High Protein") {
      return raw.filter(
        (r) =>
          r.recipe.dietaryTags.includes("High-protein") ||
          r.recipe.nutrition.proteinG >= 17
      );
    }
    return raw.filter((r) => r.recipe.cuisine === activeFilter);
  }, [savedRecipeIds, getRankedOrEvaluatedRecipe, activeFilter]);

  return (
    <div className="space-y-8">
      {/* Cookbook Header */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark via-[#1F4428] to-brand-primary text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <BookOpen className="w-3.5 h-3.5" />
            Personal Culinary Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            My Saved Recipes ({savedRecipeIds.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90">
            Curated cookbook gallery with live pantry match scores and one-click cooking mode.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {SAVED_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                activeFilter === f
                  ? "bg-brand-lime text-brand-dark shadow"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {savedItems.length === 0 ? (
        <EmptyState
          title="No saved recipes match this filter."
          description="Explore recipes in the Recipe Finder or switch the filter back to 'All'."
          actionLabel="Browse Recipe Finder"
          onAction={() => router.push("/recipes")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map(({ recipe, scoreBreakdown }) => {
            const compared = isRecipeCompared(recipe.id);
            return (
              <article
                key={recipe.id}
                className="group bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-brand-dark">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 text-brand-dark shadow">
                        {recipe.cuisine}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-lime text-brand-dark shadow">
                        {scoreBreakdown.totalScore}/100 Match
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h2 className="text-lg font-extrabold leading-snug">
                        {recipe.name}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-brand-lime mt-1 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {recipe.cookingTimeMinutes} min
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          {recipe.nutrition.calories} kcal ({recipe.nutrition.proteinG}g P)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookbook Tile Footer: Cook / Compare / Remove */}
                <div className="p-4 bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-extrabold transition"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Cook
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (!compared) toggleCompareRecipe(recipe.id);
                        router.push("/compare");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border text-xs font-bold transition"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-brand-primary" />
                      Compare
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveRecipe(recipe.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 border border-red-200 transition"
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
