// src/utils/permissions.ts
import { 
  PermissionsAndroid, 
  Platform, 
  Alert,
  Linking 
} from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Alix needs location access for advanced features.',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.log('Location permission error:', error);
    return false;
  }
};

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const camera = await request(PERMISSIONS.IOS.CAMERA);
      const mic = await request(PERMISSIONS.IOS.MICROPHONE);
      return camera === RESULTS.GRANTED && mic === RESULTS.GRANTED;
    }
  } catch (error) {
    console.log('Camera permission error:', error);
    return false;
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      return true; // Android 13+ auto-handles
    } else {
      const result = await request(PERMISSIONS.IOS.CRITICAL_ALERTS);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    return true;
  }
};

export const openSettings = () => {
  Linking.openSettings();
};

export const checkLocationEnabled = async (): Promise<boolean> => {
  // GPS enabled check (simplified)
  return true;
};