import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { useApp, type ClassBooking } from '@/context/AppContext';
import { fitnessClasses } from '@/data/fitnessStudios';

function levelColor(level: string) {
  if (level === 'beginner') return '#16A34A';
  if (level === 'advanced') return '#EF4444';
  return '#F59E0B';
}

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addBooking, bookings } = useApp();
  const [booking, setBooking] = useState(false);

  const cls = fitnessClasses.find(c => c.id === id);
  const btmPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  if (!cls) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 16 }}>Class not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isBooked = bookings.some(b => b.classId === cls.id && b.status === 'upcoming');

  function handleBook() {
    if (isBooked) {
      Alert.alert('Already Booked', `You have already booked ${cls.studioName}.`);
      return;
    }
    if (cls.spotsLeft === 0) {
      Alert.alert('Fully Booked', 'There are no spots left for this class.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setBooking(true);
    setTimeout(() => {
      const booking: ClassBooking = {
        id: Date.now().toString(),
        classId: cls.id,
        className: `${cls.studioName} — ${cls.classType}`,
        studioName: cls.studioName,
        classType: cls.classType,
        dateTime: cls.dateTime,
        instructor: cls.instructor,
        price: cls.price,
        status: 'upcoming',
      };
      addBooking(booking);
      setBooking(false);
      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your spot at ${cls.studioName} with ${cls.instructor} has been reserved.\n\n${new Date(cls.dateTime).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} at ${new Date(cls.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        [{ text: 'View in Fitness', onPress: () => router.push('/(tabs)/fitness') }, { text: 'Done' }]
      );
    }, 400);
  }

  const spotsPercent = (cls.spotsLeft / cls.totalSpots) * 100;
  const dateObj = new Date(cls.dateTime);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: btmPad + 100 }}>

        {/* Hero banner */}
        <View style={{ backgroundColor: colors.primary, padding: 24, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>{cls.classType}</Text>
            </View>
            <View style={{ backgroundColor: levelColor(cls.level) + '40', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600' }}>
                {cls.level.charAt(0).toUpperCase() + cls.level.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={{ color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
            {cls.studioName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>with {cls.instructor}</Text>
        </View>

        {/* Details */}
        <View style={{ padding: 20 }}>
          {/* Date & Time */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 14 }}>DATE & TIME</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[
                { icon: 'calendar', label: dateObj.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }) },
                { icon: 'clock', label: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { icon: 'activity', label: `${cls.duration} min` },
              ].map(item => (
                <View key={item.icon} style={{ alignItems: 'center', gap: 6 }}>
                  <Feather name={item.icon as any} size={20} color={colors.primary} />
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 10 }}>LOCATION</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <Feather name="map-pin" size={18} color={colors.secondary} style={{ marginTop: 2 }} />
              <View>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{cls.address}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 3 }}>{cls.distance} away</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700',
              letterSpacing: 0.8, marginBottom: 10 }}>ABOUT THIS CLASS</Text>
            <Text style={{ color: colors.text, fontSize: 15, lineHeight: 24 }}>{cls.description}</Text>
          </View>

          {/* Spots availability */}
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, padding: 16,
            marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }}>
                AVAILABILITY
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 14,
                color: cls.spotsLeft < 5 ? '#EF4444' : colors.success }}>
                {cls.spotsLeft} of {cls.totalSpots} spots left
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
              <View style={{ height: 8, borderRadius: 4, width: `${spotsPercent}%`,
                backgroundColor: cls.spotsLeft < 5 ? '#EF4444' : colors.success }} />
            </View>
            {cls.spotsLeft < 5 && cls.spotsLeft > 0 && (
              <Text style={{ color: '#EF4444', fontSize: 13, marginTop: 8, fontWeight: '600' }}>
                ⚠️ Only {cls.spotsLeft} spot{cls.spotsLeft !== 1 ? 's' : ''} left — book soon!
              </Text>
            )}
          </View>

          {/* What to bring */}
          <View style={{ backgroundColor: colors.secondary + '12', borderRadius: colors.radius,
            padding: 16, borderLeftWidth: 4, borderLeftColor: colors.secondary, marginBottom: 6 }}>
            <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 14, marginBottom: 8 }}>
              What to bring
            </Text>
            <Text style={{ color: colors.text, fontSize: 14, lineHeight: 22 }}>
              {'Water bottle, sweat towel, and comfortable workout clothes. Mats provided at most studios.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Book Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background, padding: 20, paddingBottom: btmPad + 12,
        borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>Class fee</Text>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 28 }}>R{cls.price}</Text>
        </View>
        <TouchableOpacity onPress={handleBook} disabled={booking || isBooked || cls.spotsLeft === 0}
          style={{ backgroundColor: isBooked ? colors.success : cls.spotsLeft === 0 ? colors.muted : colors.primary,
            borderRadius: 50, paddingVertical: 18, alignItems: 'center' }}>
          <Text style={{ color: isBooked || cls.spotsLeft === 0 ? colors.mutedForeground : '#FFF',
            fontSize: 17, fontWeight: '700' }}>
            {booking ? 'Booking...' : isBooked ? '✓ Booked' : cls.spotsLeft === 0 ? 'Fully Booked' : `Book for R${cls.price}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
