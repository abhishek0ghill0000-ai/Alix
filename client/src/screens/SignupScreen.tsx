import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import Icon from '@expo/vector-icons/MaterialIcons';

const { height } = Dimensions.get('window');
const BACKEND_URL = 'https://alix-renderer.com';

const SignupScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(true);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setShowLocationPermission(true);
      return;
    }
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setShowLocationPermission(false);
    } catch (e) {
      Alert.alert('Location Error', 'Location required for safety');
    }
  };

  const validateInputs = () => {
    if (!username || username.length < 3) return 'Username min 3 chars';
    if (!email || !/S+@S+.S+/.test(email)) return 'Valid email required';
    if (password.length < 6) return 'Password min 6 chars';
    if (password !== confirmPassword) return 'Passwords mismatch';
    if (!location) return 'Location permission required';
    return null;
  };

  const signup = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    setLoading(true);
    try {
      const uniqueId = 'ALIX' + Date.now().toString(36).toUpperCase().slice(-6);

      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          uniqueId,
          location: { lat: location.lat, lng: location.lng }, // Encrypted in backend
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Welcome! Your ID: ${uniqueId}`);
        router.push('/(tabs)/chat'); // To home chat screen
      } else {
        Alert.alert('Error', data.error || 'Signup failed');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Check connection');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => router.push('/login');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Alix</Text>
          <Text style={styles.subtitle}>Next-gen social platform</Text>
        </View>

        {/* Location Permission Modal */}
        <Modal visible={showLocationPermission} transparent animationType="fade">
          <View style={styles.permissionOverlay}>
            <View style={styles.permissionCard}>
              <Icon name="location-on" size={60} color="#007AFF" />
              <Text style={styles.permissionTitle}>Location Required</Text>
              <Text style={styles.permissionText}>
                Enable location for safety verification & advanced access. Data encrypted, no tracking.
              </Text>
              <TouchableOpacity style={styles.confirmBtn} onPress={getCurrentLocation}>
                <Text style={styles.confirmText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Form - Hidden if location pending */}
        {!showLocationPermission && (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.signupBtn} onPress={signup} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={goToLogin}>
              <Text style={styles.loginText}>Already have account? Log in</Text>
            </TouchableOpacity>

            <Text style={styles.locationNote}>
              Location: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Pending'}
            </Text>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  permissionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    elevation: 10,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 18,
    color: '#333',
  },
  signupBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  signupText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
  locationNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});

export default SignupScreen;