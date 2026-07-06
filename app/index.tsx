import { router } from 'expo-router';
import { ArrowRight, Globe, Lock, ShieldCheck, Zap } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const features = [
  { icon: ShieldCheck, label: 'Blockchain Verified', color: "#059669" },
  { icon: Zap, label: 'Real-time Sync', color: '#3B82F6' },
  { icon: Lock, label: 'Secure Records', color: '#F59E0B' },
  { icon: Globe, label: 'National Coverage', color: '#8B5CF6' },
];

export default function LandingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background decorations */}
      <View className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10" />
      <View className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/5" />

      <Animated.View
        className="flex-1 justify-center items-center px-10"
        style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >

        {/* Logo */}
        <View className="items-center justify-center mb-6">
          <View className="w-20 h-20 rounded-3xl bg-primary justify-center items-center mb-5 shadow-lg shadow-emerald-900/40">
            <ShieldCheck size={40} color="#FFFFFF" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-5xl font-black text-slate-900 leading-[52px] mb-4 text-center">
          Immuni<Text className="text-primary">Link</Text>.
        </Text>

        <Text className="text-base text-slate-500 leading-relaxed mb-8 text-center">
          Track, verify, and manage your children's vaccination records — securely and in real-time.
        </Text>

        {/* Feature pills */}
        <View className="flex-row flex-wrap gap-2 mb-10 justify-center">
          {features.map(({ icon: Icon, label, color }) => (
            <View key={label} className="flex-row items-center bg-slate-50 rounded-full px-3.5 py-2 border border-slate-200">
              <Icon size={14} color={color} />
              <Text className="text-[11px] text-slate-900 font-bold ml-1.5 tracking-tight">{label}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View className="w-full gap-4 mb-6">
          <TouchableOpacity
            className="flex-row h-16 rounded-2xl bg-primary justify-center items-center shadow-md shadow-emerald-900/20"
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text className="text-white text-lg font-bold mr-2">Register Your Child</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-16 rounded-2xl border-2 border-slate-200 justify-center items-center bg-white"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-slate-900 text-base font-semibold">Sign In as Parent / Staff</Text>
          </TouchableOpacity>
        </View>

        {/* Footer note */}
        <Text className="text-center text-xs text-slate-400 mt-2">
          Trusted by{' '}
          <Text className="text-primary font-bold">40,000+</Text>
          {' '}families across Rwanda
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
