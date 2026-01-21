// Alix App - Advanced Access Screen
// client/screens/AdvancedAccess/AdvancedAccessScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAds } from '../../hooks/useAds';
import { API_ENDPOINTS } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessData {
  userId: string;
  totalCallTimeToday: string;
  totalCallTimeWeekly: string;
  callCount: number;
  screenTime: string;
  location?: { lat: number; lng: number };
}

const AdvancedAccessScreen: React.FC = () => {
  const { user } = useAuth();
  const { Banner: AdBanner } = useAds(false); // Ads for free users
  const [accessedUsers, setAccessedUsers] = useState<AccessData[]>([]);
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    if (user) fetchAccessedData();
  }, [user]);

  const fetchAccessedData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.advancedAccess}/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAccessedUsers(data); // Only permitted data: call stats, no messages/audio
    } catch (error) {
      Alert.alert('Error', 'Failed to load access data');
    }
  };

  const generateAccessLink = () => {
    const code = Math.random().toString(36).substring(7); // One-time code
    Alert.alert('Access Code', `Share: alix.app/access/${user?.uniqueId}/${code}`);
    // Send to backend to validate one-time use
  };

  const manualLocationCheck = (userId: string) => {
    setShowLocation(true);
    // Fetch latest manual location (no live tracking)
  };

  const renderUserCard = ({ item }: { item: AccessData }) => (
    <View style={styles.card}>
      <Text style={styles.userId}>ID: {item.userId}</Text>
      <Text>Calls Today: {item.totalCallTimeToday}</Text>
      <Text>Weekly Calls: {item.totalCallTimeWeekly} ({item.callCount} calls)</Text>
      <Text>Screen Time: {item.screenTime}</Text>
      {showLocation && item.location && (
        <Text>Location: {item.location.lat}, {item.location.lng}</Text>
      )}
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => manualLocationCheck(item.userId)}
      >
        <Text>Check Location</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Access</Text>
      <TouchableOpacity style={styles.btn} onPress={generateAccessLink}>
        <Text>Generate Access Link</Text>
      </TouchableOpacity>
      
      <FlatList
        data={accessedUsers}
        renderItem={renderUserCard}
        keyExtractor={item => item.userId}
        style={styles.list}
      />
      
      <AdBanner /> {/* Free users only */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1 },
  userId: { fontWeight: 'bold', marginBottom: 10 },
  btn: { backgroundColor: '#00D4AA', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
  list: { flex: 1 },
});

export default AdvancedAccessScreen;