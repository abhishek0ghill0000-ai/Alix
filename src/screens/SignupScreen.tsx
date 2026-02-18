// src/screens/SignupScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, KeyboardAvoidingView,
  ScrollView, StyleSheet, Image, TouchableOpacity,
  Alert, TextInput, PermissionsAndroid, Platform
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const SignupScreen = () => {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'loading'>('loading');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermission('denied');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
        setLocationPermission('granted');

        // 🔥 OSM reverse geocoding
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        setCountry(data.address.country);
        setState(data.address.state);
        setCity(data.address.city || data.address.town);

      },
      () => setLocationPermission('denied'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const validate = () => {
    if (!username || !password || !gender) return false;
    if (!mobile && !email) return false;
    if (locationPermission !== 'granted') return false;
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) {
      Alert.alert("Error", "Fill all required fields & enable location");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name || undefined,
        username,
        password,
        mobile: mobile || undefined,
        email: email || undefined,
        gender,
        country,
        state,
        city,
        latitude,
        longitude,
      };

      const res = await axios.post(
        'https://alix-api.onrender.com/auth/signup',
        payload
      );

      await AsyncStorage.setItem('userToken', res.data.token);
      navigation.navigate('HomeScreen');

    } catch (err: any) {
      Alert.alert("Signup failed", err.response?.data?.error || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>

          <TextInput placeholder="Name (optional)" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Username*" value={username} onChangeText={setUsername} style={styles.input} />
          <TextInput placeholder="Password*" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

          <TextInput placeholder="Mobile" value={mobile} onChangeText={setMobile} style={styles.input} />
          <Text style={{ textAlign: 'center' }}>OR</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />

          <TextInput placeholder="Gender (male/female)*" value={gender} onChangeText={(v:any)=>setGender(v)} style={styles.input} />

          <View style={{ marginVertical: 10 }}>
            {locationPermission === 'granted' && <Text>✅ Location ready</Text>}
            {locationPermission === 'denied' && <Text>⚠️ Please enable location</Text>}
          </View>

          <TouchableOpacity onPress={handleSignup} disabled={loading} style={styles.button}>
            <Text style={{ color: '#fff' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginBottom: 12, borderRadius: 6
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 14, alignItems: 'center', borderRadius: 8
  }
});
