import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { fitnessClasses } from '@/data/fitnessStudios';

const RING = 160, STROKE = 14;
const RADIUS = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function CalorieRing({ consumed, goal, textColor, mutedColor, primaryColor }: {
  consumed: number; goal: number; textColor: string; mutedColor: string; primaryColor: string;
}) {
  const p = Math.min(consumed / Math.max(goal, 1), 1);
  return (
    <View style={{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={RING} height={RING} style={{ position: 'absolute' }}>
        <G rotation={-90} origin={`${RING / 2},${RING / 2}`}>
          <Circle cx={RING / 2} cy={RING / 2} r={RADIUS}
            stroke={primaryColor + '30'} strokeWidth={STROKE} fill="none" />
          <Circle cx={RING / 2} cy={RING / 2} r={RADIUS}
            stroke={primaryColor} strokeWidth={STROKE} fill="none"
            strokeDasharray={[CIRC, CIRC]}
            strokeDashoffset={CIRC * (1 - p)}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: textColor }}>{consumed}</Text>
        <Text style={{ fontSize: 11, color: mutedColor }}>of {goal} kcal</Text>
      </View>
    </View>
  );
}

function MacroBar({ label, value, goal, color, colors }: {
  label: string; value: number; goal: number; color: string; colors: ReturnType<typeof useColors>;
}) {
  const pct = `${Math.round(Math.min(value / Math.max(goal, 1), 1) * 100)}%`;
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 11, fontWeight: '600' }}>{value}g</Text>
      </View>
      <View style={{ height: 5, backgroundColor: colors.border, borderRadius: 3 }}>
        <View style={{ height: 5, width: pct, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

function QuickAction({ label, icon, color, onPress, colors }: {
  label: string; icon: string; color: string; onPress: () => void; colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity onPress={onPress}
      style={{ flex: 1, backgroundColor: color + '15', borderRadius: colors.radius,
        paddingVertical: 14, alignItems: 'center', gap: 6 }}>
      <Feather name={icon as any} size={20} color={color} />
      <Text style={{ color, fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, isLoaded, getTodayDiary, setWater } = useApp();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }
  if (!profile?.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  const today = new Date().toISOString().split('T')[0];
  const diary = getTodayDiary();
  const consumed = Math.round(diary.entries.reduce((s, e) => s + e.calories, 0));
  const protein = Math.round(diary.entries.reduce((s, e) => s + e.protein, 0));
  const carbs = Math.round(diary.entries.reduce((s, e) => s + e.carbs, 0));
  const fat = Math.round(diary.entries.reduce((s, e) => s + e.fat, 0));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile.name?.split(' ')[0] ?? 'there';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 120 : insets.bottom + 90;

  const cityClasses = fitnessClasses
    .filter(c => profile.city === 'other' || c.city === profile.city)
    .slice(0, 8);

  function handleWater(delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = Math.max(0, todayDiary.waterGlasses + delta);
    setWater(today, next);
  }

  const todayDiary = diary;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: btmPad }}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 20,
        backgroundColor: colors.primary }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{greeting}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
            <Feather name="zap" size={12} color="#FCD34D" />
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13, marginLeft: 4 }}>
              {profile.streak} day streak
            </Text>
          </View>
        </View>
        <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '700' }}>{firstName}</Text>
      </View>

      {/* Calorie Ring + Macros */}
      <View style={{ margin: 16, backgroundColor: colors.card, borderRadius: colors.radius,
        padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
          letterSpacing: 0.8, marginBottom: 14 }}>TODAY'S PROGRESS</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <CalorieRing consumed={consumed} goal={profile.calorieGoal}
            textColor={colors.text} mutedColor={colors.mutedForeground} primaryColor={colors.primary} />
          <View style={{ flex: 1, gap: 10 }}>
            <MacroBar label="Protein" value={protein}
              goal={Math.round((profile.calorieGoal * 0.3) / 4)} color="#3B82F6" colors={colors} />
            <MacroBar label="Carbs" value={carbs}
              goal={Math.round((profile.calorieGoal * 0.45) / 4)} color={colors.secondary} colors={colors} />
            <MacroBar label="Fat" value={fat}
              goal={Math.round((profile.calorieGoal * 0.25) / 9)} color="#A855F7" colors={colors} />
            <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')}
              style={{ backgroundColor: colors.primary + '15', borderRadius: 10,
                paddingVertical: 8, alignItems: 'center', marginTop: 2 }}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>+ Log Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Water Tracker */}
      <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000',
        shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 8 }}>WATER INTAKE</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {Array.from({ length: profile.waterGoal }).map((_, i) => (
                <View key={i} style={{ width: 18, height: 24, borderRadius: 4,
                  backgroundColor: i < todayDiary.waterGlasses ? '#3B82F6' : colors.border }} />
              ))}
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>
              {todayDiary.waterGlasses} of {profile.waterGoal} glasses
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginLeft: 12 }}>
            <TouchableOpacity onPress={() => handleWater(-1)}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border,
                alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="minus" size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleWater(1)}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B82F6',
                alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="plus" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
        <QuickAction label="Fitness" icon="activity" color={colors.secondary}
          onPress={() => router.push('/(tabs)/fitness')} colors={colors} />
        <QuickAction label="Discover" icon="map-pin" color="#8B5CF6"
          onPress={() => router.push('/(tabs)/discover')} colors={colors} />
        <QuickAction label="Meal Plan" icon="book" color={colors.primary}
          onPress={() => router.push('/(tabs)/nutrition')} colors={colors} />
      </View>

      {/* Today's Classes */}
      {cityClasses.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Nearby Classes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/fitness')}>
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList horizontal showsHorizontalScrollIndicator={false}
            data={cityClasses} keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: 210, backgroundColor: colors.card, borderRadius: colors.radius,
                  marginRight: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05,
                  shadowRadius: 6, elevation: 2 }}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/fitness/${item.id}`); }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ backgroundColor: colors.primary + '15', paddingHorizontal: 8,
                    paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>{item.classType}</Text>
                  </View>
                  <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 14 }}>R{item.price}</Text>
                </View>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14, marginBottom: 2 }}
                  numberOfLines={1}>{item.studioName}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 10 }}>{item.instructor}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                    {new Date(item.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600',
                    color: item.spotsLeft < 5 ? '#EF4444' : colors.success }}>
                    {item.spotsLeft} left
                  </Text>
                </View>
              </TouchableOpacity>
            )} />
        </View>
      )}

      {/* Meal Suggestion */}
      <View style={{ marginHorizontal: 16, backgroundColor: colors.secondary + '12',
        borderRadius: colors.radius, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.secondary }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
          letterSpacing: 0.8, marginBottom: 6 }}>TODAY'S MEAL SUGGESTION</Text>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 4 }}>
          Pap & Chakalaka Braai Bowl
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 19, marginBottom: 12 }}>
          Creamy pap topped with smoky chakalaka and spiced boerewors — a SA classic full of flavour.
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 15 }}>490 kcal</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')}
            style={{ backgroundColor: colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
            <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>View Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
