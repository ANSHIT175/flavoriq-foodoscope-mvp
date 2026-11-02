"use client";

import React, { useState, useMemo } from "react";
import { Beaker, Sparkles, CheckCircle2, Layers } from "lucide-react";
import { FLAVORDB_PAIRING_GRAPH } from "../../lib/foodoscope/mockCatalog";
import { useFlavorIq } from "../../context/FlavorIqContext";
import {
  getIngredientCategory,
  normalizeIngredientName,
} from "../../lib/foodoscope/normalizers";
import FlavorPairingCard from "../../components/FlavorPairingCard";

const NETWORK_NODES = [
  {
    id: "tofu",
    label: "Tofu",
    x: 320,
    y: 55,
    color: "#10B981",
    compounds: ["hexanal", "1-octen-3-ol", "maltol", "benzaldehyde"],
    notes: "Clean soy protein curd with subtle grassy hexanal and nutty maltol notes that absorb pungent aromatics.",
  },
  {
    id: "ginger",
    label: "Ginger",
    x: 470,
    y: 90,
    color: "#F59E0B",
    compounds: ["zingiberene", "citral", "geranial", "citronellol"],
    notes: "Warm, citrusy sesquiterpene hydrocarbons (zingiberene) that cut through rich lipids and soy proteins.",
  },
  {
    id: "garlic",
    label: "Garlic",
    x: 560,
    y: 195,
    color: "#EAB308",
    compounds: ["diallyl disulfide", "allyl methyl sulfide", "allicin"],
    notes: "Pungent organosulfur compounds that caramelize into deep savory umami bases when sautéed.",
  },
  {
    id: "capsicum",
    label: "Capsicum",
    x: 555,
    y: 330,
    color: "#22C55E",
    compounds: ["2-isobutyl-3-methoxypyrazine", "linalool", "hexanal"],
    notes: "Crisp vegetal methoxypyrazines and floral linalool that add bright aromatic lift to woks and kadai gravies.",
  },
  {
    id: "onion",
    label: "Onion",
    x: 455,
    y: 425,
    color: "#A855F7",
    compounds: ["dipropyl disulfide", "3-methylbutanal", "phenylacetaldehyde"],
    notes: "Sulfurous thiosulfinates that transform into sweet Maillard aldehydes upon browning.",
  },
  {
    id: "tomato",
    label: "Tomato",
    x: 320,
    y: 445,
    color: "#EF4444",
    compounds: ["hexanal", "furaneol", "geranylacetone", "2-methylbutanal"],
    notes: "Glutamate-rich acidic fruit volatiles that bridge dairy lactones, alliums, and toasted spices.",
  },
  {
    id: "paneer",
    label: "Paneer",
    x: 175,
    y: 420,
    color: "#3B82F6",
    compounds: ["delta-decalactone", "acetoin", "butanoic acid", "hexanal"],
    notes: "Milky sweet lactones that mellow spicy capsaicin and acidic tomato gravies.",
  },
  {
    id: "spinach",
    label: "Spinach",
    x: 85,
    y: 325,
    color: "#16A34A",
    compounds: ["(Z)-3-hexenol", "hexanal", "2-ethylfuran"],
    notes: "Fresh green-leaf alcohols and mineral volatiles that pair with lactones and starchy tubers.",
  },
  {
    id: "cumin",
    label: "Cumin",
    x: 85,
    y: 195,
    color: "#92400E",
    compounds: ["cuminaldehyde", "beta-pinene", "p-cymene", "gamma-terpinene"],
    notes: "Warm, earthy terpene aldehydes released during hot oil tempering (tadka).",
  },
  {
    id: "dal",
    label: "Dal",
    x: 175,
    y: 90,
    color: "#D97706",
    compounds: ["hexanal", "2-acetylpyrrole", "benzaldehyde"],
    notes: "Nutty legume proteins that bind with toasted cumin terpenes, browned garlic, and tangy tomato.",
  },
  {
    id: "chickpeas",
    label: "Chickpeas",
    x: 245,
    y: 250,
    color: "#B45309",
    compounds: ["hexanal", "geranylacetone", "beta-ionone", "linalool"],
    notes: "Earthy garbanzo volatiles that harmonize with roasted cumin and acidic tomato masalas.",
  },
  {
    id: "mushroom",
    label: "Mushroom",
    x: 400,
    y: 250,
    color: "#64748B",
    compounds: ["1-octen-3-ol", "methional", "guaiacol"],
    notes: "Umami-dense fungal alcohols (1-octen-3-ol) that pair synergistically with garlic and herbs.",
  },
];

