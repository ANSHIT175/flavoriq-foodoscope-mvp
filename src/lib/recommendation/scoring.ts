import {
  CuisineOption,
  DietaryOption,
  FlavorCompatibilityResult,
  NormalizedRecipe,
  TasteOption,
  UserCookingContext,
} from "../foodoscope/types";
import {
  getIngredientCategory,
  isIngredientMatch,
  normalizeIngredientName,
} from "../foodoscope/normalizers";
import { getFlavorCompatibility } from "../foodoscope/flavorDb";
import { SMART_SUBSTITUTIONS_CATALOG } from "../foodoscope/mockCatalog";

export const SCORING_WEIGHTS = {
  ingredientCoverage: 30,
  flavorCompatibility: 25,
  cuisineFit: 15,
  tasteFit: 10,
  timeFit: 10,
  dietaryFit: 10,
} as const;

export interface ScoreBreakdown {
  ingredientCoverage: number; // 0 - 30
  flavorCompatibility: number; // 0 - 25
  cuisineFit: number; // 0 - 15
  tasteFit: number; // 0 - 10
  preferenceFitCombined: number; // cuisineFit + tasteFit (0 - 25)
  timeFit: number; // 0 - 10
  dietaryFit: number; // 0 - 10
  totalScore: number; // 0 - 100
}

export interface IngredientMatchSummary {
  matchedCoreIngredients: string[];
  missingCoreIngredients: string[];
  matchedSecondaryIngredients: string[];
  missingSecondaryIngredients: string[];
  userIngredientsUsedCount: number;
  userIngredientsTotalCount: number;
  recipeCoreMatchedCount: number;
  recipeCoreTotalCount: number;
  fitDisplay: string;
}

export interface RankedRecipeResult {
  recipe: NormalizedRecipe;
  scoreBreakdown: ScoreBreakdown;
  ingredientMatch: IngredientMatchSummary;
  flavorCompatibility: FlavorCompatibilityResult;
  explanations: {
    ingredientFitText: string;
    flavorCompatibilityText: string;
    preferenceFitText: string;
    timeFitText: string;
    dietaryFitText: string;
  };
}

export function parseMaxTimeMinutes(option: UserCookingContext["maxCookingTime"]): number | null {
  switch (option) {
    case "Under 15 min":
      return 15;
    case "Under 30 min":
      return 30;
    case "Under 45 min":
      return 45;
    case "Under 60 min":
      return 60;
    default:
      return null;
  }
}

export function matchesCalorieRange(
  calories: number,
  range?: UserCookingContext["calorieRange"]
): boolean {
  if (!range || range === "Any") return true;
  if (range === "Under 300") return calories < 300;
  if (range === "300–500") return calories >= 300 && calories <= 500;
  if (range === "500–700") return calories > 500 && calories <= 700;
  if (range === "700+") return calories > 700;
  return true;
}

export function matchesProteinLevel(
  proteinG: number,
  level?: UserCookingContext["proteinLevel"]
): boolean {
  if (!level || level === "Any") return true;
  if (level === "Low") return proteinG < 12;
  if (level === "Medium") return proteinG >= 12 && proteinG < 17;
  if (level === "High") return proteinG >= 17;
  return true;
}

/**
 * Generates custom, flavor-matched recipes on the fly whenever the user enters custom pantry
 * ingredients (e.g. "Maggie", "Broccoli", "Oats", "Corn", "Cheese", etc.) so they ALWAYS get
 * recipes centered around their exact active pantry rather than unrelated default dishes.
 */
