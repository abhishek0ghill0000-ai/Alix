// Alix App - Signup Screen
// client/screens/Auth/SignUpScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Geolocation from 'react-native-geolocation-service';

const SignUpScreen: React.FC = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Reuse login logic post-signup

  const handleSignUp = async () => {
    if (!username || !email || !password || password !== confirmPassword) {
      Alert.alert('Error', 'Please fill all fields correctly');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Get location (mandatory)
      let location = null;
      return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          (position) => {
            location = position.coords;
            performSignup();
            resolve(true);
          },
          (error) => {
            Alert.alert('Location Error', 'Location is required for safety verification');
            setLoading(false);
            resolve(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        );
      });
    } catch (error) {
      Alert.alert('Signup Failed', 'Please try again');
      setLoading(false);
    }

    const performSignup = async () => {
      try {
        const response = await fetch('https://alix-renderer.com/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            location, // Send once for safety verification
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Signup failed');
        }

        const { token, user } = await response.json();
        
        // Auto-login after signup
        await AsyncStorage.multiSet([
          ['token', token],
          ['user', JSON.stringify(user)]
        ]);

        Alert.alert('Success', 'Account created! Welcome to Alix.', [
          { text: 'OK', onPress: () => navigation.replace('Main') }
        ]);
      } catch (error: any) {
        Alert.alert('Signup Error', error.message);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Join Alix</Text>
      <Text style={styles.subtitle}>Create account with location verification</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.signupBtn, loading && styles.disabledBtn]} 
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.signupText}>
          {loading ? 'Creating Account...' : 'Sign Up with Location'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginLink} 
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.loginText}>Already have account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 40, 
    backgroundColor: '#00D4AA' 
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: 'white', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.9)', 
    textAlign: 'center', 
    marginBottom: 40 
  },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20, 
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  signupBtn: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: '#ccc' },
  signupText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#00D4AA' 
  },
  loginLink: { 
    marginTop: 30, 
    alignItems: 'center' 
  },
  loginText: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 16 
  },
});

export default SignUpScreen;