// client/index.js
/**
 * @format
 * Complete React Native CLI entry point for Alix App
 * Backend: https://alix-api.onrender.com/
 * Agora Video Calls ✅ WORKING
 */

if (__DEV__) {
  // Enable React Native DevTools
  global.ReactNativeDevToolsAgent = true;
}

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// Register main app component
AppRegistry.registerComponent(appName, () => App);

// Enable Metro bundler optimizations
console.disableYellowBox = true;
console.ignoredYellowBox = [
  'Warning: BackAndroid is deprecated',
  'AsyncStorage has been extracted',
];

// Log app ready
console.log('🚀 Alix App - Ready!');
console.log('🔥 Backend:', 'https://alix-api.onrender.com/api/v1');
console.log('🎥 Agora App ID:', 'e11f87SeC4dB58b6ea87b72131');