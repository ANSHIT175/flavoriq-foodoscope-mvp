"use client";

import React from "react";
import Link from "next/link";
import { Award, Clock, Flame, Trash2, Eye } from "lucide-react";
import { RankedRecipeResult } from "../lib/recommendation/scoring";

export default function ComparisonTable({
  items,
  onRemove,
}: {
  items: RankedRecipeResult[];
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) return null;

  const maxScore = Math.max(...items.map((i) => i.scoreBreakdown.totalScore));
  const maxIng = Math.max(...items.map((i) => i.scoreBreakdown.ingredientCoverage));
  const maxFlavor = Math.max(...items.map((i) => i.scoreBreakdown.flavorCompatibility));
  const minTime = Math.min(...items.map((i) => i.recipe.cookingTimeMinutes));
  const minCal = Math.min(...items.map((i) => i.recipe.nutrition.calories));
  const maxProt = Math.max(...items.map((i) => i.recipe.nutrition.proteinG));

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface/60">
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-gray-500 w-44">
                Comparison Metric
              </th>
              {items.map((item) => {
                const isBestOverall =
                  item.scoreBreakdown.totalScore === maxScore;
                const isFastest =
                  item.recipe.cookingTimeMinutes === minTime;
                const isHighProt =
                  item.recipe.nutrition.proteinG === maxProt;

                return (
                  <th key={item.recipe.id} className="p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {isBestOverall && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-dark text-brand-lime">
                            <Award className="w-3 h-3" /> Best Overall
                          </span>
                        )}
                        {isFastest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                            <Clock className="w-3 h-3" /> Fastest
                          </span>
                        )}
                        {isHighProt && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            <Flame className="w-3 h-3" /> Highest Protein
                          </span>
                        )}
                      </div>
                      <img
                        src={item.recipe.image}
                        alt={item.recipe.name}
                        className="w-full h-28 object-cover rounded-xl border border-brand-border"
                      />
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/recipes/${item.recipe.id}`}
                          className="text-sm font-extrabold text-brand-dark hover:text-brand-primary line-clamp-2"
                        >
                          {item.recipe.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => onRemove(item.recipe.id)}
                          className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 shrink-0"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 text-xs">
            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Total Match Score
              </td>
              {items.map((i) => {
                const win = i.scoreBreakdown.totalScore === maxScore;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 font-extrabold text-base ${
                      win ? "text-brand-primary bg-brand-lime/25" : "text-brand-dark"
                    }`}
                  >
                    {i.scoreBreakdown.totalScore}/100{" "}
                    {win && <span className="text-[10px] ml-1 uppercase">★ Winner</span>}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Ingredients Coverage (30)
              </td>
              {items.map((i) => {
                const win = i.scoreBreakdown.ingredientCoverage === maxIng;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 ${win ? "font-bold text-emerald-800 bg-emerald-50/50" : ""}`}
                  >
                    {i.scoreBreakdown.ingredientCoverage}/30 pts ({i.ingredientMatch.fitDisplay} core)
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                FlavorDB Compatibility (25)
              </td>
              {items.map((i) => {
                const win = i.scoreBreakdown.flavorCompatibility === maxFlavor;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 ${win ? "font-bold text-emerald-800 bg-emerald-50/50" : ""}`}
                  >
                    {i.scoreBreakdown.flavorCompatibility}/25 pts ({i.flavorCompatibility.flavorFitLabel})
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Cuisine Fit (15)
              </td>
              {items.map((i) => (
                <td key={i.recipe.id} className="p-4">
                  {i.scoreBreakdown.cuisineFit}/15 pts ({i.recipe.cuisine})
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Taste Fit (10)
              </td>
              {items.map((i) => (
                <td key={i.recipe.id} className="p-4">
                  {i.scoreBreakdown.tasteFit}/10 pts ({i.recipe.tasteProfile.join(", ")})
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Cooking Time
              </td>
              {items.map((i) => {
                const win = i.recipe.cookingTimeMinutes === minTime;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 ${win ? "font-bold text-emerald-800 bg-emerald-50/50" : ""}`}
                  >
                    {i.recipe.cookingTimeMinutes} min ({i.scoreBreakdown.timeFit}/10 pts)
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Calories
              </td>
              {items.map((i) => {
                const win = i.recipe.nutrition.calories === minCal;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 ${win ? "font-bold text-emerald-800 bg-emerald-50/50" : ""}`}
                  >
                    {i.recipe.nutrition.calories} kcal
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Protein
              </td>
              {items.map((i) => {
                const win = i.recipe.nutrition.proteinG === maxProt;
                return (
                  <td
                    key={i.recipe.id}
                    className={`p-4 ${win ? "font-bold text-emerald-800 bg-emerald-50/50" : ""}`}
                  >
                    {i.recipe.nutrition.proteinG} g
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Dietary Fit (10)
              </td>
              {items.map((i) => (
                <td key={i.recipe.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {i.recipe.dietaryTags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-[10px] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-brand-dark bg-brand-surface/20">
                Action
              </td>
              {items.map((i) => (
                <td key={i.recipe.id} className="p-4">
                  <Link
                    href={`/recipes/${i.recipe.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Full Analysis
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
