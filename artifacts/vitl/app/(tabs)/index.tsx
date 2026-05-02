import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
  FlatList, TextInput, Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { fitnessClasses } from '@/data/fitnessStudios';

const RING = 150, STROKE = 14;
const RADIUS = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

const MOOD_EMOJIS = ['😔', '😕', '😐', '🙂', '😄'];
const MOOD_LABELS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];
const MOOD_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#10B981'];

const SA_QUOTES = [
  { text: 'Ubuntu — I am because we are. Your health journey uplifts those around you.', author: 'SA Wisdom' },
  { text: "A healthy outside starts from the inside. Take it one day at a time.", author: 'Ralph Waldo Emerson' },
  { text: "Small daily improvements lead to stunning long-term results.", author: 'Robin Sharma' },
  { text: "Ke nako — it is time. Time to invest in yourself.", author: 'SA Inspiration' },
  { text: "The secret of getting ahead is getting started.", author: 'Mark Twain' },
  { text: "Isidingo — what you need. Nourish your body and your spirit.", author: 'Zulu Proverb' },
  { text: "Take care of your body. It's the only place you have to live.", author: 'Jim Rohn' },
];

const DAILY_CHALLENGE_POOL = [
  { id: 'water', icon: '💧', title: 'Hit your water goal', points: 20 },
  { id: 'log_breakfast', icon: '🌅', title: 'Log breakfast today', points: 15 },
  { id: 'log_lunch', icon: '☀️', title: 'Log lunch today', points: 15 },
  { id: 'log_dinner', icon: '🌙', title: 'Log dinner today', points: 15 },
  { id: 'calorie_goal', icon: '🎯', title: 'Stay within your calorie goal', points: 25 },
  { id: 'protein_goal', icon: '💪', title: 'Hit your protein target', points: 20 },
  { id: 'steps_5k', icon: '👟', title: 'Log 5 000 steps', points: 30 },
  { id: 'all_meals', icon: '🍽️', title: 'Log all 3 main meals', points: 35 },
];

