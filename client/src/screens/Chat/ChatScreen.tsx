// Alix App - Main Chat Screen (Default Home)
// client/screens/Chat/ChatScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../config/env';

interface RecentChat {
  id: string;
  friendUniqueId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecentChats();
  }, [user]);

  const fetchRecentChats = async () => {
    if (!user) return;
    
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.profile}/${user.id}/recent-chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRecentChats(data);
    } catch (error) {
      console.error('Failed to fetch recent chats:', error);
    }
  };

  const filteredChats = recentChats.filter(chat =>
    chat.friendUniqueId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChatDetail = (friendId: string) => {
    navigation.navigate('ChatDetail', { friendId });
  };

  const renderChatItem = ({ item }: { item: RecentChat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChatDetail(item.id)}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{item.friendUniqueId[0].toUpperCase()}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.friendName}>{item.friendUniqueId}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatRight}>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
          </View>
        )}
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Quick Search */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quick Tab Access - Snapchat Style */}
      <View style={styles.quickTabs}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={24} color="#666" />
          <Text style={styles.tabLabel}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('RandomCall')}>
          <Ionicons name="videocam-outline" size={24} color="#666" />
          <Text style={styles.tabLabel}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Chats */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    padding: 20, 
    backgroundColor: 'white', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    padding: 12, 
    borderRadius: 25, 
    marginRight: 10,
    fontSize: 16,
  },
  newChatBtn: { 
    backgroundColor: '#00D4AA', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  quickTabs: { 
    flexDirection: 'row', 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    backgroundColor: 'white' 
  },
  tabBtn: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 10 
  },
  tabLabel: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 4,
    fontWeight: '500'
  },
  chatsList: { flex: 1, paddingHorizontal: 20 },
  chatItem: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  avatarPlaceholder: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    backgroundColor: '#00D4AA', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  avatarText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  chatInfo: { flex: 1 },
  friendName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  lastMessage: { fontSize: 14, color: '#666' },
  chatRight: { alignItems: 'flex-end' },
  unreadBadge: { 
    backgroundColor: '#FF3B30', 
    borderRadius: 12, 
    minWidth: 24, 
    height: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  timestamp: { fontSize: 12, color: '#999' },
});

export default ChatScreen;