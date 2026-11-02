"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  RefreshCw,
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  Beaker,
  ArrowLeft,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";

interface DetailedSubOption {
  id: string;
  name: string;
  compatibility: number;
  flavor: string;
  texture: string;
  protein: string;
  calories: string;
  diets: string[];
  sharedMolecules: string[];
  note: string;
}

const WORKSPACE_DATA: Record<
  string,
  {
    originalName: string;
    originalFlavor: string;
    originalTexture: string;
    originalProtein: string;
    originalCalories: string;
    originalDiets: string[];
    options: DetailedSubOption[];
  }
> = {
  paneer: {
    originalName: "PANEER",
    originalFlavor: "Milky, sweet lactone (delta-decalactone)",
    originalTexture: "Firm, non-melting pressed curd",
    originalProtein: "18g / 100g",
    originalCalories: "265 kcal / 100g",
    originalDiets: ["Vegetarian", "Gluten-Free", "High-Protein"],
    options: [
      {
        id: "tofu",
        name: "TOFU (EXTRA FIRM)",
        compatibility: 94,
        flavor: "Clean neutral soy curd; absorbs masala & wok glazes",
        texture: "Firm pan-searable cube structure",
        protein: "16g / 100g",
        calories: "144 kcal / 100g (-45% kcal)",
        diets: ["Vegan", "Vegetarian", "Dairy-Free", "Low-Oil", "Gluten-Free"],
        sharedMolecules: ["hexanal", "1-octen-3-ol", "benzaldehyde"],
        note: "Best overall plant-based substitute for Kadai Paneer, Palak Paneer, and stir-fries.",
      },
      {
        id: "tempeh",
        name: "TEMPEH CUBES",
        compatibility: 87,
        flavor: "Nutty, savory roasted pyrazines",
        texture: "Dense, hearty bite; holds up in rich gravies",
        protein: "20g / 100g (+protein)",
        calories: "192 kcal / 100g",
        diets: ["Vegan", "High-Protein", "Dairy-Free", "Gluten-Free"],
        sharedMolecules: ["2-acetylpyrazine", "hexanal", "maltol"],
        note: "High-protein, high-fiber fermented soy option with rich umami depth.",
      },
      {
        id: "chickpeas",
        name: "ROASTED CHICKPEAS",
        compatibility: 72,
        flavor: "Earthy, nutty garbanzo aldehydes",
        texture: "Tender-crisp whole legume",
        protein: "15g / 100g",
        calories: "164 kcal / 100g",
        diets: ["Vegan", "Dairy-Free", "Low-Oil", "Gluten-Free"],
        sharedMolecules: ["hexanal", "geranylacetone"],
        note: "Soy-free whole pantry staple that pairs naturally with tomato-cumin gravies.",
      },
    ],
  },
  tofu: {
    originalName: "FIRM TOFU",
    originalFlavor: "Neutral bean curd with mild hexanal",
    originalTexture: "Soft-firm porous cube",
    originalProtein: "15g / 100g",
    originalCalories: "144 kcal / 100g",
    originalDiets: ["Vegan", "Vegetarian", "Dairy-Free"],
    options: [
      {
        id: "paneer",
        name: "PANEER CUBES",
        compatibility: 92,
        flavor: "Rich milky lactones create Indo-Chinese fusion sear",
        texture: "Chewy, golden-seared cube",
        protein: "18g / 100g",
        calories: "265 kcal / 100g",
        diets: ["Vegetarian", "High-Protein", "Gluten-Free"],
        sharedMolecules: ["hexanal", "2-isobutyl-3-methoxypyrazine"],
        note: "Transforms Szechuan Tofu into classic Indo-Chinese Chilli Paneer.",
      },
      {
        id: "mushroom",
        name: "SHIITAKE / BUTTON MUSHROOMS",
        compatibility: 86,
        flavor: "Deep fungal umami (1-octen-3-ol)",
        texture: "Meaty, tender seared slices",
        protein: "9g / 100g",
        calories: "45 kcal / 100g (Ultra low-cal)",
        diets: ["Vegan", "Low-Oil", "Dairy-Free", "Gluten-Free"],
        sharedMolecules: ["1-octen-3-ol", "methional"],
        note: "Amplifies natural glutamate umami in ginger-garlic woks and rice bowls.",
      },
      {
        id: "chickpeas",
        name: "CRISPY CHICKPEAS",
        compatibility: 78,
        flavor: "Nutty roasted legume",
        texture: "Crunchy exterior, creamy center",
        protein: "15g / 100g",
        calories: "164 kcal / 100g",
        diets: ["Vegan", "Dairy-Free", "Gluten-Free"],
        sharedMolecules: ["hexanal", "linalool"],
        note: "Soy-free pantry swap for stir-fries and Thai coconut curries.",
      },
    ],
  },
  pasta: {
    originalName: "DURUM PASTA",
    originalFlavor: "Toasted wheat maltol",
    originalTexture: "Al dente extruded tube",
    originalProtein: "12g / 100g",
    originalCalories: "350 kcal / 100g",
    originalDiets: ["Vegetarian", "Vegan", "Dairy-Free"],
    options: [
      {
        id: "chickpea-pasta",
        name: "CHICKPEA PENNE",
        compatibility: 94,
        flavor: "Warm nutty legume notes complement tomato arrabbiata",
        texture: "Firm al dente bite",
        protein: "22g / 100g (+83% protein)",
        calories: "320 kcal / 100g",
        diets: ["Vegan", "Gluten-Free", "High-Protein", "Dairy-Free"],
        sharedMolecules: ["hexanal", "maltol", "2-acetylpyrrole"],
        note: "Makes Italian pasta night 100% Gluten-Free and High-Protein.",
      },
      {
        id: "rice-noodles",
        name: "FLAT RICE NOODLES",
        compatibility: 84,
        flavor: "Clean neutral grain",
        texture: "Silky, tender ribbons",
        protein: "8g / 100g",
        calories: "310 kcal / 100g",
        diets: ["Vegan", "Gluten-Free", "Low-Oil", "Dairy-Free"],
        sharedMolecules: ["hexanal", "2-acetyl-1-pyrroline"],
        note: "Light, gluten-free noodle alternative that absorbs garlic-tomato oil.",
      },
    ],
  },
  rice: {
    originalName: "BASMATI RICE",
    originalFlavor: "Fragrant pandan-like 2-acetyl-1-pyrroline",
    originalTexture: "Fluffy long-grain",
    originalProtein: "8g / 100g",
    originalCalories: "345 kcal / 100g",
    originalDiets: ["Vegan", "Gluten-Free", "Low-Oil"],
    options: [
      {
        id: "quinoa",
        name: "TRICOLOR QUINOA",
        compatibility: 91,
        flavor: "Nutty, earthy roasted grain",
        texture: "Fluffy with subtle pop",
        protein: "14g / 100g (Complete protein)",
        calories: "315 kcal / 100g",
        diets: ["Vegan", "Gluten-Free", "High-Protein", "Low-Oil"],
        sharedMolecules: ["hexanal", "2-acetylpyrrole"],
        note: "Boosts fiber and complete amino acids for Dal Tadka and Mexican Bean Bowls.",
      },
    ],
  },
  spinach: {
    originalName: "SPINACH (PALAK)",
    originalFlavor: "Herbaceous green leaf ((Z)-3-hexenol)",
    originalTexture: "Tender wilted leaf",
    originalProtein: "3g / 100g",
    originalCalories: "23 kcal / 100g",
    originalDiets: ["Vegan", "Gluten-Free", "Low-Oil"],
    options: [
      {
        id: "kale",
        name: "BABY KALE / METHI LEAVES",
        compatibility: 90,
        flavor: "Earthy, aromatic green volatiles",
        texture: "Hearty wilted greens",
        protein: "4.3g / 100g",
        calories: "35 kcal / 100g",
        diets: ["Vegan", "Gluten-Free", "Low-Oil"],
        sharedMolecules: ["(Z)-3-hexenol", "hexanal", "linalool"],
        note: "Direct green-leaf replacement for Palak Paneer, Dal, and Pasta.",
      },
    ],
  },
};

