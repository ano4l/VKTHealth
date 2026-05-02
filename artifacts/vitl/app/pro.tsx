import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const PRO_FEATURES = [
  {
    icon: 'camera',
    title: 'Photo Calorie Scanner',
    description: 'Snap any meal and instantly get a full nutritional breakdown powered by AI.',
  },
  {
    icon: 'zap',
    title: 'Unlimited AI Meal Plans',
    description: 'Generate personalised weekly plans tailored to your goals and budget.',
  },
  {
    icon: 'trending-up',
    title: 'Advanced Body Analytics',
    description: 'Track body fat %, muscle mass, and detailed progress charts over time.',
  },
  {
    icon: 'map-pin',
    title: 'Priority Spot Booking',
    description: 'Reserve spots at top SA health venues before they open to the public.',
  },
  {
    icon: 'shield',
    title: 'Ad-Free Experience',
    description: 'Clean, distraction-free tracking so you can focus on your wellness.',
  },
];

export default function ProScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, unlockPro } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 40 : insets.bottom + 24;

  function handleUnlock() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    unlockPro();
    setTimeout(() => router.back(), 400);
  }

  if (profile?.isPro) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: colors.primary + '22',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather name="check-circle" size={40} color={colors.primary} />
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' }}>
          You're on VELA Pro
        </Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, textAlign: 'center', lineHeight: 22 }}>
          All features are unlocked. Enjoy your wellness journey!
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16, paddingVertical: 14, paddingHorizontal: 40,
            backgroundColor: colors.primary, borderRadius: colors.radius,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: btmPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: topPad + 24, paddingBottom: 40, paddingHorizontal: 24, alignItems: 'center' }}
        >
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Feather name="star" size={36} color="#fff" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>
            VELA Pro
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            Unlock every feature and reach your wellness goals faster.
          </Text>

          <View style={{
            marginTop: 24, flexDirection: 'row', gap: 12,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16,
              paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', flex: 1,
            }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>R99</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>per month</Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 16,
              paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', flex: 1,
              borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>R799</Text>
                <View style={{ backgroundColor: '#FFD700', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#1A1A1A' }}>SAVE 33%</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>per year</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
            What you get
          </Text>

          {PRO_FEATURES.map((f, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row', gap: 16, alignItems: 'flex-start',
                backgroundColor: colors.card, borderRadius: colors.radius,
                padding: 16, marginBottom: 12,
              }}
            >
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: i === 0 ? colors.secondary + '22' : colors.primary + '18',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Feather
                  name={f.icon as React.ComponentProps<typeof Feather>['name']}
                  size={20}
                  color={i === 0 ? colors.secondary : colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 }}>
                  {f.title}
                </Text>
                <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 19 }}>
                  {f.description}
                </Text>
              </View>
            </View>
          ))}

          <View style={{
            backgroundColor: colors.muted, borderRadius: colors.radius,
            padding: 16, marginTop: 8, marginBottom: 4,
          }}>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 }}>
              This is a demo app. Tapping "Unlock Pro" grants full access for free.{'\n'}In production this would connect to a payment provider.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background,
        paddingBottom: btmPad, paddingHorizontal: 24, paddingTop: 16,
        borderTopWidth: 1, borderTopColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={handleUnlock}
          activeOpacity={0.85}
          style={{ borderRadius: colors.radius, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>
              Unlock Pro — Free Demo
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
