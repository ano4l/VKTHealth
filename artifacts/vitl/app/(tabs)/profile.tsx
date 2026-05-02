import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
  Modal, TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Losing Weight',
  build_muscle: 'Building Muscle',
  eat_healthier: 'Eating Healthier',
  manage_condition: 'Managing a Condition',
  general_wellness: 'General Wellness',
};

const CITY_LABELS: Record<string, string> = {
  johannesburg: 'Johannesburg',
  cape_town: 'Cape Town',
  durban: 'Durban',
  pretoria: 'Pretoria',
  other: 'South Africa',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  very_active: 'Athlete',
};

const ACHIEVEMENTS = [
  { key: 'first_log', icon: '📝', title: 'First Log', desc: 'Log your first meal' },
  { key: 'hydrated', icon: '💧', title: 'Hydrated', desc: 'Hit your water goal' },
  { key: 'streak7', icon: '🔥', title: 'Week Warrior', desc: '7-day streak' },
  { key: 'first_class', icon: '🏋️', title: 'Class Booked', desc: 'Book a fitness class' },
  { key: 'meal_plan', icon: '🍽️', title: 'Planner', desc: 'Generate a meal plan' },
  { key: 'explorer', icon: '🗺️', title: 'Explorer', desc: 'Check out a health spot' },
];

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6', pct: 0.1 };
  if (bmi < 25) return { label: 'Healthy', color: '#22C55E', pct: 0.35 };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B', pct: 0.65 };
  return { label: 'Obese', color: '#EF4444', pct: 0.9 };
}

