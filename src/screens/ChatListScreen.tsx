// src/screens/ChatListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatItem {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
}

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    // Filter chats based on search
    if (searchQuery.trim()) {
      // Mock filtered chats - replace with real search API
      const filtered = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setChats(filtered);
    }
  }, [searchQuery]);

  const loadChats = async () => {
    try {
      // Mock chat data - replace with real API call
      const mockChats: ChatItem[] = [
        {
          id: '1',
          userId: 'ALIX123',
          name: 'Priya Sharma',
          avatar: undefined,
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
        {
          id: '3',
          userId: 'ALIX789',
          name: 'Anita Singh',
          lastMessage: 'Thanks for the chat!',
          time: 'Yesterday',
          unread: 1,
          online: true,
        },
      ];
      
      setChats(mockChats);
    } catch (error) {
      console.log('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (chat: ChatItem) => {
    navigation.navigate('ChatScreen' as never, { 
      userId: chat.userId, 
      userName: chat.name 
    });
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <View style={styles.avatarContainer}>
        <Image 
          source={require('../assets/images/placeholders/default_avatar.png')} 
          style={styles.avatar} 
        />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {item.unread > 99 ? '99+' : item.unread}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../assets/images/placeholders/no_chats.png')} 
        style={styles.emptyImage} 
      />
      <Text style={styles.emptyTitle}>No chats yet</Text>
      <Text style={styles.emptySubtitle}>
        Search users by ID to start chatting or accept friend requests
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats or user ID..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Image 
          source={require('../assets/icons/ui/icon_menu.png')} 
          style={styles.menuIcon} 
        />
      </View>

      {/* Chats List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={chats.length === 0 ? styles.emptyList : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#94A3B8',
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  chatContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: '#94A3B8',
    fontSize: 12,
  },
  lastMessage: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

export default ChatListScreen;