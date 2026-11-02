"use client";

import React from "react";
import { RefreshCw, Beaker, CheckCircle2 } from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import { SMART_SUBSTITUTIONS_CATALOG } from "../../lib/foodoscope/mockCatalog";
import SubstitutionCard from "../../components/SubstitutionCard";

const TARGET_KEYS = [
  { key: "paneer", label: "Paneer" },
  { key: "tofu", label: "Firm Tofu" },
  { key: "pasta", label: "Pasta" },
  { key: "rice", label: "Basmati Rice" },
  { key: "spinach", label: "Spinach (Palak)" },
];

export default function SmartSubstitutionsPage() {
  const {
    selectedSubstitutionIngredient,
    setSelectedSubstitutionIngredient,
    applySubstituteToPantry,
    ingredients,
  } = useFlavorIq();

  const activeKey = SMART_SUBSTITUTIONS_CATALOG[selectedSubstitutionIngredient]
    ? selectedSubstitutionIngredient
    : "paneer";

  const alternatives = SMART_SUBSTITUTIONS_CATALOG[activeKey] || [];

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-brand-dark to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5" />
            Molecular &amp; Culinary Ingredient Adaptation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Smart Ingredient Substitution
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            Missing an ingredient or adapting a dish for Vegan, High-Protein, or Gluten-Free diets? Select any target ingredient below to see FlavorDB-verified alternatives and update your active cooking context in one click.
          </p>
        </div>
      </section>

      {/* Target Ingredient Selector */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-brand-dark">
              Select Missing or Restricted Ingredient
            </h2>
            <p className="text-xs text-gray-500">
              Your active pantry currently has: {ingredients.join(", ") || "None"}
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-primary flex items-center gap-1">
            <Beaker className="w-3.5 h-3.5" />
            Ranked by volatile compound &amp; texture similarity
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {TARGET_KEYS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedSubstitutionIngredient(item.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                activeKey === item.key
                  ? "bg-brand-dark text-brand-lime border-brand-dark shadow-xs"
                  : "bg-brand-surface text-brand-dark border-brand-border hover:bg-brand-lime/50"
              }`}
            >
              Missing: {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Alternatives Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alternatives.map((sub, idx) => (
          <SubstitutionCard
            key={idx}
            sub={sub}
            onUseSubstitute={(target, substitute) =>
              applySubstituteToPantry(target, substitute)
            }
          />
        ))}
      </section>
    </div>
  );
}
