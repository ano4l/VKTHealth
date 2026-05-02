import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Modal, FlatList, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { useColors } from '@/hooks/useColors';
import { useApp, type FoodEntry } from '@/context/AppContext';
import { foodDatabase, type FoodItem } from '@/data/foodDatabase';
import { generateMealPlan, BUDGET_OPTIONS } from '@/data/mealTemplates';

type SubTab = 'diary' | 'plan' | 'grocery';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const MEALS: { key: MealType; label: string; icon: string }[] = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '☀️' },
  { key: 'dinner', label: 'Dinner', icon: '🌙' },
  { key: 'snacks', label: 'Snacks', icon: '🍎' },
];

export default function NutritionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    profile, getTodayDiary, addFoodEntry, removeFoodEntry,
    mealPlan, setMealPlan, generateGroceryList, groceryList, toggleGroceryItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SubTab>('diary');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 100 : insets.bottom + 80;
  const today = new Date().toISOString().split('T')[0];
  const diary = getTodayDiary();

  const totalCal = Math.round(diary.entries.reduce((s, e) => s + e.calories, 0));
  const totalProt = Math.round(diary.entries.reduce((s, e) => s + e.protein, 0));
  const totalCarbs = Math.round(diary.entries.reduce((s, e) => s + e.carbs, 0));
  const totalFat = Math.round(diary.entries.reduce((s, e) => s + e.fat, 0));

  const filteredFoods = foodSearch.trim()
    ? foodDatabase.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 30)
    : foodDatabase.slice(0, 30);

  function addFood(food: FoodItem) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const factor = food.servingSize / 100;
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: food.name,
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
      servingSize: food.servingSize,
      meal: activeMeal,
      date: today,
    };
    addFoodEntry(entry, today);
    setShowFoodModal(false);
    setFoodSearch('');
  }

  function handleGenerate(budget: 'economy' | 'standard' | 'premium') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const plan = generateMealPlan(budget, profile?.dietary ?? ['omnivore']);
    setMealPlan(plan);
    generateGroceryList(plan);
    setShowBudgetModal(false);
  }

  const sections = groceryList.reduce<Record<string, typeof groceryList>>((acc, item) => {
    const s = item.section ?? 'Other';
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});

  const totalCost = groceryList.reduce((s, i) => s + i.estimatedPrice, 0);
  const checkedCount = groceryList.filter(i => i.checked).length;
  const calorieGoal = profile?.calorieGoal ?? 2000;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 14,
        backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Nutrition</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (profile?.isPro) {
                router.push('/scanner');
              } else {
                router.push('/pro');
              }
            }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: profile?.isPro ? colors.secondary + '18' : colors.secondary,
              paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
            }}
          >
            <Feather name="camera" size={15} color={profile?.isPro ? colors.secondary : '#fff'} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: profile?.isPro ? colors.secondary : '#fff' }}>
              Scan Meal
            </Text>
            {!profile?.isPro && (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>PRO</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: colors.muted,
          borderRadius: 12, padding: 3 }}>
          {(['diary', 'plan', 'grocery'] as SubTab[]).map(tab => (
            <TouchableOpacity key={tab}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab(tab); }}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
                backgroundColor: activeTab === tab ? colors.card : 'transparent' }}>
              <Text style={{ fontWeight: '700', fontSize: 14,
                color: activeTab === tab ? colors.primary : colors.mutedForeground,
                textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── DIARY TAB ── */}
      {activeTab === 'diary' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: btmPad }}
          showsVerticalScrollIndicator={false}>
          {/* Daily summary */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Daily Summary</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                {totalCal} / {calorieGoal} kcal
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 14 }}>
              <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.primary,
                width: `${Math.min(totalCal / calorieGoal, 1) * 100}%` }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[
                { label: 'Protein', val: totalProt, color: '#3B82F6' },
                { label: 'Carbs', val: totalCarbs, color: colors.secondary },
                { label: 'Fat', val: totalFat, color: '#A855F7' },
              ].map(m => (
                <View key={m.label} style={{ alignItems: 'center' }}>
                  <Text style={{ color: m.color, fontWeight: '800', fontSize: 22 }}>{m.val}g</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Water */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
            marginBottom: 16, flexDirection: 'row', alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>💧</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text, fontSize: 15 }}>Water</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                {diary.waterGlasses} / {profile?.waterGoal ?? 8} glasses
              </Text>
            </View>
          </View>

          {/* Meal sections */}
          {MEALS.map(meal => {
            const entries = diary.entries.filter(e => e.meal === meal.key);
            const mealCal = Math.round(entries.reduce((s, e) => s + e.calories, 0));
            return (
              <View key={meal.key} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 20 }}>{meal.icon}</Text>
                    <Text style={{ fontWeight: '700', fontSize: 17, color: colors.text }}>{meal.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {entries.length > 0 && (
                      <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{mealCal} kcal</Text>
                    )}
                    <TouchableOpacity
                      onPress={() => { setActiveMeal(meal.key); setShowFoodModal(true); }}
                      style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary,
                        alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="plus" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {entries.length === 0 ? (
                  <TouchableOpacity
                    onPress={() => { setActiveMeal(meal.key); setShowFoodModal(true); }}
                    style={{ backgroundColor: colors.muted, borderRadius: 12, padding: 16,
                      alignItems: 'center', borderWidth: 1, borderColor: colors.border,
                      borderStyle: 'dashed' }}>
                    <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>Tap to log food</Text>
                  </TouchableOpacity>
                ) : (
                  entries.map(entry => (
                    <View key={entry.id}
                      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 6,
                        shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 }}>
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}
                          numberOfLines={1}>{entry.name}</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>
                          P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fat}g
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 15 }}>
                          {entry.calories}
                        </Text>
                        <TouchableOpacity onPress={() => removeFoodEntry(entry.id, today)}>
                          <Feather name="trash-2" size={16} color={colors.destructive} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ── PLAN TAB ── */}
      {activeTab === 'plan' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: btmPad }}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setShowBudgetModal(true)}
            style={{ backgroundColor: colors.primary, borderRadius: colors.radius, padding: 16,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginBottom: 20 }}>
            <Feather name="refresh-cw" size={18} color="#FFF" />
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>
              {mealPlan ? 'Regenerate Plan' : 'Generate 7-Day Meal Plan'}
            </Text>
          </TouchableOpacity>

          {mealPlan ? (
            mealPlan.map((day, i) => (
              <View key={i} style={{ marginBottom: 14, backgroundColor: colors.card,
                borderRadius: colors.radius, overflow: 'hidden',
                shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 }}>
                <View style={{ backgroundColor: colors.primary + '18', padding: 14 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: colors.primary }}>{day.day}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>
                    {day.breakfast.calories + day.lunch.calories + day.dinner.calories} kcal total
                  </Text>
                </View>
                {[
                  { m: day.breakfast, icon: '🌅', label: 'Breakfast' },
                  { m: day.lunch, icon: '☀️', label: 'Lunch' },
                  { m: day.dinner, icon: '🌙', label: 'Dinner' },
                ].map((row, j) => (
                  <View key={j} style={{ padding: 14, borderTopWidth: j > 0 ? 1 : 0,
                    borderTopColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ fontSize: 18 }}>{row.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700',
                          letterSpacing: 0.5 }}>{row.label.toUpperCase()}</Text>
                        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14, marginTop: 2 }}
                          numberOfLines={1}>{row.m.name}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 15 }}>
                          {row.m.calories} kcal
                        </Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                          {row.m.prepTime} min
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 52, marginBottom: 16 }}>🍽️</Text>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 }}>
                No meal plan yet
              </Text>
              <Text style={{ color: colors.mutedForeground, textAlign: 'center', lineHeight: 22, fontSize: 15 }}>
                Generate a personalised 7-day South African meal plan based on your budget and preferences.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── GROCERY TAB ── */}
      {activeTab === 'grocery' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: btmPad }}
          showsVerticalScrollIndicator={false}>
          {groceryList.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 52, marginBottom: 16 }}>🛒</Text>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 }}>
                No grocery list
              </Text>
              <Text style={{ color: colors.mutedForeground, textAlign: 'center', lineHeight: 22, fontSize: 15 }}>
                Generate a meal plan first and your grocery list will be created automatically from it.
              </Text>
              <TouchableOpacity onPress={() => setActiveTab('plan')}
                style={{ marginTop: 24, backgroundColor: colors.primary,
                  borderRadius: 30, paddingHorizontal: 28, paddingVertical: 14 }}>
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Go to Plan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>
                  {checkedCount}/{groceryList.length} items
                </Text>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 17 }}>
                  ~R{totalCost}
                </Text>
              </View>

              {Object.entries(sections).map(([section, items]) => (
                <View key={section} style={{ marginBottom: 20 }}>
                  <Text style={{ color: colors.mutedForeground, fontWeight: '700', fontSize: 11,
                    letterSpacing: 1, marginBottom: 8 }}>{section.toUpperCase()}</Text>
                  {items.map(item => (
                    <TouchableOpacity key={item.id}
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleGroceryItem(item.id); }}
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
                        borderRadius: 10, padding: 14, marginBottom: 6, gap: 12 }}>
                      <View style={{ width: 22, height: 22, borderRadius: 6,
                        borderWidth: 2, borderColor: item.checked ? colors.primary : colors.border,
                        backgroundColor: item.checked ? colors.primary : 'transparent',
                        alignItems: 'center', justifyContent: 'center' }}>
                        {item.checked && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>}
                      </View>
                      <Text style={{ flex: 1, fontSize: 15, fontWeight: '500',
                        color: item.checked ? colors.mutedForeground : colors.text,
                        textDecorationLine: item.checked ? 'line-through' : 'none' }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                        ~R{item.estimatedPrice}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* Food Search Modal */}
      <Modal visible={showFoodModal} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
            flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',
              backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 12,
              paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: colors.border }}>
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput value={foodSearch} onChangeText={setFoodSearch}
                placeholder="Search SA foods..."
                placeholderTextColor={colors.mutedForeground}
                style={{ flex: 1, color: colors.text, fontSize: 15 }}
                autoFocus />
            </View>
            <TouchableOpacity onPress={() => { setShowFoodModal(false); setFoodSearch(''); }}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16, paddingVertical: 10,
            backgroundColor: colors.primary + '10', borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
              Adding to: {activeMeal.charAt(0).toUpperCase() + activeMeal.slice(1)}
            </Text>
          </View>

          <FlatList data={filteredFoods} keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => addFood(item)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>
                    {item.servingName} · P {item.protein}g · C {item.carbs}g · F {item.fat}g
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.secondary, fontWeight: '800', fontSize: 18 }}>
                    {Math.round(item.calories * item.servingSize / 100)}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>kcal</Text>
                </View>
              </TouchableOpacity>
            )} />
        </View>
      </Modal>

      {/* Budget Modal */}
      <Modal visible={showBudgetModal} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: Platform.OS === 'web' ? 24 : insets.bottom + 24 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 6 }}>
              Choose your budget
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 15, marginBottom: 22 }}>
              We'll build a personalised 7-day SA meal plan for you.
            </Text>
            {BUDGET_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.key} onPress={() => handleGenerate(opt.key)}
                style={{ backgroundColor: colors.background, borderRadius: 14, padding: 16,
                  marginBottom: 10, borderWidth: 1.5, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>{opt.label}</Text>
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 15 }}>{opt.price}</Text>
                </View>
                <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>{opt.description}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowBudgetModal(false)}
              style={{ alignItems: 'center', paddingVertical: 14 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 15, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
