// src/navigation/AppNavigator.tsx
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useColorScheme, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import RandomCallScreen from '../screens/RandomCallScreen';

// Types - FIXED for our flow
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  RandomCallScreen: undefined;
  ChatScreen: { userId: string; userName: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Simple token check (NO useAuth dependency)
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await require('@react-native-async-storage/async-storage').default
          .getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.log('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

// Main Navigator - FIXED ROUTES
const AppNavigatorContent: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={LoginScreen} /> {/* Reuse for now */}
        
        {/* Authenticated screens */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RandomCallScreen" component={RandomCallScreen} />
        <Stack.Screen 
          name="ChatScreen" 
          component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Chat Screen (Coming Soon)</Text>
            </View>
          )} 
        />
        <Stack.Screen 
          name="Profile" 
          component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Profile (Coming Soon)</Text>
            </View>
          )} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <AuthGate>
      <AppNavigatorContent />
    </AuthGate>
  );
};

export default AppNavigator;