export default function SmartSubstitutionWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.id ? String(params.id) : null;

  const {
    selectedSubstitutionIngredient,
    setSelectedSubstitutionIngredient,
    applySubstituteToPantry,
    allRecipes,
  } = useFlavorIq();

  const contextRecipe = recipeId
    ? allRecipes.find((r) => r.id === recipeId)
    : null;

  const targetKey = WORKSPACE_DATA[selectedSubstitutionIngredient]
    ? selectedSubstitutionIngredient
    : "paneer";
  const currentGroup = WORKSPACE_DATA[targetKey];

  const [selectedSubIndex, setSelectedSubIndex] = useState<number>(0);
  const activeSub =
    currentGroup.options[selectedSubIndex] || currentGroup.options[0];

  const handleApply = () => {
    const cleanSubName = activeSub.name
      .split("(")[0]
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    applySubstituteToPantry(currentGroup.originalName, cleanSubName);
    if (contextRecipe) {
      router.push(`/recipes/${contextRecipe.id}`);
    }
  };

  return (
    <div className="space-y-8">
      {contextRecipe && (
        <div className="flex items-center justify-between">
          <Link
            href={`/recipes/${contextRecipe.id}`}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-primary hover:text-brand-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Adapting Recipe: {contextRecipe.name}
          </Link>
        </div>
      )}

      {/* Workspace Header */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark to-brand-primary text-white p-6 sm:p-8 shadow-md">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
          <RefreshCw className="w-3.5 h-3.5" />
          3-Column Molecular Substitution Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
          Smart Ingredient Substitution Lab
        </h1>
        <p className="text-xs sm:text-sm text-brand-lime/90 max-w-2xl mt-1">
          Select an original ingredient on the left, choose a FlavorDB-ranked replacement in the center, and inspect the side-by-side Flavor, Texture, Protein, Calorie, and Diet comparison on the right.
        </p>
      </section>

      {/* 3-COLUMN WORKSPACE: LEFT = Original Ingredient, CENTER = Replacement Suggestions, RIGHT = Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Original Ingredient */}
        <section className="lg:col-span-3 bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
              Column 1 • Original Ingredient
            </span>
            <h2 className="text-base font-extrabold text-brand-dark">
              Select Target to Replace
            </h2>

            <div className="space-y-2 pt-1">
              {Object.entries(WORKSPACE_DATA).map(([key, item]) => {
                const active = key === targetKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedSubstitutionIngredient(key);
                      setSelectedSubIndex(0);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      active
                        ? "bg-brand-dark text-brand-lime border-brand-dark font-extrabold shadow-xs"
                        : "bg-brand-surface/50 text-brand-dark border-brand-border hover:bg-brand-lime/40 font-bold"
                    }`}
                  >
                    <span className="text-xs">{item.originalName}</span>
                    <span className="text-[10px] opacity-80">
                      {item.options.length} swaps
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-extrabold block">
              Baseline: {currentGroup.originalName}
            </span>
            <p className="text-[11px]">{currentGroup.originalProtein} Protein</p>
            <p className="text-[11px]">{currentGroup.originalCalories}</p>
          </div>
        </section>

        {/* CENTER COLUMN: Replacement Suggestions */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-brand-border p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary block">
              Column 2 • Replacement Suggestions
            </span>
            <h2 className="text-base font-extrabold text-brand-dark">
              Ranked Alternatives for {currentGroup.originalName}
            </h2>
          </div>

          {/* Visual Flow Header */}
          <div className="p-3 rounded-xl bg-brand-surface text-center font-extrabold text-xs text-brand-dark border border-brand-border">
            {currentGroup.originalName}
            <ArrowDown className="w-4 h-4 text-brand-primary mx-auto my-1" />
            Select Replacement Below
          </div>

          <div className="space-y-3">
            {currentGroup.options.map((opt, idx) => {
              const selected = idx === selectedSubIndex;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSubIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition space-y-2 ${
                    selected
                      ? "bg-brand-lime/40 border-brand-primary shadow-sm ring-2 ring-brand-primary/30"
                      : "bg-white border-brand-border hover:bg-brand-surface/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-brand-dark">
                      {opt.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-dark text-brand-lime">
                      {opt.compatibility}% compatibility
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full"
                      style={{ width: `${opt.compatibility}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {opt.note}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Side-by-Side Comparison Matrix */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary block">
                  Column 3 • Molecular &amp; Sensory Comparison
                </span>
                <h2 className="text-lg font-extrabold text-brand-dark">
                  {currentGroup.originalName} vs. {activeSub.name}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold">
                {activeSub.compatibility}% Match
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-surface/50 border border-brand-border grid grid-cols-12 gap-2">
                <span className="col-span-3 font-extrabold text-gray-500 uppercase">
                  Flavor
                </span>
                <div className="col-span-9 space-y-1">
                  <p className="text-gray-500">
                    <strong>Original:</strong> {currentGroup.originalFlavor}
                  </p>
                  <p className="text-brand-dark font-bold">
                    <strong>Substitute:</strong> {activeSub.flavor}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface/50 border border-brand-border grid grid-cols-12 gap-2">
                <span className="col-span-3 font-extrabold text-gray-500 uppercase">
                  Texture
                </span>
                <div className="col-span-9 space-y-1">
                  <p className="text-gray-500">
                    <strong>Original:</strong> {currentGroup.originalTexture}
                  </p>
                  <p className="text-brand-dark font-bold">
                    <strong>Substitute:</strong> {activeSub.texture}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">
                    Protein Comparison
                  </span>
                  <p className="text-xs font-extrabold text-emerald-950 mt-1">
                    {activeSub.protein}
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    vs. {currentGroup.originalProtein}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] font-extrabold uppercase text-amber-800 block">
                    Calorie Comparison
                  </span>
                  <p className="text-xs font-extrabold text-amber-950 mt-1">
                    {activeSub.calories}
                  </p>
                  <p className="text-[10px] text-amber-700">
                    vs. {currentGroup.originalCalories}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-1.5">
                  <Beaker className="w-3.5 h-3.5 text-brand-primary" />
                  Shared FlavorDB Molecules
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSub.sharedMolecules.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-0.5 rounded bg-brand-surface border border-brand-border font-mono text-[11px] font-bold text-brand-dark"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Diet Compatibility Unlocked
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSub.diets.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 px-5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-sm font-extrabold shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
            Apply Substitute (Swap {currentGroup.originalName} → {activeSub.name})
          </button>
        </section>
      </div>
    </div>
  );
}
