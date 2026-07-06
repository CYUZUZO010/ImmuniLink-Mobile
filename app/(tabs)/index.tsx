import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ShieldCheck, Calendar, Activity, Bell,
  ChevronRight, ArrowRight, CheckCircle2, Baby, LogOut,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

export default function HomeScreen() {
  const { t } = useI18n();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchChildren(user.email);
    } else {
      setLoading(false);
    }
  };

  const fetchChildren = async (email: string | undefined) => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    
    const { data, error } = await supabase
      .from('Patient')
      .select('*, "VaccinationRecord"(id, timestamp, "Vaccine"(name))')
      .eq('parentEmail', normalizedEmail);
      
    if (error) {
      console.error("Error fetching children:", error);
    }
    
    if (data) setChildren(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-lg bg-primary justify-center items-center mr-3">
            <ShieldCheck size={18} color="#FFFFFF" />
          </View>
          <Text className="text-lg font-extrabold text-slate-900">ImmuniLink<Text className="text-primary">.</Text></Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="p-1" onPress={handleLogout}>
            <LogOut size={22} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity className="relative p-1" onPress={() => router.push('/(tabs)/alerts')}>
            <Bell size={22} color="#1A1A1A" />
            <View className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </TouchableOpacity>
          <Image
            source={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"}
            className="w-9 h-9 rounded-full border-2 border-slate-200"
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-6 pb-24" showsVerticalScrollIndicator={false}>

        {/* Hero Card */}
        <View className="bg-primary rounded-[32px] p-6 mb-6 shadow-lg shadow-emerald-900/20">
          <View>
            <Text className="text-lg font-bold text-white mb-1">{t('welcome')}, {user?.user_metadata?.name || 'Parent'} 👋</Text>
            <Text className="text-[13px] text-white/80 mb-6">Your children's health records are synced.</Text>
          </View>
          <View className="flex-row items-center">
            <View className="flex-1 items-center">
              <Text className="text-[26px] font-extrabold text-white">{children.length}</Text>
              <Text className="text-[11px] text-white/70 font-semibold mt-0.5">{t('childrenCount')}</Text>
            </View>
            <View className="w-px h-9 bg-white/20" />
            <View className="flex-1 items-center">
              <Text className="text-[26px] font-extrabold text-white">100%</Text>
              <Text className="text-[11px] text-white/70 font-semibold mt-0.5">{t('complete')}</Text>
            </View>
            <View className="w-px h-9 bg-white/20" />
            <View className="flex-1 items-center">
              <Text className="text-[26px] font-extrabold text-white">0</Text>
              <Text className="text-[11px] text-white/70 font-semibold mt-0.5">{t('dueSoon')}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity className="flex-1 items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm shadow-slate-200" onPress={() => router.push('/(tabs)/book')}>
            <View className="w-12 h-12 rounded-xl justify-center items-center mb-2 bg-emerald-50">
              <Calendar size={22} color="#059669" />
            </View>
            <Text className="text-xs font-semibold text-slate-900 text-center">Book Slot</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm shadow-slate-200" onPress={() => router.push('/(tabs)/timeline')}>
            <View className="w-12 h-12 rounded-xl justify-center items-center mb-2 bg-blue-50">
              <Activity size={22} color="#3B82F6" />
            </View>
            <Text className="text-xs font-semibold text-slate-900 text-center">Timeline</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm shadow-slate-200" onPress={() => router.push('/sync')}>
            <View className="w-12 h-12 rounded-xl justify-center items-center mb-2 bg-amber-50">
              <CheckCircle2 size={22} color="#F59E0B" />
            </View>
            <Text className="text-xs font-semibold text-slate-900 text-center">Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm shadow-slate-200" onPress={() => router.push('/(tabs)/profile')}>
            <View className="w-12 h-12 rounded-xl justify-center items-center mb-2 bg-red-50">
              <ShieldCheck size={22} color="#EF4444" />
            </View>
            <Text className="text-xs font-semibold text-slate-900 text-center">Records</Text>
          </TouchableOpacity>
        </View>

        {/* My Children Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-900">My Children</Text>
          </View>
          
          {children.length === 0 ? (
            <View className="p-10 items-center bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
              <Text className="text-slate-500 text-sm">{t('noChildren')}</Text>
            </View>
          ) : (
            children.map((child) => (
              <TouchableOpacity 
                key={child.id} 
                className="flex-row items-center bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100"
                onPress={() => router.push({ pathname: '/(tabs)/profile', params: { childId: child.childId } })}
              >
                <View className="w-12 h-12 rounded-full bg-emerald-50 justify-center items-center mr-4">
                  <Baby size={24} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">{child.name}</Text>
                  <Text className="text-xs text-slate-500 mt-0.5">ID: {child.childId}</Text>
                </View>
                <ChevronRight size={20} color="#A1A1AA" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* AI Banner */}
        <TouchableOpacity className="bg-slate-900 rounded-[32px] p-6 flex-row items-center justify-between overflow-hidden relative mb-10">
          <View>
            <Text className="text-white text-base font-bold mb-1">{t('aiInsight')}</Text>
            <Text className="text-white/70 text-[13px] max-w-[65%]">
              {children.length > 0 
                ? `${children[0].name} is caught up! Tap to see full report.`
                : 'Register your children to get AI-powered insights.'}
            </Text>
          </View>
          <ArrowRight size={20} color="#FFFFFF" />
          <View className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-primary/20" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