function buildDynamicPantryRecipes(
  context: UserCookingContext
): NormalizedRecipe[] {
  const rawIngs = context.ingredients.map((i) => i.trim()).filter(Boolean);
  if (rawIngs.length === 0) return [];

  const primaryRaw = rawIngs[0];
  const primaryCanon = normalizeIngredientName(primaryRaw);
  const displayPrimary =
    primaryRaw.charAt(0).toUpperCase() + primaryRaw.slice(1);

  const chosenCuisine: Exclude<CuisineOption, "Any"> =
    context.cuisine === "Any" ? "Indian" : context.cuisine;
  const chosenTaste: Exclude<TasteOption, "Any"> =
    context.taste === "Any" ? "Spicy" : context.taste;
  const chosenDiet: Exclude<DietaryOption, "No preference"> =
    context.dietaryPreference === "No preference"
      ? "Vegetarian"
      : context.dietaryPreference;

  const coreList = rawIngs.slice(0, 4).map((ing) => ({
    name: ing.charAt(0).toUpperCase() + ing.slice(1),
    canonicalName: normalizeIngredientName(ing),
    quantity: "1 cup / as needed",
    category: getIngredientCategory(ing),
    isCore: true,
  }));

  return [
    {
      id: `fiq-dyn-${primaryCanon}-1`,
      recipeDbId: `RDB-DYN-${primaryCanon.toUpperCase().slice(0, 4)}-01`,
      name: `Masala ${displayPrimary} & Roasted Garlic Skillet`,
      cuisine: chosenCuisine,
      region: `${chosenCuisine} Home Style`,
      tasteProfile: [chosenTaste, "Savory"],
      cookingTimeMinutes: 15,
      dietaryTags: [chosenDiet, "Low-oil"],
      processes: ["saute", "simmer", "tadka"],
      utensils: ["skillet", "spatula"],
      nutrition: {
        calories: 310,
        proteinG: 14,
        carbsG: 42,
        fatG: 9,
        fiberG: 6,
      },
      ingredients: [
        ...coreList,
        {
          name: "Garlic",
          canonicalName: "garlic",
          quantity: "3 cloves minced",
          category: "Spices",
          isCore: false,
        },
        {
          name: "Cumin",
          canonicalName: "cumin",
          quantity: "1 tsp roasted",
          category: "Spices",
          isCore: false,
        },
      ],
      instructions: [
        `Prep ${rawIngs.join(", ")} into bite-sized pieces.`,
        `Heat 1 tbsp oil in a skillet and temper garlic and cumin until aromatic.`,
        `Toss in ${displayPrimary} and cook over medium-high flame for 8–10 minutes until tender and well-coated in masala.`,
        `Garnish with fresh herbs and serve hot.`,
      ],
      image:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
      sourceUrl: "/recipes",
      adaptations: SMART_SUBSTITUTIONS_CATALOG.paneer,
    },
    {
      id: `fiq-dyn-${primaryCanon}-2`,
      recipeDbId: `RDB-DYN-${primaryCanon.toUpperCase().slice(0, 4)}-02`,
      name: `Wok-Tossed Chilli Garlic ${displayPrimary} Bowl`,
      cuisine: context.cuisine === "Any" ? "Chinese" : chosenCuisine,
      region: "High-Heat Wok",
      tasteProfile: ["Spicy", "Tangy", "Savory"],
      cookingTimeMinutes: 14,
      dietaryTags: ["Vegetarian", "Vegan", "Dairy-free"],
      processes: ["sear", "stir-fry"],
      utensils: ["wok", "tongs"],
      nutrition: {
        calories: 295,
        proteinG: 15,
        carbsG: 38,
        fatG: 8,
        fiberG: 5,
      },
      ingredients: [
        ...coreList,
        {
          name: "Ginger",
          canonicalName: "ginger",
          quantity: "1 tsp minced",
          category: "Spices",
          isCore: false,
        },
        {
          name: "Capsicum",
          canonicalName: "capsicum",
          quantity: "1/2 cup sliced",
          category: "Vegetables",
          isCore: false,
        },
      ],
      instructions: [
        `Flash-sear ${displayPrimary} in a hot wok for 3 minutes.`,
        `Add ginger, garlic, and crisp vegetables, tossing over high heat.`,
        `Glaze with tangy soy-chilli reduction and serve immediately.`,
      ],
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
      sourceUrl: "/recipes",
      adaptations: SMART_SUBSTITUTIONS_CATALOG.tofu,
    },
  ];
}

