"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Compass, Clock, Beaker, ArrowRight } from "lucide-react";
import { CUISINE_EXPLORER_DATA } from "../../lib/foodoscope/mockCatalog";
import { useFlavorIq } from "../../context/FlavorIqContext";

export default function ExploreCuisinesPage() {
  const router = useRouter();
  const { setCuisine, computeRecommendations } = useFlavorIq();

  const handleSelectCuisine = async (
    c: (typeof CUISINE_EXPLORER_DATA)[number]["cuisine"]
  ) => {
    setCuisine(c);
    await computeRecommendations({ cuisine: c });
    router.push("/recipes");
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-brand-dark to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            Regional Culinary &amp; Aroma Signatures
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Explore Cuisines
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            Discover how different culinary traditions pair aromatic molecules. Click any cuisine card to filter recommendations and recalculate your 100-point scores.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CUISINE_EXPLORER_DATA.map((item) => (
          <article
            key={item.cuisine}
            onClick={() => handleSelectCuisine(item.cuisine)}
            className="group cursor-pointer bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-brand-dark">
                <img
                  src={item.image}
                  alt={item.cuisine}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h2 className="text-xl font-extrabold">{item.cuisine}</h2>
                    <p className="text-[11px] text-brand-lime">{item.tagline}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-brand-lime" />
                    {item.avgCookingTime}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
                    Flavor Profile
                  </span>
                  <p className="font-semibold text-brand-dark mt-0.5">
                    {item.flavorProfile}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">
                    Popular Dishes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.popularDishes.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded-md bg-brand-surface border border-brand-border text-brand-dark font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1">
                    <Beaker className="w-3 h-3 text-brand-primary" />
                    Signature Aroma Molecules
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.signatureMolecules.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-mono text-[11px] font-semibold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-brand-surface/50 border-t border-brand-border flex items-center justify-between text-xs font-extrabold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition">
              <span>Filter Recipes by {item.cuisine} Cuisine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
