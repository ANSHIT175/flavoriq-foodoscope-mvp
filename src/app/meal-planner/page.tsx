"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
  Flame,
} from "lucide-react";
import {
  useFlavorIq,
  DAYS_OF_WEEK,
  MEAL_SLOTS,
  DayOfWeek,
  MealSlotType,
} from "../../context/FlavorIqContext";

export default function WeeklyMealPlannerPage() {
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
    let totalCalories = 0;
    let totalProtein = 0;
    let scheduledMeals = 0;

    for (const day of DAYS_OF_WEEK) {
      for (const slot of MEAL_SLOTS) {
        const recId = mealPlan[day]?.[slot];
        if (recId) {
          const rec = allRecipes.find((r) => r.id === recId);
          if (rec) {
            totalCalories += rec.nutrition.calories;
            totalProtein += rec.nutrition.proteinG;
            scheduledMeals++;
          }
        }
      }
    }
    return { totalCalories, totalProtein, scheduledMeals };
  }, [mealPlan, allRecipes]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            7-Day Personalized Nutrition &amp; Meal Schedule
          </span>
          <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
            Weekly Meal Planner
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Plan Breakfast, Lunch, and Dinner across Monday–Sunday with instant meal swapping and weekly macro tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-brand-surface px-4 py-2 rounded-xl border border-brand-border text-xs">
            <span className="font-bold text-brand-dark block">
              Weekly Summary ({weeklyStats.scheduledMeals} meals):
            </span>
            <span className="text-brand-primary font-extrabold">
              {weeklyStats.totalCalories.toLocaleString()} kcal •{" "}
              {weeklyStats.totalProtein}g Protein
            </span>
          </div>

          <button
            type="button"
            onClick={autoPopulateMealPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-lime" />
            Auto-Fill 7-Day Plan
          </button>
        </div>
      </section>

      {/* Active Recipe Picker for Empty "+ Add Recipe" Slots */}
      <section className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-brand-dark">
          Recipe to assign when clicking &ldquo;+ Add Recipe&rdquo; on any slot:
        </span>
        <select
          value={selectedRecipeForAdd}
          onChange={(e) => setSelectedRecipeForAdd(e.target.value)}
          className="rounded-xl border border-brand-border bg-brand-surface/50 px-3 py-2 text-xs font-bold text-brand-dark min-w-[260px]"
        >
          {allRecipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.cuisine} • {r.nutrition.calories} kcal •{" "}
              {r.nutrition.proteinG}g Prot)
            </option>
          ))}
        </select>
      </section>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day: DayOfWeek) => (
          <div
            key={day}
            className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div className="border-b border-brand-border pb-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-brand-dark">{day}</h2>
              <Flame className="w-3.5 h-3.5 text-brand-primary" />
            </div>

            <div className="space-y-3 flex-1">
              {MEAL_SLOTS.map((slot: MealSlotType) => {
                const recId = mealPlan[day]?.[slot];
                const rec = allRecipes.find((r) => r.id === recId);

                return (
                  <div
                    key={slot}
                    className="rounded-xl border border-brand-border/80 bg-brand-surface/40 p-2.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        {slot}
                      </span>
                      {rec && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => swapMealInPlan(day, slot)}
                            title="Swap Meal"
                            className="p-1 rounded hover:bg-brand-lime text-brand-primary"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRecipeFromMealPlan(day, slot)}
                            title="Remove Meal"
                            className="p-1 rounded hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {rec ? (
                      <div className="space-y-1">
                        <Link
                          href={`/recipes/${rec.id}`}
                          className="text-xs font-bold text-brand-dark hover:text-brand-primary line-clamp-2 block"
                        >
                          {rec.name}
                        </Link>
                        <p className="text-[10px] text-gray-500">
                          {rec.nutrition.calories} kcal • {rec.nutrition.proteinG}g P
                        </p>
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
                        className="w-full py-2 rounded-lg border border-dashed border-brand-border hover:border-brand-primary text-[11px] font-semibold text-brand-primary flex items-center justify-center gap-1 hover:bg-white transition"
                      >
                        <Plus className="w-3 h-3" />
                        Add Recipe
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
