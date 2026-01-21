// Alix App - Bottom Navigation
// client/navigation/BottomTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons
import { View, Text, TouchableOpacity } from 'react-native';

// Import screens (implement separately)
import SearchScreen from '../screens/SearchScreen';
import RandomVideoCallScreen from '../screens/RandomVideoCallScreen';
import AdvancedAccessScreen from '../screens/AdvancedAccessScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import ChatScreen from '../screens/ChatScreen'; // Default home

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat" // App opens directly to Chat (Snapchat-style)
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'RandomCall') iconName = focused ? 'videocam' : 'videocam-outline';
          else if (route.name === 'AdvancedAccess') iconName = focused ? 'shield' : 'shield-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else iconName = 'chatbubbles'; // Chat default

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00D4AA', // Modern green
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Snapchat-style no header
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          paddingBottom: 10,
          height: 70,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      })}
    >
      {/* Default Chat Screen */}
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ tabBarLabel: 'Chat', tabBarIcon: 'chatbubbles' }} 
      />
      
      {/* 4 Main Tabs */}
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarLabel: 'Search' }} 
      />
      <Tab.Screen 
        name="RandomCall" 
        component={RandomVideoCallScreen} 
        options={{ tabBarLabel: 'Video Call' }} 
      />
      <Tab.Screen 
        name="AdvancedAccess" 
        component={AdvancedAccessScreen} 
        options={{ tabBarLabel: 'Access' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={MyProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;