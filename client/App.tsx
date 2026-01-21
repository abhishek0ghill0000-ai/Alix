// client/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import LottieView from 'lottie-react-native';

// Screens
import SignupScreen from './src/screens/SignupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import ChatScreen from './src/screens/ChatScreen';
import SearchScreen from './src/screens/SearchScreen';

// Types
export type RootStackParamList = {
  Signup: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Search: undefined;
  VideoCall: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: string;
          if (route.name === 'Search') iconName = focused ? 'nav/search-active.png' : 'nav/search.png';
          else if (route.name === 'VideoCall') iconName = focused ? 'nav/video-active.png' : 'nav/video.png';
          else if (route.name === 'Chat') iconName = focused ? 'nav/chat-active.png' : 'nav/chat.png';
          else iconName = focused ? 'nav/profile-active.png' : 'nav/profile.png';
          
          return (
            <Image 
              source={require(`./src/assets/icons/nav/${iconName}`)} 
              style={{ width: 24, height: 24, tintColor: focused ? '#007AFF' : '#666' }}
            />
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="VideoCall" component={VideoCallScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Splash Screen with Logo & Animation */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        
        {/* Signup Flow */}
        <Stack.Screen name="Signup" component={SignupScreen} />
        
        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Splash Screen with your assets
function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' }}>
      {/* Main Logo */}
      <Image 
        source={require('./src/assets/images/logo/app-logo.png')} 
        style={{ width: 120, height: 120, marginBottom: 20 }}
      />
      
      {/* Lottie Animation */}
      <LottieView
        source={require('./src/assets/lottie/loading.json')}
        style={{ width: 100, height: 100 }}
        autoPlay
        loop
      />
      
      {/* Background */}
      <Image 
        source={require('./src/assets/images/backgrounds/access-bg.png')} 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          right: 0, 
          width: 200, 
          height: 200,
          opacity: 0.3 
        }}
      />
    </View>
  );
}

export default App;
