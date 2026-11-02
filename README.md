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
├── .env.example                       # Environment variables template (API_MODE, FOODOSCOPE_API_KEY)
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript strict configuration
├── tailwind.config.ts                 # FLAVORIQ green/lime visual design tokens
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
        └── api/
            └── recommend/
                └── route.ts           # Next.js server-side API route (protects FOODOSCOPE_API_KEY)
```

---

## 3. Setup & Local Development

### Prerequisites
- Node.js 18.17+ or 20+
- npm / pnpm / yarn

### Step-by-Step Commands
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Run in development mode (defaults to API_MODE=mock unless changed to live)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 4. Switching Between MOCK and LIVE Foodoscope API Mode

FLAVORIQ strictly separates development mock data from live Foodoscope API output:

- **Development Mode (`API_MODE=mock` in `.env.local`):**
  - Uses the local development catalog (`mockCatalog.ts`) and clearly badges every result as **`API_MODE: MOCK`** and **`Illustrative Match Score`**.
  - Still runs the **100% real, deterministic calculation engine** (`scoring.ts`) — changing `Paneer` → `Potato` or `Indian` → `Italian` dynamically recalculates ingredient coverage, FlavorDB compound pairings, and rank order.
- **Live Mode (`API_MODE=live` in `.env.local`):**
  - Set `API_MODE=live` and provide your server-side `FOODOSCOPE_API_KEY` from [https://www.foodoscope.com/](https://www.foodoscope.com/).
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

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Add the environment variables from `.env.example` (`API_MODE`, `FOODOSCOPE_API_KEY`, `FOODOSCOPE_BASE_URL`) in the Vercel Project Settings.
4. Click **Deploy**.
