import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

type Plan = 'monthly' | 'yearly';

const FREE_FEATURES = [
  { icon: 'book-open', text: 'Food diary (5 entries/day)' },
  { icon: 'droplet', text: 'Water intake tracker' },
  { icon: 'search', text: 'Browse fitness classes' },
  { icon: 'map', text: 'Browse health spots' },
  { icon: 'user', text: 'Basic profile & body stats' },
];

const PRO_FEATURES = [
  { icon: 'book-open', text: 'Unlimited food diary entries', highlight: false },
  { icon: 'camera', text: 'Photo calorie scanner (AI)', highlight: true },
  { icon: 'calendar', text: 'AI 7-day meal planner', highlight: true },
  { icon: 'shopping-cart', text: 'Smart grocery list (ZAR pricing)', highlight: false },
  { icon: 'bookmark', text: 'Fitness class booking', highlight: false },
  { icon: 'navigation', text: 'Directions & contact for health spots', highlight: false },
  { icon: 'trending-up', text: 'Weight trend chart', highlight: false },
  { icon: 'award', text: 'Achievements & milestones', highlight: false },
  { icon: 'zap', text: 'Advanced body analytics', highlight: false },
  { icon: 'droplet', text: 'Full water & hydration tracking', highlight: false },
];

export default function ProScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, unlockPro } = useApp();
  const [plan, setPlan] = useState<Plan>('yearly');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 40 : insets.bottom + 24;

  function handleUnlock() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    unlockPro();
    setTimeout(() => router.back(), 300);
  }

  if (profile?.isPro) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <LinearGradient
          colors={[colors.primary + '18', colors.secondary + '10']}
          style={{ width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
        >
          <Text style={{ fontSize: 44 }}>⭐</Text>
        </LinearGradient>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
          You're on VELA Pro
        </Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
          Every feature is unlocked. Keep crushing your wellness goals!
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingVertical: 14, paddingHorizontal: 40, backgroundColor: colors.primary, borderRadius: colors.radius }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: btmPad + 120 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient
          colors={[colors.primary, '#1A4D38']}
          style={{ paddingTop: topPad + 20, paddingBottom: 36, paddingHorizontal: 24, alignItems: 'center' }}
        >
          <View style={{
            width: 76, height: 76, borderRadius: 38,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Text style={{ fontSize: 38 }}>⭐</Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>
            VELA Pro
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 }}>
            Unlock the full power of your South African wellness journey.
          </Text>
        </LinearGradient>

        {/* Plan toggle */}
        <View style={{ padding: 20 }}>
          <View style={{
            flexDirection: 'row', backgroundColor: colors.muted,
            borderRadius: 14, padding: 4, marginBottom: 20,
          }}>
            {([['monthly', 'Monthly', 'R99/mo'], ['yearly', 'Yearly', 'R799/yr']] as [Plan, string, string][]).map(([key, label, price]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setPlan(key)}
                style={{
                  flex: 1, paddingVertical: 11, borderRadius: 11,
                  backgroundColor: plan === key ? colors.card : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: plan === key ? colors.text : colors.mutedForeground }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: plan === key ? colors.primary : colors.mutedForeground, marginTop: 1 }}>
                  {price}
                </Text>
                {key === 'yearly' && (
                  <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: colors.secondary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>SAVE 33%</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Comparison */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, overflow: 'hidden', marginBottom: 20 }}>
            {/* Column headers */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flex: 1.4, padding: 14 }}>
                <Text style={{ color: colors.mutedForeground, fontWeight: '700', fontSize: 12 }}>FEATURE</Text>
              </View>
              <View style={{ flex: 0.7, padding: 14, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}>
                <Text style={{ color: colors.mutedForeground, fontWeight: '700', fontSize: 12 }}>FREE</Text>
              </View>
              <View style={{
                flex: 0.7, padding: 14, alignItems: 'center',
                borderLeftWidth: 1, borderLeftColor: colors.border,
                backgroundColor: colors.primary + '12',
              }}>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 12 }}>PRO</Text>
              </View>
            </View>

            {[
              { label: 'Food diary', free: '5/day', pro: 'Unlimited' },
              { label: 'Water tracking', free: true, pro: true },
              { label: 'Browse classes', free: true, pro: true },
              { label: 'Browse health spots', free: true, pro: true },
              { label: 'Photo calorie scanner', free: false, pro: true },
              { label: 'AI meal planner', free: false, pro: true },
              { label: 'Grocery list', free: false, pro: true },
              { label: 'Class booking', free: false, pro: true },
              { label: 'Directions & contact', free: false, pro: true },
              { label: 'Weight chart', free: false, pro: true },
              { label: 'Achievements', free: false, pro: true },
              { label: 'Advanced analytics', free: false, pro: true },
            ].map((row, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.border,
                }}
              >
                <View style={{ flex: 1.4, paddingVertical: 13, paddingHorizontal: 14, justifyContent: 'center' }}>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>{row.label}</Text>
                </View>
                <View style={{
                  flex: 0.7, paddingVertical: 13, alignItems: 'center', justifyContent: 'center',
                  borderLeftWidth: 1, borderLeftColor: colors.border,
                }}>
                  {typeof row.free === 'boolean'
                    ? <Feather name={row.free ? 'check' : 'x'} size={16} color={row.free ? colors.success : colors.border} />
                    : <Text style={{ fontSize: 11, color: colors.mutedForeground, fontWeight: '600' }}>{row.free}</Text>}
                </View>
                <View style={{
                  flex: 0.7, paddingVertical: 13, alignItems: 'center', justifyContent: 'center',
                  borderLeftWidth: 1, borderLeftColor: colors.border,
                  backgroundColor: colors.primary + '08',
                }}>
                  {typeof row.pro === 'boolean'
                    ? <Feather name={row.pro ? 'check' : 'x'} size={16} color={row.pro ? colors.primary : colors.border} />
                    : <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '700' }}>{row.pro}</Text>}
                </View>
              </View>
            ))}
          </View>

          {/* What's included in Pro */}
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 }}>
            Everything in Pro
          </Text>
          {PRO_FEATURES.map((f, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: f.highlight ? colors.secondary + '20' : colors.primary + '15',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Feather
                  name={f.icon as React.ComponentProps<typeof Feather>['name']}
                  size={16}
                  color={f.highlight ? colors.secondary : colors.primary}
                />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: colors.text, fontWeight: f.highlight ? '700' : '500' }}>
                {f.text}
              </Text>
            </View>
          ))}

          <View style={{
            backgroundColor: colors.muted, borderRadius: 12,
            padding: 14, marginTop: 8,
          }}>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 }}>
              Demo app — "Unlock Pro" is free. In production this connects to a payment provider.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background,
        paddingBottom: btmPad, paddingHorizontal: 20, paddingTop: 14,
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
        <TouchableOpacity onPress={handleUnlock} activeOpacity={0.88} style={{ borderRadius: colors.radius, overflow: 'hidden' }}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 17, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>
              Unlock Pro · {plan === 'yearly' ? 'R799 / year' : 'R99 / month'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>Continue with Free</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