function CalorieRing({ consumed, goal, textColor, mutedColor, primaryColor }: {
  consumed: number; goal: number; textColor: string; mutedColor: string; primaryColor: string;
}) {
  const p = Math.min(consumed / Math.max(goal, 1), 1);
  return (
    <View style={{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={RING} height={RING} style={{ position: 'absolute' }}>
        <G rotation={-90} origin={`${RING / 2},${RING / 2}`}>
          <Circle cx={RING / 2} cy={RING / 2} r={RADIUS}
            stroke={primaryColor + '28'} strokeWidth={STROKE} fill="none" />
          <Circle cx={RING / 2} cy={RING / 2} r={RADIUS}
            stroke={primaryColor} strokeWidth={STROKE} fill="none"
            strokeDasharray={[CIRC, CIRC]}
            strokeDashoffset={CIRC * (1 - p)}
            strokeLinecap="round" />
        </G>
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: textColor }}>{consumed}</Text>
        <Text style={{ fontSize: 10, color: mutedColor, marginTop: 1 }}>of {goal} kcal</Text>
        <Text style={{ fontSize: 11, color: primaryColor, fontWeight: '700', marginTop: 3 }}>
          {Math.round(p * 100)}%
        </Text>
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
        <Text style={{ color: colors.text, fontSize: 11, fontWeight: '600' }}>{value}g / {goal}g</Text>
      </View>
      <View style={{ height: 5, backgroundColor: colors.border, borderRadius: 3 }}>
        <View style={{ height: 5, width: pct, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    profile, isLoaded, getTodayDiary, setWater, setSteps, diary,
    bookings, logMood, getTodayMood,
  } = useApp();

  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [stepsInput, setStepsInput] = useState('');

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }
  if (!profile?.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayDiary = getTodayDiary();
  const todayMood = getTodayMood();
  const consumed = Math.round(todayDiary.entries.reduce((s, e) => s + e.calories, 0));
  const protein = Math.round(todayDiary.entries.reduce((s, e) => s + e.protein, 0));
  const carbs = Math.round(todayDiary.entries.reduce((s, e) => s + e.carbs, 0));
  const fat = Math.round(todayDiary.entries.reduce((s, e) => s + e.fat, 0));

  const macroTargets = profile.macroTargets ?? {
    protein: Math.round((profile.calorieGoal * 0.30) / 4),
    carbs: Math.round((profile.calorieGoal * 0.45) / 4),
    fat: Math.round((profile.calorieGoal * 0.25) / 9),
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile.name?.split(' ')[0] ?? 'there';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 120 : insets.bottom + 90;

  const cityClasses = fitnessClasses
    .filter(c => profile.city === 'other' || c.city === profile.city)
    .slice(0, 8);

  const dayIndex = new Date().getDay();
  const todayChallenges = [
    DAILY_CHALLENGE_POOL[dayIndex % DAILY_CHALLENGE_POOL.length],
    DAILY_CHALLENGE_POOL[(dayIndex + 3) % DAILY_CHALLENGE_POOL.length],
    DAILY_CHALLENGE_POOL[(dayIndex + 6) % DAILY_CHALLENGE_POOL.length],
  ];

  function getChallengeComplete(id: string): boolean {
    switch (id) {
      case 'water': return todayDiary.waterGlasses >= (profile?.waterGoal ?? 8);
      case 'log_breakfast': return todayDiary.entries.some(e => e.meal === 'breakfast');
      case 'log_lunch': return todayDiary.entries.some(e => e.meal === 'lunch');
      case 'log_dinner': return todayDiary.entries.some(e => e.meal === 'dinner');
      case 'calorie_goal': return consumed > 0 && consumed <= (profile?.calorieGoal ?? 2000);
      case 'protein_goal': return protein >= macroTargets.protein;
      case 'steps_5k': return todayDiary.steps >= 5000;
      case 'all_meals':
        return todayDiary.entries.some(e => e.meal === 'breakfast')
          && todayDiary.entries.some(e => e.meal === 'lunch')
          && todayDiary.entries.some(e => e.meal === 'dinner');
      default: return false;
    }
  }

  const completedChallenges = todayChallenges.filter(c => getChallengeComplete(c.id)).length;

  const weeklyStats = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    const days = last7.map(date => diary.find(d => d.date === date) ?? { date, waterGlasses: 0, steps: 0, activeMinutes: 0, entries: [] });
    const daysLogged = days.filter(d => d.entries.length > 0).length;
    const totalCalories = days.reduce((s, d) => s + d.entries.reduce((ss, e) => ss + e.calories, 0), 0);
    const avgCalories = daysLogged > 0 ? Math.round(totalCalories / daysLogged) : 0;
    const totalWater = days.reduce((s, d) => s + d.waterGlasses, 0);
    const classesCompleted = bookings.filter(b => {
      const bDate = new Date(b.dateTime).toISOString().split('T')[0];
      return last7.includes(bDate) && b.status === 'upcoming';
    }).length;
    return { daysLogged, avgCalories, totalWater, classesCompleted };
  }, [diary, bookings]);

  const quoteIndex = (new Date().getDate() + new Date().getMonth()) % SA_QUOTES.length;
  const quote = SA_QUOTES[quoteIndex];

  function handleWater(delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = Math.max(0, todayDiary.waterGlasses + delta);
    setWater(today, next);
  }

  function handleMood(mood: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const energy = todayMood?.energy ?? 3;
    logMood(today, mood, energy);
  }

  function handleEnergy(energy: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const mood = todayMood?.mood ?? 3;
    logMood(today, mood, energy);
  }

  function handleSaveSteps() {
    const n = parseInt(stepsInput, 10);
    if (!isNaN(n) && n >= 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSteps(today, n);
    }
    setStepsModalVisible(false);
    setStepsInput('');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: btmPad }}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 22,
        backgroundColor: colors.primary }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{greeting}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
              <Feather name="zap" size={12} color="#FCD34D" />
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12, marginLeft: 4 }}>
                {profile.streak ?? 0}d streak
              </Text>
            </View>
            {profile.isPro && (
              <View style={{ flexDirection: 'row', alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '800' }}>⭐ PRO</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '800' }}>{firstName} 👋</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
          {completedChallenges}/{todayChallenges.length} daily challenges done
        </Text>
      </View>

      {/* Calorie Ring + Macros */}
      <View style={{ margin: 16, backgroundColor: colors.card, borderRadius: colors.radius,
        padding: 18, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
          letterSpacing: 0.8, marginBottom: 14 }}>TODAY'S PROGRESS</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <CalorieRing consumed={consumed} goal={profile.calorieGoal}
            textColor={colors.text} mutedColor={colors.mutedForeground} primaryColor={colors.primary} />
          <View style={{ flex: 1, gap: 10 }}>
            <MacroBar label="Protein" value={protein} goal={macroTargets.protein} color="#3B82F6" colors={colors} />
            <MacroBar label="Carbs" value={carbs} goal={macroTargets.carbs} color={colors.secondary} colors={colors} />
            <MacroBar label="Fat" value={fat} goal={macroTargets.fat} color="#A855F7" colors={colors} />
            <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')}
              style={{ backgroundColor: colors.primary + '15', borderRadius: 10,
                paddingVertical: 8, alignItems: 'center', marginTop: 2 }}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>+ Log Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Steps + Water side by side */}
      <View style={{ flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 12 }}>
        {/* Steps */}
        <TouchableOpacity onPress={() => setStepsModalVisible(true)}
          style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
            shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>👟</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 }}>STEPS</Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 26 }}>
            {todayDiary.steps.toLocaleString()}
          </Text>
          <View style={{ marginTop: 6, height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
            <View style={{ height: 4, borderRadius: 2,
              backgroundColor: todayDiary.steps >= 10000 ? colors.success : colors.primary,
              width: `${Math.min(todayDiary.steps / 10000, 1) * 100}%` }} />
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>goal: 10 000</Text>
        </TouchableOpacity>

        {/* Water */}
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
          shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>💧</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 }}>WATER</Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 26 }}>
            {todayDiary.waterGlasses}
            <Text style={{ color: colors.mutedForeground, fontSize: 14, fontWeight: '400' }}>/{profile.waterGoal}</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 3, marginTop: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: profile.waterGoal }).map((_, i) => (
              <View key={i} style={{ width: 10, height: 14, borderRadius: 3,
                backgroundColor: i < todayDiary.waterGlasses ? '#3B82F6' : colors.border }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
            <TouchableOpacity onPress={() => handleWater(-1)}
              style={{ flex: 1, height: 30, borderRadius: 8, backgroundColor: colors.border,
                alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="minus" size={14} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleWater(1)}
              style={{ flex: 1, height: 30, borderRadius: 8, backgroundColor: '#3B82F6',
                alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="plus" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Daily Challenges */}
      <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Daily Challenges</Text>
          <View style={{ backgroundColor: completedChallenges === todayChallenges.length ? colors.success + '20' : colors.primary + '15',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: completedChallenges === todayChallenges.length ? colors.success : colors.primary,
              fontWeight: '700', fontSize: 12 }}>
              {completedChallenges}/{todayChallenges.length}
            </Text>
          </View>
        </View>
        {todayChallenges.map(challenge => {
          const done = getChallengeComplete(challenge.id);
          return (
            <View key={challenge.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 10, borderTopWidth: todayChallenges.indexOf(challenge) > 0 ? 1 : 0,
                borderTopColor: colors.border }}>
              <View style={{ width: 38, height: 38, borderRadius: 19,
                backgroundColor: done ? colors.success + '20' : colors.muted,
                alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, opacity: done ? 1 : 0.5 }}>{challenge.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: done ? colors.mutedForeground : colors.text,
                  fontWeight: '600', fontSize: 14,
                  textDecorationLine: done ? 'line-through' : 'none' }}>
                  {challenge.title}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 1 }}>
                  +{challenge.points} pts
                </Text>
              </View>
              <View style={{ width: 26, height: 26, borderRadius: 13,
                backgroundColor: done ? colors.success : colors.border,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: done ? 0 : 1.5, borderColor: colors.border }}>
                {done && <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>✓</Text>}
              </View>
            </View>
          );
        })}
      </View>

      {/* Mood & Energy Check-in */}
      <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 4 }}>
          How are you feeling?
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 13, marginBottom: 14 }}>
          {todayMood ? `Logged: ${MOOD_EMOJIS[todayMood.mood - 1]} ${MOOD_LABELS[todayMood.mood - 1]} · Energy ${todayMood.energy}/5` : 'Tap to log your mood & energy'}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          {MOOD_EMOJIS.map((emoji, i) => {
            const selected = todayMood?.mood === i + 1;
            return (
              <TouchableOpacity key={i} onPress={() => handleMood(i + 1)}
                style={{ alignItems: 'center', gap: 4 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24,
                  backgroundColor: selected ? MOOD_COLORS[i] + '25' : colors.muted,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? MOOD_COLORS[i] : colors.border,
                  alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{emoji}</Text>
                </View>
                <Text style={{ fontSize: 10, color: selected ? MOOD_COLORS[i] : colors.mutedForeground,
                  fontWeight: selected ? '700' : '400' }}>{MOOD_LABELS[i]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
            Energy Level
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(level => {
              const selected = (todayMood?.energy ?? 0) >= level;
              return (
                <TouchableOpacity key={level} onPress={() => handleEnergy(level)}
                  style={{ flex: 1, height: 10, borderRadius: 5,
                    backgroundColor: selected ? colors.secondary : colors.border }} />
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Drained</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Energised</Text>
          </View>
        </View>
      </View>

      {/* Weekly Summary */}
      <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 14 }}>
          This Week
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[
            { label: 'Days Logged', value: `${weeklyStats.daysLogged}/7`, icon: '📓', color: colors.primary },
            { label: 'Avg Calories', value: weeklyStats.avgCalories > 0 ? `${weeklyStats.avgCalories}` : '—', icon: '🔥', color: colors.secondary },
            { label: 'Water 💧', value: `${weeklyStats.totalWater}`, icon: '💧', color: '#3B82F6' },
            { label: 'Classes', value: `${weeklyStats.classesCompleted}`, icon: '🏋️', color: '#8B5CF6' },
          ].map(s => (
            <View key={s.label} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: s.color, fontWeight: '800', fontSize: 20 }}>{s.value}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, textAlign: 'center', marginTop: 4 }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Fitness', icon: 'activity', color: colors.secondary, route: '/(tabs)/fitness' },
          { label: 'Discover', icon: 'map-pin', color: '#8B5CF6', route: '/(tabs)/discover' },
          { label: 'Scanner', icon: 'camera', color: colors.primary, route: profile.isPro ? '/scanner' : '/pro' },
        ].map(a => (
          <TouchableOpacity key={a.label} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(a.route as any); }}
            style={{ flex: 1, backgroundColor: a.color + '15', borderRadius: colors.radius,
              paddingVertical: 14, alignItems: 'center', gap: 6 }}>
            <Feather name={a.icon as any} size={20} color={a.color} />
            <Text style={{ color: a.color, fontWeight: '700', fontSize: 12 }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nearby Classes */}
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
                style={{ width: 200, backgroundColor: colors.card, borderRadius: colors.radius,
                  marginRight: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 }}
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

      {/* SA Daily Quote */}
      <View style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.secondary + '12',
        borderRadius: colors.radius, padding: 18,
        borderLeftWidth: 4, borderLeftColor: colors.secondary }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700',
          letterSpacing: 1, marginBottom: 8 }}>DAILY INSPIRATION</Text>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', lineHeight: 22,
          fontStyle: 'italic', marginBottom: 8 }}>
          "{quote.text}"
        </Text>
        <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 13 }}>— {quote.author}</Text>
      </View>

      {/* Steps Modal */}
      <Modal visible={stepsModalVisible} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: Platform.OS === 'web' ? 24 : insets.bottom + 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 6 }}>
              Log Steps 👟
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 20 }}>
              Enter your step count for today
            </Text>
            <TextInput
              value={stepsInput}
              onChangeText={setStepsInput}
              placeholder="e.g. 8500"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
                padding: 14, fontSize: 18, color: colors.text,
                backgroundColor: colors.background, marginBottom: 16, textAlign: 'center' }}
              autoFocus
            />
            <TouchableOpacity onPress={handleSaveSteps}
              style={{ backgroundColor: colors.primary, borderRadius: 14,
                paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Save Steps</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setStepsModalVisible(false); setStepsInput(''); }}
              style={{ alignItems: 'center', paddingVertical: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
