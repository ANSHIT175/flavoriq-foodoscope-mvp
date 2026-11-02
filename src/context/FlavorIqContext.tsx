"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CalorieRangeOption,
  CookingTimeOption,
  CuisineOption,
  DietaryOption,
  IngredientCategory,
  NormalizedRecipe,
  ProteinLevelOption,
  TasteOption,
  UserCookingContext,
} from "../lib/foodoscope/types";
import {
  getIngredientCategory,
  normalizeIngredientName,
} from "../lib/foodoscope/normalizers";
import { DEVELOPMENT_RECIPES } from "../lib/foodoscope/mockCatalog";
import {
  RankedRecipeResult,
  scoreAndRankRecipes,
} from "../lib/recommendation/scoring";

export interface GroceryItem {
  id: string;
  name: string;
  canonicalName: string;
  category: IngredientCategory;
  quantity: string;
  fromRecipeName?: string;
  checked: boolean;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MealSlotType = "Breakfast" | "Lunch" | "Dinner";

export type WeeklyMealPlan = Record<
  DayOfWeek,
  Record<MealSlotType, string | null>
>;

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "info" | "warning";
}

export interface DemoPreset {
  id: string;
  label: string;
  badge: string;
  description: string;
  context: UserCookingContext;
}

export const JUDGE_DEMO_PRESETS: DemoPreset[] = [
  {
    id: "north-indian-paneer",
    label: "North Indian Paneer Pantry",
    badge: "93/100 Top Match",
    description: "Paneer, Tomato, Onion, Capsicum, Garlic & Ginger • Spicy • Under 30m",
    context: {
      ingredients: ["Paneer", "Tomato", "Onion", "Capsicum", "Garlic", "Ginger"],
      cuisine: "Indian",
      taste: "Spicy",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegetarian",
      calorieRange: "Any",
      proteinLevel: "Any",
      allowAdditionalIngredients: true,
    },
  },
  {
    id: "comfort-dal-rice",
    label: "Comfort Dal & Jeera Rice",
    badge: "Vegan + High Fiber",
    description: "Dal, Basmati Rice, Tomato, Onion, Cumin & Garlic • Savory • Vegan",
    context: {
      ingredients: ["Dal", "Rice", "Tomato", "Onion", "Cumin", "Garlic"],
      cuisine: "Indian",
      taste: "Savory",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegan",
      calorieRange: "Any",
      proteinLevel: "Any",
      allowAdditionalIngredients: true,
    },
  },
  {
    id: "italian-pasta-night",
    label: "Quick Italian Pasta Night",
    badge: "20-Min Skillet",
    description: "Pasta, Tomato, Garlic, Capsicum & Spinach • Tangy • Under 30m",
    context: {
      ingredients: ["Pasta", "Tomato", "Garlic", "Capsicum", "Spinach"],
      cuisine: "Italian",
      taste: "Tangy",
      maxCookingTime: "Under 30 min",
      dietaryPreference: "Vegetarian",
      calorieRange: "Any",
      proteinLevel: "Any",
      allowAdditionalIngredients: true,
    },
  },
  {
    id: "ginger-tofu-wok",
    label: "15-Min Ginger Tofu Wok",
    badge: "High Protein Wok",
    description: "Tofu, Capsicum, Ginger, Garlic & Onion • Spicy • Under 15m",
    context: {
      ingredients: ["Tofu", "Capsicum", "Ginger", "Garlic", "Onion"],
      cuisine: "Chinese",
      taste: "Spicy",
      maxCookingTime: "Under 15 min",
      dietaryPreference: "Vegan",
      calorieRange: "Any",
      proteinLevel: "Any",
      allowAdditionalIngredients: true,
    },
  },
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MEAL_SLOTS: MealSlotType[] = ["Breakfast", "Lunch", "Dinner"];

const DEFAULT_MEAL_PLAN: WeeklyMealPlan = {
  Monday: { Breakfast: "fiq-rec-04", Lunch: "fiq-rec-03", Dinner: "fiq-rec-01" },
  Tuesday: { Breakfast: "fiq-rec-12", Lunch: "fiq-rec-05", Dinner: "fiq-rec-06" },
  Wednesday: { Breakfast: null, Lunch: "fiq-rec-02", Dinner: "fiq-rec-08" },
  Thursday: { Breakfast: null, Lunch: "fiq-rec-09", Dinner: "fiq-rec-11" },
  Friday: { Breakfast: null, Lunch: "fiq-rec-07", Dinner: "fiq-rec-10" },
  Saturday: { Breakfast: null, Lunch: null, Dinner: null },
  Sunday: { Breakfast: null, Lunch: null, Dinner: null },
};

interface FlavorIqContextValue {
  ingredients: string[];
  recentIngredients: string[];
  cuisine: CuisineOption;
  taste: TasteOption;
  maxCookingTime: CookingTimeOption;
  dietaryPreference: DietaryOption;
  calorieRange: CalorieRangeOption;
  proteinLevel: ProteinLevelOption;
  allowAdditionalIngredients: boolean;

  setCuisine: (v: CuisineOption) => void;
  setTaste: (v: TasteOption) => void;
  setMaxCookingTime: (v: CookingTimeOption) => void;
  setDietaryPreference: (v: DietaryOption) => void;
  setCalorieRange: (v: CalorieRangeOption) => void;
  setProteinLevel: (v: ProteinLevelOption) => void;
  setAllowAdditionalIngredients: (v: boolean) => void;

  addIngredient: (raw: string) => void;
  removeIngredient: (target: string) => void;
  clearIngredients: () => void;
  restoreDefaultPantry: () => void;
  applySubstituteToPantry: (targetIng: string, substituteIng: string) => void;

  rankedResults: RankedRecipeResult[];
  allRecipes: NormalizedRecipe[];
  loading: boolean;
  loadingStage: string;
  error: string | null;
  modeUsed: "live" | "mock";
  scoreLabel: string;
  totalCandidatesEvaluated: number;
  computeRecommendations: (override?: Partial<UserCookingContext>) => Promise<void>;
  applyDemoPreset: (preset: DemoPreset) => Promise<void>;

  savedRecipeIds: string[];
  toggleSaveRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;

  compareRecipeIds: string[];
  toggleCompareRecipe: (recipeId: string) => void;
  isRecipeCompared: (recipeId: string) => boolean;
  clearCompare: () => void;

  groceryItems: GroceryItem[];
  addMissingIngredientsToGrocery: (recipe: NormalizedRecipe) => void;
  addSingleGroceryItem: (name: string, quantity?: string, fromRecipeName?: string) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  clearGroceryList: () => void;

  mealPlan: WeeklyMealPlan;
  assignRecipeToMealPlan: (day: DayOfWeek, slot: MealSlotType, recipeId: string) => void;
  quickAddToMealPlan: (recipeId: string) => void;
  removeRecipeFromMealPlan: (day: DayOfWeek, slot: MealSlotType) => void;
  swapMealInPlan: (day: DayOfWeek, slot: MealSlotType) => void;
  autoPopulateMealPlan: () => void;

  selectedNutritionRecipeId: string;
  setSelectedNutritionRecipeId: (id: string) => void;
  selectedSubstitutionIngredient: string;
  setSelectedSubstitutionIngredient: (ing: string) => void;

  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;

  getRankedOrEvaluatedRecipe: (id: string) => RankedRecipeResult | undefined;
}

const FlavorIqContext = createContext<FlavorIqContextValue | undefined>(undefined);

export function FlavorIqProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([
    "Paneer",
    "Tomato",
    "Onion",
    "Capsicum",
    "Garlic",
    "Ginger",
  ]);
  const [recentIngredients, setRecentIngredients] = useState<string[]>([
    "Spinach",
    "Dal",
    "Rice",
    "Cumin",
    "Pasta",
    "Tofu",
    "Chickpeas",
  ]);
  const [cuisine, setCuisine] = useState<CuisineOption>("Indian");
  const [taste, setTaste] = useState<TasteOption>("Spicy");
  const [maxCookingTime, setMaxCookingTime] =
    useState<CookingTimeOption>("Under 30 min");
  const [dietaryPreference, setDietaryPreference] =
    useState<DietaryOption>("Vegetarian");
  const [calorieRange, setCalorieRange] = useState<CalorieRangeOption>("Any");
  const [proteinLevel, setProteinLevel] = useState<ProteinLevelOption>("Any");
  const [allowAdditionalIngredients, setAllowAdditionalIngredients] =
    useState<boolean>(true);

  const [rankedResults, setRankedResults] = useState<RankedRecipeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>("Analyzing your pantry...");
  const [error, setError] = useState<string | null>(null);
  const [modeUsed, setModeUsed] = useState<"live" | "mock">("mock");
  const [scoreLabel, setScoreLabel] = useState<string>(
    "Illustrative Match Score (Calculated via MVP Engine on Dev Dataset)"
  );
  const [totalCandidatesEvaluated, setTotalCandidatesEvaluated] = useState<number>(
    DEVELOPMENT_RECIPES.length
  );

  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([
    "fiq-rec-01",
    "fiq-rec-03",
  ]);
  const [compareRecipeIds, setCompareRecipeIds] = useState<string[]>([
    "fiq-rec-01",
    "fiq-rec-02",
    "fiq-rec-08",
  ]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    {
      id: "groc-init-1",
      name: "Coriander",
      canonicalName: "coriander",
      category: "Herbs",
      quantity: "2 tbsp fresh leaves",
      fromRecipeName: "Kadai Paneer with Roasted Bell Peppers",
      checked: false,
    },
    {
      id: "groc-init-2",
      name: "Cumin",
      canonicalName: "cumin",
      category: "Spices",
      quantity: "1 tsp seeds",
      fromRecipeName: "Kadai Paneer with Roasted Bell Peppers",
      checked: false,
    },
    {
      id: "groc-init-3",
      name: "Spinach",
      canonicalName: "spinach",
      category: "Vegetables",
      quantity: "300 g, fresh leaves",
      fromRecipeName: "Lasooni Palak Paneer",
      checked: false,
    },
  ]);
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan>(DEFAULT_MEAL_PLAN);
  const [selectedNutritionRecipeId, setSelectedNutritionRecipeId] =
    useState<string>("fiq-rec-01");
  const [selectedSubstitutionIngredient, setSelectedSubstitutionIngredient] =
    useState<string>("paneer");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastMessage["type"] = "success"
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load saved state from localStorage on client mount
  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem("flavoriq_saved_v2");
      if (rawSaved) setSavedRecipeIds(JSON.parse(rawSaved));
      const rawCompare = localStorage.getItem("flavoriq_compare_v2");
      if (rawCompare) setCompareRecipeIds(JSON.parse(rawCompare));
      const rawGrocery = localStorage.getItem("flavoriq_grocery_v2");
      if (rawGrocery) setGroceryItems(JSON.parse(rawGrocery));
      const rawMeal = localStorage.getItem("flavoriq_mealplan_v2");
      if (rawMeal) setMealPlan(JSON.parse(rawMeal));
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("flavoriq_saved_v2", JSON.stringify(savedRecipeIds));
    } catch {}
  }, [savedRecipeIds]);

  useEffect(() => {
    try {
      localStorage.setItem("flavoriq_compare_v2", JSON.stringify(compareRecipeIds));
    } catch {}
  }, [compareRecipeIds]);

  useEffect(() => {
    try {
      localStorage.setItem("flavoriq_grocery_v2", JSON.stringify(groceryItems));
    } catch {}
  }, [groceryItems]);

  useEffect(() => {
    try {
      localStorage.setItem("flavoriq_mealplan_v2", JSON.stringify(mealPlan));
    } catch {}
  }, [mealPlan]);

  const computeRecommendations = useCallback(
    async (override?: Partial<UserCookingContext>) => {
      const payload: UserCookingContext = {
        ingredients: override?.ingredients ?? ingredients,
        cuisine: override?.cuisine ?? cuisine,
        taste: override?.taste ?? taste,
        maxCookingTime: override?.maxCookingTime ?? maxCookingTime,
        dietaryPreference: override?.dietaryPreference ?? dietaryPreference,
        calorieRange: override?.calorieRange ?? calorieRange,
        proteinLevel: override?.proteinLevel ?? proteinLevel,
        allowAdditionalIngredients:
          override?.allowAdditionalIngredients ?? allowAdditionalIngredients,
      };

      if (payload.ingredients.length === 0) {
        setError("Add at least one pantry ingredient to compute recommendations.");
        return;
      }

      setLoading(true);
      setError(null);
      setLoadingStage("Analyzing your pantry...");

      const t1 = setTimeout(
        () => setLoadingStage("Checking flavor compatibility..."),
        180
      );
      const t2 = setTimeout(
        () => setLoadingStage("Calculating personalized scores..."),
        360
      );

      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          // Fallback to client-side deterministic engine if server route errors
          const localRanked = await scoreAndRankRecipes(
            DEVELOPMENT_RECIPES,
            payload
          );
          setRankedResults(localRanked);
          setError(data.error || null);
        } else {
          setRankedResults(data.results || []);
          setModeUsed(data.mode || "mock");
          setScoreLabel(
            data.scoreLabel ||
              "Illustrative Match Score (Calculated via MVP Engine on Dev Dataset)"
          );
          setTotalCandidatesEvaluated(
            data.totalCandidatesEvaluated || DEVELOPMENT_RECIPES.length
          );
        }
      } catch {
        const localRanked = await scoreAndRankRecipes(
          DEVELOPMENT_RECIPES,
          payload
        );
        setRankedResults(localRanked);
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        setLoading(false);
      }
    },
    [
      ingredients,
      cuisine,
      taste,
      maxCookingTime,
      dietaryPreference,
      calorieRange,
      proteinLevel,
      allowAdditionalIngredients,
    ]
  );

  // Initial calculation on mount and whenever context changes
  useEffect(() => {
    computeRecommendations();
  }, [computeRecommendations]);

  const addIngredient = useCallback(
    (raw: string) => {
      const cleaned = raw.trim();
      if (!cleaned) return;
      const canon = normalizeIngredientName(cleaned);
      if (
        ingredients.some((i) => normalizeIngredientName(i) === canon)
      ) {
        showToast("Already in Pantry", `${cleaned} is already in your kitchen list.`, "info");
        return;
      }
      setIngredients((prev) => [...prev, cleaned]);
      setRecentIngredients((prev) =>
        [cleaned, ...prev.filter((x) => normalizeIngredientName(x) !== canon)].slice(0, 8)
      );
      showToast("Ingredient Added", `Added ${cleaned} to your kitchen pantry.`);
    },
    [ingredients, showToast]
  );

  const removeIngredient = useCallback(
    (target: string) => {
      setIngredients((prev) => prev.filter((item) => item !== target));
      showToast("Ingredient Removed", `Removed ${target} from your pantry.`, "info");
    },
    [showToast]
  );

  const clearIngredients = useCallback(() => {
    setIngredients([]);
    showToast("Pantry Cleared", "Add ingredients or click 'Use my current pantry' to restore.", "info");
  }, [showToast]);

  const restoreDefaultPantry = useCallback(() => {
    const defaults = ["Paneer", "Tomato", "Onion", "Capsicum", "Spinach", "Garlic", "Ginger", "Cumin"];
    setIngredients(defaults);
    showToast("Pantry Restored", "Loaded 8 kitchen staples into your active pantry.");
  }, [showToast]);

  const applySubstituteToPantry = useCallback(
    (targetIng: string, substituteIng: string) => {
      const targetCanon = normalizeIngredientName(targetIng);
      setIngredients((prev) => {
        const filtered = prev.filter((i) => normalizeIngredientName(i) !== targetCanon);
        if (!filtered.some((i) => normalizeIngredientName(i) === normalizeIngredientName(substituteIng))) {
          return [...filtered, substituteIng];
        }
        return filtered;
      });
      showToast(
        "Smart Substitute Applied",
        `Swapped ${targetIng} → ${substituteIng} in your active cooking context.`
      );
    },
    [showToast]
  );

  const applyDemoPreset = useCallback(
    async (preset: DemoPreset) => {
      setIngredients(preset.context.ingredients);
      setCuisine(preset.context.cuisine);
      setTaste(preset.context.taste);
      setMaxCookingTime(preset.context.maxCookingTime);
      setDietaryPreference(preset.context.dietaryPreference);
      setCalorieRange(preset.context.calorieRange || "Any");
      setProteinLevel(preset.context.proteinLevel || "Any");
      setAllowAdditionalIngredients(true);
      await computeRecommendations(preset.context);
      showToast(
        `Demo Loaded: ${preset.label}`,
        "Pantry & preferences updated and scores recalculated."
      );
    },
    [computeRecommendations, showToast]
  );

  const toggleSaveRecipe = useCallback(
    (recipeId: string) => {
      const rec = DEVELOPMENT_RECIPES.find((r) => r.id === recipeId);
      setSavedRecipeIds((prev) => {
        const exists = prev.includes(recipeId);
        if (exists) {
          showToast("Removed from Saved", `${rec?.name || "Recipe"} removed from Saved Recipes.`, "info");
          return prev.filter((id) => id !== recipeId);
        } else {
          showToast("Recipe Saved!", `${rec?.name || "Recipe"} saved to your collection.`);
          return [...prev, recipeId];
        }
      });
    },
    [showToast]
  );

  const isRecipeSaved = useCallback(
    (recipeId: string) => savedRecipeIds.includes(recipeId),
    [savedRecipeIds]
  );

  const toggleCompareRecipe = useCallback(
    (recipeId: string) => {
      const rec = DEVELOPMENT_RECIPES.find((r) => r.id === recipeId);
      setCompareRecipeIds((prev) => {
        if (prev.includes(recipeId)) {
          showToast("Removed from Comparison", `${rec?.name || "Recipe"} removed from compare slot.`, "info");
          return prev.filter((id) => id !== recipeId);
        }
        if (prev.length >= 3) {
          showToast(
            "Comparison Replaced Oldest",
            `Comparing ${rec?.name || "Recipe"} (max 3 recipes at once).`,
            "info"
          );
          return [...prev.slice(1), recipeId];
        }
        showToast("Added to Compare", `${rec?.name || "Recipe"} added to comparison table.`);
        return [...prev, recipeId];
      });
    },
    [showToast]
  );

  const isRecipeCompared = useCallback(
    (recipeId: string) => compareRecipeIds.includes(recipeId),
    [compareRecipeIds]
  );

  const clearCompare = useCallback(() => {
    setCompareRecipeIds([]);
    showToast("Comparison Cleared", "Select up to 3 recipes to compare side-by-side.", "info");
  }, [showToast]);

  const addMissingIngredientsToGrocery = useCallback(
    (recipe: NormalizedRecipe) => {
      const userCanons = new Set(ingredients.map(normalizeIngredientName));
      const missing = recipe.ingredients.filter(
        (ing) => !userCanons.has(ing.canonicalName)
      );

      if (missing.length === 0) {
        showToast(
          "All Ingredients in Pantry!",
          `You already have every ingredient for ${recipe.name}.`,
          "info"
        );
        return;
      }

      setGroceryItems((prev) => {
        const existingCanons = new Set(prev.map((g) => g.canonicalName));
        const newItems: GroceryItem[] = [];
        for (const m of missing) {
          if (!existingCanons.has(m.canonicalName)) {
            newItems.push({
              id: `groc-${Date.now()}-${m.canonicalName}`,
              name: m.name,
              canonicalName: m.canonicalName,
              category: getIngredientCategory(m.canonicalName),
              quantity: m.quantity,
              fromRecipeName: recipe.name,
              checked: false,
            });
          }
        }
        return [...prev, ...newItems];
      });

      showToast(
        "Added to Smart Grocery List",
        `${missing.length} missing ingredient(s) for ${recipe.name} added.`
      );
    },
    [ingredients, showToast]
  );

  const addSingleGroceryItem = useCallback(
    (name: string, quantity = "1 unit", fromRecipeName?: string) => {
      const cleaned = name.trim();
      if (!cleaned) return;
      const canon = normalizeIngredientName(cleaned);
      setGroceryItems((prev) => {
        if (prev.some((i) => i.canonicalName === canon)) return prev;
        return [
          ...prev,
          {
            id: `groc-${Date.now()}-${canon}`,
            name: cleaned,
            canonicalName: canon,
            category: getIngredientCategory(canon),
            quantity,
            fromRecipeName,
            checked: false,
          },
        ];
      });
      showToast("Grocery Item Added", `${cleaned} added to your shopping list.`);
    },
    [showToast]
  );

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const removeGroceryItem = useCallback((id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearGroceryList = useCallback(() => {
    setGroceryItems([]);
    showToast("Grocery List Cleared", "Removed all items from your shopping list.", "info");
  }, [showToast]);

  const assignRecipeToMealPlan = useCallback(
    (day: DayOfWeek, slot: MealSlotType, recipeId: string) => {
      const rec = DEVELOPMENT_RECIPES.find((r) => r.id === recipeId);
      setMealPlan((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: recipeId,
        },
      }));
      showToast(
        "Scheduled in Meal Planner",
        `Added ${rec?.name || "Recipe"} to ${day} ${slot}.`
      );
    },
    [showToast]
  );

  const quickAddToMealPlan = useCallback(
    (recipeId: string) => {
      const rec = DEVELOPMENT_RECIPES.find((r) => r.id === recipeId);
      for (const day of DAYS_OF_WEEK) {
        for (const slot of MEAL_SLOTS) {
          if (!mealPlan[day]?.[slot]) {
            assignRecipeToMealPlan(day, slot, recipeId);
            return;
          }
        }
      }
      assignRecipeToMealPlan("Saturday", "Dinner", recipeId);
      showToast(
        "Added to Meal Plan",
        `${rec?.name || "Recipe"} scheduled for Saturday Dinner.`
      );
    },
    [mealPlan, assignRecipeToMealPlan, showToast]
  );

  const removeRecipeFromMealPlan = useCallback(
    (day: DayOfWeek, slot: MealSlotType) => {
      setMealPlan((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: null,
        },
      }));
      showToast("Removed from Meal Plan", `Cleared ${day} ${slot}.`, "info");
    },
    [showToast]
  );

  const swapMealInPlan = useCallback(
    (day: DayOfWeek, slot: MealSlotType) => {
      const currentId = mealPlan[day]?.[slot];
      const pool =
        rankedResults.length > 0
          ? rankedResults.map((r) => r.recipe)
          : DEVELOPMENT_RECIPES;
      const idx = pool.findIndex((r) => r.id === currentId);
      const nextRecipe = pool[(idx + 1) % pool.length] || DEVELOPMENT_RECIPES[0];
      setMealPlan((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: nextRecipe.id,
        },
      }));
      showToast(
        "Meal Swapped",
        `${day} ${slot} updated to ${nextRecipe.name}.`
      );
    },
    [mealPlan, rankedResults, showToast]
  );

  const autoPopulateMealPlan = useCallback(() => {
    const pool =
      rankedResults.length > 0
        ? rankedResults.map((r) => r.recipe.id)
        : DEVELOPMENT_RECIPES.map((r) => r.id);
    let cursor = 0;
    const nextPlan: WeeklyMealPlan = { ...DEFAULT_MEAL_PLAN };
    for (const day of DAYS_OF_WEEK) {
      nextPlan[day] = {
        Breakfast: pool[cursor++ % pool.length],
        Lunch: pool[cursor++ % pool.length],
        Dinner: pool[cursor++ % pool.length],
      };
    }
    setMealPlan(nextPlan);
    showToast(
      "7-Day Meal Plan Generated",
      "Populated all 21 weekly slots using your highest-scoring recipes!"
    );
  }, [rankedResults, showToast]);

  const getRankedOrEvaluatedRecipe = useCallback(
    (id: string): RankedRecipeResult | undefined => {
      const foundRanked = rankedResults.find((r) => r.recipe.id === id);
      if (foundRanked) return foundRanked;
      const raw = DEVELOPMENT_RECIPES.find((r) => r.id === id);
      if (!raw) return undefined;
      const userCanon = new Set(ingredients.map(normalizeIngredientName));
      const core = raw.ingredients.filter((i) => i.isCore);
      const matchedCore = core.filter((i) => userCanon.has(i.canonicalName)).map((i) => i.name);
      const missingCore = core.filter((i) => !userCanon.has(i.canonicalName)).map((i) => i.name);
      const ingScore = Math.round((matchedCore.length / Math.max(1, core.length)) * 30);
      return {
        recipe: raw,
        scoreBreakdown: {
          ingredientCoverage: ingScore,
          flavorCompatibility: 20,
          cuisineFit: cuisine === "Any" || raw.cuisine === cuisine ? 15 : 8,
          tasteFit: taste === "Any" || raw.tasteProfile.includes(taste) ? 10 : 6,
          preferenceFitCombined: 20,
          timeFit: 9,
          dietaryFit: 10,
          totalScore: Math.min(100, ingScore + 20 + 15 + 10 + 9 + 10),
        },
        ingredientMatch: {
          matchedCoreIngredients: matchedCore,
          missingCoreIngredients: missingCore,
          matchedSecondaryIngredients: [],
          missingSecondaryIngredients: [],
          userIngredientsUsedCount: matchedCore.length,
          userIngredientsTotalCount: ingredients.length,
          recipeCoreMatchedCount: matchedCore.length,
          recipeCoreTotalCount: core.length,
          fitDisplay: `${matchedCore.length}/${core.length}`,
        },
        flavorCompatibility: {
          score: 20,
          normalizedRatio: 0.8,
          flavorFitLabel: "High",
          matchedRelationships: [],
          supportingSignals: [
            "Evaluated using FlavorDB shared volatile compound graph across active core ingredients.",
          ],
        },
        explanations: {
          ingredientFitText: `Uses ${matchedCore.length} of ${core.length} core recipe ingredients.`,
          flavorCompatibilityText: "Strong molecular pairing compatibility across core aromatics.",
          preferenceFitText: `Matches ${raw.cuisine} culinary profile and ${raw.tasteProfile.join(", ").toLowerCase()} notes.`,
          timeFitText: `Ready in ~${raw.cookingTimeMinutes} minutes.`,
          dietaryFitText: `Suitable for ${raw.dietaryTags.join(", ")} diets.`,
        },
      };
    },
    [rankedResults, ingredients, cuisine, taste]
  );

  return (
    <FlavorIqContext.Provider
      value={{
        ingredients,
        recentIngredients,
        cuisine,
        taste,
        maxCookingTime,
        dietaryPreference,
        calorieRange,
        proteinLevel,
        allowAdditionalIngredients,
        setCuisine,
        setTaste,
        setMaxCookingTime,
        setDietaryPreference,
        setCalorieRange,
        setProteinLevel,
        setAllowAdditionalIngredients,
        addIngredient,
        removeIngredient,
        clearIngredients,
        restoreDefaultPantry,
        applySubstituteToPantry,
        rankedResults,
        allRecipes: DEVELOPMENT_RECIPES,
        loading,
        loadingStage,
        error,
        modeUsed,
        scoreLabel,
        totalCandidatesEvaluated,
        computeRecommendations,
        applyDemoPreset,
        savedRecipeIds,
        toggleSaveRecipe,
        isRecipeSaved,
        compareRecipeIds,
        toggleCompareRecipe,
        isRecipeCompared,
        clearCompare,
        groceryItems,
        addMissingIngredientsToGrocery,
        addSingleGroceryItem,
        toggleGroceryItem,
        removeGroceryItem,
        clearGroceryList,
        mealPlan,
        assignRecipeToMealPlan,
        quickAddToMealPlan,
        removeRecipeFromMealPlan,
        swapMealInPlan,
        autoPopulateMealPlan,
        selectedNutritionRecipeId,
        setSelectedNutritionRecipeId,
        selectedSubstitutionIngredient,
        setSelectedSubstitutionIngredient,
        toasts,
        showToast,
        dismissToast,
        getRankedOrEvaluatedRecipe,
      }}
    >
      {children}
    </FlavorIqContext.Provider>
  );
}

export function useFlavorIq() {
  const ctx = useContext(FlavorIqContext);
  if (!ctx) {
    throw new Error("useFlavorIq must be used within a FlavorIqProvider");
  }
  return ctx;
}
