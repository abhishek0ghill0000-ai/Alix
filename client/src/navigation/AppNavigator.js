// client/src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

// Screens import karenge
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'Search') iconName = focused ? 'nav/search-active.png' : 'nav/search.png';
            if (route.name === 'VideoCall') iconName = focused ? 'nav/video-active.png' : 'nav/video.png';
            if (route.name === 'Chat') iconName = focused ? 'nav/chat-active.png' : 'nav/chat.png';
            if (route.name === 'Profile') iconName = focused ? 'nav/profile-active.png' : 'nav/profile.png';
            
            return <Image source={require(`../assets/icons/nav/${iconName}`)} style={{width: 24, height: 24}} />;
          }
        })}
      >
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="VideoCall" component={VideoCallScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
