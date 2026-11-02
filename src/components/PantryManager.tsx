"use client";

import React, { useState, useMemo } from "react";
import {
  Utensils,
  Search,
  Plus,
  Trash2,
  RotateCcw,
  Clock,
  Sparkles,
} from "lucide-react";
import { useFlavorIq } from "../context/FlavorIqContext";
import {
  PANTRY_INGREDIENT_CATALOG,
  getIngredientCategory,
  normalizeIngredientName,
} from "../lib/foodoscope/normalizers";
import { IngredientCategory } from "../lib/foodoscope/types";
import IngredientChip from "./IngredientChip";

const CATEGORIES: ("All" | IngredientCategory)[] = [
  "All",
  "Vegetables",
  "Protein",
  "Grains",
  "Dairy",
  "Spices",
  "Herbs",
  "Other",
];

export default function PantryManager() {
  const {
    ingredients,
    recentIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    restoreDefaultPantry,
    computeRecommendations,
  } = useFlavorIq();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | IngredientCategory>("All");

  const userCanonSet = useMemo(
    () => new Set(ingredients.map(normalizeIngredientName)),
    [ingredients]
  );

  const filteredCatalog = useMemo(() => {
    return PANTRY_INGREDIENT_CATALOG.filter((item) => {
      const matchesCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.canonicalName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    addIngredient(searchQuery.trim());
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            Smart Kitchen Inventory
          </span>
          <h2 className="text-lg font-bold text-brand-dark mt-0.5">
            What do you have in your kitchen?
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Supports Indian &amp; global synonyms (e.g., Palak → Spinach, Tamatar → Tomato, Pyaaz → Onion).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              restoreDefaultPantry();
              computeRecommendations({
                ingredients: [
                  "Paneer",
                  "Tomato",
                  "Onion",
                  "Capsicum",
                  "Spinach",
                  "Garlic",
                  "Ginger",
                  "Cumin",
                ],
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-surface hover:bg-brand-lime/70 text-brand-dark border border-brand-border transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-primary" />
            Use my current pantry
          </button>
          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={clearIngredients}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-700 hover:bg-red-50 border border-red-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search & Add Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or type an ingredient (e.g., Paneer, Palak, Tofu, Pasta)..."
            className="w-full rounded-xl border border-brand-border pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-brand-surface/30"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Active Pantry Chips */}
      <div className="bg-brand-surface/60 rounded-xl p-3.5 border border-brand-border/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-brand-dark">
            Active Pantry ({ingredients.length} ingredients)
          </span>
          <span className="text-[11px] text-brand-primary font-medium">
            Auto-normalized for RecipeDB &amp; FlavorDB
          </span>
        </div>
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <IngredientChip
                key={ing}
                name={ing}
                category={getIngredientCategory(ing)}
                onRemove={() => removeIngredient(ing)}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic py-2">
            Your pantry is empty. Add ingredients below or click &ldquo;Use my current pantry&rdquo;.
          </p>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-brand-dark text-brand-lime shadow-sm"
                  : "bg-brand-surface text-gray-700 hover:bg-brand-lime/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ingredient Catalog Grid */}
        <div className="flex flex-wrap gap-1.5 mt-2.5 max-h-44 overflow-y-auto pr-1">
          {filteredCatalog.map((item) => {
            const isSelected = userCanonSet.has(item.canonicalName);
            return (
              <IngredientChip
                key={item.canonicalName}
                name={item.name}
                selected={isSelected}
                onClick={() => {
                  if (isSelected) {
                    const match = ingredients.find(
                      (i) => normalizeIngredientName(i) === item.canonicalName
                    );
                    if (match) removeIngredient(match);
                  } else {
                    addIngredient(item.name.replace(/\s*\([^)]*\)/g, ""));
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Recently Used Ingredients */}
      {recentIngredients.length > 0 && (
        <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recently used:
          </span>
          {recentIngredients.map((rec) => {
            const already = userCanonSet.has(normalizeIngredientName(rec));
            if (already) return null;
            return (
              <button
                key={rec}
                type="button"
                onClick={() => addIngredient(rec)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-brand-surface hover:bg-brand-lime/50 text-brand-dark border border-brand-border transition"
              >
                + {rec}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
