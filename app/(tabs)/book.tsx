import React, { useState } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ShieldCheck, MapPin, Clock,
  ChevronRight, CheckCircle2, Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const clinics = [
  {
    id: '1', name: 'Kigali Central Hospital',
    district: 'Nyarugenge', rating: 4.9, slots: 12,
    nextSlot: 'Today, 09:00 AM', distance: '1.2 km',
  },
  {
    id: '2', name: 'Kimironko Health Center',
    district: 'Gasabo', rating: 4.7, slots: 8,
    nextSlot: 'Today, 11:30 AM', distance: '3.4 km',
  },
  {
    id: '3', name: 'Remera District Hospital',
    district: 'Gasabo', rating: 4.6, slots: 5,
    nextSlot: 'Tomorrow, 08:00 AM', distance: '4.1 km',
  },
  {
    id: '4', name: 'Masaka Health Center',
    district: 'Kicukiro', rating: 4.5, slots: 15,
    nextSlot: 'Tomorrow, 10:00 AM', distance: '6.8 km',
  },
];

const vaccines = ['BCG', 'OPV 1', 'Pentavalent 2', 'MMR Booster', 'OPV-4'];

const timeSlots = ['08:00', '09:00', '09:30', '10:00', '11:00', '11:30', '14:00', '15:00'];

