"use client";

import React, { useState, useMemo } from "react";
import { Beaker, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { FLAVORDB_PAIRING_GRAPH } from "../../lib/foodoscope/mockCatalog";
import { useFlavorIq } from "../../context/FlavorIqContext";
import { normalizeIngredientName } from "../../lib/foodoscope/normalizers";
import FlavorPairingCard from "../../components/FlavorPairingCard";

const NETWORK_NODES = [
  { id: "tomato", label: "Tomato", x: 320, y: 70, color: "#DC2626" },
  { id: "onion", label: "Onion", x: 490, y: 120, color: "#9333EA" },
  { id: "garlic", label: "Garlic", x: 550, y: 260, color: "#D97706" },
  { id: "ginger", label: "Ginger", x: 470, y: 390, color: "#CA8A04" },
  { id: "tofu", label: "Tofu", x: 320, y: 430, color: "#0D9488" },
  { id: "capsicum", label: "Capsicum", x: 170, y: 390, color: "#16A34A" },
  { id: "paneer", label: "Paneer", x: 90, y: 260, color: "#2563EB" },
  { id: "spinach", label: "Spinach", x: 150, y: 120, color: "#15803D" },
  { id: "cumin", label: "Cumin", x: 320, y: 250, color: "#7C2D12" },
];

const FEATURED_PAIRS = [
  { a: "tofu", b: "capsicum", label: "Tofu + Capsicum" },
  { a: "tofu", b: "ginger", label: "Tofu + Ginger" },
  { a: "tomato", b: "garlic", label: "Garlic + Tomato" },
  { a: "paneer", b: "spinach", label: "Paneer + Spinach" },
  { a: "tomato", b: "onion", label: "Tomato + Onion" },
  { a: "dal", b: "cumin", label: "Dal + Cumin" },
];

export default function FlavorIntelligencePage() {
  const { ingredients, addIngredient, showToast } = useFlavorIq();
  const [selectedNode, setSelectedNode] = useState<string>("tomato");
  const [ingA, setIngA] = useState<string>("tofu");
  const [ingB, setIngB] = useState<string>("ginger");

  const allPairs = useMemo(() => Object.values(FLAVORDB_PAIRING_GRAPH), []);

  const networkEdges = useMemo(() => {
    const nodeIds = new Set(NETWORK_NODES.map((n) => n.id));
    return allPairs.filter(
      (p) => nodeIds.has(p.ingredientA) && nodeIds.has(p.ingredientB)
    );
  }, [allPairs]);

  const activePair = useMemo(() => {
    const k1 = `${ingA}|${ingB}`;
    const k2 = `${ingB}|${ingA}`;
    return (
      FLAVORDB_PAIRING_GRAPH[k1] ||
      FLAVORDB_PAIRING_GRAPH[k2] || {
        ingredientA: ingA,
        ingredientB: ingB,
        sharedMoleculeCount: 8,
        sharedCompounds: ["hexanal", "linalool"],
        flavorProfile: "Complementary Culinary Bridge",
        pairingStrength: 74,
        sensoryNote: `${ingA} and ${ingB} share baseline green-aldehyde and terpene volatiles that balance savory dishes.`,
        source: "FlavorDB" as const,
      }
    );
  }, [ingA, ingB]);

  const filteredPairs = useMemo(() => {
    if (!selectedNode || selectedNode === "all") return allPairs;
    return allPairs.filter(
      (p) => p.ingredientA === selectedNode || p.ingredientB === selectedNode
    );
  }, [allPairs, selectedNode]);

  const userCanons = useMemo(
    () => new Set(ingredients.map(normalizeIngredientName)),
    [ingredients]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-brand-dark to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-bold">
            <Beaker className="w-3.5 h-3.5" />
            FlavorDB Molecular Pairing Graph
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Flavor Intelligence — Understand WHY Ingredients Work Together.
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            FLAVORIQ evaluates shared volatile aroma compounds, functional groups, and FEMA sensory descriptors across ingredient pairs to compute the 25-point Flavor Compatibility score.
          </p>
        </div>
      </section>

      {/* Interactive Network Graph + Pairwise Molecular Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Interactive Flavor Pairing Network */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-brand-dark">
                Interactive Flavor Pairing Network
              </h2>
              <p className="text-xs text-gray-500">
                Click any ingredient node to highlight its molecular compound bridges
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                selectedNode === "all"
                  ? "bg-brand-dark text-brand-lime border-brand-dark"
                  : "bg-brand-surface text-brand-dark border-brand-border"
              }`}
            >
              Show All 26 Bridges
            </button>
          </div>

          <div className="bg-brand-surface/50 rounded-2xl border border-brand-border p-2 overflow-hidden">
            <svg
              viewBox="0 0 640 500"
              className="w-full h-auto max-h-[420px] select-none"
            >
              {/* Edges */}
              {networkEdges.map((edge) => {
                const nA = NETWORK_NODES.find((n) => n.id === edge.ingredientA);
                const nB = NETWORK_NODES.find((n) => n.id === edge.ingredientB);
                if (!nA || !nB) return null;
                const isHighlighted =
                  selectedNode === "all" ||
                  edge.ingredientA === selectedNode ||
                  edge.ingredientB === selectedNode;
                const midX = (nA.x + nB.x) / 2;
                const midY = (nA.y + nB.y) / 2;

                return (
                  <g
                    key={`${edge.ingredientA}-${edge.ingredientB}`}
                    onClick={() => {
                      setIngA(edge.ingredientA);
                      setIngB(edge.ingredientB);
                    }}
                    className="cursor-pointer"
                  >
                    <line
                      x1={nA.x}
                      y1={nA.y}
                      x2={nB.x}
                      y2={nB.y}
                      stroke={isHighlighted ? "#2E7D32" : "#CBD5E1"}
                      strokeWidth={
                        isHighlighted
                          ? Math.max(2, Math.min(6, edge.sharedMoleculeCount / 4))
                          : 1.5
                      }
                      strokeOpacity={isHighlighted ? 0.85 : 0.35}
                    />
                    {isHighlighted && (
                      <g>
                        <rect
                          x={midX - 22}
                          y={midY - 10}
                          width={44}
                          height={20}
                          rx={6}
                          fill="#14331B"
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          fill="#D8F0C2"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {edge.sharedMoleculeCount} mol
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NETWORK_NODES.map((node) => {
                const isSelected = selectedNode === node.id;
                const inPantry = userCanons.has(node.id);
                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node.id);
                      setIngA(node.id);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 34 : 28}
                      fill={isSelected ? "#14331B" : "#FFFFFF"}
                      stroke={node.color}
                      strokeWidth={isSelected ? 5 : 3.5}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill={isSelected ? "#D8F0C2" : "#14331B"}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                    {inPantry && (
                      <circle
                        cx={node.x + 20}
                        cy={node.y - 20}
                        r={7}
                        fill="#2E7D32"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
            <span>
              ● Green badge on node = Currently in your active kitchen pantry
            </span>
            <span>Click any edge label to inspect its shared molecules</span>
          </div>
        </section>

        {/* Right: Interactive Pairwise Compound Inspector */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                Pairwise Compound Lab
              </span>
              <h2 className="text-base font-extrabold text-brand-dark mt-0.5">
                Inspect Any Ingredient Pairing
              </h2>
            </div>

            {/* Quick Featured Pair Pills */}
            <div className="flex flex-wrap gap-1.5">
              {FEATURED_PAIRS.map((fp) => {
                const active =
                  (ingA === fp.a && ingB === fp.b) ||
                  (ingA === fp.b && ingB === fp.a);
                return (
                  <button
                    key={fp.label}
                    type="button"
                    onClick={() => {
                      setIngA(fp.a);
                      setIngB(fp.b);
                      setSelectedNode(fp.a);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      active
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-brand-surface text-brand-dark border-brand-border hover:bg-brand-lime/50"
                    }`}
                  >
                    {fp.label}
                  </button>
                );
              })}
            </div>

            {/* Dropdown Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Ingredient A
                </label>
                <select
                  value={ingA}
                  onChange={(e) => {
                    setIngA(e.target.value);
                    setSelectedNode(e.target.value);
                  }}
                  className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-bold capitalize bg-brand-surface/40"
                >
                  {[
                    "tofu",
                    "paneer",
                    "tomato",
                    "onion",
                    "garlic",
                    "ginger",
                    "capsicum",
                    "spinach",
                    "potato",
                    "dal",
                    "chickpeas",
                    "pasta",
                    "mushroom",
                    "black beans",
                    "rice",
                    "coconut milk",
                    "noodles",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Ingredient B
                </label>
                <select
                  value={ingB}
                  onChange={(e) => setIngB(e.target.value)}
                  className="w-full rounded-xl border border-brand-border px-3 py-2 text-xs font-bold capitalize bg-brand-surface/40"
                >
                  {[
                    "ginger",
                    "capsicum",
                    "garlic",
                    "tomato",
                    "onion",
                    "spinach",
                    "cumin",
                    "paneer",
                    "tofu",
                    "sesame",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Pair Card */}
            <FlavorPairingCard pair={activePair} />
          </div>

          <button
            type="button"
            onClick={() => {
              addIngredient(ingA.charAt(0).toUpperCase() + ingA.slice(1));
              addIngredient(ingB.charAt(0).toUpperCase() + ingB.slice(1));
              showToast(
                "Pair Added to Pantry",
                `Added ${ingA} and ${ingB} to your active cooking context.`
              );
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
            Add Both Ingredients to My Kitchen Pantry
          </button>
        </section>
      </div>

      {/* Filtered Pairing Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-brand-dark capitalize">
            {selectedNode === "all"
              ? `All Indexed FlavorDB Molecular Bridges (${filteredPairs.length})`
              : `Molecular Bridges Connected to ${selectedNode} (${filteredPairs.length})`}
          </h2>
          {selectedNode !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedNode("all")}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Show All Pairs
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPairs.map((pair) => (
            <FlavorPairingCard
              key={`${pair.ingredientA}-${pair.ingredientB}`}
              pair={pair}
              onSelectPair={(a, b) => {
                setIngA(a);
                setIngB(b);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
