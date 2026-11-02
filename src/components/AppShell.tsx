"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import Sidebar, { NAV_ITEMS } from "./Sidebar";
import Navbar from "./Navbar";
import { useFlavorIq } from "../context/FlavorIqContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { toasts, dismissToast } = useFlavorIq();

  const mobileBottomItems = NAV_ITEMS.slice(0, 5);

  return (
    <div className="min-h-screen flex bg-brand-surface text-brand-dark">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-brand-border bg-white/70 px-4 sm:px-6 lg:px-8 py-4 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p className="font-semibold text-brand-dark">
              FLAVORIQ — From What You Have to What You&apos;ll Love • Team CodeXIT
            </p>
            <p>
              Powered by RecipeDB + FlavorDB Molecular Pairing Intelligence • Foodoscope Fork It Challenge 2026
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-dark text-white border-t border-white/15 px-2 py-1.5 flex items-center justify-around">
        {mobileBottomItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/" || pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold ${
                active ? "bg-brand-primary text-white" : "text-brand-lime/80"
              }`}
            >
              <span className="text-sm">{item.emoji}</span>
              <span className="truncate max-w-[64px]">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Toast Notifications */}
      <div className="fixed bottom-20 lg:bottom-5 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-brand-dark text-white shadow-xl border border-brand-lime/30 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-start gap-2.5">
              {t.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              ) : t.type === "warning" ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-extrabold">{t.title}</p>
                {t.description && (
                  <p className="text-[11px] text-brand-lime/90 mt-0.5">
                    {t.description}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
