// AlixExpo/root/app.tsx (simple version)
import React from 'react';
import { View, StatusBar } from 'react-native';
import App from '../src/app';

export default function RootApp() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <App />
    </View>
  );
}
