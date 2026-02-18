// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  RandomCall: undefined;
  RandomCallScreen: undefined;
  ChatScreen: { userId: string; userName: string };
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  icon: any;
  screen: keyof RootStackParamList;
  badge?: number;
}

interface ChatItem {
  id: string;
  userId: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
}

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [userName, setUserName] = useState('User');
  const navigation = useNavigation<NavigationProp>();

  // Token check (userToken name match with LoginScreen/App.tsx)
  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      if (token) {
        setUserName('testuser123'); // From login
      }
    });

    // Mock chats data
    const mockChats: ChatItem[] = [
      {
        id: '1',
        userId: 'ALIX123',
        name: 'Priya Sharma',
        lastMessage: 'Hii, kaisi ho? Call kar sakte hain?',
        time: '2 min',
        unread: 3,
        online: true,
      },
      {
        id: '2',
        userId: 'ALIX456',
        name: 'Rohan Gupta',
        lastMessage: 'Kal ka video call mast tha!',
        time: '1 hr',
        unread: 0,
        online: false,
      },
    ];
    setChats(mockChats);
  }, []);

  // Quick Actions - FIXED NAVIGATION
  const quickActions: QuickAction[] = [
    {
      id: 'random-call',
      title: 'Random Video Call',
      icon: { uri: 'https://via.placeholder.com/48x48/4A90E2/FFFFFF?text=📹' },
     // icon: require('../assets/icons/action/icon_video.png'),
      screen: 'RandomCallScreen', // ✅ FIXED: Correct screen name
      badge: 0,
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: { uri: 'https://img.icons8.com/ios-filled/50/4A90E2/phone.png' },
      screen: 'ChatScreen',
      badge: 3,
    },
    {
      id: 'posts',
      title: 'Posts',
      icon: require('../../assets/icons/action/icon_add_media.png'),

      screen: 'Profile',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: require('../../assets/icons/nav/nav_profile.png'),
      screen: 'Profile',
    },
  ];

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={() => navigation.navigate(item.screen as any)}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionInner}>
        <Image source={item.icon} style={styles.quickIcon} resizeMode="contain" />
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
        <Text style={styles.quickTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatScreen' as any, {
        userId: item.userId,
        userName: item.name
      })}
    >
      <Image
        source={require('../../assets/images/placeholders/default_avatar.png')}
        style={styles.chatAvatar}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>
            {item.unread > 99 ? '99+' : item.unread}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header - Welcome to Alix */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to Alix</Text>
          <Text style={styles.statusText}>What would you like to do today?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={require('../../assets/images/placeholders/default_avatar.png')}
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Image
          source={require('../../assets/icons/ui/icon_menu.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats or friends..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsList}
        />
      </View>
      
      {/* Messages Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.chatsList}
        />
      </View>
      
      {/* BIG Random Call CTA */}
      <View style={styles.randomCallCta}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('RandomCallScreen' as any)}
        >
          <Text style={styles.ctaButtonText}>🎥 Start Random Video Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#94A3B8',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  quickActionsList: {
    paddingVertical: 8,
  },
  quickAction: {
    marginRight: 16,
    alignItems: 'center',
  },
  quickActionInner: {
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#FFFFFF',
  },
  quickTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    paddingRight: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  chatMessage: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  chatBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  randomCallCta: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default HomeScreen;
