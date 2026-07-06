import React, { useState } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react-native';

const children = ['All', 'Ethan', 'Amira'];

const records = [
  {
    id: '1', child: 'Ethan', vaccine: 'BCG', dose: 'Single Dose',
    date: 'Apr 12, 2026', clinic: 'Kigali Central', status: 'done', age: 'At Birth',
  },
  {
    id: '2', child: 'Ethan', vaccine: 'OPV 0', dose: 'Dose 0',
    date: 'Apr 12, 2026', clinic: 'Kigali Central', status: 'done', age: 'At Birth',
  },
  {
    id: '3', child: 'Ethan', vaccine: 'Pentavalent 1', dose: 'Dose 1',
    date: 'May 24, 2026', clinic: 'Kimironko Clinic', status: 'upcoming', age: '6 Weeks',
  },
  {
    id: '4', child: 'Ethan', vaccine: 'MMR', dose: 'Dose 1',
    date: 'Jul 10, 2026', clinic: 'Pending Booking', status: 'upcoming', age: '9 Months',
  },
  {
    id: '5', child: 'Amira', vaccine: 'BCG', dose: 'Single Dose',
    date: 'Jan 5, 2026', clinic: 'Gasabo Health', status: 'done', age: 'At Birth',
  },
  {
    id: '6', child: 'Amira', vaccine: 'Pentavalent 2', dose: 'Dose 2',
    date: 'Jun 2, 2026', clinic: 'Gasabo Health', status: 'upcoming', age: '10 Weeks',
  },
  {
    id: '7', child: 'Ethan', vaccine: 'OPV 1', dose: 'Dose 1',
    date: 'Apr 30, 2026', clinic: 'Kigali Central', status: 'missed', age: '6 Weeks',
  },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  done: { color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2, label: 'Completed' },
  upcoming: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: Clock, label: 'Upcoming' },
  missed: { color: '#EF4444', bg: '#FEF2F2', icon: XCircle, label: 'Missed' },
};

export default function TimelineScreen() {
  const [activeChild, setActiveChild] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  const filtered = records.filter(r => {
    const childMatch = activeChild === 'All' || r.child === activeChild;
    const statusMatch = activeStatus === 'All' || r.status === activeStatus.toLowerCase();
    return childMatch && statusMatch;
  });

  const done = records.filter(r => r.status === 'done').length;
  const upcoming = records.filter(r => r.status === 'upcoming').length;
  const missed = records.filter(r => r.status === 'missed').length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50">
        <View className="w-7 h-7 rounded-lg bg-primary justify-center items-center mr-3">
          <ShieldCheck size={16} color="#FFFFFF" />
        </View>
        <Text className="text-lg font-extrabold text-slate-900">Vaccination Timeline</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View className="flex-row px-6 pt-6 gap-3 mb-4">
          <TouchableOpacity
            className={`flex-1 bg-slate-50 rounded-2xl p-2 items-center border-2 ${activeStatus === 'All' ? 'border-slate-900' : 'border-transparent'}`}
            onPress={() => setActiveStatus('All')}
          >
            <Text className="text-[22px] font-extrabold text-slate-900 mb-0.5">{records.length}</Text>
            <Text className="text-[11px] text-slate-500 font-semibold">Total</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 bg-slate-50 rounded-2xl p-2 items-center border-2 ${activeStatus === 'Done' ? 'border-emerald-500' : 'border-transparent'}`}
            onPress={() => setActiveStatus('Done')}
          >
            <Text className="text-[22px] font-extrabold text-emerald-500 mb-0.5">{done}</Text>
            <Text className="text-[11px] text-slate-500 font-semibold">Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 bg-slate-50 rounded-2xl p-2 items-center border-2 ${activeStatus === 'Upcoming' ? 'border-primary' : 'border-transparent'}`}
            onPress={() => setActiveStatus('Upcoming')}
          >
            <Text className="text-[22px] font-extrabold text-primary mb-0.5">{upcoming}</Text>
            <Text className="text-[11px] text-slate-500 font-semibold">Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 bg-slate-50 rounded-2xl p-2 items-center border-2 ${activeStatus === 'Missed' ? 'border-red-500' : 'border-transparent'}`}
            onPress={() => setActiveStatus('Missed')}
          >
            <Text className="text-[22px] font-extrabold text-red-500 mb-0.5">{missed}</Text>
            <Text className="text-[11px] text-slate-500 font-semibold">Missed</Text>
          </TouchableOpacity>
        </View>

        {/* Child filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-6 pb-4 gap-2">
          {children.map(c => (
            <TouchableOpacity
              key={c}
              className={`px-4 py-2 rounded-full border ${activeChild === c ? 'bg-primary border-primary' : 'bg-slate-100 border-transparent'}`}
              onPress={() => setActiveChild(c)}
            >
              <Text className={`text-sm font-semibold ${activeChild === c ? 'text-white' : 'text-slate-500'}`}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timeline list */}
        <View className="px-6">
          {filtered.map((r, i) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            const isLast = i === filtered.length - 1;
            return (
              <View key={r.id} className="flex-row">
                {/* Line + dot */}
                <View className="items-center mr-3 pt-1">
                  <View className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: cfg.color }} />
                  {!isLast && <View className="w-0.5 flex-1 bg-slate-200 mb-1" />}
                </View>

                {/* Card */}
                <View className={`flex-1 bg-white rounded-2xl p-4 border border-slate-200 mb-4 shadow-sm shadow-slate-100 ${isLast ? 'mb-20' : ''}`}>
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg }}>
                      <Icon size={12} color={cfg.color} />
                      <Text className="text-[11px] font-bold ml-1" style={{ color: cfg.color }}>{cfg.label}</Text>
                    </View>
                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{r.age}</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-900 mb-0.5">{r.vaccine}</Text>
                  <Text className="text-[13px] text-slate-500 mb-2">{r.dose} · {r.child}</Text>
                  <View className="flex-row justify-between">
                    <Text className="text-xs font-bold text-primary">{r.date}</Text>
                    <Text className="text-xs text-slate-400">{r.clinic}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {filtered.length === 0 && (
            <View className="items-center py-20">
              <Text className="text-slate-400 text-[15px]">No records for this filter.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
