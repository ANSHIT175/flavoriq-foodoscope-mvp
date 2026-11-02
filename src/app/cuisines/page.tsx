"use client";

import React from "react";
import Link from "next/link";
import { Compass, Clock, Beaker, ArrowRight } from "lucide-react";
import { CUISINE_EXPLORER_DATA } from "../../lib/foodoscope/mockCatalog";

const CUISINE_FLAGS: Record<string, string> = {
  Indian: "🇮🇳",
  Chinese: "🇨🇳",
  Italian: "🇮🇹",
  Mexican: "🇲🇽",
  Japanese: "🇯🇵",
  Thai: "🇹🇭",
  Mediterranean: "🇬🇷",
};

export default function CuisineExplorerGalleryPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark to-brand-primary text-white p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <Compass className="w-3.5 h-3.5" />
            Global Molecular Gastronomy Atlas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Explore Cuisines
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            Click any regional cuisine card below to open its dedicated culinary profile, signature aroma molecules, popular ingredients, and matching recipes.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CUISINE_EXPLORER_DATA.map((item) => {
          const flag = CUISINE_FLAGS[item.cuisine] || "🌍";
          return (
            <Link
              key={item.cuisine}
              href={`/cuisines/${item.cuisine.toLowerCase()}`}
              className="group bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-brand-dark">
                  <img
                    src={item.image}
                    alt={item.cuisine}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <span>{flag}</span>
                        <span>{item.cuisine}</span>
                      </h2>
                      <p className="text-[11px] text-brand-lime mt-0.5">
                        {item.tagline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50">
                      <Clock className="w-3 h-3 text-brand-lime" />
                      {item.avgCookingTime}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">
                      Flavor Profile
                    </span>
                    <p className="font-semibold text-brand-dark mt-0.5">
                      {item.flavorProfile}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1">
                      <Beaker className="w-3 h-3 text-brand-primary" />
                      Signature Molecules
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.signatureMolecules.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-mono text-[11px] font-bold"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-brand-surface/50 border-t border-brand-border flex items-center justify-between text-xs font-extrabold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition">
                <span>Open {item.cuisine} Cuisine Page</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
