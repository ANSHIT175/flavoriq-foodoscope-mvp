# FLAVORIQ — From What You Have to What You’ll Love

> **“We don't just return a recipe. We explain why that recipe makes sense for this user.”**

Built by **Team CodeXIT** for the **Foodoscope Fork It Challenge 2026** hosted by **CoSy Lab, IIIT Delhi**.

---

## 1. Product Overview

**FLAVORIQ** is a flavor-aware personalized recipe recommendation platform that connects three distinct layers of food intelligence:
1. **Recipe Knowledge (`RecipeDB`)** — Answers *"What can this user cook?"* (retrieves candidate recipes, ingredients, quantities, cooking processes, and nutritional metadata).
2. **Flavor Intelligence (`FlavorDB`)** — Answers *"Why might these ingredients work together?"* (evaluates shared flavor compounds, molecular functional groups, and ingredient pairing relationships).
3. **User Cooking Context** — Captures available pantry ingredients, preferred cuisine, taste profile, maximum cooking time, and dietary restrictions.

**CocktailDB Scope Note:** `CocktailDB` is intentionally excluded from the MVP scope to keep the first version focused on food recipe discovery and meal personalization, while the adapter layer (`/src/lib/foodoscope/`) is architected so `cocktailDb.ts` can be plugged in seamlessly in future versions.

---

## 2. Project Architecture

```text
flavoriq-nextjs/
├── .env.example                       # Environment variables template (API_MODE=MOCK, FOODOSCOPE_API_KEY)
├── .nvmrc                             # Pins Node.js 20 for Vercel & local version managers
├── .node-version                      # Pins Node.js 20 for Vercel builds
├── next.config.mjs                    # Next.js 14 configuration
├── postcss.config.js                  # Tailwind CSS + Autoprefixer PostCSS configuration
├── package.json                       # Pure-JS/TS dependencies & engines: { "node": "20.x" }
├── package-lock.json                  # Lockfile synchronized with package.json (zero native modules)
├── tsconfig.json                      # TypeScript strict configuration
├── tailwind.config.ts                 # FLAVORIQ green/lime visual design tokens
├── vercel.json                        # Vercel Next.js build settings
├── scripts/
│   └── verify-demo-flow.ts            # CLI verification script for recommendation scoring
└── src/
    ├── lib/
    │   ├── foodoscope/
    │   │   ├── types.ts               # Internal normalized TypeScript interfaces
    │   │   ├── normalizers.ts         # Ingredient aliasing & RecipeDB/FlavorDB schema mappers
    │   │   ├── recipeDb.ts            # Server-side RecipeDB REST adapter (Live + Mock mode)
    │   │   ├── flavorDb.ts            # Server-side FlavorDB pairing & compound signal adapter
    │   │   └── mockCatalog.ts         # Clearly labeled development dataset for offline/mock testing
    │   └── recommendation/
    │       └── scoring.ts             # Transparent 0-100 multi-factor scoring & explanation generator
    └── app/
        ├── globals.css                # Tailwind directives & brand surface styles
        ├── layout.tsx                 # Root App Router layout
        ├── page.tsx                   # Interactive FLAVORIQ UI & score breakdown dashboard
        └── api/
            └── recommend/
                └── route.ts           # Next.js server-side API route (protects FOODOSCOPE_API_KEY)
```

---

## 3. Setup & Local Development

### Prerequisites
- **Node.js 20.x LTS** (enforced via `package.json` `engines`, `.nvmrc`, and `.node-version`)
- npm 9+ / 10+

### Step-by-Step Commands
```bash
# 1. Remove any stale lockfile/node_modules if upgrading from an older branch, then install
rm -rf node_modules
npm install

# 2. Configure environment variables (defaults to API_MODE=MOCK out of the box)
cp .env.example .env.local

# 3. Verify production build locally
npm run build

# 4. Run in development mode
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 4. Switching Between MOCK and LIVE Foodoscope API Mode

FLAVORIQ strictly separates development mock data from live Foodoscope API output:

- **Mock / Demo Mode (`API_MODE=MOCK` or `API_MODE=mock`, or unset):**
  - Uses the local development catalog (`src/lib/foodoscope/mockCatalog.ts`) and clearly badges every result as **`API_MODE: MOCK`** and **`Illustrative Match Score`**.
  - Runs the **100% real, deterministic calculation engine** (`scoring.ts`) — changing `Paneer` → `Potato` or `Indian` → `Italian` dynamically recalculates ingredient coverage, FlavorDB compound pairings, and rank order without requiring live API keys.
- **Live Mode (`API_MODE=LIVE` or `API_MODE=live`):**
  - Set `API_MODE=LIVE` and provide your server-side `FOODOSCOPE_API_KEY` from [https://www.foodoscope.com/](https://www.foodoscope.com/).
  - All requests are proxied through `/api/recommend` on the server so `FOODOSCOPE_API_KEY` is never exposed to browser JavaScript.

---

## 5. Transparent Scoring Formula

All weights are configured in one place (`src/lib/recommendation/scoring.ts` -> `SCORING_WEIGHTS`):

| Component | Max Points | How It Is Calculated |
| :--- | :--- | :--- |
| **Ingredient Coverage** | **30 pts** | Proportion of recipe core ingredients present in user's pantry + pantry utilization ratio |
| **Flavor Compatibility** | **25 pts** | FlavorDB shared flavor molecule count & pairing density across active recipe ingredients |
| **Cuisine Fit** | **15 pts** | Exact match with user's selected cuisine (`Indian`, `Italian`, `Mexican`, `Chinese`, `Continental`, `Any`) |
| **Taste Fit** | **10 pts** | Match with user's selected taste profile (`Spicy`, `Mild`, `Sweet`, `Savory`, `Tangy`, `Any`) |
| **Cooking Time Fit** | **10 pts** | Whether recipe total cooking time fits within user's maximum cooking time constraint |
| **Dietary Fit** | **10 pts** | Strict filter & match on dietary preference (`Vegetarian`, `Vegan`, `Low-oil`, `Gluten-free`) |
| **Total Normalized Score** | **100 pts** | Deterministic sum (`0–100`), never random or hardcoded |

---

## 6. Deployment (Vercel)

1. Push the repository to GitHub (ensure any old `package-lock.json` that referenced `better-sqlite3` is replaced with the clean `package-lock.json` from `npm install`).
2. Import the project into [Vercel](https://vercel.com/).
3. In **Vercel Project Settings → General → Node.js Version**, ensure **20.x** is selected (Vercel also reads `"engines": { "node": "20.x" }` in `package.json` and `.nvmrc` automatically).
4. In **Vercel Project Settings → Environment Variables**, set `API_MODE=MOCK` (or `API_MODE=LIVE` with `FOODOSCOPE_API_KEY` when connecting to live Foodoscope endpoints).
5. Click **Deploy**. Zero native `node-gyp` modules are used, so `npm install` and `npm run build` succeed cleanly on Vercel Serverless.
