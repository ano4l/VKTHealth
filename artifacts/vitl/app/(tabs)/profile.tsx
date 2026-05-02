import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

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

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, diary, bookings, mealPlan } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 100 : insets.bottom + 80;

  const avgCalories = useMemo(() => {
    if (!diary || diary.length === 0) return 0;
    const total = diary.reduce((s, d) => s + d.entries.reduce((sum, e) => sum + e.calories, 0), 0);
    return Math.round(total / diary.length);
  }, [diary]);

  const upcomingClasses = bookings.filter(b => b.status === 'upcoming').length;

  const weightData = useMemo(() => {
    if (profile && profile.weightHistory.length > 1) return profile.weightHistory.slice(-8);
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

  const achievements = {
    first_log: diary.some(d => d.entries.length > 0),
    hydrated: diary.some(d => d.waterGlasses >= (profile?.waterGoal ?? 8)),
    streak7: (profile?.streak ?? 0) >= 7,
    first_class: bookings.length > 0,
    meal_plan: mealPlan !== null,
    explorer: false,
  };

  if (!profile) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const initials = profile.name
    ? profile.name.trim().split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: btmPad }} showsVerticalScrollIndicator={false}>

      {/* Profile Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 28,
        backgroundColor: colors.primary }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 20 }}>Profile</Text>
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
      </View>

      {/* Stats Cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 }}>
        {[
          { label: 'Streak', value: `${profile.streak} days`, icon: 'zap' as const, color: '#F59E0B' },
          { label: 'Daily Goal', value: `${profile.calorieGoal} kcal`, icon: 'target' as const, color: colors.primary },
          { label: 'Avg Intake', value: avgCalories > 0 ? `${avgCalories} kcal` : 'No data', icon: 'bar-chart-2' as const, color: colors.secondary },
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

      {/* Body Stats */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text, marginBottom: 16 }}>Body Stats</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
      </View>

      {/* Weight Trend Chart */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card,
        borderRadius: colors.radius, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Weight Trend</Text>
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
            {profile.weight} kg
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 5 }}>
          {weightData.map((d, i) => {
            const h = Math.max(Math.round(((d.weight - minW) / wRange) * 60 + 10), 10);
            const isLast = i === weightData.length - 1;
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
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
          Last 7 weigh-ins (kg)
        </Text>
      </View>

      {/* Achievements */}
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ fontWeight: '700', fontSize: 18, color: colors.text, marginBottom: 14 }}>
          Achievements
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const unlocked = achievements[a.key as keyof typeof achievements] === true;
            return (
              <View key={a.key}
                style={{ width: '30%', backgroundColor: unlocked ? colors.primary + '15' : colors.muted,
                  borderRadius: 14, padding: 12, alignItems: 'center',
                  borderWidth: 1.5, borderColor: unlocked ? colors.primary + '60' : 'transparent' }}>
                <Text style={{ fontSize: 26, marginBottom: 6, opacity: unlocked ? 1 : 0.3 }}>
                  {a.icon}
                </Text>
                <Text style={{ color: unlocked ? colors.primary : colors.mutedForeground,
                  fontWeight: '700', fontSize: 11, textAlign: 'center' }}>{a.title}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 9, textAlign: 'center', marginTop: 2 }}>
                  {a.desc}
                </Text>
              </View>
            );
          })}
        </View>
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
    </ScrollView>
  );
}
