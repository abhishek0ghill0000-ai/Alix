// src/types/navigation.ts - RandomCallScreen के लिए complete types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  RandomCallScreen: undefined;
  ChatScreen: { 
    userId: string; 
    userName: string; 
    receiverInfo?: {
      _id: string;
      name: string;
      gender: string;
    };
  };
  Profile: undefined;
};

// Bottom Tab के लिए types
export type BottomTabParamList = {
  Chat: undefined;
  Search: undefined;
  RandomCall: undefined;
  Post: undefined;
  Profile: undefined;
};

// Screen props के लिए helper types
export type RandomCallScreenProps = NativeStackScreenProps<RootStackParamList, 'RandomCallScreen'>;
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatScreen'>;

// Navigation props के लिए
export type RandomCallScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RandomCallScreen'>;
export type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatScreen'>;