export async function scoreAndRankRecipes(
  candidates: NormalizedRecipe[],
  context: UserCookingContext
): Promise<RankedRecipeResult[]> {
  const userCanonical = Array.from(
    new Set(context.ingredients.map(normalizeIngredientName).filter(Boolean))
  );

  // Check how many catalog recipes match at least one user core ingredient
  const matchingCatalogCount = candidates.filter((rec) =>
    rec.ingredients.some((rIng) =>
      context.ingredients.some((uRaw) => isIngredientMatch(uRaw, rIng))
    )
  ).length;

  const fullCandidatePool =
    matchingCatalogCount < 2 && userCanonical.length > 0
      ? [...candidates, ...buildDynamicPantryRecipes(context)]
      : candidates;

  const results: RankedRecipeResult[] = [];

  for (const recipe of fullCandidatePool) {
    const coreIngredients = recipe.ingredients.filter((i) => i.isCore);
    const secondaryIngredients = recipe.ingredients.filter((i) => !i.isCore);

    const matchedCore = coreIngredients
      .filter((i) =>
        context.ingredients.some((u) => isIngredientMatch(u, i))
      )
      .map((i) => i.name);
    const missingCore = coreIngredients
      .filter(
        (i) => !context.ingredients.some((u) => isIngredientMatch(u, i))
      )
      .map((i) => i.name);

    const matchedSecondary = secondaryIngredients
      .filter((i) =>
        context.ingredients.some((u) => isIngredientMatch(u, i))
      )
      .map((i) => i.name);
    const missingSecondary = secondaryIngredients
      .filter(
        (i) => !context.ingredients.some((u) => isIngredientMatch(u, i))
      )
      .map((i) => i.name);

    const totalMatchedInRecipe = matchedCore.length + matchedSecondary.length;
    const userUsedCount = context.ingredients.filter((u) =>
      recipe.ingredients.some((rIng) => isIngredientMatch(u, rIng))
    ).length;

    // 1. Ingredient Coverage (0 - 30)
    const coreRatio =
      coreIngredients.length > 0 ? matchedCore.length / coreIngredients.length : 0;
    const secondaryRatio =
      secondaryIngredients.length > 0
        ? matchedSecondary.length / secondaryIngredients.length
        : 0;
    const userUtilizationRatio =
      userCanonical.length > 0 ? userUsedCount / userCanonical.length : 0;
    const rawIngScore =
      (coreRatio * 0.55 + secondaryRatio * 0.05 + userUtilizationRatio * 0.4) *
      SCORING_WEIGHTS.ingredientCoverage;
    const ingredientCoverage: number = Math.round(rawIngScore);

    // 2. Flavor Compatibility (0 - 25) via FlavorDB
    // Only award full FlavorDB score when the recipe actually uses user pantry ingredients!
    const activeRecipeIngredients = Array.from(
      new Set([
        ...matchedCore.map(normalizeIngredientName),
        ...matchedSecondary.map(normalizeIngredientName),
        ...(matchedCore.length > 0
          ? coreIngredients.slice(0, 2).map((i) => i.canonicalName)
          : []),
      ])
    );
    const flavorResult = await getFlavorCompatibility(
      activeRecipeIngredients,
      SCORING_WEIGHTS.flavorCompatibility
    );
    const flavorCompatibility: number =
      totalMatchedInRecipe === 0 ? 4 : flavorResult.score;

    // 3. Cuisine Fit (0 - 15)
    let cuisineFit: number = 0;
    if (context.cuisine === "Any" || recipe.cuisine === context.cuisine) {
      cuisineFit = SCORING_WEIGHTS.cuisineFit;
    } else {
      cuisineFit = 0;
    }

    // 4. Taste Fit (0 - 10)
    let tasteFit: number = 0;
    if (context.taste === "Any" || recipe.tasteProfile.includes(context.taste)) {
      tasteFit = SCORING_WEIGHTS.tasteFit;
    } else {
      tasteFit = 2;
    }

    // 5. Cooking Time Fit (0 - 10)
    const maxMinutes = parseMaxTimeMinutes(context.maxCookingTime);
    let timeFit: number = SCORING_WEIGHTS.timeFit;
    if (maxMinutes !== null) {
      if (recipe.cookingTimeMinutes <= maxMinutes) {
        const buffer = maxMinutes - recipe.cookingTimeMinutes;
        timeFit = buffer >= 10 ? 10 : buffer >= 5 ? 9 : 8;
      } else {
        const over = recipe.cookingTimeMinutes - maxMinutes;
        timeFit = Math.max(0, 3 - Math.ceil(over / 5));
      }
    }

    // 6. Dietary Fit (0 - 10)
    let dietaryFit: number = SCORING_WEIGHTS.dietaryFit;
    if (context.dietaryPreference !== "No preference") {
      if (recipe.dietaryTags.includes(context.dietaryPreference)) {
        dietaryFit = SCORING_WEIGHTS.dietaryFit;
      } else {
        dietaryFit = 0;
      }
    }

    const rawTotal =
      ingredientCoverage +
      flavorCompatibility +
      cuisineFit +
      tasteFit +
      timeFit +
      dietaryFit;

    // Cap score if 0 core ingredients matched so zero-match recipes never look like high matches
    const totalScore: number =
      matchedCore.length === 0
        ? Math.min(35, rawTotal)
        : Math.min(100, Math.max(0, rawTotal));

    results.push({
      recipe,
      scoreBreakdown: {
        ingredientCoverage,
        flavorCompatibility,
        cuisineFit,
        tasteFit,
        preferenceFitCombined: cuisineFit + tasteFit,
        timeFit,
        dietaryFit,
        totalScore,
      },
      ingredientMatch: {
        matchedCoreIngredients: matchedCore,
        missingCoreIngredients: missingCore,
        matchedSecondaryIngredients: matchedSecondary,
        missingSecondaryIngredients: missingSecondary,
        userIngredientsUsedCount: userUsedCount,
        userIngredientsTotalCount: userCanonical.length,
        recipeCoreMatchedCount: matchedCore.length,
        recipeCoreTotalCount: coreIngredients.length,
        fitDisplay: `${matchedCore.length}/${coreIngredients.length}`,
      },
      flavorCompatibility: flavorResult,
      explanations: {
        ingredientFitText: `Uses ${matchedCore.length} of ${coreIngredients.length} core recipe ingredients (${matchedCore.join(", ") || "none matched"}).`,
        flavorCompatibilityText:
          flavorResult.matchedRelationships.length > 0
            ? `FlavorDB signals indicate compatible ingredient relationships across ${flavorResult.matchedRelationships.length} ingredient pair(s).`
            : `Baseline culinary compatibility evaluated across recipe ingredients.`,
        preferenceFitText: `Matches your selected ${
          context.cuisine === "Any" ? recipe.cuisine : context.cuisine
        } cuisine and ${
          context.taste === "Any" ? (recipe.tasteProfile[0]?.toLowerCase() || "savory") : context.taste.toLowerCase()
        } taste preference.`,
        timeFitText:
          maxMinutes !== null
            ? recipe.cookingTimeMinutes <= maxMinutes
              ? `Fits your maximum cooking time of ${maxMinutes} minutes (~${recipe.cookingTimeMinutes} min).`
              : `Takes ~${recipe.cookingTimeMinutes} minutes (exceeds your ${maxMinutes} minute target).`
            : `Takes ~${recipe.cookingTimeMinutes} minutes (no maximum cooking time restriction set).`,
        dietaryFitText:
          context.dietaryPreference !== "No preference"
            ? recipe.dietaryTags.includes(context.dietaryPreference)
              ? `Matches your ${context.dietaryPreference.toLowerCase()} preference.`
              : `Does not match your ${context.dietaryPreference.toLowerCase()} requirement.`
            : `Suitable for ${recipe.dietaryTags.join(", ")} diets.`,
      },
    });
  }

  const maxMinutes = parseMaxTimeMinutes(context.maxCookingTime);

  // Filter to recipes that match at least 1 pantry ingredient!
  const pantryMatchedResults = results.filter(
    (r) =>
      r.ingredientMatch.matchedCoreIngredients.length > 0 ||
      r.ingredientMatch.matchedSecondaryIngredients.length > 0
  );

  const activePool =
    pantryMatchedResults.length > 0 ? pantryMatchedResults : results;

  const strictFiltered = activePool.filter((r) => {
    if (
      context.dietaryPreference !== "No preference" &&
      !r.recipe.dietaryTags.includes(context.dietaryPreference)
    ) {
      return false;
    }
    if (!matchesCalorieRange(r.recipe.nutrition.calories, context.calorieRange)) {
      return false;
    }
    if (!matchesProteinLevel(r.recipe.nutrition.proteinG, context.proteinLevel)) {
      return false;
    }
    return true;
  });

  const finalPool = strictFiltered.length > 0 ? strictFiltered : activePool;

  // Sort by:
  // 1) Recipes that match core pantry ingredients ALWAYS come before 0-core-match recipes
  // 2) Total 100-point score descending
  // 3) Number of matched core ingredients descending
  return finalPool.sort((a, b) => {
    const aHasCore = a.ingredientMatch.recipeCoreMatchedCount > 0 ? 1 : 0;
    const bHasCore = b.ingredientMatch.recipeCoreMatchedCount > 0 ? 1 : 0;
    if (aHasCore !== bHasCore) return bHasCore - aHasCore;

    if (context.cuisine !== "Any") {
      const aCuisine = a.recipe.cuisine === context.cuisine ? 1 : 0;
      const bCuisine = b.recipe.cuisine === context.cuisine ? 1 : 0;
      if (aCuisine !== bCuisine) return bCuisine - aCuisine;
    }

    if (maxMinutes !== null) {
      const aTimeOk = a.recipe.cookingTimeMinutes <= maxMinutes ? 1 : 0;
      const bTimeOk = b.recipe.cookingTimeMinutes <= maxMinutes ? 1 : 0;
      if (aTimeOk !== bTimeOk) return bTimeOk - aTimeOk;
    }

    if (b.scoreBreakdown.totalScore !== a.scoreBreakdown.totalScore) {
      return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
    }
    return (
      b.ingredientMatch.recipeCoreMatchedCount -
      a.ingredientMatch.recipeCoreMatchedCount
    );
  });
}
