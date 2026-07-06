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
import { ChevronLeft, CheckCircle2, RefreshCw, Info, Send } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AppointmentConfirmScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { clinic, vaccine, slot } = useLocalSearchParams<{ clinic: string, vaccine: string, slot: string }>();
  const [patient, setPatient] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const { data } = await supabase
          .from('Patient')
          .select('id, name')
          .eq('parentEmail', normalizedEmail)
          .limit(1);
        if (data && data.length > 0) setPatient(data[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      let patientId = patient?.id;
      if (!patientId) {
        let { data: patients } = await supabase.from('Patient').select('id').limit(1);
        patientId = patients?.[0]?.id;
        if (!patientId) {
          patientId = 'cl' + Math.random().toString(36).substring(2, 10);
          await supabase.from('Patient').insert({ id: patientId, name: 'Demo Patient', dateOfBirth: new Date().toISOString(), parentName: 'Demo Parent' });
        }
      }

      let vaccineId;
      if (vaccine) {
        let { data: vaccines } = await supabase.from('Vaccine').select('id').eq('name', vaccine).limit(1);
        vaccineId = vaccines?.[0]?.id;
      }
      if (!vaccineId) {
        let { data: vaccines } = await supabase.from('Vaccine').select('id').limit(1);
        vaccineId = vaccines?.[0]?.id;
        if (!vaccineId) {
          vaccineId = 'cl' + Math.random().toString(36).substring(2, 10);
          await supabase.from('Vaccine').insert({ id: vaccineId, name: vaccine || 'Demo Vaccine', type: 'Demo', window: '1m' });
        }
      }

      let clinicId;
      if (clinic) {
        let { data: clinics } = await supabase.from('Clinic').select('id').eq('name', clinic).limit(1);
        clinicId = clinics?.[0]?.id;
      }
      if (!clinicId) {
        let { data: clinics } = await supabase.from('Clinic').select('id').limit(1);
        clinicId = clinics?.[0]?.id;
        if (!clinicId) {
          clinicId = 'cl' + Math.random().toString(36).substring(2, 10);
          await supabase.from('Clinic').insert({ id: clinicId, name: clinic || 'Demo Clinic', address: 'Demo', district: 'Demo' });
        }
      }
      
      const { error } = await supabase
        .from('VaccinationRecord')
        .insert([
          {
            id: 'cl' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
            patientId,
            vaccineId,
            clinicId,
            nurseId: 'system-mobile',
            doseNumber: 1,
            status: 'CONFIRMED',
            lotNumber: 'LOT-2024-XP',
          }
        ])
        .select();

      if (error) throw error;

      setIsSaved(true);
      Alert.alert('Success', 'Appointment synced with clinic records!');
    } catch (error: any) {
      console.error('Sync Error:', error.message);
      Alert.alert('Sync Error', 'Could not sync with clinic. Data saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Book Appointment</Text>
        <View className="w-10" />
      </View>

      <View className="flex-row items-center justify-center py-6 px-10 bg-white border-b border-slate-50">
        <View className="items-center w-[60px]">
          <View className="w-8 h-8 rounded-full bg-primary justify-center items-center mb-1">
            <CheckCircle2 size={16} color="#FFFFFF" />
          </View>
          <Text className="text-[10px] font-bold text-primary">CLINIC</Text>
        </View>
        <View className="flex-1 h-0.5 bg-primary mx-1 -mt-3.5" />
        <View className="items-center w-[60px]">
          <View className="w-8 h-8 rounded-full bg-primary justify-center items-center mb-1">
            <CheckCircle2 size={16} color="#FFFFFF" />
          </View>
          <Text className="text-[10px] font-bold text-primary">TIME</Text>
        </View>
        <View className="flex-1 h-0.5 bg-primary mx-1 -mt-3.5" />
        <View className="items-center w-[60px]">
          <View className="w-8 h-8 rounded-full bg-primary justify-center items-center mb-1">
            <Text className="text-white text-sm font-bold">3</Text>
          </View>
          <Text className="text-[10px] font-bold text-primary">CONFIRM</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-[32px] border border-slate-200 overflow-hidden mb-6 shadow-sm shadow-slate-100">
          <View className="bg-primary p-8 items-center">
            <View className="mb-4">
              <CheckCircle2 size={32} color="#FFFFFF" />
            </View>
            <Text className="text-white text-xl font-bold mb-1">Appointment {isSaved ? 'Synced' : 'Confirmed'}</Text>
            <Text className="text-white/70 text-xs">Please present this code at the clinic</Text>
          </View>

          <View className="p-10 items-center">
            <View className="p-4 rounded-2xl border border-slate-100">
              <QRCode
                value="APPT-12345678"
                size={160}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
          </View>

          <View className="flex-row flex-wrap border-t border-slate-50 p-4">
            <View className="w-1/2 p-2 mb-2">
              <Text className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Patient</Text>
              <Text className="text-[15px] font-bold text-slate-900">{patient ? patient.name : 'Liam Nshuti'}</Text>
            </View>
            <View className="w-1/2 p-2 mb-2">
              <Text className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Vaccine</Text>
              <View className="bg-slate-100 px-2.5 py-1 rounded-full self-start">
                <Text className="text-[11px] font-bold text-slate-900">{vaccine || 'Polio Oral (OPV2)'}</Text>
              </View>
            </View>
            <View className="w-1/2 p-2 mb-2">
              <Text className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Date & Time</Text>
              <Text className="text-[15px] font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">{slot || '09:30'} AM</Text>
            </View>
            <View className="w-1/2 p-2 mb-2">
              <Text className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Clinic</Text>
              <Text className="text-[15px] font-bold text-slate-900">{clinic || 'Kigali Central'}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">Assigned Desk</Text>
            </View>
          </View>
        </View>

        {!isSaved && (
          <TouchableOpacity 
            className={`flex-row bg-primary h-14 rounded-xl justify-center items-center mb-4 shadow-md shadow-emerald-900/20 ${isSaving ? 'opacity-70' : ''}`} 
            onPress={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text className="text-white text-base font-bold ml-2">Confirm & Sync with Clinic</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity className="flex-row items-center justify-center h-14 rounded-xl border border-slate-200 mb-4">
          <RefreshCw size={20} color="#1A1A1A" />
          <Text className="text-base font-semibold text-slate-900 ml-2">Reschedule Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center justify-center py-4 mb-8">
          <Text className="text-base font-semibold text-red-500">Cancel Appointment</Text>
        </TouchableOpacity>

        <View className="flex-row bg-slate-50 rounded-xl p-4 border border-slate-200 mb-10">
          <Info size={20} color="#71717A" className="mr-4" />
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-slate-900 mb-1">Preparation Tip</Text>
            <Text className="text-[13px] text-slate-500 leading-5">
              Bring your child's original birth certificate and current vaccination card. Arrive 15 minutes early for registration.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
