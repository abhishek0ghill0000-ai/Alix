// src/App.tsx - **ChatScreen + AdvancedAccessScreen FULLY INTEGRATED**

import React, { useEffect, useState } from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LogBox, View, StatusBar, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigator, BottomTabs } from './navigation/AppNavigator';  

// NEW IMPORTS - Post & Reel Screens + CHAT SCREENS
import PostScreen from './src/screens/PostScreen';
import ReelScreen from './src/screens/ReelScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatDetailScreen from './src/screens/ChatDetailScreen';
import AdvancedAccessScreen from './src/screens/AdvancedAccessScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
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

// ===== POST + REEL STACK (Already existing) =====
const Stack = createStackNavigator();
const PostReelStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PostScreen" component={PostScreen} />
    <Stack.Screen name="ReelScreen" component={ReelScreen} />
  </Stack.Navigator>
);

// ===== CHAT STACK (NEW - ChatScreen के लिए) =====
const ChatStack = createStackNavigator();
const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
    <ChatStack.Screen name="ChatDetail" component={ChatDetailScreen} />
    <ChatStack.Screen name="AdvancedAccessScreen" component={AdvancedAccessScreen} />
  </ChatStack.Navigator>
);

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
            <BottomTabs />  {/* BottomTabs me ChatStack already integrated होगा */}
          </NavigationContainer>
        ) : (
          <AppNavigator />
        )}
      </RootWrapper>
    </SafeAreaProvider>
  );
}
