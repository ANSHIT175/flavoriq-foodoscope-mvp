"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Utensils, Compass, Plus, ArrowRight, X } from "lucide-react";
import { useFlavorIq } from "../context/FlavorIqContext";
import { PANTRY_INGREDIENT_CATALOG } from "../lib/foodoscope/normalizers";
import { CUISINE_EXPLORER_DATA } from "../lib/foodoscope/mockCatalog";

export default function SearchBar() {
  const router = useRouter();
  const { rankedResults, allRecipes, addIngredient, setCuisine } = useFlavorIq();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedRecipes = useMemo(() => {
    if (!q) return [];
    const source =
      rankedResults.length > 0
        ? rankedResults.map((r) => ({
            recipe: r.recipe,
            score: r.scoreBreakdown.totalScore,
          }))
        : allRecipes.map((r) => ({ recipe: r, score: 85 }));
    return source
      .filter(
        ({ recipe }) =>
          recipe.name.toLowerCase().includes(q) ||
          recipe.cuisine.toLowerCase().includes(q) ||
          recipe.ingredients.some((i) => i.name.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [q, rankedResults, allRecipes]);

  const matchedIngredients = useMemo(() => {
    if (!q) return [];
    return PANTRY_INGREDIENT_CATALOG.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.canonicalName.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [q]);

  const matchedCuisines = useMemo(() => {
    if (!q) return [];
    return CUISINE_EXPLORER_DATA.filter(
      (c) =>
        c.cuisine.toLowerCase().includes(q) ||
        c.flavorProfile.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [q]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search recipes, pantry ingredients, cuisines..."
          className="w-full rounded-xl border border-brand-border bg-brand-surface/50 focus:bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && q.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-border shadow-xl z-50 overflow-hidden divide-y divide-brand-border/60 max-h-[75vh] overflow-y-auto">
          {/* Recipes */}
          <div className="p-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 block mb-1">
              Matching Recipes ({matchedRecipes.length})
            </span>
            {matchedRecipes.length > 0 ? (
              <div className="space-y-1">
                {matchedRecipes.map(({ recipe, score }) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/recipes/${recipe.id}`);
                    }}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-brand-surface text-left transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-dark truncate">
                          {recipe.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {recipe.cuisine} • {recipe.cookingTimeMinutes}m •{" "}
                          {recipe.nutrition.calories} kcal
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-primary shrink-0">
                      {score}/100
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 px-2 py-1">No matching recipes</p>
            )}
          </div>

          {/* Ingredients */}
          {matchedIngredients.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                Quick-Add Pantry Ingredients
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {matchedIngredients.map((ing) => (
                  <button
                    key={ing.canonicalName}
                    type="button"
                    onClick={() => {
                      addIngredient(ing.name.replace(/\s*\([^)]*\)/g, ""));
                      setOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-surface hover:bg-brand-lime text-brand-dark border border-brand-border transition"
                  >
                    <Plus className="w-3 h-3 text-brand-primary" />
                    {ing.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cuisines */}
          {matchedCuisines.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                Filter by Cuisine
              </span>
              <div className="space-y-1">
                {matchedCuisines.map((c) => (
                  <button
                    key={c.cuisine}
                    type="button"
                    onClick={() => {
                      setCuisine(c.cuisine);
                      setOpen(false);
                      router.push("/recipes");
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-brand-surface text-xs font-semibold text-brand-dark transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-brand-primary" />
                      {c.cuisine} Cuisine
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
