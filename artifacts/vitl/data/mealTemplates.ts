import type { MealPlanDay } from '@/context/AppContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Meal = { name: string; calories: number; prepTime: number; ingredients: string[]; steps: string[] };

const economyBreakfasts: Meal[] = [
  { name: 'Pap & Fried Eggs', calories: 380, prepTime: 15, ingredients: ['White maize meal', 'Eggs', 'Butter', 'Salt'], steps: ['Boil 2 cups salted water', 'Stir in ½ cup maize meal, cook 10 min', 'Fry 2 eggs in butter', 'Serve together'] },
  { name: 'Oats with Banana', calories: 320, prepTime: 10, ingredients: ['Rolled oats', 'Banana', 'Milk', 'Honey', 'Cinnamon'], steps: ['Cook oats in 1.5 cups milk 5 min', 'Add cinnamon', 'Top with sliced banana and honey'] },
  { name: 'Brown Bread & Peanut Butter', calories: 280, prepTime: 5, ingredients: ['Brown bread', 'Peanut butter', 'Banana'], steps: ['Toast 2 slices bread', 'Spread peanut butter generously', 'Serve with banana'] },
  { name: 'Scrambled Eggs on Toast', calories: 340, prepTime: 10, ingredients: ['Eggs', 'Brown bread', 'Butter', 'Salt & pepper', 'Cherry tomatoes'], steps: ['Beat 3 eggs with salt & pepper', 'Cook slowly in buttered pan', 'Toast bread', 'Serve with tomatoes'] },
  { name: 'Morogo & Pap', calories: 290, prepTime: 25, ingredients: ['Wild spinach (morogo)', 'White maize meal', 'Onion', 'Tomato', 'Salt'], steps: ['Make stiff pap', 'Fry onion and tomato', 'Add morogo, cook 10 min', 'Season and serve with pap'] },
  { name: 'French Toast', calories: 365, prepTime: 15, ingredients: ['Brown bread', 'Eggs', 'Milk', 'Cinnamon', 'Butter', 'Honey'], steps: ['Whisk 2 eggs, ¼ cup milk and cinnamon', 'Dip 3 slices bread', 'Cook in butter 2 min each side', 'Drizzle with honey'] },
  { name: 'Yogurt & Fruit Bowl', calories: 260, prepTime: 5, ingredients: ['Plain yogurt', 'Banana', 'Apple', 'Honey', 'Oats'], steps: ['Spoon yogurt into bowl', 'Add sliced fruit', 'Drizzle honey', 'Sprinkle oats'] },
];

const economyLunches: Meal[] = [
  { name: 'Umngqusho (Samp & Beans)', calories: 420, prepTime: 40, ingredients: ['Samp', 'Butter beans', 'Onion', 'Butter', 'Salt & pepper'], steps: ['Boil samp and beans until tender ~45 min', 'Fry onion in butter until golden', 'Mix together and season well'] },
  { name: 'Rice & Tuna Salad', calories: 380, prepTime: 15, ingredients: ['Brown rice', 'Canned tuna', 'Cherry tomatoes', 'Onion', 'Lemon'], steps: ['Cook and cool rice', 'Drain and flake tuna', 'Mix with tomatoes and onion', 'Season with lemon and salt'] },
  { name: 'Veggie Soup & Bread', calories: 280, prepTime: 30, ingredients: ['Potatoes', 'Carrots', 'Onion', 'Cabbage', 'Vegetable stock', 'Brown bread'], steps: ['Fry onion', 'Add chopped veg and stock', 'Boil 20 min', 'Season, serve with bread'] },
  { name: 'Bean & Rice Bowl', calories: 390, prepTime: 15, ingredients: ['Red kidney beans', 'Brown rice', 'Chakalaka', 'Onion', 'Tomatoes'], steps: ['Heat beans with onion and tomato', 'Season with spice', 'Serve over rice with chakalaka'] },
  { name: 'Chicken & Pap', calories: 450, prepTime: 30, ingredients: ['Chicken pieces', 'White maize meal', 'Onion', 'Tomatoes', 'Spices'], steps: ['Brown chicken with onion and tomato', 'Cook until done ~20 min', 'Make stiff pap', 'Serve together'] },
  { name: 'Red Lentil Soup', calories: 320, prepTime: 35, ingredients: ['Red lentils', 'Onion', 'Carrots', 'Cumin', 'Vegetable stock', 'Lemon'], steps: ['Fry onion with cumin', 'Add lentils, carrots and stock', 'Simmer 25 min until soft', 'Blend half, finish with lemon'] },
  { name: 'Egg Fried Rice', calories: 400, prepTime: 20, ingredients: ['Cooked rice', 'Eggs', 'Onion', 'Frozen peas', 'Soy sauce', 'Oil'], steps: ['Heat oil, fry onion', 'Add peas and rice, stir-fry', 'Push aside, scramble 2 eggs', 'Mix with soy sauce'] },
];

