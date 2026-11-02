import { NextRequest, NextResponse } from "next/server";
import { UserCookingContext } from "../../../lib/foodoscope/types";
import { fetchCandidateRecipes } from "../../../lib/foodoscope/recipeDb";
import { scoreAndRankRecipes } from "../../../lib/recommendation/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UserCookingContext>;
    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients.map((i) => String(i).trim()).filter(Boolean)
      : [];

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "Add at least one ingredient to discover recipes." },
        { status: 400 }
      );
    }

    const context: UserCookingContext = {
      ingredients,
      cuisine: body.cuisine || "Any",
      taste: body.taste || "Any",
      maxCookingTime: body.maxCookingTime || "Any",
      dietaryPreference: body.dietaryPreference || "No preference",
      calorieRange: body.calorieRange || "Any",
      proteinLevel: body.proteinLevel || "Any",
      allowAdditionalIngredients:
        typeof body.allowAdditionalIngredients === "boolean"
          ? body.allowAdditionalIngredients
          : true,
    };

    const { recipes, modeUsed } = await fetchCandidateRecipes(context);
    const ranked = await scoreAndRankRecipes(recipes, context);

    return NextResponse.json({
      mode: modeUsed,
      scoreLabel:
        modeUsed === "live"
          ? "Calculated Recommendation Score"
          : "Illustrative Match Score (Calculated via MVP Engine on Dev Dataset)",
      context,
      results: ranked,
      totalCandidatesEvaluated: recipes.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "We couldn't reach the food knowledge service right now.",
        details: err?.message || "Unknown server error",
      },
      { status: 503 }
    );
  }
}
