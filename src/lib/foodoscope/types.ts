/**
 * Normalized Internal Data Models for FLAVORIQ
 * Keeps UI and Recommendation Engine decoupled from raw Foodoscope API schemas.
 */

export type ApiMode = "live" | "mock";

export type CuisineOption =
  | "Indian"
  | "Chinese"
  | "Italian"
  | "Mexican"
  | "Thai"
  | "Japanese"
  | "Mediterranean"
  | "Continental"
  | "Any";

export type TasteOption =
  | "Spicy"
  | "Savory"
  | "Tangy"
  | "Sweet"
  | "Mild"
  | "Balanced"
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
  | "High-protein"
  | "Low-oil"
  | "Gluten-free"
  | "Dairy-free"
  | "No preference";

export type CalorieRangeOption =
  | "Any"
  | "Under 300"
  | "300–500"
  | "500–700"
  | "700+";

export type ProteinLevelOption = "Any" | "Low" | "Medium" | "High";

export type IngredientCategory =
  | "Vegetables"
  | "Protein"
  | "Grains"
  | "Dairy"
  | "Spices"
  | "Herbs"
  | "Other";

export interface PantryCatalogItem {
  name: string;
  canonicalName: string;
  category: IngredientCategory;
  popular: boolean;
}

export interface UserCookingContext {
  ingredients: string[];
  cuisine: CuisineOption;
  taste: TasteOption;
  maxCookingTime: CookingTimeOption;
  dietaryPreference: DietaryOption;
  calorieRange?: CalorieRangeOption;
  proteinLevel?: ProteinLevelOption;
  allowAdditionalIngredients?: boolean;
}

export interface RecipeIngredient {
  name: string;
  canonicalName: string;
  quantity: string;
  category: IngredientCategory | string;
  isCore: boolean;
}

export interface SubstitutionSuggestion {
  targetIngredient: string;
  substituteIngredient: string;
  sourceType: "flavordb-supported" | "rule-based";
  compatibilityScore?: number; // e.g. 92
  proteinPer100g?: string;
  flavorNote?: string;
  dietaryCompatibility?: string[];
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
    fiberG?: number;
  };
  ingredients: RecipeIngredient[];
  instructions: string[];
  image: string;
  sourceUrl: string;
  adaptations: SubstitutionSuggestion[];
  nutritionTips?: string[];
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
  flavorProfile?: string;
  pairingStrength?: number; // 0-100
  sensoryNote: string;
  source: "FlavorDB";
}

export interface FlavorCompatibilityResult {
  score: number; // Normalized 0-25
  normalizedRatio: number; // 0.0 to 1.0
  flavorFitLabel: "High" | "Medium" | "Low";
  matchedRelationships: FlavorPairingRelationship[];
  supportingSignals: string[];
}