function ProFeatureLock({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: colors.secondary + '12',
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
        borderWidth: 1, borderColor: colors.secondary + '30' }}>
      <Feather name="lock" size={12} color={colors.secondary} />
      <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: '700' }}>{label} — Pro</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, diary, bookings, mealPlan, updateProfile } = useApp();

  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showMacrosModal, setShowMacrosModal] = useState(false);
  const [waistInput, setWaistInput] = useState('');
  const [hipInput, setHipInput] = useState('');
  const [chestInput, setChestInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 100 : insets.bottom + 80;
  const isPro = profile?.isPro ?? false;

  const avgCalories = useMemo(() => {
    if (!diary || diary.length === 0) return 0;
    const logged = diary.filter(d => d.entries.length > 0);
    if (logged.length === 0) return 0;
    const total = logged.reduce((s, d) => s + d.entries.reduce((sum, e) => sum + e.calories, 0), 0);
    return Math.round(total / logged.length);
  }, [diary]);

  const upcomingClasses = bookings.filter(b => b.status === 'upcoming').length;
  const totalDaysLogged = diary.filter(d => d.entries.length > 0).length;

  const bmi = useMemo(() => {
    if (!profile?.weight || !profile?.height || profile.height === 0) return null;
    const h = profile.height / 100;
    return Math.round((profile.weight / (h * h)) * 10) / 10;
  }, [profile]);

  const bmiInfo = bmi ? getBmiCategory(bmi) : null;

  const weightData = useMemo(() => {
    if (profile && profile.weightHistory && profile.weightHistory.length > 1) return profile.weightHistory.slice(-8);
    const base = profile?.weight ?? 70;
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i) * 7);
      const noise = Math.sin(i * 1.7) * 1.2;
      return { date: d.toISOString().split('T')[0], weight: Math.round((base + noise - i * 0.15) * 10) / 10 };
    });
  }, [profile]);

  const maxW = Math.max(...weightData.map(d => d.weight));
  const minW = Math.min(...weightData.map(d => d.weight));
  const wRange = maxW - minW || 1;

  const achievementStatus: Record<string, boolean> = {
    first_log: diary.some(d => d.entries.length > 0),
    hydrated: diary.some(d => d.waterGlasses >= (profile?.waterGoal ?? 8)),
    streak7: (profile?.streak ?? 0) >= 7,
    first_class: bookings.length > 0,
    meal_plan: mealPlan !== null,
    explorer: false,
  };

  const macroTargets = profile?.macroTargets ?? {
    protein: Math.round(((profile?.calorieGoal ?? 2000) * 0.30) / 4),
    carbs: Math.round(((profile?.calorieGoal ?? 2000) * 0.45) / 4),
    fat: Math.round(((profile?.calorieGoal ?? 2000) * 0.25) / 9),
  };

  function openMeasurements() {
    setWaistInput(profile?.waist?.toString() ?? '');
    setHipInput(profile?.hip?.toString() ?? '');
    setChestInput(profile?.chest?.toString() ?? '');
    setShowMeasurementsModal(true);
  }

  function saveMeasurements() {
    const updates: Record<string, number | undefined> = {};
    if (waistInput) updates.waist = parseFloat(waistInput);
    if (hipInput) updates.hip = parseFloat(hipInput);
    if (chestInput) updates.chest = parseFloat(chestInput);
    updateProfile(updates as any);
    setShowMeasurementsModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function openMacros() {
    setProteinInput(macroTargets.protein.toString());
    setCarbsInput(macroTargets.carbs.toString());
    setFatInput(macroTargets.fat.toString());
    setShowMacrosModal(true);
  }

  function saveMacros() {
    const p = parseInt(proteinInput, 10);
    const c = parseInt(carbsInput, 10);
    const f = parseInt(fatInput, 10);
    if (!isNaN(p) && !isNaN(c) && !isNaN(f)) {
      updateProfile({ macroTargets: { protein: p, carbs: c, fat: f } });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowMacrosModal(false);
  }

  if (!profile) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const initials = profile.name
    ? profile.name.trim().split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: btmPad }} showsVerticalScrollIndicator={false}>

      {/* Profile Header */}
      <LinearGradient colors={[colors.primary, '#1A4D38']}
        style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF' }}>Profile</Text>
          {isPro ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5,
              backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ fontSize: 12 }}>⭐</Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>PRO</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => router.push('/pro')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Feather name="star" size={13} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
            borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)' }}>
            <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '800' }}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800' }}>
              {profile.name || 'VELA User'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 3 }}>
              {GOAL_LABELS[profile.goal] ?? 'General Wellness'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 }}>
              {CITY_LABELS[profile.city] ?? 'South Africa'} · {ACTIVITY_LABELS[profile.activityLevel] ?? ''}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 }}>
        {[
          { label: 'Streak', value: `${profile.streak ?? 0} days`, icon: 'zap' as const, color: '#F59E0B' },
          { label: 'Daily Goal', value: `${profile.calorieGoal} kcal`, icon: 'target' as const, color: colors.primary },
          { label: 'Avg Calories', value: avgCalories > 0 ? `${avgCalories}` : '—', icon: 'bar-chart-2' as const, color: colors.secondary },
          { label: 'Classes', value: `${upcomingClasses} upcoming`, icon: 'calendar' as const, color: '#8B5CF6' },
        ].map(stat => (
          <View key={stat.label}
            style={{ width: '47%', backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
              shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Feather name={stat.icon} size={20} color={stat.color} />
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18, marginTop: 8 }}>
              {stat.value}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 3 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Body Stats + BMI */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 16 }}>Body Stats</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
          {[
            { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '—' },
            { label: 'Height', value: profile.height ? `${profile.height} cm` : '—' },
            { label: 'Age', value: profile.age ? `${profile.age} yrs` : '—' },
          ].map(s => (
            <View key={s.label} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 24 }}>{s.value}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {bmi && bmiInfo && (
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                BMI
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.text, fontWeight: '800', fontSize: 20 }}>{bmi}</Text>
                <View style={{ backgroundColor: bmiInfo.color + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ color: bmiInfo.color, fontWeight: '700', fontSize: 12 }}>{bmiInfo.label}</Text>
                </View>
              </View>
            </View>
            <View style={{ height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
              <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: '#3B82F6' }} />
                <View style={{ flex: 1, backgroundColor: '#22C55E' }} />
                <View style={{ flex: 1, backgroundColor: '#F59E0B' }} />
                <View style={{ flex: 1, backgroundColor: '#EF4444' }} />
              </View>
              <View style={{ position: 'absolute', top: -2, bottom: -2,
                left: `${Math.round(bmiInfo.pct * 100)}%`, width: 3, backgroundColor: '#fff',
                borderRadius: 2, shadowColor: '#000', shadowOpacity: 0.3, elevation: 2 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              {['Under', 'Healthy', 'Over', 'Obese'].map(l => (
                <Text key={l} style={{ color: colors.mutedForeground, fontSize: 9 }}>{l}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Body Measurements */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Measurements</Text>
          <TouchableOpacity onPress={openMeasurements}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: colors.primary + '15', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
            <Feather name="edit-2" size={12} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            { label: 'Waist', value: profile.waist ? `${profile.waist} cm` : '—', icon: '📏' },
            { label: 'Hip', value: profile.hip ? `${profile.hip} cm` : '—', icon: '📐' },
            { label: 'Chest', value: profile.chest ? `${profile.chest} cm` : '—', icon: '📊' },
          ].map(m => (
            <View key={m.label} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</Text>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>{m.value}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 3 }}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Macro Targets */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Macro Targets</Text>
          <TouchableOpacity onPress={openMacros}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: colors.primary + '15', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
            <Feather name="sliders" size={12} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Customise</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 12 }}>
          {[
            { label: 'Protein', goal: macroTargets.protein, color: '#3B82F6', emoji: '💪' },
            { label: 'Carbs', goal: macroTargets.carbs, color: colors.secondary, emoji: '🌾' },
            { label: 'Fat', goal: macroTargets.fat, color: '#A855F7', emoji: '🥑' },
          ].map(m => (
            <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 18, width: 26 }}>{m.emoji}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>{m.label}</Text>
                  <Text style={{ color: m.color, fontWeight: '700', fontSize: 13 }}>{m.goal}g / day</Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                  <View style={{ height: 6, borderRadius: 3, width: '100%', backgroundColor: m.color + '40' }}>
                    <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${Math.round(m.goal / (macroTargets.protein + macroTargets.carbs + macroTargets.fat) * 100)}%`,
                      backgroundColor: m.color, borderRadius: 3 }} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 14, textAlign: 'center' }}>
          Total: {macroTargets.protein + macroTargets.carbs + macroTargets.fat}g ·{' '}
          {(macroTargets.protein * 4) + (macroTargets.carbs * 4) + (macroTargets.fat * 9)} kcal from macros
        </Text>
      </View>

      {/* Weight Trend Chart */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          padding: 16, paddingBottom: isPro ? 10 : 16 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Weight Trend</Text>
          {isPro
            ? <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>{profile.weight} kg</Text>
            : <ProFeatureLock label="Weight Chart" onPress={() => router.push('/pro')} />}
        </View>

        {isPro ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 5 }}>
              {weightData.map((d, i) => {
                const h = Math.max(Math.round(((d.weight - minW) / wRange) * 60 + 10), 10);
                const isLast = i === weightData.length - 1;
                return (
                  <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Text style={{ color: colors.text, fontSize: 8, marginBottom: 3, fontWeight: isLast ? '700' : '400' }}>
                      {d.weight}
                    </Text>
                    <View style={{ width: '100%', height: h, borderRadius: 4,
                      backgroundColor: isLast ? colors.primary : colors.primary + '45' }} />
                    <Text style={{ color: colors.mutedForeground, fontSize: 8, marginTop: 4 }}>
                      {d.date.slice(8)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 10, textAlign: 'center' }}>
              Last {weightData.length} weigh-ins (kg)
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push('/pro')} activeOpacity={0.85}>
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, opacity: 0.15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 5 }}>
                {[40, 55, 35, 65, 50, 70, 80].map((h, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ width: '100%', height: h, borderRadius: 4, backgroundColor: colors.primary }} />
                  </View>
                ))}
              </View>
            </View>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Feather name="lock" size={22} color={colors.secondary} />
              <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '700' }}>
                Upgrade to see your trend
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Achievements */}
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text }}>Achievements</Text>
          {!isPro && <ProFeatureLock label="Unlock" onPress={() => router.push('/pro')} />}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const unlocked = isPro && achievementStatus[a.key] === true;
            return (
              <TouchableOpacity key={a.key} onPress={() => !isPro && router.push('/pro')}
                style={{ width: '30%', backgroundColor: unlocked ? colors.primary + '15' : colors.muted,
                  borderRadius: 14, padding: 12, alignItems: 'center',
                  borderWidth: 1.5, borderColor: unlocked ? colors.primary + '60' : 'transparent' }}>
                <Text style={{ fontSize: 26, marginBottom: 6, opacity: isPro ? (unlocked ? 1 : 0.35) : 0.2 }}>
                  {a.icon}
                </Text>
                <Text style={{ color: unlocked ? colors.primary : colors.mutedForeground,
                  fontWeight: '700', fontSize: 11, textAlign: 'center' }}>{a.title}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 9, textAlign: 'center', marginTop: 2 }}>
                  {isPro ? a.desc : '🔒 Pro'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {!isPro && (
          <TouchableOpacity onPress={() => router.push('/pro')}
            style={{ marginTop: 14, backgroundColor: colors.secondary + '12', borderRadius: 12,
              padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
              borderWidth: 1, borderColor: colors.secondary + '30' }}>
            <Feather name="award" size={20} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 14 }}>
                Unlock your achievements
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>
                Track milestones and celebrate your progress with Pro.
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dietary Info */}
      <View style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 12 }}>
          Dietary Preferences
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(profile.dietary ?? ['omnivore']).map(d => (
            <View key={d} style={{ backgroundColor: colors.secondary + '15', paddingHorizontal: 12,
              paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.secondary + '40' }}>
              <Text style={{ color: colors.secondary, fontWeight: '600', fontSize: 13 }}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Measurements Modal */}
      <Modal visible={showMeasurementsModal} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>Body Measurements</Text>
            <TouchableOpacity onPress={() => setShowMeasurementsModal(false)}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 24, lineHeight: 21 }}>
              Track your body measurements over time to monitor progress beyond just weight.
            </Text>
            {[
              { label: 'Waist', value: waistInput, setter: setWaistInput, placeholder: 'e.g. 80', hint: 'Measured at the narrowest point' },
              { label: 'Hip', value: hipInput, setter: setHipInput, placeholder: 'e.g. 100', hint: 'Measured at the widest point' },
              { label: 'Chest', value: chestInput, setter: setChestInput, placeholder: 'e.g. 95', hint: 'Measured across the chest' },
            ].map(field => (
              <View key={field.label} style={{ marginBottom: 20 }}>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: 4 }}>
                  {field.label} (cm)
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 8 }}>{field.hint}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
                    padding: 14, fontSize: 16, color: colors.text, backgroundColor: colors.card }}
                />
              </View>
            ))}
            <TouchableOpacity onPress={saveMeasurements}
              style={{ backgroundColor: colors.primary, borderRadius: 14,
                paddingVertical: 16, alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Save Measurements</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Macro Targets Modal */}
      <Modal visible={showMacrosModal} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>Macro Targets</Text>
            <TouchableOpacity onPress={() => setShowMacrosModal(false)}>
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 24, lineHeight: 21 }}>
              Set your daily macro targets in grams. These will show as progress bars on your home screen and nutrition diary.
            </Text>
            {[
              { label: 'Protein', emoji: '💪', color: '#3B82F6', value: proteinInput, setter: setProteinInput, hint: 'High protein supports muscle & satiety' },
              { label: 'Carbs', emoji: '🌾', color: colors.secondary, value: carbsInput, setter: setCarbsInput, hint: 'Main energy source for your body' },
              { label: 'Fat', emoji: '🥑', color: '#A855F7', value: fatInput, setter: setFatInput, hint: 'Essential for hormones & brain health' },
            ].map(m => (
              <View key={m.label} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>{m.label} (g/day)</Text>
                </View>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 8 }}>{m.hint}</Text>
                <TextInput
                  value={m.value}
                  onChangeText={m.setter}
                  placeholder="e.g. 150"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  style={{ borderWidth: 1.5, borderColor: m.color + '60', borderRadius: 12,
                    padding: 14, fontSize: 16, color: colors.text, backgroundColor: colors.card }}
                />
              </View>
            ))}
            <View style={{ backgroundColor: colors.muted, borderRadius: 12, padding: 14, marginBottom: 20 }}>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
                Total calories from macros
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                {((parseInt(proteinInput) || 0) * 4) + ((parseInt(carbsInput) || 0) * 4) + ((parseInt(fatInput) || 0) * 9)} kcal
              </Text>
            </View>
            <TouchableOpacity onPress={saveMacros}
              style={{ backgroundColor: colors.primary, borderRadius: 14,
                paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Save Targets</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
