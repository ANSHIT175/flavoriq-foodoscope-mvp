import { fetchCandidateRecipes } from "../src/lib/foodoscope/recipeDb";
import { scoreAndRankRecipes } from "../src/lib/recommendation/scoring";
import { UserCookingContext } from "../src/lib/foodoscope/types";

async function runVerification() {
  process.env.API_MODE = "MOCK";

  const demoContext: UserCookingContext = {
    ingredients: ["Paneer", "Tamatar", "Pyaaz", "Shimla Mirch", "Garlic"],
    cuisine: "Indian",
    taste: "Spicy",
    maxCookingTime: "Under 30 min",
    dietaryPreference: "Vegetarian",
    allowAdditionalIngredients: true,
  };

  const { recipes, modeUsed } = await fetchCandidateRecipes(demoContext);
  const ranked = await scoreAndRankRecipes(recipes, demoContext);

  console.log(`=== FLAVORIQ Verification (API_MODE=${modeUsed}) ===`);
  console.log(`Candidates evaluated: ${recipes.length}`);
  console.log(`Ranked matches returned: ${ranked.length}`);

  if (ranked.length === 0) {
    throw new Error("Expected at least 1 ranked recipe for North Indian Paneer Pantry");
  }

  const top = ranked[0];
  console.log(
    `Top #1 Match: ${top.recipe.name} — Score: ${top.scoreBreakdown.totalScore}/100 (Core fit: ${top.ingredientMatch.fitDisplay}, FlavorDB: ${top.flavorCompatibility.flavorFitLabel})`
  );
  console.log("Score Breakdown:", top.scoreBreakdown);
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
