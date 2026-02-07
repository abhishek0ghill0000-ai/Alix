// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { CommonButton } from '../components/CommonButton';
import { InputField } from '../components/InputField';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SignupScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    phone?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});

  const { signup } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Enter valid phone number';
    }

    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await signup({ 
        name: name.trim(),
        phone: phone.trim(), 
        password: password.trim()
      });
      
      if (success) {
        console.log('✅ Signup successful!');
      } else {
        setErrors({ 
          phone: 'Phone number already exists',
          password: 'Phone number already exists' 
        });
      }
    } catch (error) {
      console.log('Signup error:', error);
      setErrors({ 
        phone: 'Signup failed. Try again.',
        password: 'Signup failed. Try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header + Back */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Alix and start connecting</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <InputField
              label="Phone Number"
              placeholder="+91 9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
              autoComplete="tel"
            />

            <InputField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <CommonButton
              title={loading ? "Creating Account..." : "Create Account"}
              variant="primary"
              loading={loading}
              onPress={handleSignup}
              style={styles.signupButton}
            />

            <View style={styles.loginDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <CommonButton
              title="I have an account"
              variant="outline"
              size="lg"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  backButton: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 32,
  },
});