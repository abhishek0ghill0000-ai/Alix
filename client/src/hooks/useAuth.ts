// Alix App - Authentication Hook
// client/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { API_ENDPOINTS, API_HEADERS } from '../config/env';

interface User {
  id: string;
  username: string;
  uniqueId: string;
  location?: { lat: number; lng: number }; // Encrypted on server
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationGranted, setLocationGranted] = useState(false);

  // Mandatory location permission on login
  const requestLocation = useCallback(async () => {
    const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (permission !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result !== RESULTS.GRANTED) throw new Error('Location required for safety');
    }
    setLocationGranted(true);
  }, []);

  // Login with location
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      await requestLocation();

      let currentPosition: any;
      Geolocation.getCurrentPosition(
        (position) => { currentPosition = position; },
        () => { throw new Error('Location fetch failed'); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      const response = await fetch(API_ENDPOINTS.auth, {
        method: 'POST',
        ...API_HEADERS,
        body: JSON.stringify({
          ...credentials,
          location: currentPosition?.coords, // Send once, no continuous tracking
        }),
      });

      if (!response.ok) throw new Error('Login failed');

      const { token, user: userData } = await response.json();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  }, []);

  // Load user from storage
  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    locationGranted,
  };
};