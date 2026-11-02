import {
  FlavorCompatibilityResult,
  NormalizedRecipe,
  UserCookingContext,
} from "../foodoscope/types";
import { normalizeIngredientName } from "../foodoscope/normalizers";
import { getFlavorCompatibility } from "../foodoscope/flavorDb";

/**
 * Configurable MVP Recommendation Weights (Total = 100 points)
 * Note: These weights represent the transparent MVP recommendation logic
 * and are not claimed to be clinically or scientifically validated.
 */
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
  fitDisplay: string; // e.g., "4/4"
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

export async function scoreAndRankRecipes(
  candidates: NormalizedRecipe[],
  context: UserCookingContext
): Promise<RankedRecipeResult[]> {
  const userCanonical = Array.from(
    new Set(context.ingredients.map(normalizeIngredientName).filter(Boolean))
  );

  const results: RankedRecipeResult[] = [];

  for (const recipe of candidates) {
    const coreIngredients = recipe.ingredients.filter((i) => i.isCore);
    const secondaryIngredients = recipe.ingredients.filter((i) => !i.isCore);

    const matchedCore = coreIngredients
      .filter((i) => userCanonical.includes(i.canonicalName))
      .map((i) => i.name);
    const missingCore = coreIngredients
      .filter((i) => !userCanonical.includes(i.canonicalName))
      .map((i) => i.name);

    const matchedSecondary = secondaryIngredients
      .filter((i) => userCanonical.includes(i.canonicalName))
      .map((i) => i.name);
    const missingSecondary = secondaryIngredients
      .filter((i) => !userCanonical.includes(i.canonicalName))
      .map((i) => i.name);

    const recipeCanonicalAll = recipe.ingredients.map((i) => i.canonicalName);
    const userUsedCount = userCanonical.filter((u) => recipeCanonicalAll.includes(u)).length;

    // 1. Ingredient Coverage (0 - 30)
    const coreRatio =
      coreIngredients.length > 0 ? matchedCore.length / coreIngredients.length : 0;
    const userUtilizationRatio =
      userCanonical.length > 0 ? userUsedCount / userCanonical.length : 0;
    const rawIngScore =
      (coreRatio * 0.75 + userUtilizationRatio * 0.25) * SCORING_WEIGHTS.ingredientCoverage;
    const ingredientCoverage = Math.round(rawIngScore);

    // 2. Flavor Compatibility (0 - 25) via FlavorDB
    const activeRecipeIngredients = [
      ...matchedCore.map(normalizeIngredientName),
      ...coreIngredients.slice(0, 3).map((i) => i.canonicalName),
    ];
    const flavorResult = await getFlavorCompatibility(
      activeRecipeIngredients,
      SCORING_WEIGHTS.flavorCompatibility
    );
    const flavorCompatibility = flavorResult.score;

    // 3. Cuisine Fit (0 - 15)
    let cuisineFit = 0;
    if (context.cuisine === "Any" || recipe.cuisine === context.cuisine) {
      cuisineFit = SCORING_WEIGHTS.cuisineFit;
    } else {
      cuisineFit = 3;
    }

    // 4. Taste Fit (0 - 10)
    let tasteFit = 0;
    if (context.taste === "Any" || recipe.tasteProfile.includes(context.taste)) {
      tasteFit = SCORING_WEIGHTS.tasteFit;
    } else {
      tasteFit = 3;
    }

    // 5. Cooking Time Fit (0 - 10)
    const maxMinutes = parseMaxTimeMinutes(context.maxCookingTime);
    let timeFit = SCORING_WEIGHTS.timeFit;
    if (maxMinutes !== null) {
      if (recipe.cookingTimeMinutes <= maxMinutes) {
        const buffer = maxMinutes - recipe.cookingTimeMinutes;
        timeFit = buffer >= 10 ? 10 : buffer >= 5 ? 9 : 8;
      } else {
        const over = recipe.cookingTimeMinutes - maxMinutes;
        timeFit = Math.max(0, 5 - Math.ceil(over / 5));
      }
    }

    // 6. Dietary Fit (0 - 10)
    let dietaryFit = SCORING_WEIGHTS.dietaryFit;
    if (context.dietaryPreference !== "No preference") {
      if (recipe.dietaryTags.includes(context.dietaryPreference)) {
        dietaryFit = SCORING_WEIGHTS.dietaryFit;
      } else {
        dietaryFit = 0;
      }
    }

    const totalScore = Math.min(
      100,
      Math.max(
        0,
        ingredientCoverage +
          flavorCompatibility +
          cuisineFit +
          tasteFit +
          timeFit +
          dietaryFit
      )
    );

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

  return results
    .filter((r) => {
      if (
        context.dietaryPreference !== "No preference" &&
        !r.recipe.dietaryTags.includes(context.dietaryPreference)
      ) {
        return false;
      }
      if (!context.allowAdditionalIngredients && r.ingredientMatch.matchedCoreIngredients.length === 0) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);
}
