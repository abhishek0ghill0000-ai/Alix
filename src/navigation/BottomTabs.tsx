// src/navigation/BottomTabs.tsx (ChatListScreen INTEGRATED)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';              // ✅ Changed from ChatListScreen
import FeedScreen from '../screens/FeedScreen';
import RandomCallScreen from '../screens/RandomCallScreen';
import AdvancedAccessScreen from '../screens/AdvancedAccessScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      {/* 1. Home Tab (ChatListScreen integrated inside HomeScreen) */}
      <Tab.Screen
        name="Home"                    // ✅ Changed name
        component={HomeScreen}         // ✅ Uses HomeScreen (with ChatList)
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_search_active.png')
                  : require('../assets/icons/nav/nav_search.png')
              }
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 2. Feed Tab */}
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_video_active.png')
                  : require('../assets/icons/nav/nav_video.png')
              }
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 3. Random Call Tab */}
      <Tab.Screen
        name="RandomCall"
        component={RandomCallScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_access_active.png')
                  : require('../assets/icons/nav/nav_access.png')
              }
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 4. Advanced Access Tab */}
      <Tab.Screen
        name="AdvancedAccess"
        component={AdvancedAccessScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_access_active.png')
                  : require('../assets/icons/nav/nav_access.png')
              }
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 5. Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_profile_active.png')
                  : require('../assets/icons/nav/nav_profile.png')
              }
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;