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
 * Synthesizes multi-ingredient candidate recipes when the user enters custom ingredient
 * combinations not fully covered by the static catalog.
 */
function buildDynamicPantryRecipes(
  context: UserCookingContext
): NormalizedRecipe[] {
  const rawIngs = context.ingredients.map((i) => i.trim()).filter(Boolean);
  if (rawIngs.length === 0) return [];

  const chosenCuisine: Exclude<CuisineOption, "Any"> =
    context.cuisine === "Any" ? "Indian" : context.cuisine;
  const chosenTaste: Exclude<TasteOption, "Any"> =
    context.taste === "Any" ? "Spicy" : context.taste;
  const chosenDiet: Exclude<DietaryOption, "No preference"> =
    context.dietaryPreference === "No preference"
      ? "Vegetarian"
      : context.dietaryPreference;

  const formattedIngs = rawIngs.map(
    (i) => i.charAt(0).toUpperCase() + i.slice(1)
  );
  const titleCombo = formattedIngs.slice(0, 3).join(", ");

  const coreList = rawIngs.map((ing) => ({
    name: ing.charAt(0).toUpperCase() + ing.slice(1),
    canonicalName: normalizeIngredientName(ing),
    quantity: "1 cup / prepped",
    category: getIngredientCategory(ing),
    isCore: true,
  }));

  const extraMissing = [
    { name: "Tomato", canonicalName: "tomato", quantity: "2 medium, chopped", category: "Vegetables", isCore: true },
    { name: "Garlic", canonicalName: "garlic", quantity: "4 cloves, minced", category: "Spices", isCore: false },
  ].filter(
    (m) => !rawIngs.some((u) => normalizeIngredientName(u) === m.canonicalName)
  );

  return [
    {
      id: `fiq-dyn-combo-1`,
      recipeDbId: `RDB-DYN-COMBO-01`,
      name: `Chef's Special ${titleCombo} Masala Fusion Skillet`,
      cuisine: chosenCuisine,
      region: `${chosenCuisine} Multi-Ingredient Fusion`,
      tasteProfile: [chosenTaste, "Savory"],
      cookingTimeMinutes: 18,
      dietaryTags: [chosenDiet, "High-protein"],
      processes: ["sear", "saute", "simmer"],
      utensils: ["skillet", "spatula"],
      nutrition: {
        calories: 345,
        proteinG: 18,
        carbsG: 40,
        fatG: 11,
        fiberG: 6,
      },
      ingredients: [...coreList, ...extraMissing],
      instructions: [
        `Prepare all active pantry ingredients (${formattedIngs.join(", ")}) into bite-sized pieces.`,
        `Heat 1 tbsp oil in a wide skillet and temper aromatics until fragrant.`,
        `Sear and toss ${formattedIngs.join(", ")} over medium-high heat for 8–10 minutes so their flavor compounds meld.`,
        `Season to taste and serve hot.`,
      ],
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      sourceUrl: "/recipes",
      adaptations: SMART_SUBSTITUTIONS_CATALOG.paneer,
    },
  ];
}

