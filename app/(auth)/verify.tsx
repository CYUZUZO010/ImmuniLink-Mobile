import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join('');
    if (token.length !== 8) {
      Alert.alert('Invalid Code', 'Please enter the 8-digit code sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email as string,
        token,
        type: 'signup',
      });

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Your email has been verified. You can now sign in.',
        [{ text: 'Sign In', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email as string,
      });
      if (error) throw error;
      Alert.alert('Code Resent', 'A new verification code has been sent to your email.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 justify-center items-center mb-8" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <View className="mb-10">
            <View className="w-16 h-16 rounded-2xl bg-primary justify-center items-center mb-6 shadow-lg shadow-emerald-900/30">
              <ShieldCheck size={32} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 mb-2">Verify Email</Text>
            <Text className="text-[15px] text-slate-500 leading-5">
              We've sent an 8-digit verification code to{'\n'}
              <Text className="text-slate-900 font-bold">{email}</Text>
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between mb-10">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                className={`w-[11%] h-14 rounded-xl bg-slate-50 border-2 text-center text-lg font-bold text-slate-900 ${digit ? 'border-primary bg-emerald-50' : 'border-slate-200'}`}
                value={digit}
                onChangeText={(v) => handleOtpChange(v, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            className={`flex-row h-14 rounded-xl bg-primary justify-center items-center shadow-md shadow-emerald-900/20 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white text-base font-bold mr-2">Verify Account</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-slate-500">Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-sm text-primary font-bold">Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
