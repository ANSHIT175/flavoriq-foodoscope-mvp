"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Utensils,
  Sparkles,
  Beaker,
  Flame,
  RefreshCw,
  BarChart2,
  Heart,
  ShoppingCart,
  Calendar,
  Compass,
  BookOpen,
  Settings,
  HelpCircle,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useFlavorIq } from "../context/FlavorIqContext";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home, emoji: "🏠" },
  { href: "/recipes", label: "Recipe Finder", icon: Utensils, emoji: "🍳" },
  { href: "/generator", label: "AI Recipe Generator", icon: Sparkles, emoji: "🧠" },
  { href: "/flavor-intelligence", label: "Flavor Intelligence", icon: Beaker, emoji: "🔬" },
  { href: "/nutrition", label: "Nutrition Analyzer", icon: Flame, emoji: "🥗" },
  { href: "/substitutions", label: "Smart Substitutions", icon: RefreshCw, emoji: "🔄" },
  { href: "/compare", label: "Compare Recipes", icon: BarChart2, emoji: "📊", badgeKey: "compare" },
  { href: "/saved", label: "Saved Recipes", icon: Heart, emoji: "❤️", badgeKey: "saved" },
  { href: "/grocery", label: "Grocery Planner", icon: ShoppingCart, emoji: "🛒", badgeKey: "grocery" },
  { href: "/meal-planner", label: "Meal Planner", icon: Calendar, emoji: "📅" },
  { href: "/cuisines", label: "Explore Cuisines", icon: Compass, emoji: "🌍" },
  { href: "/about", label: "How It Works", icon: BookOpen, emoji: "💡" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { savedRecipeIds, compareRecipeIds, groceryItems } = useFlavorIq();

  const getBadgeCount = (key?: string) => {
    if (key === "saved") return savedRecipeIds.length;
    if (key === "compare") return compareRecipeIds.length;
    if (key === "grocery") return groceryItems.filter((i) => !i.checked).length;
    return 0;
  };

  const renderLinks = (isMobile = false) => (
    <div className="flex flex-col justify-between flex-1 py-4 px-3 space-y-6 overflow-y-auto">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const count = getBadgeCount(item.badgeKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-primary text-white shadow-xs ring-1 ring-brand-lime/40"
                  : "text-brand-lime/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm leading-none shrink-0">{item.emoji}</span>
                {(!collapsed || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>
              {(!collapsed || isMobile) && count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-brand-lime text-brand-dark"
                      : "bg-white/15 text-brand-lime"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings & Help */}
      <div className="pt-4 border-t border-white/15 space-y-1">
        <Link
          href="/settings"
          onClick={() => isMobile && setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            pathname === "/settings"
              ? "bg-brand-primary text-white"
              : "text-brand-lime/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && <span>⚙️ Settings</span>}
        </Link>
        <Link
          href="/about"
          onClick={() => isMobile && setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            pathname === "/about"
              ? "bg-brand-primary text-white"
              : "text-brand-lime/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && <span>❓ Help &amp; Guide</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-brand-dark text-white border-r border-brand-primary/30 transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-xs shrink-0">
              <ChefHat className="w-5 h-5 text-brand-lime" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-base font-extrabold tracking-tight block leading-none">
                  FLAVORIQ
                </span>
                <span className="text-[10px] text-brand-lime/80 font-medium block mt-0.5 truncate">
                  Food Intelligence Platform
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-brand-lime transition cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {renderLinks(false)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-brand-dark text-white h-full flex flex-col z-10 shadow-2xl">
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-brand-lime" />
                </div>
                <div>
                  <span className="text-base font-extrabold block leading-none">
                    FLAVORIQ
                  </span>
                  <span className="text-[10px] text-brand-lime/80">
                    RecipeDB + FlavorDB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-brand-lime"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderLinks(true)}
          </aside>
        </div>
      )}
    </>
  );
}