const economyDinners: Meal[] = [
  { name: 'Boerewors & Pap', calories: 520, prepTime: 20, ingredients: ['Boerewors', 'White maize meal', 'Chakalaka', 'Onion'], steps: ['Cook boerewors on pan or braai', 'Make stiff pap', 'Heat chakalaka', 'Serve together'] },
  { name: 'Chicken Stew & Pap', calories: 480, prepTime: 45, ingredients: ['Chicken pieces', 'Potatoes', 'Carrots', 'Onion', 'Tomatoes', 'Spices'], steps: ['Brown chicken with onion', 'Add veg and tomatoes', 'Cover and simmer 35 min', 'Serve with pap or rice'] },
  { name: 'Samp & Beans', calories: 440, prepTime: 60, ingredients: ['Samp', 'Butter beans', 'Onion', 'Butter', 'Seasoning'], steps: ['Pre-soak overnight', 'Boil together until tender', 'Fry onion in butter, add to pot', 'Season and serve hot'] },
  { name: 'Bean Curry & Rice', calories: 450, prepTime: 30, ingredients: ['Chickpeas', 'Tomatoes', 'Onion', 'Curry powder', 'Brown rice', 'Coriander'], steps: ['Fry onion with curry powder', 'Add tomatoes and chickpeas', 'Simmer 20 min', 'Serve over rice with coriander'] },
  { name: 'Pilchards & Pap', calories: 410, prepTime: 15, ingredients: ['Canned pilchards in tomato sauce', 'White maize meal', 'Onion'], steps: ['Heat pilchards with fried onion', 'Make stiff pap', 'Serve together'] },
  { name: 'Morogo Stew & Rice', calories: 350, prepTime: 30, ingredients: ['Wild spinach', 'Tomatoes', 'Onion', 'Garlic', 'Brown rice', 'Spices'], steps: ['Fry onion and garlic', 'Add tomatoes and morogo', 'Cook 20 min', 'Serve over rice'] },
  { name: 'Pap & Chakalaka Braai', calories: 490, prepTime: 25, ingredients: ['White maize meal', 'Chakalaka', 'Boerewors', 'Onion', 'Tomatoes'], steps: ['Cook boerewors on braai', 'Make pap', 'Warm chakalaka', 'Serve together'] },
];

