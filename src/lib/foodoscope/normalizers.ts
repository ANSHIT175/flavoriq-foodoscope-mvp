import {
  CuisineOption,
  DietaryOption,
  IngredientCategory,
  NormalizedRecipe,
  PantryCatalogItem,
  RecipeIngredient,
  TasteOption,
} from "./types";

export const INGREDIENT_SYNONYM_GROUPS: Record<string, string[]> = {
  dal: [
    "dal", "daal", "dhal", "lentil", "lentils", "toor dal", "arhar dal",
    "moong dal", "masoor dal", "chana dal", "urad dal", "yellow dal",
    "yellow lentils", "red lentils", "split lentils", "mung dal", "mixed dal"
  ],
  paneer: ["paneer", "cottage cheese", "indian cottage cheese", "chenna", "chhena"],
  tomato: ["tomato", "tomatoes", "tamatar", "tomato puree", "crushed tomatoes", "cherry tomatoes"],
  onion: ["onion", "onions", "pyaaz", "pyaz", "red onion", "white onion", "shallots", "spring onion", "scallions"],
  capsicum: ["capsicum", "bell pepper", "bell peppers", "shimla mirch", "green pepper", "red bell pepper", "peppers"],
  potato: ["potato", "potatoes", "aloo", "alu", "baby potatoes", "boiled potato"],
  rice: ["rice", "chawal", "basmati rice", "basmati", "cooked rice", "white rice", "brown rice", "jasmine rice", "sushi rice", "poha"],
  spinach: ["spinach", "palak", "baby spinach", "saag", "leafy greens"],
  garlic: ["garlic", "lahsun", "lehsun", "garlic cloves", "minced garlic"],
  ginger: ["ginger", "adrak", "fresh ginger", "ginger juliennes", "galangal"],
  "green chili": ["green chili", "green chilli", "green chilies", "hari mirch", "chili", "chilli", "jalapeno", "thai chili", "serrano"],
  coriander: ["coriander", "cilantro", "dhania", "coriander leaves", "coriander seeds"],
  cumin: ["cumin", "jeera", "cumin seeds", "roasted cumin", "ground cumin"],
  pasta: ["pasta", "penne", "spaghetti", "macaroni", "fusilli", "fettuccine"],
  maggi: ["maggi", "maggie", "instant noodles", "masala noodles", "wai wai", "yippee", "cup noodles"],
  noodles: ["noodles", "ramen", "udon", "rice noodles", "hakka noodles", "soba", "chowmein", "chow mein"],
  bread: ["bread", "pizza", "pazzia", "pizza base", "pav", "bun", "toast", "roti", "chapati", "naan", "tortilla"],
  cheese: ["cheese", "mozzarella", "cheddar", "processed cheese", "amul cheese", "parmesan"],
  peas: ["peas", "green peas", "matar", "mattar", "mutter", "frozen peas"],
  corn: ["corn", "sweet corn", "bhutta", "makai", "baby corn"],
  chickpeas: ["chickpeas", "chickpea", "chana", "chole", "kabuli chana", "garbanzo", "garbanzo beans"],
  mushroom: ["mushroom", "mushrooms", "button mushroom", "cremini", "shiitake", "portobello"],
  tofu: ["tofu", "bean curd", "firm tofu", "silken tofu", "soya paneer", "soya", "soya chunks"],
  "black beans": ["black beans", "beans", "kidney beans", "rajma", "pinto beans"],
  "coconut milk": ["coconut milk", "coconut cream", "nariyal doodh"],
  lemon: ["lemon", "lime", "nimbu", "lemon juice", "lime juice", "citrus"],
  basil: ["basil", "thai basil", "sweet basil", "tulsi"],
  avocado: ["avocado", "guacamole"],
  "olive oil": ["olive oil", "extra virgin olive oil"],
  "soy sauce": ["soy sauce", "tamari", "shoyu"],
  sesame: ["sesame", "sesame oil", "sesame seeds", "tahini", "til"],
  edamame: ["edamame", "green soybeans", "soybeans"],
  eggplant: ["eggplant", "baingan", "aubergine", "brinjal"],
  yogurt: ["yogurt", "curd", "dahi", "greek yogurt"],
};

