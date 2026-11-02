import { NormalizedRecipe, RecipeIngredient } from "./types";

export const INGREDIENT_SYNONYM_GROUPS: Record<string, string[]> = {
  dal: [
    "dal", "daal", "dhal", "lentil", "lentils", "toor dal", "arhar dal",
    "moong dal", "masoor dal", "chana dal", "urad dal", "yellow dal",
    "yellow lentils", "red lentils", "split lentils", "mung dal", "mixed dal"
  ],
  paneer: ["paneer", "cottage cheese", "indian cottage cheese", "chenna", "chhena"],
  tomato: ["tomato", "tomatoes", "tamatar", "tomato puree", "crushed tomatoes", "cherry tomatoes"],
  onion: ["onion", "onions", "pyaaz", "pyaz", "red onion", "white onion", "shallots", "spring onion"],
  capsicum: ["capsicum", "bell pepper", "bell peppers", "shimla mirch", "green pepper", "red bell pepper", "peppers"],
  potato: ["potato", "potatoes", "aloo", "alu", "baby potatoes", "boiled potato"],
  rice: ["rice", "chawal", "basmati rice", "basmati", "cooked rice", "white rice", "brown rice"],
  spinach: ["spinach", "palak", "baby spinach", "saag", "leafy greens"],
  garlic: ["garlic", "lahsun", "lehsun", "garlic cloves", "minced garlic"],
  ginger: ["ginger", "adrak", "fresh ginger", "ginger juliennes"],
  "green chili": ["green chili", "green chilli", "green chilies", "hari mirch", "chili", "chilli", "jalapeno"],
  coriander: ["coriander", "cilantro", "dhania", "coriander leaves", "coriander seeds"],
  cumin: ["cumin", "jeera", "cumin seeds", "roasted cumin"],
  pasta: ["pasta", "penne", "spaghetti", "macaroni", "fusilli", "noodles"],
  chickpeas: ["chickpeas", "chickpea", "chana", "chole", "kabuli chana", "garbanzo", "garbanzo beans"],
  mushroom: ["mushroom", "mushrooms", "button mushroom", "cremini"],
  tofu: ["tofu", "bean curd", "firm tofu", "soya paneer"],
  "black beans": ["black beans", "beans", "kidney beans", "rajma", "pinto beans"],
};

const ALIAS_TO_CANONICAL: Record<string, string> = {};
for (const [canon, aliases] of Object.entries(INGREDIENT_SYNONYM_GROUPS)) {
  ALIAS_TO_CANONICAL[canon] = canon;
  for (const a of aliases) {
    ALIAS_TO_CANONICAL[a.toLowerCase()] = canon;
  }
}

export function normalizeIngredientName(raw: string): string {
  if (!raw) return "";
  const cleaned = String(raw).trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ");
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

export function isIngredientMatch(userRawOrCanon: string, recipeIng: RecipeIngredient): boolean {
  const uCanon = normalizeIngredientName(userRawOrCanon);
  if (!uCanon) return false;
  const rCanon = normalizeIngredientName(recipeIng.canonicalName || recipeIng.name);
  if (uCanon === rCanon) return true;
  const rNameLower = recipeIng.name.toLowerCase();
  const uRawLower = userRawOrCanon.trim().toLowerCase();
  return rNameLower.includes(uRawLower) || rNameLower.includes(uCanon);
}
