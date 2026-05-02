# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains an API server, a mockup canvas sandbox, and the main VELA mobile app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## VELA — SA Health & Wellness App

**Artifact**: `artifacts/vitl` (Expo mobile app, slug: `vitl`)

A South African health and wellness mobile app with earthy green (#2D6A4F) + terracotta (#C8714B) palette, full dark mode support.

### Screens

| Screen | Description |
|---|---|
| **Onboarding** | 6-step wizard: name, city, body metrics, goal, activity level, dietary preferences. Calculates personalised calorie goal. |
| **Home Dashboard** | Greeting, streak + PRO badge, SVG calorie ring with %, macro bars (with custom targets), steps + water side-by-side, daily challenges (3 rotating, auto-evaluated), mood/energy check-in, weekly summary card, nearby classes carousel, daily SA quote. |
| **Fitness** | 15 SA fitness classes across JHB/CT/Durban/Pretoria. Search + filter. Booking locked behind Pro. |
| **Discover** | 15 SA health spots. Category filter, rating. Directions + call locked behind Pro. |
| **Nutrition — Diary** | Food diary with breakfast/lunch/dinner/snacks. 5-entry free limit with live counter. Scan Meal button (Pro). |
| **Nutrition — Plan** | AI 7-day SA meal plan. Economy/standard/premium budgets. Pro-gated. |
| **Nutrition — Grocery** | Auto-generated grocery list from meal plan. ZAR pricing, section grouping, checkboxes. Pro-gated. |
| **Food Modal** | 3-tab modal: Recent (last 10 logged foods), Saved (starred favourites ⭐), All Foods (full database search). Star button on every food item. |
| **Profile** | Avatar, body stats, BMI gauge with colour-coded categories (Under/Healthy/Over/Obese), body measurements (waist/hip/chest) with edit modal, macro targets with customise modal, weight trend chart (Pro), 6 achievement badges (Pro). |
| **Pro Paywall** | Feature comparison table, monthly/yearly price toggle, unlock demo. |
| **Scanner** | Photo calorie scanner via camera/gallery. Calls /api/scan-meal (OpenAI vision). Pro only. |

### Free vs Pro Gates

| Feature | Free | Pro |
|---|---|---|
| Food diary | 5 entries/day | Unlimited |
| Fitness booking | View only | Full booking |
| Directions & call | Hidden | Unlocked |
| Meal Planner tab | Locked | Full access |
| Grocery List tab | Locked | Full access |
| Weight trend chart | Blurred | Full chart |
| Achievements | Dimmed | Unlocked |
| Photo scanner | Locked | Full access |

### Data Files

- `data/fitnessStudios.ts` — 15 fitness classes with full SA metadata
- `data/healthSpots.ts` — 15 health spots across SA cities
- `data/foodDatabase.ts` — 85 South African foods with full macros
- `data/mealTemplates.ts` — Economy/standard meal templates, `generateMealPlan()`, `BUDGET_OPTIONS`

### Architecture

- `context/AppContext.tsx` — Global state: profile, diary, bookings, meal plan, grocery list, favouriteFoods, moodLog. Persisted with AsyncStorage.
  - Actions: `updateProfile`, `completeOnboarding`, `unlockPro`, `addFoodEntry`, `removeFoodEntry`, `setWater`, `setSteps`, `addBooking`, `cancelBooking`, `setMealPlan`, `generateGroceryList`, `toggleGroceryItem`, `toggleFavouriteFood`, `logMood`, `getTodayMood`
- `constants/colors.ts` — Full light/dark VELA palette (green primary, terracotta secondary)
- `hooks/useColors.ts` — Dark mode color hook
- `app/_layout.tsx` — Root layout with AppProvider, Stack screens
- `app/(tabs)/_layout.tsx` — 5-tab layout (Home, Fitness, Nutrition, Discover, Profile)

### UserProfile Fields

```typescript
name, age, weight, height, goal, activityLevel, dietary, city,
calorieGoal, waterGoal, onboardingComplete, streak, lastActiveDate,
weightHistory, isPro,
macroTargets?: { protein, carbs, fat },
waist?, hip?, chest?
```

### API Server

- `POST /api/scan-meal` — Accepts base64 image dataURL, calls OpenAI GPT vision, returns `{ items, totalCalories, confidence, notes }`. Body limit: 20mb.
- Replit AI integrations: `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` set in environment.
