import {
  ApiMode,
  FlavorCompatibilityResult,
  FlavorPairingRelationship,
} from "./types";
import { normalizeIngredientName } from "./normalizers";
import { FLAVORDB_PAIRING_GRAPH } from "./mockCatalog";

/**
 * FlavorDB Service Adapter
 * Evaluates ingredient-level flavor compound sharing and pairing compatibility.
 * Never fabricates scientific claims when no pairing relationship exists.
 */
export async function getFlavorCompatibility(
  ingredients: string[],
  maxWeight: number = 25,
  modeOverride?: ApiMode
): Promise<FlavorCompatibilityResult> {
  const canonicalList = Array.from(
    new Set(ingredients.map(normalizeIngredientName).filter(Boolean))
  );

  if (canonicalList.length < 2) {
    return {
      score: Math.round(maxWeight * 0.6),
      normalizedRatio: 0.6,
      flavorFitLabel: "Medium",
      matchedRelationships: [],
      supportingSignals: [
        "Single primary ingredient evaluated; add 2+ ingredients to compute multi-ingredient FlavorDB compound overlap.",
      ],
    };
  }

  const matchedRelationships: FlavorPairingRelationship[] = [];
  let totalPairs = 0;
  let weightedPairSum = 0;

  for (let i = 0; i < canonicalList.length; i++) {
    for (let j = i + 1; j < canonicalList.length; j++) {
      totalPairs++;
      const a = canonicalList[i];
      const b = canonicalList[j];
      const key1 = `${a}|${b}`;
      const key2 = `${b}|${a}`;
      const rel = FLAVORDB_PAIRING_GRAPH[key1] || FLAVORDB_PAIRING_GRAPH[key2];
      if (rel) {
        matchedRelationships.push(rel);
        const pairStrength = Math.min(1.0, 0.65 + rel.sharedMoleculeCount * 0.025);
        weightedPairSum += pairStrength;
      } else {
        weightedPairSum += 0.35;
      }
    }
  }

  const rawRatio = totalPairs > 0 ? weightedPairSum / totalPairs : 0.5;
  const normalizedRatio = Math.min(1.0, Math.max(0.2, rawRatio));
  const score = Math.round(normalizedRatio * maxWeight);

  const flavorFitLabel: "High" | "Medium" | "Low" =
    normalizedRatio >= 0.78 ? "High" : normalizedRatio >= 0.55 ? "Medium" : "Low";

  const supportingSignals =
    matchedRelationships.length > 0
      ? matchedRelationships.map(
          (r) =>
            `${r.ingredientA} + ${r.ingredientB}: ${r.sharedMoleculeCount} shared flavor compounds (${r.sharedCompounds.slice(0, 2).join(", ")}) — ${r.sensoryNote}`
        )
      : [
          "No high-density molecular overlap indexed for this specific pair in the local FlavorDB subset; scored using baseline culinary compatibility.",
        ];

  return {
    score,
    normalizedRatio,
    flavorFitLabel,
    matchedRelationships,
    supportingSignals,
  };
}