export default function BookScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slotWidth = (width - 48 - 30) / 4;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50">
        <View className="w-7 h-7 rounded-lg bg-primary justify-center items-center mr-3">
          <ShieldCheck size={16} color="#FFFFFF" />
        </View>
        <Text className="text-lg font-extrabold text-slate-900">Book Appointment</Text>
      </View>

      {/* Step bar */}
      <View className="flex-row items-center px-8 py-4 border-b border-slate-50">
        {[1, 2, 3].map((s) => (
          <View key={s} className="flex-row items-center flex-1">
            <View className={`w-7 h-7 rounded-full border-2 justify-center items-center ${step >= s ? 'bg-primary border-primary' : 'border-slate-200 bg-white'}`}>
              {step > s
                ? <CheckCircle2 size={14} color="#FFFFFF" />
                : <Text className={`text-xs font-bold ${step >= s ? 'text-white' : 'text-slate-400'}`}>{s}</Text>
              }
            </View>
            <Text className={`text-[11px] font-semibold ml-1 ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
              {s === 1 ? 'Clinic' : s === 2 ? 'Vaccine' : 'Time'}
            </Text>
            {s < 3 && <View className={`flex-1 h-0.5 mx-1.5 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerClassName="p-6 pb-32" showsVerticalScrollIndicator={false}>

        {/* ── STEP 1: Choose Clinic ── */}
        {step === 1 && (
          <View>
            <Text className="text-xl font-extrabold text-slate-900 mb-1">Select a Clinic</Text>
            <Text className="text-sm text-slate-500 mb-6">Nearest ImmuniLink-certified clinics</Text>
            {clinics.map(clinic => (
              <TouchableOpacity
                key={clinic.id}
                className={`rounded-2xl p-4 border-2 mb-4 ${selectedClinic === clinic.id ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}
                onPress={() => setSelectedClinic(clinic.id)}
              >
                <View className="flex-row items-center mb-3">
                  <View className={`w-10 h-10 rounded-xl justify-center items-center mr-3 ${selectedClinic === clinic.id ? 'bg-white/20' : 'bg-emerald-50'}`}>
                    <MapPin size={18} color={selectedClinic === clinic.id ? '#FFFFFF' : '#059669'} />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-[15px] font-bold mb-0.5 ${selectedClinic === clinic.id ? 'text-white' : 'text-slate-900'}`}>
                      {clinic.name}
                    </Text>
                    <Text className={`text-xs ${selectedClinic === clinic.id ? 'text-white/70' : 'text-slate-500'}`}>
                      {clinic.district} · {clinic.distance}
                    </Text>
                  </View>
                  {selectedClinic === clinic.id && <CheckCircle2 size={20} color="#FFFFFF" />}
                </View>
                <View className={`flex-row justify-between border-t pt-3 ${selectedClinic === clinic.id ? 'border-white/10' : 'border-slate-100'}`}>
                  <View className="flex-row items-center gap-1.5">
                    <Clock size={12} color={selectedClinic === clinic.id ? 'rgba(255,255,255,0.7)' : '#71717A'} />
                    <Text className={`text-xs font-medium ${selectedClinic === clinic.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {clinic.nextSlot}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Star size={12} color="#F59E0B" />
                    <Text className={`text-xs font-medium ${selectedClinic === clinic.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {clinic.rating} · {clinic.slots} slots left
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── STEP 2: Choose Vaccine ── */}
        {step === 2 && (
          <View>
            <Text className="text-xl font-extrabold text-slate-900 mb-1">Select Vaccine</Text>
            <Text className="text-sm text-slate-500 mb-6">Choose the vaccine for this visit</Text>
            {vaccines.map(v => (
              <TouchableOpacity
                key={v}
                className={`flex-row items-center p-4 rounded-xl border-2 mb-3 bg-white ${selectedVaccine === v ? 'border-primary bg-emerald-50' : 'border-slate-200'}`}
                onPress={() => setSelectedVaccine(v)}
              >
                <View className={`w-9 h-9 rounded-lg justify-center items-center mr-4 ${selectedVaccine === v ? 'bg-primary' : 'bg-emerald-50'}`}>
                  <ShieldCheck size={18} color={selectedVaccine === v ? '#FFFFFF' : '#059669'} />
                </View>
                <Text className={`flex-1 text-[15px] font-semibold ${selectedVaccine === v ? 'text-primary' : 'text-slate-900'}`}>
                  {v}
                </Text>
                {selectedVaccine === v && <CheckCircle2 size={18} color="#059669" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── STEP 3: Choose Time Slot ── */}
        {step === 3 && (
          <View>
            <Text className="text-xl font-extrabold text-slate-900 mb-1">Select Time Slot</Text>
            <Text className="text-sm text-slate-500 mb-6">Available slots for today</Text>
            <View className="flex-row flex-wrap gap-2.5 mb-8">
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={{ width: slotWidth }}
                  className={`flex-row items-center rounded-lg border-2 justify-center gap-1 py-2.5 ${selectedSlot === slot ? 'bg-primary border-primary' : 'border-slate-200'}`}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Clock size={14} color={selectedSlot === slot ? '#FFFFFF' : '#71717A'} />
                  <Text className={`text-xs font-semibold ${selectedSlot === slot ? 'text-white' : 'text-slate-500'}`}>{slot} AM</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary card */}
            {selectedSlot && (
              <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <Text className="text-[15px] font-bold text-slate-900 mb-3">Appointment Summary</Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <MapPin size={14} color="#059669" />
                  <Text className="text-sm text-slate-900 font-medium">
                    {clinics.find(c => c.id === selectedClinic)?.name}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 mb-2">
                  <ShieldCheck size={14} color="#059669" />
                  <Text className="text-sm text-slate-900 font-medium">{selectedVaccine}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={14} color="#059669" />
                  <Text className="text-sm text-slate-900 font-medium">Today at {selectedSlot} AM</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 p-6 bg-white border-t border-slate-50">
        {step > 1 && (
          <TouchableOpacity className="h-14 px-6 rounded-xl border-2 border-slate-200 justify-center items-center" onPress={() => setStep((step - 1) as any)}>
            <Text className="text-[15px] font-semibold text-slate-900">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`flex-1 h-14 rounded-xl bg-primary flex-row justify-center items-center shadow-md shadow-emerald-900/20 ${((step === 1 && !selectedClinic) || (step === 2 && !selectedVaccine) || (step === 3 && !selectedSlot)) ? 'opacity-40' : ''}`}
          onPress={() => {
            if (step < 3) setStep((step + 1) as any);
            else {
              const clinicName = clinics.find(c => c.id === selectedClinic)?.name;
              router.push({
                pathname: '/book/confirm',
                params: {
                  clinic: clinicName,
                  vaccine: selectedVaccine,
                  slot: selectedSlot
                }
              });
            }
          }}
          disabled={
            (step === 1 && !selectedClinic) ||
            (step === 2 && !selectedVaccine) ||
            (step === 3 && !selectedSlot)
          }
        >
          <Text className="text-white text-[15px] font-bold mr-1">
            {step === 3 ? 'Confirm Appointment' : 'Continue'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
