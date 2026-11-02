"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Beaker,
  Utensils,
  Plus,
  Flame,
  ArrowRight,
} from "lucide-react";
import { CUISINE_EXPLORER_DATA } from "../../../lib/foodoscope/mockCatalog";
import { useFlavorIq } from "../../../context/FlavorIqContext";
import { ScoreRing } from "../../../components/ScoreBreakdown";

const CUISINE_INGREDIENTS: Record<string, string[]> = {
  Indian: ["Paneer", "Tomato", "Onion", "Spinach", "Cumin", "Garlic", "Ginger", "Dal", "Chickpeas"],
  Chinese: ["Firm Tofu", "Capsicum", "Ginger", "Garlic", "Onion", "Soy Sauce", "Sesame", "Noodles"],
  Italian: ["Pasta", "Tomato", "Garlic", "Capsicum", "Spinach", "Fresh Basil", "Olive Oil", "Mushroom"],
  Mexican: ["Black Beans", "Rice", "Tomato", "Onion", "Capsicum", "Cumin", "Coriander", "Avocado"],
  Thai: ["Firm Tofu", "Coconut Milk", "Ginger", "Capsicum", "Fresh Basil", "Green Chili", "Lemon"],
  Japanese: ["Firm Tofu", "Mushroom", "Rice", "Ginger", "Sesame", "Edamame", "Spinach", "Noodles"],
  Mediterranean: ["Chickpeas", "Tomato", "Spinach", "Garlic", "Lemon", "Olive Oil", "Cumin"],
};

export default function DedicatedCuisineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawParam = String(params?.cuisine || "indian").toLowerCase();

  const {
    allRecipes,
    getRankedOrEvaluatedRecipe,
    addIngredient,
    setCuisine,
    computeRecommendations,
  } = useFlavorIq();

  const cuisineMeta =
    CUISINE_EXPLORER_DATA.find(
      (c) => c.cuisine.toLowerCase() === rawParam
    ) || CUISINE_EXPLORER_DATA[0];

  const popularIngredients =
    CUISINE_INGREDIENTS[cuisineMeta.cuisine] || CUISINE_INGREDIENTS.Indian;

  const cuisineRecipes = allRecipes
    .filter((r) => r.cuisine.toLowerCase() === cuisineMeta.cuisine.toLowerCase())
    .map((r) => getRankedOrEvaluatedRecipe(r.id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/cuisines"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-primary hover:text-brand-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Cuisines
        </Link>

        <button
          type="button"
          onClick={async () => {
            setCuisine(cuisineMeta.cuisine);
            await computeRecommendations({ cuisine: cuisineMeta.cuisine });
            router.push("/recipes");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-extrabold transition"
        >
          Filter Recipe Finder by {cuisineMeta.cuisine}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cuisine Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-brand-dark text-white min-h-[260px] flex items-end shadow-lg">
        <img
          src={cuisineMeta.image}
          alt={cuisineMeta.cuisine}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
        <div className="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-lime text-brand-dark">
              Regional Culinary Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {cuisineMeta.cuisine} Cuisine
            </h1>
            <p className="text-xs sm:text-sm text-brand-lime/95">
              {cuisineMeta.tagline} — {cuisineMeta.flavorProfile}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
            <Clock className="w-4 h-4 text-brand-lime inline mr-1.5 -mt-0.5" />
            Average Cooking Time: {cuisineMeta.avgCookingTime}
          </div>
        </div>
      </section>

      {/* Popular Ingredients + Signature Molecules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-primary" />
            Popular {cuisineMeta.cuisine} Pantry Ingredients (Click to Add)
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularIngredients.map((ing) => (
              <button
                key={ing}
                type="button"
                onClick={() => addIngredient(ing)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime text-brand-dark border border-brand-border text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-primary" />
                {ing}
              </button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <Beaker className="w-5 h-5 text-brand-primary" />
            Signature Aroma Molecules
          </h2>
          <div className="flex flex-wrap gap-2">
            {cuisineMeta.signatureMolecules.map((mol) => (
              <span
                key={mol}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-xs font-bold"
              >
                {mol}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            These key volatile compounds drive the sensory character of{" "}
            {cuisineMeta.cuisine} dishes in the FlavorDB pairing network.
          </p>
        </section>
      </div>

      {/* Popular Recipes in This Cuisine */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-brand-dark">
          Popular {cuisineMeta.cuisine} Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cuisineRecipes.map(({ recipe, scoreBreakdown }) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm flex flex-col sm:flex-row"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="sm:w-44 h-44 sm:h-auto object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-brand-primary">
                      {recipe.region}
                    </span>
                    <h3 className="text-base font-extrabold text-brand-dark">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {recipe.cookingTimeMinutes} min •{" "}
                      <Flame className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                      {recipe.nutrition.calories} kcal ({recipe.nutrition.proteinG}g P)
                    </p>
                  </div>
                  <ScoreRing score={scoreBreakdown.totalScore} size={50} />
                </div>

                <Link
                  href={`/recipes/${recipe.id}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition"
                >
                  View Full Recipe →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
