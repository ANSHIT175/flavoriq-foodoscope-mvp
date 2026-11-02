"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Check,
  CheckSquare,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import { getIngredientCategory } from "../../lib/foodoscope/normalizers";
import { IngredientCategory } from "../../lib/foodoscope/types";

const CATEGORY_META: {
  key: IngredientCategory;
  label: string;
}[] = [
  { key: "Vegetables", label: "🥕 Vegetables" },
  { key: "Dairy", label: "🥛 Dairy" },
  { key: "Grains", label: "🌾 Grains" },
  { key: "Spices", label: "🌶 Spices & Herbs" },
  { key: "Protein", label: "🥩 Protein" },
  { key: "Other", label: "📦 Other" },
];

export default function SmartGroceryChecklistPage() {
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
    const map: Record<string, typeof groceryItems> = {
      Vegetables: [],
      Dairy: [],
      Grains: [],
      Spices: [],
      Protein: [],
      Other: [],
    };
    for (const item of groceryItems) {
      const cat =
        item.category === "Herbs" ? "Spices" : item.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [groceryItems]);

  const handleCheckAll = () => {
    groceryItems.forEach((item) => {
      if (!item.checked) toggleGroceryItem(item.id);
    });
    showToast("Checked All Items", "Marked all shopping list items as completed.");
  };

  const handleCopyList = () => {
    const lines = [
      "FLAVORIQ — Smart Shopping Checklist",
      "====================================",
      ...groceryItems.map(
        (i) => `${i.checked ? "[x]" : "[ ]"} ${i.name} (${i.quantity})`
      ),
    ];
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
    }
    showToast(
      "Copied to Clipboard!",
      `Copied ${groceryItems.length} shopping items.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Checklist Action Header */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark to-brand-primary text-white p-6 sm:p-8 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <ShoppingCart className="w-3.5 h-3.5" />
            Smart Kitchen Gap Checklist
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            🛒 Smart Grocery List
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 mt-1">
            Separates ingredients already in your pantry from items you need to buy, organized by supermarket aisle.
          </p>
        </div>

        {/* 4 Required Buttons: Add All, Check All, Clear, Copy List */}
        <div className="flex flex-wrap items-center gap-2">
          {rankedResults[0] && (
            <button
              type="button"
              onClick={() =>
                addMissingIngredientsToGrocery(rankedResults[0].recipe)
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-lime text-brand-dark hover:bg-white text-xs font-extrabold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add All
            </button>
          )}

          <button
            type="button"
            onClick={handleCheckAll}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition"
          >
            <CheckSquare className="w-3.5 h-3.5 text-brand-lime" />
            Check All
          </button>

          <button
            type="button"
            onClick={handleCopyList}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition"
          >
            <Copy className="w-3.5 h-3.5 text-brand-lime" />
            Copy List
          </button>

          <button
            type="button"
            onClick={clearGroceryList}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Need to Buy Checklist */}
        <section className="lg:col-span-8 bg-white rounded-3xl border border-brand-border p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
            <h2 className="text-lg font-extrabold text-brand-dark">
              🛒 Need to Buy ({groceryItems.filter((i) => !i.checked).length} remaining)
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
                placeholder="Add custom grocery item..."
                className="rounded-xl border border-brand-border px-3 py-2 text-xs bg-brand-surface/30"
              />
              <input
                type="text"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="Qty"
                className="w-24 rounded-xl border border-brand-border px-2.5 py-2 text-xs bg-brand-surface/30"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
              >
                + Add
              </button>
            </form>
          </div>

          {groceryItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 space-y-2">
              <p className="font-bold text-sm text-brand-dark">
                Your shopping checklist is empty!
              </p>
              <p>
                Click &ldquo;Add All&rdquo; at the top right or click &ldquo;Add to Grocery&rdquo; on any recipe.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CATEGORY_META.map((cat) => {
                const items = groupedGrocery[cat.key] || [];
                if (items.length === 0) return null;
                return (
                  <div
                    key={cat.key}
                    className="rounded-2xl border border-brand-border bg-brand-surface/30 p-4 space-y-3"
                  >
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark border-b border-brand-border pb-2 flex items-center justify-between">
                      <span>{cat.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-brand-primary text-[10px]">
                        {items.length}
                      </span>
                    </h3>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-white border border-brand-border/80 flex items-center justify-between gap-2 text-xs"
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer min-w-0">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleGroceryItem(item.id)}
                              className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                            />
                            <div className="min-w-0">
                              <span
                                className={`font-bold block truncate ${
                                  item.checked
                                    ? "line-through text-gray-400"
                                    : "text-brand-dark"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {item.quantity}
                              </span>
                            </div>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeGroceryItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
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

        {/* Right: Already in Your Pantry */}
        <section className="lg:col-span-4 bg-white rounded-3xl border border-brand-border p-6 shadow-sm space-y-4 self-start">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-brand-dark">
              Already in Your Pantry ({ingredients.length})
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            These ingredients are already stocked in your kitchen and automatically subtracted from recipe shopping lists:
          </p>
          <div className="space-y-2">
            {ingredients.map((ing) => (
              <div
                key={ing}
                className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {ing}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-emerald-800">
                  {getIngredientCategory(ing)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
