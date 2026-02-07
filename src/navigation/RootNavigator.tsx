// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import BottomTabs from './BottomTabs';
import ChatScreen from '../screens/ChatScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      {/* Auth Flow */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />

      {/* Main App */}
      <Stack.Screen 
        name="Main" 
        component={BottomTabs} 
        options={{ gestureEnabled: false }}
      />
      
      {/* Home (ChatList wrapper) */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Chat Flow */}
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
        }}
      />

      {/* Social Flow */}
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;