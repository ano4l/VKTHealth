# VELA — SA Health & Wellness App

A South African health and wellness mobile app built with Expo and React Native. Track nutrition, discover fitness classes and health spots across SA, generate personalised meal plans, and scan meals with AI.

---

## Features

### Free

| Feature | Description |
|---|---|
| **Onboarding** | 6-step wizard — name, city, body metrics, goal, activity level, dietary preferences. Calculates a personalised daily calorie goal. |
| **Home Dashboard** | Greeting, streak counter, SVG calorie ring with live progress, macro bars (protein / carbs / fat), water tracker, nearby class cards, and a meal suggestion. |
| **Fitness** | Browse 15 SA fitness classes across Johannesburg, Cape Town, Durban, and Pretoria. Search by name, filter by class type, see spots remaining, and book a class. |
| **Discover** | Explore 15 SA health spots — healthy restaurants, juice bars, supplement stores, outdoor gyms, hiking trails, parkrun routes, wellness centres, and spas. Filter by category, view ratings, get directions. |
| **Food Diary** | Log breakfast, lunch, dinner, and snacks from a database of 85 South African foods with full macros. |
| **AI Meal Planner** | Generate a 7-day SA meal plan at economy (R500/wk), standard (R1 000/wk), or premium (R1 500/wk) budget. |
| **Grocery List** | Auto-generated from your meal plan, grouped by section (Meat & Fish, Dairy, Produce, Grains, Pantry) with ZAR price estimates and checkboxes. |
| **Profile** | Avatar initials, body stats, calorie and streak counters, weight trend chart, and 6 achievement badges. |

### Pro

| Feature | Description |
|---|---|
| **Photo Calorie Scanner** | Take or upload a photo of any meal — AI identifies the foods and returns a full nutritional breakdown (calories, protein, carbs, fat per item). Add individual items or everything at once to your diary. |

---

## Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo SDK 54, Expo Router, React Native |
| UI | React Native + custom design tokens, `react-native-svg`, `expo-linear-gradient`, `expo-blur` |
| State | React Context + AsyncStorage (persistent across sessions) |
| API server | Express 5, TypeScript, esbuild |
| AI | OpenAI `gpt-5-mini` vision via Replit AI Integrations (no API key required) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
artifacts/
  vitl/                      # Expo mobile app
    app/
      (tabs)/
        index.tsx            # Home dashboard
        fitness.tsx          # Fitness class listing
        discover.tsx         # Health spot discovery
        nutrition.tsx        # Diary / Plan / Grocery tabs
        profile.tsx          # Profile & stats
      onboarding.tsx         # 6-step onboarding wizard
      fitness/[id].tsx       # Class detail & booking
      discover/[id].tsx      # Spot detail & directions
      scanner.tsx            # Pro: photo calorie scanner
      pro.tsx                # Pro plan paywall
    context/
      AppContext.tsx          # Global state (profile, diary, bookings, meal plan, grocery)
    data/
      fitnessStudios.ts       # 15 SA fitness classes
      healthSpots.ts          # 15 SA health spots
      foodDatabase.ts         # 85 SA foods with full macros
      mealTemplates.ts        # Economy / standard meal plans + generateMealPlan()
    constants/
      colors.ts               # Light & dark VELA palette
    hooks/
      useColors.ts            # Dark mode colour hook

  api-server/                # Express API server
    src/
      routes/
        health.ts             # GET /api/healthz
        scan.ts               # POST /api/scan-meal (AI vision)

lib/
  integrations-openai-ai-server/   # Replit OpenAI integration client
```

---

## Design Tokens

| Token | Light | Dark |
|---|---|---|
| Primary | `#2D6A4F` (earthy green) | `#5FA080` |
| Secondary | `#C8714B` (terracotta) | `#D4845E` |
| Background | `#F8F5F0` | `#0F1710` |
| Card | `#FFFFFF` | `#1A2620` |
| Muted foreground | `#8A7B6F` | `#7A8C85` |

---

## Running Locally

The app runs via Replit workflows. Two services are required:

**API server** (Express):
```bash
pnpm --filter @workspace/api-server run dev
```

**Mobile app** (Expo):
```bash
pnpm --filter @workspace/vitl run dev
```

Scan the QR code in the Expo output to open the app on a physical device with the Expo Go app.

---

## API Reference

### `POST /api/scan-meal`

Accepts a base64 image data URL and returns AI-identified food items with nutritional estimates.

**Request body**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**
```json
{
  "items": [
    {
      "name": "Grilled chicken breast",
      "serving": "200g",
      "calories": 330,
      "protein": 62.0,
      "carbs": 0.0,
      "fat": 7.2
    }
  ],
  "totalCalories": 330,
  "confidence": "high",
  "notes": "Estimated based on typical portion size."
}
```

---

## Pro Plan

The Pro plan is demonstrated in the app as a free unlock (no payment integration). In a production deployment this would connect to a payment provider. Pro unlocks the Photo Calorie Scanner and is persisted to AsyncStorage.
