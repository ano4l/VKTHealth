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

### Features

| Screen | Description |
|---|---|
| **Onboarding** | 6-step wizard: name, city, body metrics, goal, activity level, dietary preferences. Calculates personalised calorie goal. |
| **Home Dashboard** | Greeting, streak counter, SVG calorie ring, macro progress bars (protein/carbs/fat), water tracker, nearby classes horizontal scroll, meal suggestion card. |
| **Fitness** | 15 SA fitness classes across JHB/CT/Durban/Pretoria. Search + class type filter, spots remaining bar, booking flow. |
| **Discover** | 15 SA health spots (restaurants, juice bars, trails, gyms, spas). Category filter, rating, directions via Maps. |
| **Nutrition — Diary** | Food diary with breakfast/lunch/dinner/snacks. Add from 85-item SA food database. Macro summary bar. Water tracker. |
| **Nutrition — Plan** | AI-generated 7-day SA meal plan with economy/standard/premium budget options. Shows name, calories, prep time per meal. |
| **Nutrition — Grocery** | Auto-generated grocery list from meal plan, grouped by section (Meat, Dairy, Produce, etc.) with ZAR pricing and checkboxes. |
| **Profile** | Avatar initials, body stats, streak and calorie stats, weight trend chart, 6 achievement badges. |

### Data Files

- `data/fitnessStudios.ts` — 15 fitness classes with full SA metadata
- `data/healthSpots.ts` — 15 health spots across SA cities
- `data/foodDatabase.ts` — 85 South African foods with full macros
- `data/mealTemplates.ts` — Economy/standard meal templates, `generateMealPlan()`

### Architecture

- `context/AppContext.tsx` — Single global state: profile, diary, bookings, meal plan, grocery list. Persisted with AsyncStorage.
- `constants/colors.ts` — Full light/dark VELA palette (green primary, terracotta secondary)
- `hooks/useColors.ts` — Dark mode color hook
- `app/_layout.tsx` — Root layout with AppProvider, Stack screens for onboarding + detail pages
- `app/(tabs)/_layout.tsx` — 5-tab layout with NativeTabs (iOS 26) + ClassicTabLayout fallback