const standardBreakfasts: Meal[] = [
  { name: 'Açaí Smoothie Bowl', calories: 380, prepTime: 10, ingredients: ['Frozen açaí', 'Banana', 'Almond milk', 'Granola', 'Strawberries', 'Honey'], steps: ['Blend frozen açaí, banana and milk thick', 'Pour into bowl', 'Top with granola and fruit', 'Drizzle honey'] },
  { name: 'Greek Yogurt Parfait', calories: 340, prepTime: 5, ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey', 'Chia seeds'], steps: ['Layer yogurt in glass', 'Add mixed berries', 'Top with granola and chia', 'Drizzle honey'] },
  { name: 'Veggie Omelette', calories: 320, prepTime: 15, ingredients: ['Eggs', 'Spinach', 'Peppers', 'Onion', 'Feta cheese', 'Olive oil'], steps: ['Beat 3 eggs, season', 'Fry veg in olive oil', 'Add eggs, cook until set', 'Fold with crumbled feta'] },
  { name: 'Overnight Oats', calories: 380, prepTime: 5, ingredients: ['Rolled oats', 'Almond milk', 'Chia seeds', 'Banana', 'Peanut butter', 'Honey'], steps: ['Mix oats, milk and chia', 'Refrigerate overnight', 'Top with banana in morning', 'Add peanut butter and honey'] },
  { name: 'Avocado Toast & Eggs', calories: 350, prepTime: 10, ingredients: ['Sourdough bread', 'Avocado', 'Eggs', 'Lemon', 'Chilli flakes'], steps: ['Toast sourdough', 'Mash avo with lemon and salt', 'Poach 2 eggs', 'Top toast with avo and eggs'] },
  { name: 'Green Smoothie Bowl', calories: 360, prepTime: 10, ingredients: ['Frozen mango', 'Banana', 'Spinach', 'Coconut milk', 'Granola', 'Pawpaw'], steps: ['Blend frozen mango, spinach and coconut milk', 'Pour into bowl thick', 'Top with granola', 'Add fresh pawpaw'] },
  { name: 'Protein Pancakes', calories: 400, prepTime: 20, ingredients: ['Rolled oats', 'Eggs', 'Banana', 'Protein powder', 'Milk', 'Blueberries'], steps: ['Blend all except berries', 'Cook small pancakes in non-stick pan', 'Stack with fresh blueberries', 'Serve with Greek yogurt'] },
];

const standardLunches: Meal[] = [
  { name: 'Quinoa Salad Bowl', calories: 420, prepTime: 20, ingredients: ['Quinoa', 'Cucumber', 'Cherry tomatoes', 'Feta', 'Avocado', 'Lemon', 'Olive oil'], steps: ['Cook quinoa, cool', 'Chop all vegetables', 'Combine in bowl', 'Dress with lemon and olive oil'] },
  { name: 'Grilled Chicken Wrap', calories: 450, prepTime: 20, ingredients: ['Chicken breast', 'Whole wheat wrap', 'Lettuce', 'Avocado', 'Tomato', 'Low-fat mayo'], steps: ['Season and grill chicken', 'Slice chicken', 'Assemble wrap with all fillings', 'Roll and serve'] },
  { name: 'Butternut & Lentil Soup', calories: 360, prepTime: 35, ingredients: ['Red lentils', 'Butternut', 'Onion', 'Garlic', 'Cumin', 'Vegetable stock'], steps: ['Roast butternut 20 min', 'Fry onion with cumin', 'Add lentils and stock, 20 min', 'Blend with butternut'] },
  { name: 'Tuna Nicoise Salad', calories: 410, prepTime: 20, ingredients: ['Canned tuna', 'Baby potatoes', 'Green beans', 'Eggs', 'Olives', 'Mustard dressing'], steps: ['Boil potatoes and beans', 'Hard boil eggs', 'Arrange with tuna', 'Drizzle mustard dressing'] },
  { name: 'Chicken & Chickpea Bowl', calories: 440, prepTime: 25, ingredients: ['Grilled chicken', 'Chickpeas', 'Spinach', 'Roasted peppers', 'Tahini', 'Lemon'], steps: ['Grill seasoned chicken', 'Roast chickpeas in oven', 'Wilt spinach', 'Assemble bowl with tahini'] },
  { name: 'Poke Bowl', calories: 450, prepTime: 20, ingredients: ['Brown rice', 'Smoked salmon', 'Avocado', 'Edamame', 'Cucumber', 'Soy sauce'], steps: ['Cook rice, cool', 'Slice salmon and avo', 'Arrange toppings over rice', 'Drizzle soy sauce'] },
  { name: 'SA Chicken Salad', calories: 380, prepTime: 15, ingredients: ['Grilled chicken', 'Mixed leaves', 'Mango', 'Macadamia nuts', 'Balsamic dressing'], steps: ['Grill and slice chicken', 'Arrange on mixed leaves', 'Add mango slices and nuts', 'Dress with balsamic'] },
];

const standardDinners: Meal[] = [
  { name: 'Chicken & Sweet Potato', calories: 490, prepTime: 35, ingredients: ['Chicken breast', 'Sweet potatoes', 'Broccoli', 'Olive oil', 'Herbs', 'Lemon'], steps: ['Roast sweet potato wedges 25 min', 'Grill seasoned chicken', 'Steam broccoli', 'Serve with lemon and herbs'] },
  { name: 'Lightened Bobotie', calories: 420, prepTime: 50, ingredients: ['Lean beef mince', 'Onion', 'Curry powder', 'Eggs', 'Milk', 'Bay leaves', 'Apricot jam'], steps: ['Fry mince with onion and curry', 'Add jam, season', 'Bake at 180°C', 'Pour egg mixture over, bake 20 min more'] },
  { name: 'Salmon & Roasted Veg', calories: 480, prepTime: 30, ingredients: ['Salmon fillet', 'Asparagus', 'Cherry tomatoes', 'Butternut', 'Olive oil', 'Herbs'], steps: ['Season salmon with herbs', 'Roast veg 200°C 20 min', 'Pan-fry salmon 4 min each side', 'Serve together'] },
  { name: 'Lamb Curry & Rice', calories: 550, prepTime: 60, ingredients: ['Lamb shoulder', 'Onion', 'Tomatoes', 'Curry paste', 'Yogurt', 'Basmati rice', 'Coriander'], steps: ['Brown lamb with onion', 'Add curry paste and tomatoes', 'Simmer 45 min', 'Serve over rice with yogurt'] },
  { name: 'Beef & Mushroom Stir-Fry', calories: 460, prepTime: 25, ingredients: ['Beef strips', 'Mixed mushrooms', 'Peppers', 'Broccoli', 'Soy sauce', 'Brown rice'], steps: ['Cook rice', 'Stir-fry beef in hot pan', 'Add mushrooms and veg', 'Season with soy sauce'] },
  { name: 'Prawn Peri-Peri Pasta', calories: 520, prepTime: 25, ingredients: ['Prawns', 'Wholewheat pasta', 'Peri-peri sauce', 'Garlic', 'Lemon', 'Parsley'], steps: ['Cook pasta al dente', 'Fry garlic and prawns', 'Add peri-peri sauce', 'Toss with pasta and lemon'] },
  { name: 'Cape Malay Chicken', calories: 480, prepTime: 40, ingredients: ['Chicken thighs', 'Cape Malay spice blend', 'Onion', 'Tomatoes', 'Yogurt', 'Basmati rice'], steps: ['Brown chicken in spiced oil', 'Add tomatoes and simmer', 'Cook 30 min', 'Serve over rice with yogurt'] },
];

export function generateMealPlan(
  budget: 'economy' | 'standard' | 'premium',
  _dietary: string[]
): MealPlanDay[] {
  const breakfasts = budget === 'economy' ? economyBreakfasts : standardBreakfasts;
  const lunches = budget === 'economy' ? economyLunches : standardLunches;
  const dinners = budget === 'economy' ? economyDinners : standardDinners;

  return DAYS.map((day, i) => ({
    day,
    breakfast: breakfasts[i % breakfasts.length],
    lunch: lunches[i % lunches.length],
    dinner: dinners[i % dinners.length],
  }));
}

export const BUDGET_OPTIONS = [
  { key: 'economy' as const, label: 'Economy', price: 'R500/week', description: 'Affordable SA staples, balanced and filling' },
  { key: 'standard' as const, label: 'Standard', price: 'R1000/week', description: 'Fresh ingredients, variety and great nutrition' },
  { key: 'premium' as const, label: 'Premium', price: 'R1500/week', description: 'Superfood-rich, diverse and restaurant-quality' },
];
