import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import type { UserProfile } from '@/context/AppContext';

const TOTAL_STEPS = 6;

interface OnboardingData {
  name: string;
  age: string;
  weight: string;
  height: string;
  city: UserProfile['city'];
  goal: UserProfile['goal'];
  activityLevel: UserProfile['activityLevel'];
  dietary: string[];
}

const GOALS: { key: UserProfile['goal']; label: string; icon: string; desc: string }[] = [
  { key: 'lose_weight', label: 'Lose Weight', icon: '⚖️', desc: 'Reduce body fat and improve health markers' },
  { key: 'build_muscle', label: 'Build Muscle', icon: '💪', desc: 'Gain strength and increase muscle mass' },
  { key: 'eat_healthier', label: 'Eat Healthier', icon: '🥗', desc: 'Improve nutrition and food choices' },
  { key: 'manage_condition', label: 'Manage Condition', icon: '🏥', desc: 'Support a health condition through diet' },
  { key: 'general_wellness', label: 'General Wellness', icon: '✨', desc: 'Feel better overall, more energy' },
];

const ACTIVITY_LEVELS: { key: UserProfile['activityLevel']; label: string; desc: string }[] = [
  { key: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
  { key: 'light', label: 'Lightly Active', desc: '1-3 days of light exercise per week' },
  { key: 'moderate', label: 'Moderately Active', desc: '3-5 days of moderate exercise' },
  { key: 'active', label: 'Very Active', desc: '6-7 days of hard exercise' },
  { key: 'very_active', label: 'Athlete', desc: 'Twice daily training or physical job' },
];

const CITIES: { key: UserProfile['city']; label: string; emoji: string }[] = [
  { key: 'johannesburg', label: 'Johannesburg', emoji: '🌆' },
  { key: 'cape_town', label: 'Cape Town', emoji: '🌊' },
  { key: 'durban', label: 'Durban', emoji: '🌴' },
  { key: 'pretoria', label: 'Pretoria', emoji: '🌸' },
  { key: 'other', label: 'Other', emoji: '📍' },
];

const DIETARY = [
  { key: 'omnivore', label: 'Omnivore', desc: 'I eat everything' },
  { key: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish' },
  { key: 'vegan', label: 'Vegan', desc: 'No animal products' },
  { key: 'halaal', label: 'Halaal', desc: 'Halaal certified foods' },
  { key: 'kosher', label: 'Kosher', desc: 'Kosher certified foods' },
  { key: 'diabetic', label: 'Diabetic-friendly', desc: 'Low GI, blood sugar aware' },
];

function calcCalorieGoal(weight: number, activity: string, goal: string): number {
  const mult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  let cal = Math.round(weight * 22 * (mult[activity] ?? 1.55));
  if (goal === 'lose_weight') cal -= 500;
  if (goal === 'build_muscle') cal += 300;
  return Math.max(cal, 1200);
}

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '', age: '', weight: '', height: '',
    city: 'johannesburg', goal: 'general_wellness',
    activityLevel: 'moderate', dietary: ['omnivore'],
  });

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(s => s + 1);
  }

  function finish() {
    const weight = parseFloat(data.weight) || 70;
    const profile: UserProfile = {
      name: data.name || 'Wellness User',
      age: parseInt(data.age) || 25,
      weight,
      height: parseFloat(data.height) || 170,
      city: data.city,
      goal: data.goal,
      activityLevel: data.activityLevel,
      dietary: data.dietary.length > 0 ? data.dietary : ['omnivore'],
      calorieGoal: calcCalorieGoal(weight, data.activityLevel, data.goal),
      waterGoal: 8,
      onboardingComplete: true,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      weightHistory: [{ date: new Date().toISOString().split('T')[0], weight }],
    };
    completeOnboarding(profile);
    router.replace('/(tabs)');
  }

  function toggleDietary(key: string) {
    setData(d => ({
      ...d,
      dietary: d.dietary.includes(key)
        ? d.dietary.filter(k => k !== key)
        : [...d.dietary.filter(k => k !== 'omnivore' || key === 'omnivore'), key],
    }));
  }

  const progress = step / TOTAL_STEPS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {step > 0 && (
        <View style={{ paddingTop: topPad + 10, paddingHorizontal: 20, paddingBottom: 8,
          backgroundColor: colors.background }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(s => s - 1)}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>←</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
              <View style={{ height: 4, width: `${progress * 100}%`, backgroundColor: colors.primary, borderRadius: 2 }} />
            </View>
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Step {step} of {TOTAL_STEPS}</Text>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: btmPad + 20 }}>

          {step === 0 && (
            <View style={{ alignItems: 'center', paddingTop: topPad + 70, paddingHorizontal: 32 }}>
              <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: colors.primary,
                alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                <Text style={{ fontSize: 52 }}>🌿</Text>
              </View>
              <Text style={{ fontSize: 44, fontWeight: '900', color: colors.text, marginBottom: 10 }}>VELA</Text>
              <Text style={{ fontSize: 18, color: colors.mutedForeground, textAlign: 'center',
                lineHeight: 28, marginBottom: 16 }}>
                Your South African health & wellness journey starts here.
              </Text>
              <Text style={{ fontSize: 14, color: colors.mutedForeground, textAlign: 'center',
                lineHeight: 22, marginBottom: 52 }}>
                Track nutrition, discover fitness classes and health spots, and get personalised SA meal plans.
              </Text>
              <TouchableOpacity onPress={next} style={{ backgroundColor: colors.primary,
                paddingVertical: 18, borderRadius: 50, width: '100%', alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                What's your name?
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 32 }}>
                We'll personalise your VELA experience for you.
              </Text>
              <TextInput value={data.name} onChangeText={v => setData(d => ({ ...d, name: v }))}
                placeholder="Your first name"
                placeholderTextColor={colors.mutedForeground}
                style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
                  fontSize: 18, color: colors.text, borderWidth: 1.5, borderColor: colors.border, marginBottom: 32 }}
                autoFocus returnKeyType="next" />
              <Btn onPress={next} disabled={!data.name.trim()} colors={colors} label="Continue" />
            </View>
          )}

          {step === 2 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                Where are you based?
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 28 }}>
                We'll show you classes and health spots near you.
              </Text>
              <View style={{ gap: 10, marginBottom: 32 }}>
                {CITIES.map(city => (
                  <TouchableOpacity key={city.key}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setData(d => ({ ...d, city: city.key })); }}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
                      borderRadius: colors.radius, padding: 16, borderWidth: 2,
                      borderColor: data.city === city.key ? colors.primary : colors.border }}>
                    <Text style={{ fontSize: 24, marginRight: 14 }}>{city.emoji}</Text>
                    <Text style={{ fontSize: 17, flex: 1, fontWeight: data.city === city.key ? '700' : '400',
                      color: data.city === city.key ? colors.primary : colors.text }}>{city.label}</Text>
                    {data.city === city.key && (
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary,
                        alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Btn onPress={next} colors={colors} label="Continue" />
            </View>
          )}

          {step === 3 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                Your body stats
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 28 }}>
                Used to calculate your personalised daily calorie goal.
              </Text>
              {[
                { label: 'Age', key: 'age', placeholder: 'e.g. 28', unit: 'years', kbd: 'numeric' },
                { label: 'Weight', key: 'weight', placeholder: 'e.g. 72', unit: 'kg', kbd: 'decimal-pad' },
                { label: 'Height', key: 'height', placeholder: 'e.g. 170', unit: 'cm', kbd: 'numeric' },
              ].map(f => (
                <View key={f.key} style={{ marginBottom: 16 }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginBottom: 8 }}>{f.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TextInput
                      value={(data as Record<string, string>)[f.key]}
                      onChangeText={v => setData(d => ({ ...d, [f.key]: v }))}
                      placeholder={f.placeholder} placeholderTextColor={colors.mutedForeground}
                      keyboardType={f.kbd as any}
                      style={{ flex: 1, backgroundColor: colors.card, borderRadius: colors.radius,
                        padding: 14, fontSize: 17, color: colors.text,
                        borderWidth: 1.5, borderColor: colors.border }} />
                    <Text style={{ color: colors.mutedForeground, fontSize: 15, width: 44 }}>{f.unit}</Text>
                  </View>
                </View>
              ))}
              <View style={{ height: 24 }} />
              <Btn onPress={next} colors={colors} label="Continue" />
            </View>
          )}

          {step === 4 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                What's your main goal?
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 28 }}>
                Your calorie target and meal plan will be tailored to this.
              </Text>
              <View style={{ gap: 10, marginBottom: 32 }}>
                {GOALS.map(g => (
                  <TouchableOpacity key={g.key}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setData(d => ({ ...d, goal: g.key })); }}
                    style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
                      flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2,
                      borderColor: data.goal === g.key ? colors.primary : colors.border }}>
                    <Text style={{ fontSize: 28 }}>{g.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', fontSize: 16,
                        color: data.goal === g.key ? colors.primary : colors.text }}>{g.label}</Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{g.desc}</Text>
                    </View>
                    {data.goal === g.key && (
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary,
                        alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Btn onPress={next} colors={colors} label="Continue" />
            </View>
          )}

          {step === 5 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                Activity level
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 28 }}>
                How active are you on a typical week?
              </Text>
              <View style={{ gap: 10, marginBottom: 32 }}>
                {ACTIVITY_LEVELS.map(a => (
                  <TouchableOpacity key={a.key}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setData(d => ({ ...d, activityLevel: a.key })); }}
                    style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
                      flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2,
                      borderColor: data.activityLevel === a.key ? colors.primary : colors.border }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', fontSize: 16,
                        color: data.activityLevel === a.key ? colors.primary : colors.text }}>{a.label}</Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{a.desc}</Text>
                    </View>
                    <View style={{ width: 22, height: 22, borderRadius: 11,
                      borderWidth: 2, borderColor: data.activityLevel === a.key ? colors.primary : colors.border,
                      backgroundColor: data.activityLevel === a.key ? colors.primary : 'transparent',
                      alignItems: 'center', justifyContent: 'center' }}>
                      {data.activityLevel === a.key && <Text style={{ color: '#FFF', fontSize: 12 }}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Btn onPress={next} colors={colors} label="Continue" />
            </View>
          )}

          {step === 6 && (
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                Dietary preferences
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 16, lineHeight: 24, marginBottom: 28 }}>
                Select all that apply — helps tailor your meal suggestions.
              </Text>
              <View style={{ gap: 10, marginBottom: 32 }}>
                {DIETARY.map(d => {
                  const active = data.dietary.includes(d.key);
                  return (
                    <TouchableOpacity key={d.key} onPress={() => toggleDietary(d.key)}
                      style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 14,
                        flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2,
                        borderColor: active ? colors.secondary : colors.border }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', fontSize: 16,
                          color: active ? colors.secondary : colors.text }}>{d.label}</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{d.desc}</Text>
                      </View>
                      <View style={{ width: 22, height: 22, borderRadius: 5,
                        borderWidth: 2, borderColor: active ? colors.secondary : colors.border,
                        backgroundColor: active ? colors.secondary : 'transparent',
                        alignItems: 'center', justifyContent: 'center' }}>
                        {active && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Btn onPress={finish} colors={colors} label="Start My VELA Journey 🌿" />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Btn({ onPress, disabled = false, colors, label }: {
  onPress: () => void; disabled?: boolean; colors: ReturnType<typeof useColors>; label: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}
      style={{ backgroundColor: disabled ? colors.muted : colors.primary,
        borderRadius: 50, paddingVertical: 18, alignItems: 'center', width: '100%' }}>
      <Text style={{ color: disabled ? colors.mutedForeground : '#FFF', fontSize: 17, fontWeight: '700' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
