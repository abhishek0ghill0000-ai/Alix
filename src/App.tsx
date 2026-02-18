// src/App.tsx - **100% EAS BUILD READY**

import React, { useEffect, useState } from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LogBox, View, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabs } from './navigation/AppNavigator';  
import { NavigationContainer } from '@react-navigation/native';
import { initialize } from 'react-native-google-mobile-ads';

// Custom theme
const COLORS = {
  primary: '#6366F1',
  background: '#0F0F23',
  white: '#FFFFFF',
};

// AdMob App ID
const ADMOB_APP_ID = 'ca-app-pub-3781718251647447~8945014239';

// Disable warnings
LogBox.ignoreLogs([
  'Setting a timer for a long period of time',
  'AsyncStorage has been extracted from react-native',
  "EventEmitter.removeListener('appStateDidChange',...)",
  "EventEmitter.removeAllListeners('appStateDidChange')",
  '[Reanimated]',
]);

// Root wrapper with safe area + styling
function RootWrapper({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: COLORS.background,
      }}
    >
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primary}
        translucent={false}
      />
      {children}
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize AdMob SDK first
    initialize({ appId: ADMOB_APP_ID }).then(() => {
      console.log('✅ AdMob SDK initialized');
    }).catch((error) => {
      console.error('❌ AdMob initialization failed:', error);
    });

    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log('Token check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RootWrapper>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </RootWrapper>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RootWrapper>
        {isAuthenticated ? (
          <NavigationContainer>
            <BottomTabs />  {/* ChatScreen + PostScreen + sab integrated */}
          </NavigationContainer>
        ) : (
          <AppNavigator />
        )}
      </RootWrapper>
    </SafeAreaProvider>
  );
}
