// Alix App - Chat List Screen
// client/screens/Chat/ChatListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { API_ENDPOINTS } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  id: string;
  friendId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const ChatListScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // User posts feed

  useEffect(() => {
    if (user) {
      fetchChats();
      fetchPosts();
    }
  }, [user]);

  const fetchChats = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_ENDPOINTS.friendChats}/${user?.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setChats(data);
  };

  const fetchPosts = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.posts, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(await response.json());
  };

  const openChat = (friendId: string) => {
    navigation.navigate('ChatDetail', { friendId });
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item.friendId)}>
      <Text style={styles.friendId}>{item.friendId}</Text>
      <Text>{item.lastMessage}</Text>
      {item.unread > 0 && <Text style={styles.unread}>{item.unread}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatsList}
      />
      {/* Posts section */}
      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={posts}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text>{item.content}</Text>
            <TouchableOpacity><Text>Like</Text></TouchableOpacity>
            <TouchableOpacity><Text>Comment</Text></TouchableOpacity>
            <TouchableOpacity><Text>Share</Text></TouchableOpacity>
          </View>
        )}
        style={styles.postsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  chatsList: { flex: 0.6 },
  postsList: { flex: 0.4 },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, alignItems: 'center' },
  friendId: { fontWeight: 'bold', marginRight: 10 },
  unread: { backgroundColor: 'red', color: 'white', borderRadius: 10, padding: 2, fontSize: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  post: { width: 200, marginRight: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
});

export default ChatListScreen;