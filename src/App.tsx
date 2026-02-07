// src/App.tsx - FULLY WORKING OMEGLE CLONE
import React from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';

// Disable warnings
LogBox.ignoreLogs([
  'Setting a timer for a long period of time',
  'AsyncStorage has been extracted from react-native',
  "EventEmitter.removeListener('appStateDidChange',...)",
  "EventEmitter.removeAllListeners('appStateDidChange')",
  '[Reanimated]',
]);

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
