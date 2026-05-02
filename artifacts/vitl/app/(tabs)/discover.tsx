import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { healthSpots, SPOT_CATEGORIES } from '@/data/healthSpots';

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 100 : insets.bottom + 80;

  const filtered = useMemo(() => {
    return healthSpots.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || s.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  function starRating(rating: number) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 14,
        backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Discover</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
          borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8,
          borderWidth: 1, borderColor: colors.border }}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput value={search} onChangeText={setSearch}
            placeholder="Search health spots..."
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, color: colors.text, fontSize: 15 }} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {SPOT_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCategory(cat); }}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              backgroundColor: category === cat ? colors.secondary : colors.card,
              borderWidth: 1, borderColor: category === cat ? colors.secondary : colors.border }}>
            <Text style={{ color: category === cat ? '#FFF' : colors.text,
              fontWeight: '600', fontSize: 13 }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4,
        color: colors.mutedForeground, fontSize: 13 }}>
        {filtered.length} spot{filtered.length !== 1 ? 's' : ''} found
      </Text>

      <FlatList data={filtered} keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: btmPad, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/discover/${item.id}`); }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ backgroundColor: colors.secondary + '15', paddingHorizontal: 10,
                paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: '700' }}>{item.category}</Text>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{item.priceRange}</Text>
            </View>

            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18, marginBottom: 6 }}>
              {item.name}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, lineHeight: 20, marginBottom: 12 }}
              numberOfLines={2}>{item.description}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: '#F59E0B', fontSize: 14, letterSpacing: -1 }}>
                  {starRating(item.rating)}
                </Text>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{item.rating}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>({item.reviewCount})</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{item.distance}</Text>
              </View>
            </View>

            {item.tags && item.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {item.tags.slice(0, 4).map(tag => (
                  <View key={tag} style={{ backgroundColor: colors.muted, paddingHorizontal: 8,
                    paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )} />
    </View>
  );
}
