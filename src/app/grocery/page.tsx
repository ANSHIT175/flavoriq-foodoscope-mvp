"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Check,
  Utensils,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import { getIngredientCategory } from "../../lib/foodoscope/normalizers";
import { IngredientCategory } from "../../lib/foodoscope/types";

const GROUP_ORDER: IngredientCategory[] = [
  "Vegetables",
  "Protein",
  "Dairy",
  "Grains",
  "Spices",
  "Herbs",
  "Other",
];

export default function SmartGroceryPlannerPage() {
  const {
    ingredients,
    groceryItems,
    rankedResults,
    addMissingIngredientsToGrocery,
    addSingleGroceryItem,
    toggleGroceryItem,
    removeGroceryItem,
    clearGroceryList,
    showToast,
  } = useFlavorIq();

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1 pack");

  const groupedGrocery = useMemo(() => {
    const map: Record<string, typeof groceryItems> = {};
    for (const cat of GROUP_ORDER) map[cat] = [];
    for (const item of groceryItems) {
      const cat = item.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [groceryItems]);

  const handleCopyList = () => {
    const lines = [
      "FLAVORIQ — Smart Grocery List",
      "=============================",
      ...groceryItems.map(
        (i) => `${i.checked ? "[x]" : "[ ]"} ${i.name} (${i.quantity}) — [${i.category}]`
      ),
    ];
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
    }
    showToast(
      "Grocery List Copied!",
      `Copied ${groceryItems.length} item(s) to your clipboard.`
    );
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            Pantry Gap &amp; Shopping Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
            Smart Grocery List
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Automatically separates what you already have in your kitchen from missing ingredients needed for your recipes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rankedResults[0] && (
            <button
              type="button"
              onClick={() =>
                addMissingIngredientsToGrocery(rankedResults[0].recipe)
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add All Missing from #{1} Match
            </button>
          )}
          <button
            type="button"
            onClick={handleCopyList}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark border border-brand-border text-xs font-bold transition"
          >
            <Copy className="w-3.5 h-3.5 text-brand-primary" />
            Copy List
          </button>
          {groceryItems.length > 0 && (
            <button
              type="button"
              onClick={clearGroceryList}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ingredients Already Available */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Ingredients Already Available ({ingredients.length})
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            These items are currently in your active kitchen pantry and excluded from shopping needs:
          </p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {ing}
                <span className="text-[10px] text-emerald-700/80">
                  ({getIngredientCategory(ing)})
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* Right: Ingredients You Need to Buy */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
              <Utensils className="w-5 h-5 text-brand-primary" />
              Ingredients You Need to Buy ({groceryItems.length})
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newItemName.trim()) return;
                addSingleGroceryItem(newItemName, newItemQty);
                setNewItemName("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item (e.g., Kasuri Methi)..."
                className="rounded-xl border border-brand-border px-3 py-1.5 text-xs bg-brand-surface/30"
              />
              <input
                type="text"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="Qty"
                className="w-24 rounded-xl border border-brand-border px-2.5 py-1.5 text-xs bg-brand-surface/30"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
              >
                + Add
              </button>
            </form>
          </div>

          {groceryItems.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-6 text-center">
              Your shopping list is empty! Click &ldquo;Add All Missing&rdquo; above or add items from any recipe card.
            </p>
          ) : (
            <div className="space-y-5">
              {GROUP_ORDER.map((cat) => {
                const list = groupedGrocery[cat] || [];
                if (list.length === 0) return null;
                return (
                  <div key={cat} className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary border-b border-brand-border/60 pb-1">
                      {cat} ({list.length})
                    </h3>
                    <div className="divide-y divide-brand-border/50">
                      {list.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleGroceryItem(item.id)}
                              className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                            />
                            <div>
                              <span
                                className={`font-bold ${
                                  item.checked
                                    ? "line-through text-gray-400"
                                    : "text-brand-dark"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-gray-500 ml-2">
                                ({item.quantity})
                              </span>
                              {item.fromRecipeName && (
                                <span className="block text-[10px] text-gray-400">
                                  For: {item.fromRecipeName}
                                </span>
                              )}
                            </div>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeGroceryItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
