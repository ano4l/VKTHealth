import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  Platform, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useColors } from '@/hooks/useColors';
import { useApp, type FoodEntry } from '@/context/AppContext';

interface ScannedItem {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ScanResult {
  items: ScannedItem[];
  totalCalories: number;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}

const MEAL_OPTIONS: { key: FoodEntry['meal']; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

const CONFIDENCE_COLOR: Record<string, string> = {
  high: '#16A34A',
  medium: '#D97706',
  low: '#DC2626',
};

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addFoodEntry } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const btmPad = Platform.OS === 'web' ? 40 : insets.bottom + 24;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<FoodEntry['meal']>('lunch');
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const apiBase = Platform.OS === 'web'
    ? `${process.env.EXPO_PUBLIC_DOMAIN ?? ''}`
    : `https://${process.env.EXPO_PUBLIC_DOMAIN ?? ''}`;

  async function pickImage(useCamera: boolean) {
    try {
      let res;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required to scan meals.');
          return;
        }
        res = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          base64: true,
          quality: 0.7,
          allowsEditing: true,
          aspect: [4, 3],
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library access is required.');
          return;
        }
        res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          base64: true,
          quality: 0.7,
          allowsEditing: true,
          aspect: [4, 3],
        });
      }

      if (!res.canceled && res.assets[0]) {
        const asset = res.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 ?? null);
        setResult(null);
        setAddedItems(new Set());
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open image picker. Please try again.');
    }
  }

  async function analyseImage() {
    if (!imageBase64) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScanning(true);
    setResult(null);

    try {
      const dataUrl = `data:image/jpeg;base64,${imageBase64}`;
      const response = await fetch(`${apiBase}/api/scan-meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? 'Server error');
      }

      const data = await response.json() as ScanResult;
      setResult(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Scan failed', msg + '\n\nMake sure the API server is running.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setScanning(false);
    }
  }

  function addItemToDiary(item: ScannedItem, index: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const today = new Date().toISOString().split('T')[0];
    const entry: FoodEntry = {
      id: `scan_${Date.now()}_${index}`,
      name: item.name,
      calories: Math.round(item.calories),
      protein: Math.round(item.protein * 10) / 10,
      carbs: Math.round(item.carbs * 10) / 10,
      fat: Math.round(item.fat * 10) / 10,
      meal: selectedMeal,
      servingSize: 100,
      date: today,
    };
    addFoodEntry(entry, today);
    setAddedItems(prev => new Set(prev).add(index));
  }

  function addAllToDiary() {
    if (!result) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    result.items.forEach((item, i) => {
      if (!addedItems.has(i)) addItemToDiary(item, i);
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: btmPad + 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colors.secondary + '22',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Feather name="camera" size={18} color={colors.secondary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
              Photo Scanner
            </Text>
            <View style={{
              backgroundColor: colors.secondary, borderRadius: 8,
              paddingHorizontal: 8, paddingVertical: 3,
            }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>PRO</Text>
            </View>
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 20, marginBottom: 20 }}>
            Take or upload a photo of your meal and AI will identify the foods and estimate the nutritional content.
          </Text>

          {!imageUri ? (
            <View style={{
              height: 220, backgroundColor: colors.muted, borderRadius: colors.radius,
              borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
              alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16,
            }}>
              <Feather name="image" size={48} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
                No photo selected
              </Text>
            </View>
          ) : (
            <View style={{ marginBottom: 16, borderRadius: colors.radius, overflow: 'hidden' }}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 240 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => { setImageUri(null); setImageBase64(null); setResult(null); setAddedItems(new Set()); }}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 16,
                  padding: 6,
                }}
              >
                <Feather name="x" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => pickImage(true)}
              style={{
                flex: 1, backgroundColor: colors.card, borderRadius: colors.radius,
                paddingVertical: 14, alignItems: 'center', flexDirection: 'row',
                justifyContent: 'center', gap: 8,
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <Feather name="camera" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage(false)}
              style={{
                flex: 1, backgroundColor: colors.card, borderRadius: colors.radius,
                paddingVertical: 14, alignItems: 'center', flexDirection: 'row',
                justifyContent: 'center', gap: 8,
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <Feather name="image" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <TouchableOpacity
              onPress={analyseImage}
              disabled={scanning}
              activeOpacity={0.85}
              style={{ borderRadius: colors.radius, overflow: 'hidden', marginBottom: 24 }}
            >
              <LinearGradient
                colors={scanning ? [colors.muted, colors.muted] : [colors.secondary, '#E8875B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                {scanning
                  ? <ActivityIndicator color={colors.mutedForeground} />
                  : <Feather name="zap" size={18} color="#fff" />}
                <Text style={{ color: scanning ? colors.mutedForeground : '#fff', fontWeight: '800', fontSize: 16 }}>
                  {scanning ? 'Analysing…' : 'Analyse Meal'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {scanning && (
            <View style={{
              backgroundColor: colors.card, borderRadius: colors.radius,
              padding: 24, alignItems: 'center', gap: 12, marginBottom: 16,
            }}>
              <ActivityIndicator size="large" color={colors.secondary} />
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>
                Identifying foods…
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: 'center' }}>
                AI is analysing your meal photo and estimating nutritional content
              </Text>
            </View>
          )}

          {result && result.items.length > 0 && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
                  Results
                </Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: (CONFIDENCE_COLOR[result.confidence] ?? colors.primary) + '18',
                  paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
                }}>
                  <Feather name="check-circle" size={12} color={CONFIDENCE_COLOR[result.confidence] ?? colors.primary} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: CONFIDENCE_COLOR[result.confidence] ?? colors.primary }}>
                    {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                  </Text>
                </View>
              </View>

              <View style={{
                backgroundColor: colors.primary + '18', borderRadius: colors.radius,
                padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Total estimated calories</Text>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 20 }}>
                  {result.totalCalories ?? result.items.reduce((s, i) => s + i.calories, 0)} kcal
                </Text>
              </View>

              {result.notes && (
                <View style={{
                  backgroundColor: colors.muted, borderRadius: 10, padding: 12, marginBottom: 14,
                  flexDirection: 'row', gap: 8,
                }}>
                  <Feather name="info" size={14} color={colors.mutedForeground} style={{ marginTop: 1 }} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 19, flex: 1 }}>{result.notes}</Text>
                </View>
              )}

              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 }}>
                Add to meal
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {MEAL_OPTIONS.map(m => (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => setSelectedMeal(m.key)}
                    style={{
                      paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20,
                      backgroundColor: selectedMeal === m.key ? colors.primary : colors.card,
                      borderWidth: 1, borderColor: selectedMeal === m.key ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{ color: selectedMeal === m.key ? '#fff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {result.items.map((item, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: colors.card, borderRadius: colors.radius,
                    padding: 14, marginBottom: 10, flexDirection: 'row',
                    alignItems: 'center', gap: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>{item.serving}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                      <MacroChip label="Cal" value={Math.round(item.calories)} color={colors.secondary} />
                      <MacroChip label="P" value={Math.round(item.protein * 10) / 10} color={colors.primary} unit="g" />
                      <MacroChip label="C" value={Math.round(item.carbs * 10) / 10} color="#D97706" unit="g" />
                      <MacroChip label="F" value={Math.round(item.fat * 10) / 10} color="#7C3AED" unit="g" />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => addItemToDiary(item, i)}
                    disabled={addedItems.has(i)}
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      backgroundColor: addedItems.has(i) ? colors.success + '22' : colors.primary + '18',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Feather
                      name={addedItems.has(i) ? 'check' : 'plus'}
                      size={18}
                      color={addedItems.has(i) ? (colors.success ?? '#16A34A') : colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              {result.items.length > 1 && addedItems.size < result.items.length && (
                <TouchableOpacity
                  onPress={addAllToDiary}
                  style={{
                    backgroundColor: colors.primary, borderRadius: colors.radius,
                    paddingVertical: 14, alignItems: 'center', marginTop: 4,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                    Add All to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}

              {addedItems.size > 0 && (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/nutrition')}
                  style={{ marginTop: 10, alignItems: 'center' }}
                >
                  <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
                    View in Diary →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {result && result.items.length === 0 && (
            <View style={{
              backgroundColor: colors.muted, borderRadius: colors.radius,
              padding: 24, alignItems: 'center', gap: 8,
            }}>
              <Feather name="alert-circle" size={32} color={colors.mutedForeground} />
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>No food detected</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: 'center', lineHeight: 19 }}>
                Make sure the photo clearly shows food. Try a different angle or better lighting.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function MacroChip({
  label, value, color, unit = '',
}: { label: string; value: number; color: string; unit?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Text style={{ fontSize: 11, color, fontWeight: '700' }}>{label}</Text>
      <Text style={{ fontSize: 11, color, fontWeight: '600' }}>{value}{unit}</Text>
    </View>
  );
}
