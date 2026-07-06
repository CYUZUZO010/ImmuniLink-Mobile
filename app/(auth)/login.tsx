import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        Alert.alert(
          '📧 Email Not Confirmed',
          'Please verify your account with the 6-digit code sent to your email.',
          [
            { text: 'Verify Now', onPress: () => router.push({ pathname: '/(auth)/verify', params: { email } }) },
            { text: 'Resend Code', onPress: async () => {
              await supabase.auth.resend({ type: 'signup', email });
              Alert.alert('Sent!', 'A new verification code has been sent to ' + email);
            }},
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Login Failed', err.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerClassName="p-6 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 justify-center items-center mb-8" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Logo & Title */}
          <View className="items-center mb-8 relative">
            {/* Decorative Background Blob */}
            <View className="absolute w-64 h-64 rounded-full bg-emerald-50 -top-16 -right-16" />
            
            <View className="w-16 h-16 rounded-2xl bg-primary justify-center items-center mb-4 shadow-lg shadow-emerald-900/30 z-10">
              <ShieldCheck size={32} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Welcome Back</Text>
            <Text className="text-base text-slate-500 leading-5 text-center px-4">Sign in to manage your child's immunization records.</Text>
          </View>

          {/* Form */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-900 mb-1.5">Email Address</Text>
              <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                <Mail size={18} color="#71717A" className="mr-3" />
                <TextInput
                  className="flex-1 text-[15px] text-slate-900"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-sm font-semibold text-slate-900">Password</Text>
                <TouchableOpacity>
                  <Text className="text-[13px] text-primary font-semibold">Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                <Lock size={18} color="#71717A" className="mr-3" />
                <TextInput
                  className="flex-1 text-[15px] text-slate-900"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <EyeOff size={18} color="#71717A" />
                    : <Eye size={18} color="#71717A" />
                  }
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`flex-row h-14 rounded-xl bg-primary justify-center items-center mt-2 shadow-md shadow-emerald-900/20 ${isLoading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white text-base font-bold mr-2">Sign In</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="mx-4 text-slate-400 text-[13px] font-medium">New to ImmuniLink?</Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          {/* Signup CTA */}
          <TouchableOpacity className="h-14 rounded-xl border-2 border-primary justify-center items-center mb-8" onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-primary text-base font-bold">Create an Account</Text>
          </TouchableOpacity>

          <Text className="text-xs text-slate-400 text-center leading-5">
            By signing in, you agree to our{' '}
            <Text className="text-primary font-semibold">Privacy Policy</Text>
            {' '}and{' '}
            <Text className="text-primary font-semibold">Terms of Service</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
