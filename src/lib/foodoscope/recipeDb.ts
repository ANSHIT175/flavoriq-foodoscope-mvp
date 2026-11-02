import { ApiMode, NormalizedRecipe, UserCookingContext } from "./types";
import { mapRawRecipeDbRecord, normalizeIngredientName } from "./normalizers";
import { DEVELOPMENT_RECIPES } from "./mockCatalog";

/**
 * RecipeDB Service Adapter
 * Isolates Foodoscope RecipeDB REST calls behind a clean server-side interface.
 * CocktailDB is intentionally excluded from MVP scope per product specification.
 */
export async function fetchCandidateRecipes(
  context: UserCookingContext,
  modeOverride?: ApiMode
): Promise<{ recipes: NormalizedRecipe[]; modeUsed: ApiMode }> {
  const envMode = String(process.env.API_MODE || "mock").trim().toLowerCase();
  const mode: ApiMode =
    modeOverride || (envMode === "live" ? "live" : "mock");

  if (mode === "live") {
    const apiKey = process.env.FOODOSCOPE_API_KEY;
    const baseUrl = process.env.FOODOSCOPE_BASE_URL || "https://api.foodoscope.com/v1";
    const recipePath = process.env.FOODOSCOPE_RECIPEDB_PATH || "/recipedb";

    if (!apiKey) {
      throw new Error(
        "FOODOSCOPE_API_KEY is missing in server environment (.env.local). Switch API_MODE=MOCK for local/Vercel demo mode or add your Foodoscope token."
      );
    }

    const params = new URLSearchParams();
    if (context.ingredients.length > 0) {
      params.set("ingredientsUsed", context.ingredients.map(normalizeIngredientName).join(","));
    }
    if (context.cuisine !== "Any") {
      params.set("cuisine", context.cuisine);
    }

    const response = await fetch(`${baseUrl}${recipePath}/recipes-by-ingredient?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Foodoscope RecipeDB responded with HTTP ${response.status}`);
    }

    const payload = await response.json();
    const rawList = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    return {
      recipes: rawList.map(mapRawRecipeDbRecord),
      modeUsed: "live",
    };
  }

  // MOCK MODE (Clearly labeled development dataset — works with API_MODE=MOCK or API_MODE=mock)
  return {
    recipes: DEVELOPMENT_RECIPES,
    modeUsed: "mock",
  };
}
