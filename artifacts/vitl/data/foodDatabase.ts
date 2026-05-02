export interface FoodItem {
  id: string;
  name: string;
  category: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingName: string;
}

export const foodDatabase: FoodItem[] = [
  // SA Traditional
  { id: 'f001', name: 'Pap (Stiff Maize Porridge)', category: 'SA Traditional', calories: 135, protein: 2.5, carbs: 29.0, fat: 0.6, servingSize: 200, servingName: '1 cup cooked' },
  { id: 'f002', name: 'Soft Pap (Slap Pap)', category: 'SA Traditional', calories: 80, protein: 1.5, carbs: 17.0, fat: 0.4, servingSize: 200, servingName: '1 bowl' },
  { id: 'f003', name: 'Chakalaka', category: 'SA Traditional', calories: 65, protein: 2.0, carbs: 9.5, fat: 2.5, servingSize: 100, servingName: '½ cup' },
  { id: 'f004', name: 'Boerewors (Cooked)', category: 'SA Traditional', calories: 286, protein: 14.0, carbs: 1.0, fat: 25.0, servingSize: 100, servingName: '1 roll' },
  { id: 'f005', name: 'Biltong (Beef)', category: 'SA Traditional', calories: 290, protein: 50.0, carbs: 1.5, fat: 8.0, servingSize: 30, servingName: '30g bag' },
  { id: 'f006', name: 'Vetkoek (Plain)', category: 'SA Traditional', calories: 345, protein: 6.5, carbs: 48.0, fat: 15.0, servingSize: 100, servingName: '1 medium' },
  { id: 'f007', name: 'Umngqusho (Samp & Beans)', category: 'SA Traditional', calories: 160, protein: 7.0, carbs: 30.0, fat: 1.5, servingSize: 200, servingName: '1 cup cooked' },
  { id: 'f008', name: 'Morogo (Wild Spinach)', category: 'SA Traditional', calories: 36, protein: 3.8, carbs: 4.5, fat: 0.7, servingSize: 150, servingName: '1 cup cooked' },
  { id: 'f009', name: 'Braai Chicken (Grilled)', category: 'SA Traditional', calories: 215, protein: 27.0, carbs: 0.0, fat: 12.0, servingSize: 150, servingName: '1 piece' },
  { id: 'f010', name: 'Braai T-Bone Steak', category: 'SA Traditional', calories: 260, protein: 29.0, carbs: 0.0, fat: 16.0, servingSize: 200, servingName: '200g steak' },
  { id: 'f011', name: 'Samoosa (Vegetable)', category: 'SA Traditional', calories: 148, protein: 3.5, carbs: 18.0, fat: 7.0, servingSize: 60, servingName: '1 medium' },
  { id: 'f012', name: 'Roti (Plain)', category: 'SA Traditional', calories: 297, protein: 8.5, carbs: 55.0, fat: 5.5, servingSize: 80, servingName: '1 roti' },
  { id: 'f013', name: 'Gatsby (Viennas, Half)', category: 'SA Traditional', calories: 520, protein: 18.0, carbs: 65.0, fat: 22.0, servingSize: 350, servingName: '½ gatsby' },
  { id: 'f014', name: 'Bunny Chow (Beans)', category: 'SA Traditional', calories: 420, protein: 14.0, carbs: 75.0, fat: 8.5, servingSize: 400, servingName: '¼ loaf' },
  { id: 'f015', name: 'Kotas', category: 'SA Traditional', calories: 485, protein: 15.0, carbs: 72.0, fat: 18.0, servingSize: 380, servingName: '1 kota' },
  { id: 'f016', name: 'Bobotie', category: 'SA Traditional', calories: 310, protein: 20.5, carbs: 18.0, fat: 18.0, servingSize: 250, servingName: '1 serving' },
  { id: 'f017', name: 'Pap & Wors with Chakalaka', category: 'SA Traditional', calories: 490, protein: 18.5, carbs: 38.0, fat: 27.5, servingSize: 400, servingName: '1 plate' },
  { id: 'f018', name: 'Snoek (Braai)', category: 'SA Traditional', calories: 175, protein: 24.5, carbs: 0.0, fat: 8.0, servingSize: 150, servingName: '1 piece' },
  { id: 'f019', name: 'Mutton Curry', category: 'SA Traditional', calories: 285, protein: 22.0, carbs: 12.0, fat: 17.0, servingSize: 300, servingName: '1 bowl' },
  { id: 'f020', name: 'Yellow Rice (Geelrys)', category: 'SA Traditional', calories: 135, protein: 2.5, carbs: 28.5, fat: 1.0, servingSize: 150, servingName: '½ cup cooked' },
  { id: 'f021', name: 'Milk Tart (Melktert)', category: 'SA Traditional', calories: 185, protein: 4.5, carbs: 27.0, fat: 7.5, servingSize: 90, servingName: '1 slice' },
  { id: 'f022', name: 'Koeksister', category: 'SA Traditional', calories: 235, protein: 3.0, carbs: 38.0, fat: 9.5, servingSize: 80, servingName: '1 koeksister' },
  { id: 'f023', name: 'Rusks (Ouma)', category: 'SA Traditional', calories: 140, protein: 2.5, carbs: 24.0, fat: 4.0, servingSize: 40, servingName: '1 rusk' },
  { id: 'f024', name: 'Amadumbe (Taro)', category: 'SA Traditional', calories: 142, protein: 1.5, carbs: 33.0, fat: 0.5, servingSize: 150, servingName: '1 medium piece' },

  // Woolworths
  { id: 'f025', name: 'WW Chicken & Avo Salad', category: 'Woolworths', brand: 'Woolworths', calories: 165, protein: 14.0, carbs: 6.5, fat: 9.5, servingSize: 250, servingName: '1 pack' },
  { id: 'f026', name: 'WW Greek Salad', category: 'Woolworths', brand: 'Woolworths', calories: 120, protein: 4.5, carbs: 7.0, fat: 8.5, servingSize: 200, servingName: '1 pack' },
  { id: 'f027', name: 'WW Quinoa & Roasted Veg Bowl', category: 'Woolworths', brand: 'Woolworths', calories: 185, protein: 6.5, carbs: 28.0, fat: 6.0, servingSize: 300, servingName: '1 pack' },
  { id: 'f028', name: 'WW Grilled Chicken Strips', category: 'Woolworths', brand: 'Woolworths', calories: 140, protein: 24.0, carbs: 2.0, fat: 4.5, servingSize: 200, servingName: '1 pack' },
  { id: 'f029', name: 'WW Hummus Classic', category: 'Woolworths', brand: 'Woolworths', calories: 170, protein: 5.0, carbs: 16.0, fat: 9.0, servingSize: 200, servingName: '1 tub' },
  { id: 'f030', name: 'WW Overnight Oats Vanilla', category: 'Woolworths', brand: 'Woolworths', calories: 230, protein: 7.5, carbs: 38.0, fat: 5.5, servingSize: 250, servingName: '1 pack' },
  { id: 'f031', name: 'WW Banting Bread', category: 'Woolworths', brand: 'Woolworths', calories: 195, protein: 9.0, carbs: 5.0, fat: 16.0, servingSize: 40, servingName: '2 slices' },
  { id: 'f032', name: 'WW Health Nut Bar', category: 'Woolworths', brand: 'Woolworths', calories: 180, protein: 4.5, carbs: 22.0, fat: 8.0, servingSize: 45, servingName: '1 bar' },
  { id: 'f033', name: 'WW Low-Fat Strawberry Yogurt', category: 'Woolworths', brand: 'Woolworths', calories: 95, protein: 4.0, carbs: 16.0, fat: 1.5, servingSize: 175, servingName: '1 tub' },
  { id: 'f034', name: 'WW Smoked Salmon', category: 'Woolworths', brand: 'Woolworths', calories: 185, protein: 20.0, carbs: 0.0, fat: 12.0, servingSize: 100, servingName: '100g pack' },
  { id: 'f035', name: 'WW Beef Lasagna Ready Meal', category: 'Woolworths', brand: 'Woolworths', calories: 220, protein: 12.0, carbs: 26.0, fat: 7.5, servingSize: 350, servingName: '1 pack' },

  // Pick n Pay
  { id: 'f036', name: 'PnP White Rice (Cooked)', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, servingSize: 200, servingName: '1 cup cooked' },
  { id: 'f037', name: 'PnP Chicken Breast (Raw)', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, servingSize: 150, servingName: '1 medium breast' },
  { id: 'f038', name: 'PnP Free Range Eggs', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 143, protein: 13.0, carbs: 0.5, fat: 9.5, servingSize: 60, servingName: '1 large egg' },
  { id: 'f039', name: 'PnP Rolled Oats', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 379, protein: 13.0, carbs: 68.0, fat: 7.0, servingSize: 80, servingName: '½ cup dry' },
  { id: 'f040', name: 'PnP Fat Free Milk', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 35, protein: 3.5, carbs: 4.8, fat: 0.2, servingSize: 250, servingName: '1 glass' },
  { id: 'f041', name: 'PnP Greek Yogurt', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 100, protein: 8.5, carbs: 8.0, fat: 3.5, servingSize: 200, servingName: '1 tub' },
  { id: 'f042', name: 'PnP Brown Bread', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 120, protein: 4.5, carbs: 22.0, fat: 1.5, servingSize: 40, servingName: '2 slices' },
  { id: 'f043', name: 'PnP Tuna in Springwater', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 100, protein: 22.0, carbs: 0.0, fat: 1.5, servingSize: 170, servingName: '1 can' },
  { id: 'f044', name: 'PnP Mixed Vegetable Pack', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 45, protein: 2.0, carbs: 8.5, fat: 0.3, servingSize: 200, servingName: '1 portion' },
  { id: 'f045', name: 'PnP Avocado', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 160, protein: 2.0, carbs: 9.0, fat: 15.0, servingSize: 100, servingName: '½ avo' },

  // Checkers
  { id: 'f046', name: 'Checkers Beef Burger Patty', category: 'Checkers', brand: 'Checkers', calories: 250, protein: 19.0, carbs: 1.0, fat: 19.0, servingSize: 100, servingName: '1 patty' },
  { id: 'f047', name: 'Checkers Protein Yogurt', category: 'Checkers', brand: 'Checkers', calories: 80, protein: 10.0, carbs: 7.0, fat: 1.0, servingSize: 200, servingName: '1 tub' },
  { id: 'f048', name: 'Checkers Wholewheat Pasta', category: 'Checkers', brand: 'Checkers', calories: 352, protein: 13.0, carbs: 65.0, fat: 2.5, servingSize: 80, servingName: '1 serving dry' },
  { id: 'f049', name: 'Checkers Mixed Fruit Salad', category: 'Checkers', brand: 'Checkers', calories: 55, protein: 0.8, carbs: 13.0, fat: 0.2, servingSize: 250, servingName: '1 pack' },
  { id: 'f050', name: 'Checkers Natural Peanut Butter', category: 'Checkers', brand: 'Checkers', calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0, servingSize: 30, servingName: '2 tbsp' },
  { id: 'f051', name: 'Checkers Smoked Chicken', category: 'Checkers', brand: 'Checkers', calories: 180, protein: 22.0, carbs: 2.0, fat: 9.0, servingSize: 150, servingName: '150g pack' },
  { id: 'f052', name: 'Checkers Cottage Cheese', category: 'Checkers', brand: 'Checkers', calories: 105, protein: 12.5, carbs: 4.0, fat: 4.5, servingSize: 250, servingName: '1 tub' },
  { id: 'f053', name: 'Checkers BBQ Ribs', category: 'Checkers', brand: 'Checkers', calories: 320, protein: 23.0, carbs: 8.5, fat: 22.0, servingSize: 200, servingName: '200g' },

  // Fast Food SA
  { id: 'f054', name: "Nando's 1/4 Chicken Peri-Peri", category: 'Fast Food', brand: "Nando's", calories: 252, protein: 28.0, carbs: 1.5, fat: 15.0, servingSize: 200, servingName: '¼ chicken' },
  { id: 'f055', name: "Nando's Chicken Pita", category: 'Fast Food', brand: "Nando's", calories: 380, protein: 24.0, carbs: 42.0, fat: 12.0, servingSize: 250, servingName: '1 pita' },
  { id: 'f056', name: "Nando's Corn on the Cob", category: 'Fast Food', brand: "Nando's", calories: 130, protein: 3.5, carbs: 26.0, fat: 2.0, servingSize: 120, servingName: '1 ear' },
  { id: 'f057', name: 'Steers Classic Burger', category: 'Fast Food', brand: 'Steers', calories: 520, protein: 28.0, carbs: 52.0, fat: 22.0, servingSize: 230, servingName: '1 burger' },
  { id: 'f058', name: 'Steers Chips (Regular)', category: 'Fast Food', brand: 'Steers', calories: 290, protein: 3.5, carbs: 40.0, fat: 13.5, servingSize: 140, servingName: '1 regular' },
  { id: 'f059', name: 'Chicken Licken Soul Wings (3)', category: 'Fast Food', brand: 'Chicken Licken', calories: 270, protein: 20.0, carbs: 14.0, fat: 15.0, servingSize: 150, servingName: '3 wings' },
  { id: 'f060', name: 'KFC Zinger Burger', category: 'Fast Food', brand: 'KFC', calories: 568, protein: 29.0, carbs: 60.0, fat: 24.0, servingSize: 260, servingName: '1 burger' },
  { id: 'f061', name: 'KFC Original Chicken Piece', category: 'Fast Food', brand: 'KFC', calories: 260, protein: 20.0, carbs: 11.0, fat: 15.0, servingSize: 115, servingName: '1 piece' },
  { id: 'f062', name: 'KFC Coleslaw', category: 'Fast Food', brand: 'KFC', calories: 145, protein: 1.0, carbs: 18.0, fat: 8.0, servingSize: 100, servingName: '1 serving' },

  // Fruit & Vegetables
  { id: 'f063', name: 'Banana', category: 'Fruit', calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, servingSize: 120, servingName: '1 medium' },
  { id: 'f064', name: 'Apple (Red)', category: 'Fruit', calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, servingSize: 182, servingName: '1 medium' },
  { id: 'f065', name: 'Mango', category: 'Fruit', calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4, servingSize: 200, servingName: '1 cup sliced' },
  { id: 'f066', name: 'Pawpaw (Papaya)', category: 'Fruit', calories: 43, protein: 0.5, carbs: 11.0, fat: 0.3, servingSize: 200, servingName: '1 cup cubed' },
  { id: 'f067', name: 'Orange', category: 'Fruit', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, servingSize: 180, servingName: '1 medium' },
  { id: 'f068', name: 'Baby Spinach', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: 100, servingName: '2 cups' },
  { id: 'f069', name: 'Butternut Squash (Roasted)', category: 'Vegetables', calories: 82, protein: 1.8, carbs: 21.5, fat: 0.1, servingSize: 200, servingName: '1 cup' },
  { id: 'f070', name: 'Sweet Potato', category: 'Vegetables', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, servingSize: 130, servingName: '1 medium' },
  { id: 'f071', name: 'Broccoli', category: 'Vegetables', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, servingSize: 200, servingName: '1 cup' },
  { id: 'f072', name: 'Avocado', category: 'Vegetables', calories: 160, protein: 2.0, carbs: 9.0, fat: 15.0, servingSize: 100, servingName: '½ avo' },

  // Grains & Legumes
  { id: 'f073', name: 'Brown Rice (Cooked)', category: 'Grains', calories: 216, protein: 5.0, carbs: 45.0, fat: 1.8, servingSize: 200, servingName: '1 cup cooked' },
  { id: 'f074', name: 'Quinoa (Cooked)', category: 'Grains', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.5, servingSize: 185, servingName: '1 cup cooked' },
  { id: 'f075', name: 'Lentils (Cooked)', category: 'Legumes', calories: 230, protein: 18.0, carbs: 40.0, fat: 0.8, servingSize: 200, servingName: '1 cup cooked' },
  { id: 'f076', name: 'Chickpeas (Cooked)', category: 'Legumes', calories: 269, protein: 14.5, carbs: 45.0, fat: 4.3, servingSize: 200, servingName: '1 cup cooked' },

  // Dairy & Protein
  { id: 'f077', name: 'Full Cream Milk', category: 'Dairy', calories: 149, protein: 8.0, carbs: 11.7, fat: 8.0, servingSize: 250, servingName: '1 cup' },
  { id: 'f078', name: 'Cheddar Cheese', category: 'Dairy', calories: 402, protein: 25.0, carbs: 1.3, fat: 33.0, servingSize: 30, servingName: '1 slice (30g)' },
  { id: 'f079', name: 'Almonds', category: 'Nuts & Seeds', calories: 164, protein: 6.0, carbs: 6.1, fat: 14.2, servingSize: 28, servingName: '23 almonds' },
  { id: 'f080', name: 'Whey Protein Shake', category: 'Supplements', calories: 120, protein: 24.0, carbs: 4.0, fat: 2.0, servingSize: 30, servingName: '1 scoop' },

  // Beverages
  { id: 'f081', name: 'Rooibos Tea (No sugar)', category: 'Beverages', calories: 2, protein: 0.1, carbs: 0.4, fat: 0.0, servingSize: 240, servingName: '1 cup' },
  { id: 'f082', name: 'Baobab Smoothie', category: 'Beverages', calories: 185, protein: 3.5, carbs: 38.0, fat: 2.0, servingSize: 350, servingName: '1 large' },
  { id: 'f083', name: 'Kauai Green Detox Juice', category: 'Beverages', calories: 120, protein: 2.5, carbs: 26.0, fat: 0.5, servingSize: 400, servingName: '1 large' },
  { id: 'f084', name: 'Rooibos Latte', category: 'Beverages', calories: 80, protein: 3.0, carbs: 10.0, fat: 3.5, servingSize: 250, servingName: '1 cup' },
  { id: 'f085', name: 'Provita Wholewheat Crackers', category: 'Pick n Pay', brand: 'Pick n Pay', calories: 115, protein: 3.5, carbs: 22.0, fat: 1.8, servingSize: 30, servingName: '5 crackers' },
];

export const FOOD_CATEGORIES = [
  'All',
  'SA Traditional',
  'Woolworths',
  'Pick n Pay',
  'Checkers',
  'Fast Food',
  'Fruit',
  'Vegetables',
  'Grains',
  'Legumes',
  'Dairy',
  'Nuts & Seeds',
  'Supplements',
  'Beverages',
];