export default function FlavorIntelligenceLabPage() {
  const { ingredients, addIngredient } = useFlavorIq();
  const [selectedNodeId, setSelectedNodeId] = useState<string>("tofu");

  const allPairs = useMemo(() => Object.values(FLAVORDB_PAIRING_GRAPH), []);

  const activeNode = useMemo(
    () =>
      NETWORK_NODES.find((n) => n.id === selectedNodeId) || NETWORK_NODES[0],
    [selectedNodeId]
  );

  const connectedPairs = useMemo(
    () =>
      allPairs.filter(
        (p) =>
          p.ingredientA === activeNode.id || p.ingredientB === activeNode.id
      ),
    [allPairs, activeNode]
  );

  const compatibleIngredients = useMemo(
    () =>
      connectedPairs.map((p) => {
        const partnerId =
          p.ingredientA === activeNode.id ? p.ingredientB : p.ingredientA;
        return {
          id: partnerId,
          name: partnerId.charAt(0).toUpperCase() + partnerId.slice(1),
          molecules: p.sharedMoleculeCount,
          compounds: p.sharedCompounds,
          strength:
            p.pairingStrength || Math.min(96, 65 + p.sharedMoleculeCount * 1.5),
        };
      }),
    [connectedPairs, activeNode]
  );

  const avgPairingStrength = useMemo(() => {
    if (compatibleIngredients.length === 0) return 88;
    return Math.round(
      compatibleIngredients.reduce((a, b) => a + b.strength, 0) /
        compatibleIngredients.length
    );
  }, [compatibleIngredients]);

  const networkEdges = useMemo(() => {
    const nodeSet = new Set(NETWORK_NODES.map((n) => n.id));
    return allPairs.filter(
      (p) => nodeSet.has(p.ingredientA) && nodeSet.has(p.ingredientB)
    );
  }, [allPairs]);

  const userCanons = useMemo(
    () => new Set(ingredients.map(normalizeIngredientName)),
    [ingredients]
  );

  return (
    <div className="space-y-8">
      {/* Dark Scientific Header */}
      <section className="rounded-3xl bg-[#0E2414] text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-brand-lime text-xs font-extrabold border border-emerald-400/30">
            <Beaker className="w-3.5 h-3.5" />
            FlavorDB Molecular Graph Visualization
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Flavor Intelligence — Understand WHY Ingredients Work Together
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/85 leading-relaxed">
            Click any node in the interactive graph or selector pills below (Tofu, Ginger, Garlic, Capsicum, Onion, Tomato, Paneer, Spinach, Cumin, Dal, Chickpeas, Mushroom) to inspect its volatile aroma compounds and pairing bridges.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 max-w-md">
          {NETWORK_NODES.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelectedNodeId(n.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize border transition cursor-pointer ${
                selectedNodeId === n.id
                  ? "bg-brand-lime text-brand-dark border-brand-lime shadow"
                  : "bg-white/10 text-white border-white/15 hover:bg-white/20"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN TECHNICAL WORKSPACE: Left Interactive Graph + Right Node Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Flavor Network Canvas */}
        <section className="lg:col-span-7 bg-[#112A18] text-white rounded-3xl border border-emerald-500/30 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-lime">
                Interactive Molecular Pairing Topology
              </span>
              <h2 className="text-base font-extrabold text-white">
                Click Any Ingredient Node to Inspect Chemical Bridges
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-brand-dark bg-brand-lime px-3 py-1 rounded-lg">
              Selected: {activeNode.label.toUpperCase()}
            </span>
          </div>

          <div className="rounded-2xl bg-[#0B1D10] border border-emerald-500/20 p-2 overflow-hidden">
            <svg
              viewBox="0 0 640 500"
              className="w-full h-auto max-h-[440px] select-none"
            >
              {/* Edges */}
              {networkEdges.map((edge) => {
                const nA = NETWORK_NODES.find((n) => n.id === edge.ingredientA);
                const nB = NETWORK_NODES.find((n) => n.id === edge.ingredientB);
                if (!nA || !nB) return null;
                const active =
                  edge.ingredientA === activeNode.id ||
                  edge.ingredientB === activeNode.id;
                const midX = (nA.x + nB.x) / 2;
                const midY = (nA.y + nB.y) / 2;

                return (
                  <g
                    key={`${edge.ingredientA}-${edge.ingredientB}`}
                    onClick={() => {
                      const other =
                        edge.ingredientA === activeNode.id
                          ? edge.ingredientB
                          : edge.ingredientA;
                      setSelectedNodeId(other);
                    }}
                    className="cursor-pointer"
                  >
                    <line
                      x1={nA.x}
                      y1={nA.y}
                      x2={nB.x}
                      y2={nB.y}
                      stroke={active ? "#D8F0C2" : "#2E7D32"}
                      strokeWidth={active ? 3.5 : 1.5}
                      strokeOpacity={active ? 0.95 : 0.35}
                    />
                    {active && (
                      <g>
                        <rect
                          x={midX - 24}
                          y={midY - 10}
                          width={48}
                          height={20}
                          rx={6}
                          fill="#D8F0C2"
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          fill="#14331B"
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
                const isSelected = node.id === activeNode.id;
                const isConnected = compatibleIngredients.some(
                  (c) => c.id === node.id
                );
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 34 : isConnected ? 29 : 24}
                      fill={isSelected ? "#D8F0C2" : "#14331B"}
                      stroke={node.color}
                      strokeWidth={isSelected ? 5 : 3}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill={isSelected ? "#14331B" : "#FFFFFF"}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-brand-lime/80 pt-3">
            <span>
              Click any node: Tofu → Ginger → Garlic → Capsicum → Onion → Tomato
            </span>
            <span>Edge labels show shared FlavorDB aroma molecule count</span>
          </div>
        </section>

        {/* Right Node Inspector Side Panel */}
        <aside className="lg:col-span-5 bg-white rounded-3xl border border-brand-border p-6 shadow-md flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">
                  Selected Node Inspector
                </span>
                <h2 className="text-2xl font-extrabold text-brand-dark capitalize mt-0.5">
                  {activeNode.label}
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  Category: {getIngredientCategory(activeNode.id)}
                </span>
              </div>

              <div className="text-right bg-brand-surface px-3.5 py-2 rounded-2xl border border-brand-border">
                <span className="text-xl font-extrabold text-brand-primary block leading-none">
                  {avgPairingStrength}%
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  Pairing Strength
                </span>
              </div>
            </div>

            {/* Flavor Compounds */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block mb-2">
                Key Volatile Flavor Compounds ({activeNode.compounds.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.compounds.map((comp) => (
                  <span
                    key={comp}
                    className="px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border text-xs font-mono font-bold text-brand-dark"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Sensory Profile */}
            <div className="p-3.5 rounded-2xl bg-brand-surface/60 border border-brand-border space-y-1">
              <span className="text-xs font-extrabold text-brand-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sensory &amp; Olfactory Profile
              </span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {activeNode.notes}
              </p>
            </div>

            {/* Compatible Ingredients */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block mb-2">
                Compatible Ingredients ({compatibleIngredients.length} — Click to Inspect)
              </span>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {compatibleIngredients.map((comp) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => {
                      const existsInGraph = NETWORK_NODES.some(
                        (n) => n.id === comp.id
                      );
                      if (existsInGraph) setSelectedNodeId(comp.id);
                    }}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-surface/30 hover:bg-brand-lime/50 flex items-center justify-between text-xs transition cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="font-bold text-brand-dark block">
                        {activeNode.label} + {comp.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {comp.compounds.slice(0, 2).join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[11px] text-gray-600">
                        {comp.molecules} mol
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-dark text-brand-lime">
                        {Math.round(comp.strength)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => addIngredient(activeNode.label)}
            disabled={userCanons.has(activeNode.id)}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-dark disabled:bg-emerald-100 disabled:text-emerald-800 text-white text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {userCanons.has(activeNode.id)
              ? `${activeNode.label} is in Your Active Pantry ✓`
              : `Add ${activeNode.label} to Kitchen Pantry`}
          </button>
        </aside>
      </div>

      {/* Molecular Pairing Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-primary" />
            Molecular Pairing Cards for {activeNode.label} ({connectedPairs.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedPairs.map((pair) => (
            <FlavorPairingCard
              key={`${pair.ingredientA}-${pair.ingredientB}`}
              pair={pair}
              onSelectPair={(a, b) => {
                const next = a === activeNode.id ? b : a;
                if (NETWORK_NODES.some((n) => n.id === next)) {
                  setSelectedNodeId(next);
                }
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
