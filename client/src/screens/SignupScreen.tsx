import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const API_BASE = 'http://127.0.0.1:5000';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const requestLocation = () =>
    new Promise<Geolocation.GeoPosition>((resolve, reject) => {
      Geolocation.requestAuthorization('whenInUse')
        .then(() => {
          Geolocation.getCurrentPosition(
            pos => resolve(pos),
            err => reject(err),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        })
        .catch(reject);
    });

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Sab fields bharo');
      return;
    }

    try {
      setLoading(true);
      const pos = await requestLocation();
      const { latitude, longitude } = pos.coords;

      const body = {
        username,
        email,
        password,
        location: { lat: latitude, lng: longitude },
      };

      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        Alert.alert('Signup failed', data.error || 'Unknown error');
        return;
      }

      Alert.alert('Success', `Signed up! Your ID: ${data.user.unique_id}`);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Signup request me problem aayi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Alix Signup</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button
        title={loading ? 'Signing up...' : 'Signup with Location'}
        onPress={handleSignup}
        disabled={loading}
      />
    </View>
  );
};

export default SignupScreen;
