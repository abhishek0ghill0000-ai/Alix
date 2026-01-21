// Alix App - Posts Feed Screen
// client/screens/Posts/FeedScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../config/env';

interface Post {
  id: string;
  userId: string;
  username: string;
  uniqueId: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

type RootStackParamList = {
  CreatePost: undefined;
  PostDetail: { postId: string };
};

type NavigationPropType = NavigationProp<RootStackParamList>;

interface Props {
  navigation: NavigationPropType;
}

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number = 1, refresh = false) => {
    if (loading) return;
    
    setLoading(true);
    if (refresh) setRefreshing(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.posts}?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newPosts = await response.json();
      setPosts(refresh ? newPosts : [...posts, ...newPosts]);
      setPage(pageNum + 1);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      if (refresh) setRefreshing(false);
    }
  }, [loading, posts, page]);

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const onRefresh = () => fetchPosts(1, true);

  const loadMore = () => {
    if (!loading) fetchPosts(page);
  };

  const navigateToPostDetail = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const navigateToCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postCard} 
      onPress={() => navigateToPostDetail(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.uniqueId}>@{item.uniqueId}</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </View>

      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <View style={styles.actionRow}>
          <View style={styles.actionLeft}>
            <Ionicons name="heart-outline" size={22} color="#666" />
            <Text style={styles.actionCount}>{item.likes}</Text>
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionCount}>{item.comments}</Text>
          </View>
          <Ionicons name="send-outline" size={22} color="#6366F1" />
        </View>
        
        <Text style={styles.timestamp}>{item.createdAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Create Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity 
          style={styles.createBtn} 
          onPress={navigateToCreatePost}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  createBtn: { 
    backgroundColor: '#00D4AA', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listContent: { paddingBottom: 20 },
  postCard: { 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    marginVertical: 8, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  postHeader: { 
    flexDirection: 'row', 
    padding: 16, 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: '#ddd', 
    marginRight: 12 
  },
  username: { fontWeight: '700', fontSize: 16, color: '#333' },
  uniqueId: { fontSize: 14, color: '#666', marginTop: 1 },
  postContent: { 
    fontSize: 16, 
    lineHeight: 22, 
    paddingHorizontal: 16, 
    paddingVertical: 4,
    color: '#333',
  },
  postImage: { 
    width: '100%', 
    height: 220, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16,
    marginTop: 8,
  },
  postActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    paddingTop: 12,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  actionLeft: { flexDirection: 'row', alignItems: 'center' },
  actionCount: { 
    marginLeft: 6, 
    fontWeight: '600', 
    fontSize: 14, 
    color: '#666' 
  },
  timestamp: { 
    fontSize: 12, 
    color: '#999', 
    alignSelf: 'flex-end' 
  },
});

export default FeedScreen;