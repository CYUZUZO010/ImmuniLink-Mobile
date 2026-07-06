import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, WifiOff, RefreshCw, FileText, CheckCircle2, XCircle, Clock, Info, ChevronRight, Wifi } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

const pendingRecords = [
  { id: '1', name: 'Liam Nshuti', type: 'Polio Oral (OPV2)', time: '09:30 AM', status: 'pending' }
];

export default function SyncManagerScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [recordsCount, setRecordsCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    setIsSyncing(true);
    try {
      const { count, error } = await supabase
        .from('VaccinationRecord')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setRecordsCount(count || 0);
      setIsOffline(false);
    } catch (err) {
      console.log('Offline or error:', err);
      setIsOffline(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 ml-2">Sync Manager</Text>
        <View className={`flex-row items-center px-3 py-1 rounded-full border ${isOffline ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
           {isOffline ? <WifiOff size={14} color="#F59E0B" /> : <Wifi size={14} color="#10B981" />}
           <Text className={`text-xs font-bold ml-1 ${isOffline ? 'text-amber-500' : 'text-emerald-500'}`}>{isOffline ? 'Offline' : 'Online'}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-slate-900 rounded-[32px] p-6 mb-6 shadow-lg shadow-slate-900/20">
          <View className="flex-row justify-between items-center mb-10">
             <View className="flex-1">
                <Text className="text-xs font-bold text-white/50 tracking-widest mb-1 uppercase">Cloud Sync</Text>
                <Text className="text-[28px] font-bold text-white">{isOffline ? 'Disconnected' : 'Connected'}</Text>
             </View>
             <View className="w-16 h-16 rounded-full border-4 border-white/10 justify-center items-center">
                <Text className="text-sm font-bold text-white/50">{isOffline ? '0%' : '100%'}</Text>
             </View>
          </View>

          <View className="flex-row mb-10 gap-10">
            <StatBox label={recordsCount.toString().padStart(2, '0')} sublabel="TOTAL RECORDS" />
            <StatBox label="00" sublabel="PENDING" color="#F59E0B" />
            <StatBox label="00" sublabel="FAILED" color="#EF4444" />
          </View>

          <View className="flex-row items-center border-t border-white/10 pt-4">
             <RefreshCw size={14} color="rgba(255, 255, 255, 0.4)" />
             <Text className="text-xs text-white/40 ml-1.5">Last check: {new Date().toLocaleTimeString()}</Text>
          </View>
        </View>

        <TouchableOpacity 
          className={`flex-row bg-slate-900 h-14 rounded-xl justify-center items-center mb-4 shadow-md shadow-slate-900/10 ${isSyncing ? 'opacity-70' : ''}`} 
          onPress={fetchSyncStatus}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <RefreshCw size={20} color="#FFFFFF" />
              <Text className="text-white text-base font-bold ml-2">Force Sync</Text>
            </>
          )}
        </TouchableOpacity>

        <Text className="text-xs text-slate-500 text-center leading-5 px-6 mb-8">
          ImmuniLink uses encrypted local storage to secure data until a stable connection is established.
        </Text>

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-900">Pending Records</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-slate-500 font-semibold mr-1">View All</Text>
              <ChevronRight size={16} color="#71717A" />
            </TouchableOpacity>
          </View>

          {pendingRecords.map((record) => (
            <TouchableOpacity key={record.id} className="flex-row items-center bg-white rounded-xl p-4 border border-slate-200 mb-3 shadow-sm shadow-slate-100">
              <View className="w-10 h-10 rounded-lg bg-slate-100 justify-center items-center mr-4">
                <FileText size={20} color="#71717A" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900 mb-0.5">{record.name}</Text>
                <Text className="text-xs text-slate-500">{record.type} • {record.time}</Text>
              </View>
              <StatusBadge status={record.status} />
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8">
          <Info size={20} color="#71717A" className="mr-4" />
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-slate-900 mb-1">Connection Tip</Text>
            <Text className="text-[13px] text-slate-500 leading-5">
              If syncing fails, try moving to an area with better 4G coverage or connect to the clinic's satellite Wi-Fi.
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between py-4 border-t border-slate-100">
           <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-1.5 bg-red-500" />
              <Text className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Local Storage: 12.4 MB</Text>
           </View>
           <View className="flex-row items-center">
              <WifiOff size={14} color="#71717A" />
              <Text className="text-[10px] font-bold text-slate-500 tracking-wider uppercase ml-1.5">Weak Signal</Text>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, sublabel, color = '#FFFFFF' }: any) {
  return (
    <View className="flex-1">
      <Text className="text-[32px] font-bold mb-0.5" style={{ color }}>{label}</Text>
      <Text className="text-[10px] font-bold text-white/50 tracking-wider uppercase">{sublabel}</Text>
    </View>
  );
}

function StatusBadge({ status }: any) {
  const configs: any = {
    pending: { color: '#F59E0B', bg: '#FFFBEB', icon: Clock, text: 'Pending' },
    failed: { color: '#EF4444', bg: '#FEF2F2', icon: XCircle, text: 'Failed' },
    synced: { color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2, text: 'Synced' },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <View className="flex-row items-center px-3 py-1 rounded-full" style={{ backgroundColor: config.bg }}>
      <Icon size={12} color={config.color} />
      <Text className="text-xs font-bold ml-1" style={{ color: config.color }}>{config.text}</Text>
    </View>
  );
}
