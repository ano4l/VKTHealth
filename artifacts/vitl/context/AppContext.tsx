import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'lose_weight' | 'build_muscle' | 'eat_healthier' | 'manage_condition' | 'general_wellness';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietary: string[];
  city: 'johannesburg' | 'cape_town' | 'durban' | 'pretoria' | 'other';
  calorieGoal: number;
  waterGoal: number;
  onboardingComplete: boolean;
  streak: number;
  lastActiveDate: string;
  weightHistory: { date: string; weight: number }[];
  isPro: boolean;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  servingSize: number;
  date: string;
}

export interface DiaryDay {
  date: string;
  waterGlasses: number;
  steps: number;
  activeMinutes: number;
  entries: FoodEntry[];
}

export interface ClassBooking {
  id: string;
  classId: string;
  className: string;
  studioName: string;
  classType: string;
  dateTime: string;
  instructor: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface MealPlanDay {
  day: string;
  breakfast: { name: string; calories: number; prepTime: number; ingredients: string[]; steps: string[] };
  lunch: { name: string; calories: number; prepTime: number; ingredients: string[]; steps: string[] };
  dinner: { name: string; calories: number; prepTime: number; ingredients: string[]; steps: string[] };
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  section: string;
  estimatedPrice: number;
  checked: boolean;
}

interface AppContextType {
  profile: UserProfile | null;
  diary: DiaryDay[];
  bookings: ClassBooking[];
  mealPlan: MealPlanDay[] | null;
  groceryList: GroceryItem[];
  isLoaded: boolean;
  updateProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: (p: UserProfile) => void;
  unlockPro: () => void;
  addFoodEntry: (entry: FoodEntry, date: string) => void;
  removeFoodEntry: (entryId: string, date: string) => void;
  setWater: (date: string, glasses: number) => void;
  getTodayDiary: () => DiaryDay;
  addBooking: (b: ClassBooking) => void;
  cancelBooking: (id: string) => void;
  setMealPlan: (plan: MealPlanDay[]) => void;
  generateGroceryList: (plan: MealPlanDay[]) => void;
  toggleGroceryItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [diary, setDiary] = useState<DiaryDay[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [mealPlan, setMealPlanState] = useState<MealPlanDay[] | null>(null);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, d, b, m, g] = await Promise.all([
          AsyncStorage.getItem('vela_profile'),
          AsyncStorage.getItem('vela_diary'),
          AsyncStorage.getItem('vela_bookings'),
          AsyncStorage.getItem('vela_mealplan'),
          AsyncStorage.getItem('vela_grocery'),
        ]);
        if (p) setProfile(JSON.parse(p));
        if (d) setDiary(JSON.parse(d));
        if (b) setBookings(JSON.parse(b));
        if (m) setMealPlanState(JSON.parse(m));
        if (g) setGroceryList(JSON.parse(g));
      } catch {}
      setIsLoaded(true);
    })();
  }, []);

  const save = useCallback((key: string, value: unknown) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...(prev ?? {} as UserProfile), ...partial };
      save('vela_profile', next);
      return next;
    });
  }, [save]);

  const completeOnboarding = useCallback((p: UserProfile) => {
    const next = { ...p, onboardingComplete: true };
    setProfile(next);
    save('vela_profile', next);
  }, [save]);

  const unlockPro = useCallback(() => {
    setProfile(prev => {
      const next = { ...(prev ?? {} as UserProfile), isPro: true };
      save('vela_profile', next);
      return next;
    });
  }, [save]);

  const getTodayDiary = useCallback((): DiaryDay => {
    const today = todayStr();
    return diary.find(d => d.date === today) ?? {
      date: today, waterGlasses: 0, steps: 0, activeMinutes: 0, entries: [],
    };
  }, [diary]);

  const addFoodEntry = useCallback((entry: FoodEntry, date: string) => {
    setDiary(prev => {
      const existing = prev.find(d => d.date === date);
      let next: DiaryDay[];
      if (existing) {
        next = prev.map(d => d.date === date ? { ...d, entries: [...d.entries, entry] } : d);
      } else {
        next = [...prev, { date, waterGlasses: 0, steps: 0, activeMinutes: 0, entries: [entry] }];
      }
      save('vela_diary', next);
      return next;
    });
  }, [save]);

  const removeFoodEntry = useCallback((entryId: string, date: string) => {
    setDiary(prev => {
      const next = prev.map(d =>
        d.date === date ? { ...d, entries: d.entries.filter(e => e.id !== entryId) } : d
      );
      save('vela_diary', next);
      return next;
    });
  }, [save]);

  const setWater = useCallback((date: string, glasses: number) => {
    setDiary(prev => {
      const existing = prev.find(d => d.date === date);
      let next: DiaryDay[];
      if (existing) {
        next = prev.map(d => d.date === date ? { ...d, waterGlasses: glasses } : d);
      } else {
        next = [...prev, { date, waterGlasses: glasses, steps: 0, activeMinutes: 0, entries: [] }];
      }
      save('vela_diary', next);
      return next;
    });
  }, [save]);

  const addBooking = useCallback((b: ClassBooking) => {
    setBookings(prev => {
      const next = [...prev, b];
      save('vela_bookings', next);
      return next;
    });
  }, [save]);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      save('vela_bookings', next);
      return next;
    });
  }, [save]);

  const setMealPlan = useCallback((plan: MealPlanDay[]) => {
    setMealPlanState(plan);
    save('vela_mealplan', plan);
  }, [save]);

  const generateGroceryList = useCallback((plan: MealPlanDay[]) => {
    const seen = new Set<string>();
    const items: GroceryItem[] = [];
    let idx = 0;

    const allIngredients = plan.flatMap(d => [
      ...d.breakfast.ingredients,
      ...d.lunch.ingredients,
      ...d.dinner.ingredients,
    ]);

    allIngredients.forEach(ing => {
      if (!seen.has(ing)) {
        seen.add(ing);
        const lower = ing.toLowerCase();
        let section = 'Pantry';
        let price = 25;
        if (['chicken', 'beef', 'lamb', 'pork', 'fish', 'tuna', 'prawn', 'boerewors', 'snoek', 'salmon'].some(m => lower.includes(m))) {
          section = 'Meat & Fish'; price = 85;
        } else if (['milk', 'yogurt', 'cheese', 'eggs', 'butter', 'cream', 'feta'].some(d => lower.includes(d))) {
          section = 'Dairy & Eggs'; price = 35;
        } else if (['apple', 'banana', 'spinach', 'tomato', 'onion', 'potato', 'carrot', 'broccoli', 'avocado', 'mango', 'peppers', 'butternut', 'mushroom', 'garlic'].some(v => lower.includes(v))) {
          section = 'Produce'; price = 20;
        } else if (['rice', 'pasta', 'pap', 'maize', 'bread', 'flour', 'oats', 'quinoa', 'lentil', 'chickpea', 'bean'].some(g => lower.includes(g))) {
          section = 'Grains & Legumes'; price = 30;
        }
        items.push({
          id: `g${idx++}`,
          name: ing,
          quantity: '1 unit',
          section,
          estimatedPrice: price,
          checked: false,
        });
      }
    });
    setGroceryList(items);
    save('vela_grocery', items);
  }, [save]);

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryList(prev => {
      const next = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      save('vela_grocery', next);
      return next;
    });
  }, [save]);

  return (
    <AppContext.Provider value={{
      profile, diary, bookings, mealPlan, groceryList, isLoaded,
      updateProfile, completeOnboarding, unlockPro, addFoodEntry, removeFoodEntry,
      setWater, getTodayDiary, addBooking, cancelBooking,
      setMealPlan, generateGroceryList, toggleGroceryItem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
