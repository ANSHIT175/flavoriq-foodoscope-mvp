"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
} from "lucide-react";
import {
  useFlavorIq,
  DAYS_OF_WEEK,
  MEAL_SLOTS,
  DayOfWeek,
  MealSlotType,
} from "../../context/FlavorIqContext";

export default function WeeklyMealPlannerCalendarPage() {
  const {
    mealPlan,
    allRecipes,
    assignRecipeToMealPlan,
    removeRecipeFromMealPlan,
    swapMealInPlan,
    autoPopulateMealPlan,
  } = useFlavorIq();

  const [selectedRecipeForAdd, setSelectedRecipeForAdd] = useState<string>(
    allRecipes[0]?.id || "fiq-rec-01"
  );

  const weeklyStats = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let planned = 0;
    for (const d of DAYS_OF_WEEK) {
      for (const s of MEAL_SLOTS) {
        const recId = mealPlan[d]?.[s];
        if (recId) {
          const rec = allRecipes.find((r) => r.id === recId);
          if (rec) {
            calories += rec.nutrition.calories;
            protein += rec.nutrition.proteinG;
            planned++;
          }
        }
      }
    }
    return { calories, protein, planned };
  }, [mealPlan, allRecipes]);

  return (
    <div className="space-y-8">
      {/* Calendar Header + Weekly Summary Cards */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark to-brand-primary text-white p-6 sm:p-8 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <Calendar className="w-3.5 h-3.5" />
            Weekly Culinary Calendar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            📅 Weekly Meal Planner (Monday → Sunday)
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90">
            Schedule Breakfast, Lunch, and Dinner across all 7 days with live calorie &amp; protein tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center text-xs">
            <div className="px-2">
              <strong className="text-base text-brand-lime block">
                {weeklyStats.calories.toLocaleString()}
              </strong>
              <span className="text-[10px] text-white/80">Calories</span>
            </div>
            <div className="px-2 border-x border-white/15">
              <strong className="text-base text-brand-lime block">
                {weeklyStats.protein}g
              </strong>
              <span className="text-[10px] text-white/80">Protein</span>
            </div>
            <div className="px-2">
              <strong className="text-base text-brand-lime block">
                {weeklyStats.planned}
              </strong>
              <span className="text-[10px] text-white/80">Recipes Planned</span>
            </div>
          </div>

          <button
            type="button"
            onClick={autoPopulateMealPlan}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-brand-lime text-brand-dark hover:bg-white text-xs font-extrabold shadow transition"
          >
            <Sparkles className="w-4 h-4 text-brand-primary" />
            Auto-Fill Week
          </button>
        </div>
      </section>

      {/* Active Recipe Selector for "+ Add Meal" */}
      <section className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-brand-dark">
          Active Recipe for &ldquo;+ Add Meal&rdquo; Buttons:
        </span>
        <select
          value={selectedRecipeForAdd}
          onChange={(e) => setSelectedRecipeForAdd(e.target.value)}
          className="rounded-xl border border-brand-border bg-brand-surface/50 px-3.5 py-2 text-xs font-bold text-brand-dark min-w-[280px]"
        >
          {allRecipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.cuisine} • {r.nutrition.calories} kcal •{" "}
              {r.nutrition.proteinG}g Protein)
            </option>
          ))}
        </select>
      </section>

      {/* WEEKLY CALENDAR MATRIX: Rows = Breakfast / Lunch / Dinner, Columns = Monday -> Sunday */}
      <section className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[920px]">
            <thead>
              <tr className="bg-brand-dark text-white">
                <th className="p-3.5 text-left text-xs font-extrabold uppercase tracking-wider w-28 border-r border-white/15">
                  Meal Slot
                </th>
                {DAYS_OF_WEEK.map((day: DayOfWeek) => (
                  <th
                    key={day}
                    className="p-3.5 text-left text-xs font-extrabold uppercase tracking-wider border-r border-white/10"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {MEAL_SLOTS.map((slot: MealSlotType) => (
                <tr key={slot} className="align-top">
                  <td className="p-4 bg-brand-surface/60 font-extrabold text-xs text-brand-dark border-r border-brand-border">
                    {slot}
                  </td>
                  {DAYS_OF_WEEK.map((day: DayOfWeek) => {
                    const recId = mealPlan[day]?.[slot];
                    const rec = allRecipes.find((r) => r.id === recId);

                    return (
                      <td
                        key={`${day}-${slot}`}
                        className="p-3 border-r border-brand-border/60 w-36"
                      >
                        {rec ? (
                          <div className="rounded-xl border border-brand-border bg-brand-surface/40 p-2.5 space-y-2">
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="w-full h-16 object-cover rounded-lg"
                            />
                            <Link
                              href={`/recipes/${rec.id}`}
                              className="text-xs font-extrabold text-brand-dark hover:text-brand-primary line-clamp-2 block leading-snug"
                            >
                              {rec.name}
                            </Link>
                            <p className="text-[10px] font-semibold text-gray-500">
                              {rec.nutrition.calories} kcal •{" "}
                              {rec.nutrition.proteinG}g P
                            </p>
                            <div className="flex items-center justify-between pt-1 border-t border-brand-border/60">
                              <button
                                type="button"
                                onClick={() => swapMealInPlan(day, slot)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:underline"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Swap Meal
                              </button>
                              <button
                                type="button"
                                onClick={() => removeRecipeFromMealPlan(day, slot)}
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 hover:underline"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              assignRecipeToMealPlan(
                                day,
                                slot,
                                selectedRecipeForAdd
                              )
                            }
                            className="w-full h-28 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-primary hover:bg-brand-surface/50 flex flex-col items-center justify-center gap-1 text-xs font-bold text-brand-primary transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Meal</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