export const PANTRY_INGREDIENT_CATALOG: PantryCatalogItem[] = [
  { name: "Paneer", canonicalName: "paneer", category: "Dairy", popular: true },
  { name: "Maggi / Noodles", canonicalName: "maggi", category: "Grains", popular: true },
  { name: "Tomato", canonicalName: "tomato", category: "Vegetables", popular: true },
  { name: "Spinach (Palak)", canonicalName: "spinach", category: "Vegetables", popular: true },
  { name: "Onion", canonicalName: "onion", category: "Vegetables", popular: true },
  { name: "Garlic", canonicalName: "garlic", category: "Spices", popular: true },
  { name: "Ginger", canonicalName: "ginger", category: "Spices", popular: true },
  { name: "Capsicum", canonicalName: "capsicum", category: "Vegetables", popular: true },
  { name: "Potato (Aloo)", canonicalName: "potato", category: "Vegetables", popular: true },
  { name: "Basmati Rice", canonicalName: "rice", category: "Grains", popular: true },
  { name: "Yellow Dal", canonicalName: "dal", category: "Protein", popular: true },
  { name: "Pasta", canonicalName: "pasta", category: "Grains", popular: true },
  { name: "Mushroom", canonicalName: "mushroom", category: "Vegetables", popular: true },
  { name: "Chickpeas (Chole)", canonicalName: "chickpeas", category: "Protein", popular: true },
  { name: "Coriander", canonicalName: "coriander", category: "Herbs", popular: true },
  { name: "Firm Tofu", canonicalName: "tofu", category: "Protein", popular: true },
  { name: "Cumin (Jeera)", canonicalName: "cumin", category: "Spices", popular: true },
  { name: "Green Peas (Matar)", canonicalName: "peas", category: "Vegetables", popular: true },
  { name: "Cheese", canonicalName: "cheese", category: "Dairy", popular: true },
  { name: "Bread / Pizza Base", canonicalName: "bread", category: "Grains", popular: true },
  { name: "Sweet Corn", canonicalName: "corn", category: "Vegetables", popular: false },
  { name: "Green Chili", canonicalName: "green chili", category: "Spices", popular: false },
  { name: "Black Beans (Rajma)", canonicalName: "black beans", category: "Protein", popular: false },
  { name: "Hakka Noodles", canonicalName: "noodles", category: "Grains", popular: false },
  { name: "Coconut Milk", canonicalName: "coconut milk", category: "Other", popular: false },
  { name: "Lemon / Lime", canonicalName: "lemon", category: "Vegetables", popular: false },
  { name: "Fresh Basil", canonicalName: "basil", category: "Herbs", popular: false },
  { name: "Avocado", canonicalName: "avocado", category: "Vegetables", popular: false },
  { name: "Olive Oil", canonicalName: "olive oil", category: "Other", popular: false },
  { name: "Soy Sauce", canonicalName: "soy sauce", category: "Other", popular: false },
  { name: "Sesame / Tahini", canonicalName: "sesame", category: "Spices", popular: false },
  { name: "Edamame", canonicalName: "edamame", category: "Protein", popular: false },
  { name: "Greek Yogurt (Dahi)", canonicalName: "yogurt", category: "Dairy", popular: false },
];

const ALIAS_TO_CANONICAL: Record<string, string> = {};
for (const [canon, aliases] of Object.entries(INGREDIENT_SYNONYM_GROUPS)) {
  ALIAS_TO_CANONICAL[canon] = canon;
  for (const a of aliases) {
    ALIAS_TO_CANONICAL[a.toLowerCase()] = canon;
  }
}

export function normalizeIngredientName(raw: string): string {
  if (!raw) return "";
  const cleaned = String(raw)
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ");
  if (!cleaned) return "";
  if (ALIAS_TO_CANONICAL[cleaned]) return ALIAS_TO_CANONICAL[cleaned];
  if (cleaned.endsWith("es") && ALIAS_TO_CANONICAL[cleaned.slice(0, -2)]) {
    return ALIAS_TO_CANONICAL[cleaned.slice(0, -2)];
  }
  if (cleaned.endsWith("s") && ALIAS_TO_CANONICAL[cleaned.slice(0, -1)]) {
    return ALIAS_TO_CANONICAL[cleaned.slice(0, -1)];
  }
  for (const token of cleaned.split(" ")) {
    if (ALIAS_TO_CANONICAL[token]) return ALIAS_TO_CANONICAL[token];
  }
  return cleaned;
}

export function getIngredientCategory(nameOrCanon: string): IngredientCategory {
  const canon = normalizeIngredientName(nameOrCanon);
  const found = PANTRY_INGREDIENT_CATALOG.find((item) => item.canonicalName === canon);
  if (found) return found.category;
  if (["paneer", "yogurt", "cheese", "butter", "cream", "milk"].includes(canon)) return "Dairy";
  if (["tofu", "dal", "chickpeas", "black beans", "edamame", "tempeh"].includes(canon)) return "Protein";
  if (["rice", "pasta", "noodles", "maggi", "bread", "quinoa", "oats"].includes(canon)) return "Grains";
  if (["cumin", "garlic", "ginger", "green chili", "sesame", "turmeric"].includes(canon)) return "Spices";
  if (["coriander", "basil", "mint", "parsley"].includes(canon)) return "Herbs";
  if (["tomato", "onion", "spinach", "capsicum", "potato", "mushroom", "lemon", "avocado", "peas", "corn"].includes(canon)) {
    return "Vegetables";
  }
  return "Other";
}

