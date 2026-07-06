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
import {
  Mail, Lock, Eye, EyeOff, User, Phone, Calendar,
  ShieldCheck, ChevronLeft, Plus, Trash2, ArrowRight,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';

interface Child {
  name: string;
  dateOfBirth: string;
  gender: string;
}

export default function SignupScreen() {
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPicker, setShowPicker] = useState<{ show: boolean, index: number }>({ show: false, index: 0 });

  const [children, setChildren] = useState<Child[]>([
    { name: '', dateOfBirth: '', gender: 'Male' },
  ]);

  const addChild = () => {
    setChildren([...children, { name: '', dateOfBirth: '', gender: 'Male' }]);
  };

  const removeChild = (index: number) => {
    if (children.length === 1) return;
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleNextStep = () => {
    if (!parentName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in your name, email, and password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match.');
      return;
    }
    setStep(2);
  };

  const generateChildId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleSignup = async () => {
    const validChildren = children.filter(c => c.name && c.dateOfBirth);
    if (validChildren.length === 0) {
      Alert.alert('No Child Info', 'Please add at least one child with a name and date of birth.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setIsLoading(true);
    try {
      // 1. Sign Up the User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { name: parentName, phone, role: 'PARENT' } },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;

      // 2. Prepare Child Inserts
      const childInserts = validChildren.map(child => ({
        id: `c${Math.random().toString(36).substring(2, 15)}`,
        childId: generateChildId(),
        name: child.name,
        dateOfBirth: new Date(child.dateOfBirth).toISOString(),
        gender: child.gender,
        parentName,
        parentEmail: normalizedEmail,
        address: '',
      }));

      // 3. Parallelize Data Inserts for maximum speed
      const [userResult, childResult] = await Promise.all([
        supabase.from('User').upsert({
          id: userId,
          email: normalizedEmail,
          name: parentName,
          phone,
          role: 'PARENT',
          password: 'EXTERNAL_AUTH',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        supabase.from('Patient').insert(childInserts).select('childId, name')
      ]);

      if (userResult.error) throw userResult.error;
      if (childResult.error) throw childResult.error;

      // 4. Fast feedback and navigation
      const idList = childResult.data
        ?.map((c: any) => `• ${c.name}: ${c.childId}`)
        .join('\n');

      Alert.alert(
        '🎉 Registration Successful!',
        `Your children have been registered.\n\nIDs:\n${idList}\n\nWe've sent a 6-digit code to ${email}.`,
        [{ text: 'Verify Now', onPress: () => router.push({ pathname: '/(auth)/verify', params: { email } }) }]
      );
    } catch (err: any) {
      const isOfflineError = err.message?.includes('fetch') || err.message?.includes('network');
      Alert.alert(
        isOfflineError ? 'Connection Issue' : 'Registration Failed',
        isOfflineError 
          ? 'It looks like you are offline. ImmuniLink will securely save your data locally, but you need a connection to create an account and verify your email.' 
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView 
          contentContainerClassName="flex-grow pb-12" 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 w-full max-w-[500px] self-center">

          {/* Back Button */}
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-slate-100 justify-center items-center mb-8"
            onPress={() => (step === 2 ? setStep(1) : router.back())}
          >
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-6 relative">
            {/* Decorative Background Blob */}
            <View className="absolute w-64 h-64 rounded-full bg-emerald-50 -top-16 -right-16" />
            
            <View className="w-16 h-16 rounded-2xl bg-primary justify-center items-center mb-4 shadow-lg shadow-emerald-900/30 z-10">
              <ShieldCheck size={32} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 mb-2 text-center">
              {step === 1 ? 'Create Account' : 'Add Your Children'}
            </Text>
            <Text className="text-[15px] text-slate-500 leading-5 text-center px-4 max-w-[320px]">
              {step === 1
                ? 'Register as a parent to track your children\'s vaccination records.'
                : 'Enter your children\'s details. Each child will receive a unique ID.'}
            </Text>
          </View>

          {/* Step indicator */}
          <View className="flex-row items-center mb-8">
            <View className={`w-8 h-8 rounded-full border-2 justify-center items-center ${step >= 1 ? 'border-primary bg-primary' : 'border-slate-200 bg-white'}`}>
              <Text className={`text-sm font-bold ${step >= 1 ? 'text-white' : 'text-slate-400'}`}>1</Text>
            </View>
            <View className={`flex-1 h-0.5 mx-1.5 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
            <View className={`w-8 h-8 rounded-full border-2 justify-center items-center ${step >= 2 ? 'border-primary bg-primary' : 'border-slate-200 bg-white'}`}>
              <Text className={`text-sm font-bold ${step >= 2 ? 'text-white' : 'text-slate-400'}`}>2</Text>
            </View>
          </View>

          {step === 1 ? (
            /* ─── STEP 1: Parent Info ─── */
            <View className="mb-8">
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-900 mb-1.5">Full Name</Text>
                <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                  <User size={18} color="#71717A" className="mr-3" />
                  <TextInput
                    className="flex-1 text-[15px] text-slate-900"
                    value={parentName}
                    onChangeText={setParentName}
                    placeholder="Your full name"
                    placeholderTextColor="#A1A1AA"
                    autoComplete="name"
                    textContentType="name"
                  />
                </View>
              </View>

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
                <Text className="text-sm font-semibold text-slate-900 mb-1.5">Phone Number</Text>
                <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                  <Phone size={18} color="#71717A" className="mr-3" />
                  <TextInput
                    className="flex-1 text-[15px] text-slate-900"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+250 7XX XXX XXX"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-900 mb-1.5">Password</Text>
                <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                  <Lock size={18} color="#71717A" className="mr-3" />
                  <TextInput
                    className="flex-1 text-[15px] text-slate-900"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
                    textContentType="password" 
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} color="#71717A" /> : <Eye size={18} color="#71717A" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-900 mb-1.5">Confirm Password</Text>
                <View className="flex-row items-center bg-slate-50 rounded-xl border-2 border-slate-200 px-4 h-14">
                  <Lock size={18} color="#71717A" className="mr-3" />
                  <TextInput
                    className="flex-1 text-[15px] text-slate-900"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              <TouchableOpacity className="flex-row h-14 rounded-xl bg-primary justify-center items-center mt-4 shadow-md shadow-emerald-900/20" onPress={handleNextStep}>
                <Text className="text-white text-base font-bold mr-2">Next: Add Children</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            /* ─── STEP 2: Children Info ─── */
            <View className="mb-8">
              {children.map((child, index) => (
                <View key={index} className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base font-bold text-primary">Child {index + 1}</Text>
                    {children.length > 1 && (
                      <TouchableOpacity onPress={() => removeChild(index)} className="w-8 h-8 rounded-full bg-red-50 justify-center items-center">
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-slate-900 mb-1.5">Child's Full Name</Text>
                    <View className="flex-row items-center bg-white rounded-xl border-2 border-slate-200 px-4 h-14">
                      <User size={18} color="#71717A" className="mr-3" />
                      <TextInput
                        className="flex-1 text-[15px] text-slate-900"
                        value={child.name}
                        onChangeText={v => updateChild(index, 'name', v)}
                        placeholder="Child's name"
                        placeholderTextColor="#A1A1AA"
                      />
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-slate-900 mb-1.5">Date of Birth</Text>
                    <TouchableOpacity 
                      className="flex-row items-center bg-white rounded-xl border-2 border-slate-200 px-4 h-14"
                      onPress={() => setShowPicker({ show: true, index })}
                    >
                      <Calendar size={18} color="#71717A" className="mr-3" />
                      <Text className={`flex-1 text-[15px] ${child.dateOfBirth ? 'text-slate-900' : 'text-slate-400'}`}>
                        {child.dateOfBirth || 'Select date'}
                      </Text>
                    </TouchableOpacity>

                    {showPicker.show && showPicker.index === index && (
                      <DateTimePicker
                        value={child.dateOfBirth ? new Date(child.dateOfBirth) : new Date()}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowPicker({ ...showPicker, show: false });
                          if (selectedDate) {
                            updateChild(index, 'dateOfBirth', selectedDate.toISOString().split('T')[0]);
                          }
                        }}
                      />
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-slate-900 mb-1.5">Gender</Text>
                    <View className="flex-row gap-3">
                      {['Male', 'Female'].map(g => (
                        <TouchableOpacity
                          key={g}
                          className={`flex-1 h-11 rounded-lg border-2 justify-center items-center ${child.gender === g ? 'border-primary bg-emerald-50' : 'border-slate-200 bg-white'}`}
                          onPress={() => updateChild(index, 'gender', g)}
                        >
                          <Text className={`text-sm font-semibold ${child.gender === g ? 'text-primary' : 'text-slate-500'}`}>
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity className="flex-row items-center justify-center h-12 rounded-xl border-2 border-primary border-dashed mb-6" onPress={addChild}>
                <Plus size={18} color="#059669" />
                <Text className="text-primary font-semibold text-[15px] ml-1.5">Add Another Child</Text>
              </TouchableOpacity>

              <View className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-4">
                <Text className="text-emerald-700 text-[13px] leading-5">
                  💡 Each child will get a unique ID after registration. Save these IDs — you'll need them to look up records on future visits.
                </Text>
              </View>

              <TouchableOpacity
                className={`flex-row h-14 rounded-xl bg-primary justify-center items-center mt-4 shadow-md shadow-emerald-900/20 ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <>
                      <Text className="text-white text-base font-bold mr-2">Complete Registration</Text>
                      <ArrowRight size={20} color="#FFFFFF" />
                    </>
                }
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity className="items-center py-6" onPress={() => router.push('/(auth)/login')}>
            <Text className="text-sm text-slate-500">
              Already have an account? <Text className="text-primary font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
