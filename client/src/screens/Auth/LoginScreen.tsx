// Alix App - Login Screen
// client/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { requestLocation } from '../../hooks/useAuth'; // Reuse

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, locationGranted } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Enter username & password');
      return;
    }

    const success = await login({ username, password });
    if (success) {
      Alert.alert('Success', 'Logged in! Opening Chat...');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alix</Text>
      <Text style={styles.subtitle}>Location required for safety</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username / Unique ID"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login with Location</Text>
      </TouchableOpacity>
      
      {!locationGranted && (
        <Text style={styles.warning}>Grant location permission to continue</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 40, backgroundColor: '#00D4AA' },
  title: { fontSize: 48, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 18, fontWeight: 'bold', color: '#00D4AA' },
  warning: { color: 'yellow', textAlign: 'center', marginTop: 20 },
});

export default LoginScreen;