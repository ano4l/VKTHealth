import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { healthSpots } from '@/data/healthSpots';

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <Text style={{ fontSize: 18, letterSpacing: 2 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
    </Text>
  );
}

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();

  const spot = healthSpots.find(s => s.id === id);
  const btmPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;
  const isPro = profile?.isPro ?? false;

  if (!spot) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 16 }}>Spot not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function openDirections() {
    if (!isPro) { router.push('/pro'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(`${spot!.name}, ${spot!.address}`);
    const url = Platform.OS === 'ios'
      ? `maps:?q=${query}`
      : `https://maps.google.com/?q=${query}`;
    Linking.canOpenURL(url).then(can => {
      if (can) Linking.openURL(url);
      else Linking.openURL(`https://maps.google.com/?q=${query}`);
    }).catch(() => {
      Alert.alert('Unable to open maps. Please search manually for this location.');
    });
  }

  function callSpot() {
    if (!spot?.phone) return;
    if (!isPro) { router.push('/pro'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${spot.phone}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: btmPad + 160 }}>

        {/* Hero banner */}
        <View style={{ backgroundColor: colors.secondary, padding: 24, paddingTop: 20 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4,
            borderRadius: 8, alignSelf: 'flex-start', marginBottom: 14 }}>
            <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>{spot.category}</Text>
          </View>
          <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '800', marginBottom: 8 }}>{spot.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <StarRating rating={spot.rating} />
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '700' }}>{spot.rating}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>({spot.reviewCount} reviews)</Text>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          {/* Quick info row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            {[
              { icon: 'map-pin', text: spot.distance },
              { icon: 'tag', text: spot.priceRange },
              { icon: 'clock', text: spot.hours ?? 'See hours' },
            ].map(item => (
              <View key={item.icon}
                style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12,
                  alignItems: 'center', gap: 5,
                  shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
                <Feather name={item.icon as React.ComponentProps<typeof Feather>['name']} size={16} color={colors.secondary} />
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center' }}
                  numberOfLines={2}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 10 }}>ABOUT</Text>
            <Text style={{ color: colors.text, fontSize: 15, lineHeight: 24 }}>{spot.description}</Text>
          </View>

          {/* Location */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 10 }}>ADDRESS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <Feather name="map-pin" size={18} color={colors.secondary} style={{ marginTop: 1 }} />
              <Text style={{ color: colors.text, fontSize: 15, flex: 1, lineHeight: 22 }}>{spot.address}</Text>
            </View>
          </View>

          {/* Contact */}
          {spot.phone && (
            <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
              marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
                letterSpacing: 0.8, marginBottom: 10 }}>CONTACT</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="phone" size={18} color={isPro ? colors.primary : colors.border} />
                <Text style={{ color: isPro ? colors.primary : colors.mutedForeground, fontSize: 15, fontWeight: '600' }}>
                  {isPro ? spot.phone : '*** *** ****'}
                </Text>
                {!isPro && (
                  <View style={{ backgroundColor: colors.secondary + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ color: colors.secondary, fontSize: 10, fontWeight: '800' }}>PRO</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Tags */}
          {spot.tags && spot.tags.length > 0 && (
            <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
              marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
                letterSpacing: 0.8, marginBottom: 12 }}>SPECIALTIES</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {spot.tags.map(tag => (
                  <View key={tag} style={{ backgroundColor: colors.secondary + '12', paddingHorizontal: 12,
                    paddingVertical: 6, borderRadius: 20,
                    borderWidth: 1, borderColor: colors.secondary + '30' }}>
                    <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '600' }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pro upsell banner for free users */}
          {!isPro && (
            <TouchableOpacity
              onPress={() => router.push('/pro')}
              style={{ backgroundColor: colors.secondary + '12', borderRadius: colors.radius,
                padding: 16, borderWidth: 1, borderColor: colors.secondary + '30',
                flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20,
                backgroundColor: colors.secondary + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="lock" size={18} color={colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 14 }}>
                  Unlock directions & contact
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>
                  Pro members can get directions and call spots directly.
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Fixed action buttons */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background, padding: 20, paddingBottom: btmPad + 12,
        borderTopWidth: 1, borderTopColor: colors.border, gap: 10 }}>
        <TouchableOpacity
          onPress={openDirections}
          style={{
            backgroundColor: isPro ? colors.secondary : colors.muted,
            borderRadius: 50, paddingVertical: 16,
            alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
          }}
        >
          <Feather name={isPro ? 'navigation' : 'lock'} size={18} color={isPro ? '#FFF' : colors.mutedForeground} />
          <Text style={{ color: isPro ? '#FFF' : colors.mutedForeground, fontSize: 16, fontWeight: '700' }}>
            {isPro ? 'Get Directions' : 'Directions — Pro only'}
          </Text>
        </TouchableOpacity>
        {spot.phone && (
          <TouchableOpacity
            onPress={callSpot}
            style={{
              backgroundColor: colors.card, borderRadius: 50, paddingVertical: 14,
              alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
              borderWidth: 1, borderColor: isPro ? colors.border : colors.border,
              opacity: isPro ? 1 : 0.6,
            }}
          >
            <Feather name={isPro ? 'phone' : 'lock'} size={16} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
              {isPro ? 'Call Now' : 'Call — Pro only'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
