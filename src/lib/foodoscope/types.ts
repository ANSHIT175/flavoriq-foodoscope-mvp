/**
 * Normalized Internal Data Models for FLAVORIQ
 * Keeps UI and Recommendation Engine decoupled from raw Foodoscope API schemas.
 */

export type ApiMode = "live" | "mock";

export type CuisineOption =
  | "Indian"
  | "Italian"
  | "Mexican"
  | "Chinese"
  | "Continental"
  | "Any";

export type TasteOption =
  | "Spicy"
  | "Mild"
  | "Sweet"
  | "Savory"
  | "Tangy"
  | "Any";

export type CookingTimeOption =
  | "Under 15 min"
  | "Under 30 min"
  | "Under 45 min"
  | "Under 60 min"
  | "Any";

export type DietaryOption =
  | "Vegetarian"
  | "Vegan"
  | "Low-oil"
  | "Gluten-free"
  | "No preference";

export interface UserCookingContext {
  ingredients: string[];
  cuisine: CuisineOption;
  taste: TasteOption;
  maxCookingTime: CookingTimeOption;
  dietaryPreference: DietaryOption;
  allowAdditionalIngredients?: boolean;
}

export interface RecipeIngredient {
  name: string;
  canonicalName: string;
  quantity: string;
  category: string;
  isCore: boolean; // Core dish ingredient vs pantry seasoning/oil
}

export interface SubstitutionSuggestion {
  targetIngredient: string;
  substituteIngredient: string;
  sourceType: "flavordb-supported" | "rule-based";
  sharedCompounds?: string[];
  reasoning: string;
}

export interface NormalizedRecipe {
  id: string;
  recipeDbId: string;
  name: string;
  cuisine: Exclude<CuisineOption, "Any">;
  region: string;
  tasteProfile: Exclude<TasteOption, "Any">[];
  cookingTimeMinutes: number;
  dietaryTags: Exclude<DietaryOption, "No preference">[];
  processes: string[];
  utensils: string[];
  nutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  ingredients: RecipeIngredient[];
  instructions: string[];
  image: string;
  sourceUrl: string;
  adaptations: SubstitutionSuggestion[];
}

export interface FlavorMoleculeSignal {
  compoundName: string;
  femaProfile: string;
  functionalGroup: string;
}

export interface FlavorPairingRelationship {
  ingredientA: string;
  ingredientB: string;
  sharedMoleculeCount: number;
  sharedCompounds: string[];
  sensoryNote: string;
  source: "FlavorDB";
}

export interface FlavorCompatibilityResult {
  score: number; // Normalized 0-25 (or scaled by weight)
  normalizedRatio: number; // 0.0 to 1.0
  flavorFitLabel: "High" | "Medium" | "Low";
  matchedRelationships: FlavorPairingRelationship[];
  supportingSignals: string[];
}
