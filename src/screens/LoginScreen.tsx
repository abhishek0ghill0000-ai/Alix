// src/screens/LoginScreen.tsx
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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  HomeScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('testuser123'); // Default working user
  const [password, setPassword] = useState('testpass123'); // Default working password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  
  const navigation = useNavigation<NavigationProp>();

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      console.log('🔄 Logging in:', username, password);
      
      // Backend API call (WORKING ENDPOINT)
      const response = await axios.post('https://alix-api.onrender.com/authRoutes/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        // Store token for RandomCallScreen
        await AsyncStorage.setItem('authToken', response.data.token);
        console.log('✅ Token saved:', response.data.token.substring(0, 20) + '...');
        
        // Navigate to Home
        navigation.navigate('HomeScreen' as any);
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert(
        'Login Failed', 
        error.response?.data?.error || 'Server error. Try again.'
      );
      setErrors({
        username: 'Invalid credentials',
        password: 'Invalid credentials'
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to start video calls</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputContainer, errors.username && styles.inputError]}>
              <Text style={styles.username}>{username}</Text>
              <TouchableOpacity onPress={() => setUsername('testuser123')}>
                <Text style={styles.useDemo}>Use Demo</Text>
              </TouchableOpacity>
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Text style={styles.password} secureTextEntry>
                {password}
              </Text>
              <TouchableOpacity onPress={() => setPassword('testpass123')}>
                <Text style={styles.useDemo}>Use Demo</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate('Signup' as any)}
            >
              <Text style={styles.signupText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 120, height: 120, marginBottom: 24 },
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
  form: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  password: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  useDemo: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signupButton: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
