import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { fitnessClasses } from '@/data/fitnessStudios';

const TYPES = ['All', 'Yoga', 'HIIT', 'Functional', 'CrossFit', 'Pilates', 'Boxing', 'Dance Cardio', 'Spin', 'Outdoor'];

function levelColor(level: string, colors: ReturnType<typeof useColors>) {
  if (level === 'beginner') return colors.success;
  if (level === 'advanced') return colors.destructive;
  if (level === 'intermediate') return colors.warning;
  return colors.mutedForeground;
}

export default function FitnessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, bookings } = useApp();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 100 : insets.bottom + 80;

  const filtered = useMemo(() => {
    return fitnessClasses.filter(c => {
      const matchSearch = !search ||
        c.studioName.toLowerCase().includes(search.toLowerCase()) ||
        c.classType.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchType = type === 'All' || c.classType === type;
      return matchSearch && matchType;
    });
  }, [search, type]);

  const upcomingIds = new Set(bookings.filter(b => b.status === 'upcoming').map(b => b.classId));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 14,
        backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Fitness</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
          borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8,
          borderWidth: 1, borderColor: colors.border }}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput value={search} onChangeText={setSearch}
            placeholder="Search classes, studios, instructors..."
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, color: colors.text, fontSize: 15 }} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {TYPES.map(t => (
          <TouchableOpacity key={t}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setType(t); }}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              backgroundColor: type === t ? colors.primary : colors.card,
              borderWidth: 1, borderColor: type === t ? colors.primary : colors.border }}>
            <Text style={{ color: type === t ? '#FFF' : colors.text, fontWeight: '600', fontSize: 13 }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4,
        color: colors.mutedForeground, fontSize: 13 }}>
        {filtered.length} class{filtered.length !== 1 ? 'es' : ''} available
      </Text>

      <FlatList data={filtered} keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: btmPad, gap: 12 }}
        renderItem={({ item }) => {
          const booked = upcomingIds.has(item.id);
          return (
            <TouchableOpacity
              style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
                shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
                borderWidth: booked ? 2 : 0, borderColor: colors.primary }}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/fitness/${item.id}`); }}>
              {booked && (
                <View style={{ backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3,
                  borderRadius: 10, alignSelf: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>✓ BOOKED</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', gap: 8, flex: 1, flexWrap: 'wrap' }}>
                  <View style={{ backgroundColor: colors.primary + '15', paddingHorizontal: 10,
                    paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{item.classType}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
                    backgroundColor: levelColor(item.level, colors) + '15' }}>
                    <Text style={{ color: levelColor(item.level, colors), fontSize: 12, fontWeight: '600' }}>
                      {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.secondary, fontWeight: '800', fontSize: 18 }}>R{item.price}</Text>
              </View>

              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 17, marginBottom: 2 }}>
                {item.studioName}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 14 }}>
                with {item.instructor}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Feather name="clock" size={13} color={colors.mutedForeground} />
                    <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                      {new Date(item.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                    <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{item.distance}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 60, height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
                    <View style={{ height: 4, borderRadius: 2,
                      width: `${(item.spotsLeft / item.totalSpots) * 100}%`,
                      backgroundColor: item.spotsLeft < 5 ? '#EF4444' : colors.success }} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700',
                    color: item.spotsLeft < 5 ? '#EF4444' : colors.success }}>
                    {item.spotsLeft} left
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }} />
    </View>
  );
}
