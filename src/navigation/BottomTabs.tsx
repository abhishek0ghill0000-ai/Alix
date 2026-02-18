// src/navigation/BottomTabs.tsx - **ChatScreen FULLY INTEGRATED ✅**

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';

// Screens 
import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import SearchScreen from '../screens/SearchScreen';
import RandomCallScreen from '../screens/RandomCallScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Post + Reel Screens
import PostScreen from '../screens/PostScreen';
import ReelScreen from '../screens/ReelScreen';

// NEW: CHAT SCREENS ✅
import ChatScreen from '../screens/ChatScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import AdvancedAccessScreen from '../screens/AdvancedAccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Post + Reel Stack (PostScreen → ReelScreen navigation के लिए)
const PostReelStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PostScreen" component={PostScreen} />
    <Stack.Screen name="ReelScreen" component={ReelScreen} />
  </Stack.Navigator>
);

// NEW: CHAT STACK (ChatScreen → ChatDetail → AdvancedAccessScreen) ✅
const ChatStack = createStackNavigator();
const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
    <ChatStack.Screen name="ChatDetail" component={ChatDetailScreen} />
    <ChatStack.Screen name="AdvancedAccessScreen" component={AdvancedAccessScreen} />
  </ChatStack.Navigator>
);

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
      {/* 1. Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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

      {/* 3. SearchScreen Tab */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
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

      {/* 4. CHAT TAB (NEW) - Posts tab को ChatStack से replace किया ✅ */}
      <Tab.Screen
        name="Chats"
        component={ChatStackNavigator}  // ← CHATSTACK ADDED (ChatScreen + ChatDetail + AdvancedAccessScreen)
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/nav/nav_chat_active.png')  // ← Chat icon चाहिए
                  : require('../assets/icons/nav/nav_chat.png')        // ← Chat icon चाहिए
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
