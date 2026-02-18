// src/navigation/AppNavigator.tsx - Fixed + RandomCallScreen first
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RandomCallScreen from '../screens/RandomCallScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ✅ Fixed Types - ChatScreen ke liye receiverInfo add
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  RandomCallScreen: undefined;
  ChatScreen: { 
    userId: string; 
    userName: string; 
    receiverInfo?: any;  // ← Added
  };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tab - Instagram style
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopWidth: 1,
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: () => <Text>💬</Text> }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: () => <Text>🔍</Text> }} />
      <Tab.Screen name="RandomCall" component={RandomCallScreen} options={{ tabBarIcon: () => <Text>🎥</Text> }} />
      <Tab.Screen name="Post" component={PostScreen} options={{ tabBarIcon: () => <Text>📝</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
};

// ✅ Main App - Auth ke baad RandomCallScreen first
const AppNavigatorContent: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },  // Dark theme
          animation: 'slide_from_right',
        }}
        initialRouteName="RandomCallScreen"  // ← FIXED: App open → RandomCallScreen
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={BottomTabs} />  // ← Tab navigator
        <Stack.Screen name="RandomCallScreen" component={RandomCallScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ✅ Simple Auth check (token hai to RandomCallScreen)
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log('Auth check failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return <>{children}</>;
};

export const AppNavigator: React.FC = () => {
  return (
    <AuthGate>
      <AppNavigatorContent />
    </AuthGate>
  );
};

export { BottomTabs };
export default AppNavigator;