export async function scoreAndRankRecipes(
  candidates: NormalizedRecipe[],
  context: UserCookingContext
): Promise<RankedRecipeResult[]> {
  const userRawList = context.ingredients.map((i) => i.trim()).filter(Boolean);
  const userCanonical = Array.from(
    new Set(userRawList.map(normalizeIngredientName).filter(Boolean))
  );

  // Check if any catalog recipe matches all or most of the user's ingredients
  const maxCatalogMatchCount = candidates.reduce((maxM, rec) => {
    const cnt = userRawList.filter((u) =>
      rec.ingredients.some((rIng) => isIngredientMatch(u, rIng))
    ).length;
    return Math.max(maxM, cnt);
  }, 0);

  // Add dynamic multi-ingredient recipe if the user entered custom ingredients not covered together
  const fullCandidatePool =
    userCanonical.length > 0 && maxCatalogMatchCount === 0
      ? [...buildDynamicPantryRecipes(context), ...candidates]
      : candidates;

  const results: RankedRecipeResult[] = [];

  for (const recipe of fullCandidatePool) {
    // Compare ALL recipe ingredients against ALL active user pantry ingredients
    const matchedAll: string[] = [];
    const missingAll: string[] = [];
    const matchedSecondary: string[] = [];
    const missingSecondary: string[] = [];

    for (const rIng of recipe.ingredients) {
      const matchedUserRaw = userRawList.find((uRaw) =>
        isIngredientMatch(uRaw, rIng)
      );
      if (matchedUserRaw) {
        matchedAll.push(rIng.name);
        if (!rIng.isCore) matchedSecondary.push(rIng.name);
      } else {
        if (rIng.isCore) {
          missingAll.push(rIng.name);
        } else {
          missingSecondary.push(rIng.name);
        }
      }
    }

    // Also ensure any missing secondary ingredients are shown if missingAll is empty so user always sees what else the recipe uses
    const displayMissing = Array.from(
      new Set([...missingAll, ...missingSecondary])
    ).slice(0, 4);

    // Count how many distinct user pantry ingredients are utilized by this recipe
    const matchedUserPantryItems = userRawList.filter((uRaw) =>
      recipe.ingredients.some((rIng) => isIngredientMatch(uRaw, rIng))
    );
    const userUsedCount = matchedUserPantryItems.length;
    const totalRecipeCount = Math.max(1, recipe.ingredients.length);
    const coreIngredientsCount = Math.max(
      1,
      recipe.ingredients.filter((i) => i.isCore).length
    );

    // 1. Ingredient Coverage (0 - 30)
    // Rewards BOTH:
    // - How many of the user's pantry ingredients are used (userUtilizationRatio)
    // - How much of the recipe is covered (recipeCoverageRatio)
    // - Multi-ingredient match bonus when 2+, 3+, 4+ pantry ingredients match!
    const userUtilizationRatio =
      userCanonical.length > 0 ? userUsedCount / userCanonical.length : 0;
    const recipeCoverageRatio = matchedAll.length / totalRecipeCount;
    const matchedCoreOnlyCount = recipe.ingredients.filter(
      (rIng) =>
        rIng.isCore &&
        userRawList.some((uRaw) => isIngredientMatch(uRaw, rIng))
    ).length;
    const coreCoverageRatio = Math.min(
      1,
      matchedCoreOnlyCount / coreIngredientsCount
    );

    let ingredientCoverage: number = 0;
    if (matchedAll.length > 0) {
      const baseRatio =
        userUtilizationRatio * 0.55 +
        coreCoverageRatio * 0.3 +
        recipeCoverageRatio * 0.15;
      const multiBonus = Math.min(6, Math.max(0, (userUsedCount - 1) * 2.5));
      ingredientCoverage = Math.min(
        SCORING_WEIGHTS.ingredientCoverage,
        Math.round(baseRatio * (SCORING_WEIGHTS.ingredientCoverage - 4) + multiBonus)
      );
    }

    // 2. Flavor Compatibility (0 - 25) via FlavorDB
    // Evaluate FlavorDB strictly across the matched ingredients in this recipe (+1 core ingredient if only 1 matched)
    const activeRecipeIngredients = Array.from(
      new Set([
        ...matchedAll.map(normalizeIngredientName),
        ...(matchedAll.length === 1
          ? recipe.ingredients.slice(0, 2).map((i) => i.canonicalName)
          : []),
      ])
    );
    const flavorResult = await getFlavorCompatibility(
      activeRecipeIngredients,
      SCORING_WEIGHTS.flavorCompatibility
    );

    // Scale FlavorDB score by whether multiple pantry ingredients are actually interacting in this recipe
    let flavorCompatibility: number = 4;
    if (matchedAll.length >= 3) {
      flavorCompatibility = Math.min(25, flavorResult.score + 3);
    } else if (matchedAll.length === 2) {
      flavorCompatibility = flavorResult.score;
    } else if (matchedAll.length === 1) {
      // Single matched ingredient gets a lower flavor interaction score when user has multiple pantry items
      flavorCompatibility =
        userCanonical.length > 1
          ? Math.min(14, Math.round(flavorResult.score * 0.65))
          : flavorResult.score;
    }

    // 3. Cuisine Fit (0 - 15)
    let cuisineFit: number = 0;
    if (context.cuisine === "Any" || recipe.cuisine === context.cuisine) {
      cuisineFit = SCORING_WEIGHTS.cuisineFit;
    } else {
      cuisineFit = 5;
    }

    // 4. Taste Fit (0 - 10)
    let tasteFit: number = 0;
    if (context.taste === "Any" || recipe.tasteProfile.includes(context.taste)) {
      tasteFit = SCORING_WEIGHTS.tasteFit;
    } else {
      tasteFit = 4;
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

    const totalScore: number =
      matchedAll.length === 0
        ? Math.min(30, rawTotal)
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
        matchedCoreIngredients: matchedAll,
        missingCoreIngredients: displayMissing,
        matchedSecondaryIngredients: matchedSecondary,
        missingSecondaryIngredients: missingSecondary,
        userIngredientsUsedCount: userUsedCount,
        userIngredientsTotalCount: userCanonical.length,
        recipeCoreMatchedCount: matchedAll.length,
        recipeCoreTotalCount: recipe.ingredients.length,
        fitDisplay: `${matchedAll.length}/${recipe.ingredients.length}`,
      },
      flavorCompatibility: flavorResult,
      explanations: {
        ingredientFitText: `Matches ${matchedAll.length} ingredient(s) from your active pantry (${matchedAll.join(", ") || "none matched"}).`,
        flavorCompatibilityText:
          flavorResult.matchedRelationships.length > 0
            ? `FlavorDB signals indicate compatible ingredient relationships across ${flavorResult.matchedRelationships.length} ingredient pair(s).`
            : `Baseline culinary compatibility evaluated across recipe ingredients.`,
        preferenceFitText: `Matches ${recipe.cuisine} cuisine and ${
          recipe.tasteProfile[0]?.toLowerCase() || "savory"
        } taste profile.`,
        timeFitText:
          maxMinutes !== null
            ? recipe.cookingTimeMinutes <= maxMinutes
              ? `Fits your maximum cooking time of ${maxMinutes} minutes (~${recipe.cookingTimeMinutes} min).`
              : `Takes ~${recipe.cookingTimeMinutes} minutes (exceeds your ${maxMinutes} minute target).`
            : `Takes ~${recipe.cookingTimeMinutes} minutes.`,
        dietaryFitText:
          context.dietaryPreference !== "No preference"
            ? recipe.dietaryTags.includes(context.dietaryPreference)
              ? `Matches your ${context.dietaryPreference.toLowerCase()} preference.`
              : `Does not match your ${context.dietaryPreference.toLowerCase()} requirement.`
            : `Suitable for ${recipe.dietaryTags.join(", ")} diets.`,
      },
    });
  }

  // Only keep recipes that match at least 1 ingredient from the user's pantry
  const pantryMatchedResults = results.filter(
    (r) => r.ingredientMatch.matchedCoreIngredients.length > 0
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

  // Sort primarily by:
  // 1) Number of matched user pantry ingredients descending (multi-ingredient matches ALWAYS outrank single-ingredient matches!)
  // 2) Total 100-point Match Score descending
  return finalPool.sort((a, b) => {
    if (
      b.ingredientMatch.userIngredientsUsedCount !==
      a.ingredientMatch.userIngredientsUsedCount
    ) {
      return (
        b.ingredientMatch.userIngredientsUsedCount -
        a.ingredientMatch.userIngredientsUsedCount
      );
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
