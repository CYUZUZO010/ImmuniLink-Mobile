import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ShieldCheck, 
  Download, 
  ChevronRight, 
  Users,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

export default function ProfileScreen() {
  const { childId } = useLocalSearchParams();
  const { t } = useI18n();
  const [child, setChild] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      fetchChildData();
    } else {
      setLoading(false);
    }
  }, [childId]);

  const fetchChildData = async () => {
    setLoading(true);
    try {
      const { data: childData, error: childError } = await supabase
        .from('Patient')
        .select('*')
        .eq('childId', childId)
        .single();
      
      if (childError) throw childError;
      setChild(childData);

      const { data: recordData, error: recordError } = await supabase
        .from('VaccinationRecord')
        .select('*, "Vaccine"(*)')
        .eq('patientId', childData.id);
      
      if (recordError) throw recordError;
      setRecords(recordData);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch child details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!child) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-center text-slate-500 mb-6">
          Select a child from the dashboard to see their vaccination records.
        </Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-xl"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white font-bold">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takenVaccines = records.map(r => (r.Vaccine || r.vaccine)?.name).filter(Boolean);
  const allVaccines = ['BCG', 'OPV 0', 'Pentavalent 1', 'PCV 1', 'Rotavirus 1', 'OPV 1', 'Pentavalent 2', 'PCV 2', 'Rotavirus 2', 'OPV 2', 'Pentavalent 3', 'PCV 3', 'Rotavirus 3', 'OPV 3', 'IPV', 'Measles 1', 'Yellow Fever', 'Measles 2'];
  const nextVaccines = allVaccines.filter(v => !takenVaccines.includes(v)).slice(0, 2);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 justify-center items-center" onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">{t('childId')}: {child.childId}</Text>
        <TouchableOpacity>
          <EyeOff size={24} color="#71717A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full bg-emerald-50 justify-center items-center">
               <Users size={50} color="#059669" />
            </View>
            <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-white justify-center items-center">
               <ShieldCheck size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-1">{child.name}</Text>
          <View className="flex-row items-center">
            <View className="flex-row items-center bg-emerald-50 px-3 py-1 rounded-full">
              <ShieldCheck size={14} color="#10B981" />
              <Text className="text-xs font-bold text-emerald-600 ml-1">{nextVaccines.length === 0 ? 'Fully Protected' : 'Up to Date'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="flex-row bg-primary rounded-xl h-14 justify-center items-center mb-8 shadow-md shadow-emerald-900/20">
          <Download size={20} color="#FFFFFF" />
          <Text className="text-white text-base font-bold ml-2">Download Digital Health Card</Text>
        </TouchableOpacity>

        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{t('takenVaccines')}</Text>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-200">
            {records.length === 0 ? (
               <Text className="p-6 text-center text-slate-400 italic">No vaccines recorded yet.</Text>
            ) : (
              records.map((record, index) => (
                <View key={record.id} className={`flex-row items-center p-4 ${index !== records.length - 1 ? 'border-b border-slate-50' : ''}`}>
                   <View className="mr-4">
                      <CheckCircle2 size={18} color="#10B981" />
                   </View>
                   <View className="flex-1">
                      <Text className="text-[15px] font-bold text-slate-900">{(record.Vaccine || record.vaccine)?.name}</Text>
                      <Text className="text-xs text-emerald-600 font-semibold mt-0.5">{new Date(record.timestamp).toLocaleDateString()}</Text>
                   </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('nextVaccine')}</Text>
          {nextVaccines.length > 0 ? (
            <View className="flex-row bg-white rounded-2xl p-4 mt-2 border border-slate-100 shadow-sm shadow-slate-200">
               <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900 mb-0.5">{nextVaccines[0]}</Text>
                  <View className="flex-row items-center">
                    <Clock size={14} color="#F59E0B" />
                    <Text className="text-[13px] font-semibold text-amber-500 ml-1.5">Scheduled for Next Milestone</Text>
                  </View>
               </View>
               <TouchableOpacity className="bg-primary px-5 py-2.5 rounded-lg justify-center items-center" onPress={() => router.push('/(tabs)/book')}>
                 <Text className="text-white text-sm font-bold">{t('book')}</Text>
               </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
               <Text className="text-emerald-700 text-center font-semibold text-sm">All mandatory vaccines for this age have been completed!</Text>
            </View>
          )}
        </View>

        {/* AI Health Assistant Section */}
        <View className="mt-4 mb-12">
           <View className="flex-row items-center mb-3 gap-2">
              <Sparkles size={20} color="#059669" />
              <Text className="text-[13px] font-black text-primary uppercase tracking-widest">AI Health Assistant</Text>
           </View>
           <View className="bg-slate-900 p-6 rounded-3xl border-l-4 border-primary">
              <Text className="text-white/80 text-sm leading-relaxed">
                Based on {child.name}'s records, the next critical window is for {nextVaccines[0] || 'the next booster'}. 
                I will send you a reminder via <Text className="font-bold text-white">Push Notification</Text> and an <Text className="font-bold text-white">SMS</Text> if you're offline.
              </Text>
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
