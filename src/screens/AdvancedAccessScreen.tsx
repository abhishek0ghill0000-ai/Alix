// src/screens/AdvancedAccessScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const API_BASE = 'https://alix-api.onrender.com';

type RouteParams = {
  userId: string;
  userName: string;
};

const AdvancedAccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userId, userName } = route.params as RouteParams;

  const [accessCode, setAccessCode] = useState('');
  const [accessLink, setAccessLink] = useState('');
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [stats, setStats] = useState({
    totalCallTimeToday: 0,
    totalCallTimeWeekly: 0,
    callCount: 0,
    screenTime: {},
    location: null as null | { lat: number; lng: number },
  });

  // Fetch stats (total call time, call count, screen time, location)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE}/api/v1/advanced-access/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data.stats);
        setIsAccessGranted(response.data.isAccessGranted);
        setAccessLink(response.data.accessLink);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch stats');
      }
    };

    fetchStats();
  }, [userId]);

  // Generate one-time confirmation code
  const generateAccessCode = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        `${API_BASE}/api/v1/advanced-access/generate-code`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAccessCode(response.data.code);
      Alert.alert('Success', 'One-time access code generated');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate access code');
    }
  };

  // Manual unlink access
  const unlinkAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(
        `${API_BASE}/api/v1/advanced-access/unlink`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsAccessGranted(false);
      setAccessLink('');
      Alert.alert('Success', 'Access unlinked');
    } catch (error) {
      Alert.alert('Error', 'Failed to unlink access');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Advanced Access</Text>
        </View>

        {/* Access status */}
        <View style={styles.card}>
          <Text style={styles.label}>Access Status</Text>
          <Text style={styles.value}>{isAccessGranted ? 'Granted' : 'Not Granted'}</Text>
        </View>

        {/* One-time code */}
        <View style={styles.card}>
          <Text style={styles.label}>One-time Code</Text>
          <Text style={styles.value}>{accessCode || 'Not generated'}</Text>
          <TouchableOpacity style={styles.button} onPress={generateAccessCode}>
            <Text style={styles.buttonText}>Generate Code</Text>
          </TouchableOpacity>
        </View>

        {/* Permanent link */}
        <View style={styles.card}>
          <Text style={styles.label}>Permanent Access Link</Text>
          <Text style={styles.value}>{accessLink || 'No link'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.label}>Call Stats</Text>
          <Text style={styles.value}>Today: {stats.totalCallTimeToday}s</Text>
          <Text style={styles.value}>Weekly: {stats.totalCallTimeWeekly}s</Text>
          <Text style={styles.value}>Calls: {stats.callCount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Screen Time</Text>
          {Object.entries(stats.screenTime).map(([app, time]) => (
            <Text key={app} style={styles.value}>
              {app}: {time}s
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {stats.location
              ? `Lat: ${stats.location.lat}, Lng: ${stats.location.lng}`
              : 'Not available'}
          </Text>
        </View>

        {/* Unlink button */}
        {isAccessGranted && (
          <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={unlinkAccess}>
            <Text style={styles.buttonText}>Unlink Access</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdvancedAccessScreen;
