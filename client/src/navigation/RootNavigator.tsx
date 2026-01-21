// Alix App - Root Navigator
// client/navigation/RootNavigator.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth'; // From previous
import { ActivityIndicator, View, Alert } from 'react-native';
import BottomTabs from './BottomTabs';
import LoginScreen from '../screens/LoginScreen'; // Implement login with location

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, locationGranted, login } = useAuth();

  // Auto-check auth on app start
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !locationGranted) {
      Alert.alert('Location Required', 'App needs location for safety verification.');
    }
  }, [isLoading, isAuthenticated, locationGranted]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00D4AA" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated: Direct to BottomTabs (Chat default)
          <Stack.Screen name="Main" component={BottomTabs} />
        ) : (
          // Non-auth: Login with mandatory location
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;