export function isIngredientMatch(userRawOrCanon: string, recipeIng: RecipeIngredient): boolean {
  const uCanon = normalizeIngredientName(userRawOrCanon);
  if (!uCanon) return false;
  const rCanon = normalizeIngredientName(recipeIng.canonicalName || recipeIng.name);
  if (uCanon === rCanon) return true;
  if (
    (uCanon === "maggi" && rCanon === "noodles") ||
    (uCanon === "noodles" && rCanon === "maggi")
  ) {
    return true;
  }
  const rNameLower = recipeIng.name.toLowerCase();
  const uRawLower = userRawOrCanon.trim().toLowerCase();
  return rNameLower.includes(uRawLower) || rNameLower.includes(uCanon);
}

const VALID_CUISINES: Exclude<CuisineOption, "Any">[] = [
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
  "Mediterranean",
  "Continental",
];

const VALID_TASTES: Exclude<TasteOption, "Any">[] = [
  "Spicy",
  "Savory",
  "Tangy",
  "Sweet",
  "Mild",
  "Balanced",
];

const VALID_DIETARY: Exclude<DietaryOption, "No preference">[] = [
  "Vegetarian",
  "Vegan",
  "High-protein",
  "Low-oil",
  "Gluten-free",
  "Dairy-free",
];

export function mapRawRecipeDbRecord(
  raw: Record<string, any>,
  index: number = 0
): NormalizedRecipe {
  const rawCuisine = String(raw?.cuisine || raw?.region || "Indian");
  const matchedCuisine =
    VALID_CUISINES.find((c) => rawCuisine.toLowerCase().includes(c.toLowerCase())) ||
    "Indian";

  const rawTastes: string[] = Array.isArray(raw?.tasteProfile)
    ? raw.tasteProfile
    : ["Savory"];
  const tasteProfile = rawTastes
    .map((t) => VALID_TASTES.find((vt) => vt.toLowerCase() === String(t).toLowerCase()))
    .filter((t): t is Exclude<TasteOption, "Any"> => Boolean(t));

  const rawDietary: string[] = Array.isArray(raw?.dietaryTags)
    ? raw.dietaryTags
    : ["Vegetarian"];
  const dietaryTags = rawDietary
    .map((d) => VALID_DIETARY.find((vd) => vd.toLowerCase() === String(d).toLowerCase()))
    .filter((d): d is Exclude<DietaryOption, "No preference"> => Boolean(d));

  const rawIngredients: any[] = Array.isArray(raw?.ingredients) ? raw.ingredients : [];
  const ingredients: RecipeIngredient[] = rawIngredients.map((ing: any, idx: number) => {
    const name = typeof ing === "string" ? ing : String(ing?.name || ing?.ingredient || `Ingredient ${idx + 1}`);
    const canonicalName = normalizeIngredientName(ing?.canonicalName || name);
    return {
      name,
      canonicalName,
      quantity: String(ing?.quantity || ing?.phrase || "as needed"),
      category: getIngredientCategory(canonicalName),
      isCore: typeof ing?.isCore === "boolean" ? ing.isCore : idx < 4,
    };
  });

  return {
    id: String(raw?.id || raw?.recipe_id || `rec-${index + 1}`),
    recipeDbId: String(raw?.recipeDbId || raw?.recipe_id || `RDB-${1000 + index}`),
    name: String(raw?.name || raw?.Recipe_title || "Seasonal Dish"),
    cuisine: matchedCuisine,
    region: String(raw?.region || raw?.Sub_region || matchedCuisine),
    tasteProfile: tasteProfile.length > 0 ? tasteProfile : ["Savory"],
    cookingTimeMinutes: Number(raw?.cookingTimeMinutes || raw?.total_time || 30),
    dietaryTags: dietaryTags.length > 0 ? dietaryTags : ["Vegetarian"],
    processes: Array.isArray(raw?.processes)
      ? raw.processes.map(String)
      : ["saute", "simmer"],
    utensils: Array.isArray(raw?.utensils)
      ? raw.utensils.map(String)
      : ["pan", "spatula"],
    nutrition: {
      calories: Number(raw?.nutrition?.calories || raw?.Calories || 320),
      proteinG: Number(raw?.nutrition?.proteinG || raw?.Protein || 14),
      carbsG: Number(raw?.nutrition?.carbsG || raw?.Carbohydrate || 34),
      fatG: Number(raw?.nutrition?.fatG || raw?.Total_lipid || 12),
      fiberG: Number(raw?.nutrition?.fiberG || raw?.Fiber || 6),
    },
    ingredients,
    instructions: Array.isArray(raw?.instructions)
      ? raw.instructions.map(String)
      : ["Prepare and chop ingredients.", "Cook over medium heat and season to taste."],
    image: String(raw?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"),
    sourceUrl: "/recipes",
    adaptations: Array.isArray(raw?.adaptations) ? raw.adaptations : [],
  };
}
