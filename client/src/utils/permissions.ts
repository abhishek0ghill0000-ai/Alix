import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import * as Audio from 'expo-av';
import { Alert, Platform } from 'react-native';
import { LocationData } from '../types/models';

export const requestMandatoryPermissions = async (): Promise<boolean> => {
  try {
    // 1. Location (compulsory for login/safety)
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert('Location Required', 'App needs location for safety verification. Please enable.');
      return false;
    }

    // 2. Camera for video calls (Agora)
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Camera Required', 'Needed for video calls.');
      return false;
    }

    // 3. Microphone for video/voice
    const { status: micStatus } = await Audio.requestPermissionsAsync();
    if (micStatus !== 'granted') {
      Alert.alert('Microphone Required', 'Needed for calls.');
      return false;
    }

    // Background location (no continuous tracking, only manual)
    const { status: bgLocation } = await Location.requestBackgroundPermissionsAsync();
    console.log('BG Location:', bgLocation); // Optional log

    return true;
  } catch (error) {
    console.error('Permissions error:', error);
    Alert.alert('Permissions Failed', 'Please enable all permissions manually.');
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Location fetch failed:', error);
    return null;
  }
};

export const checkPermissionsStatus = (): { location: boolean; camera: boolean; mic: boolean } => ({
  location: Location.hasServicesEnabledAsync(),
  camera: Camera.getCameraPermissionsAsync(),
  mic: Audio.getPermissionsAsync(),
});