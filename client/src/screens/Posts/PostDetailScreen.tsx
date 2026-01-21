// Alix App - Post Detail Screen
// client/screens/Posts/PostDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
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
  liked: boolean;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

interface Props {
  route: { params: { postId: string } };
}

const PostDetailScreen: React.FC<Props> = ({ route }) => {
  const { user } = useAuth();
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.posts}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPost(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load post');
    }
  };

  const toggleLike = async () => {
    if (!post || !user) return;
    
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_ENDPOINTS.posts}/${post.id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPost({
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to like/unlike');
    }
  };

  const addComment = async () => {
    if (!commentText.trim() || !post || !user) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.posts}/${post.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        setCommentText('');
        fetchPost(); // Refresh
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const sharePost = () => {
    Alert.alert('Share', `Share post ${postId} via...`);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.comment}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentText}>{item.content}</Text>
      <Text style={styles.commentTime}>{item.createdAt}</Text>
    </View>
  );

  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading post...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.uniqueId}>@{post.uniqueId}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <ScrollView style={styles.postContent}>
        <Text style={styles.postText}>{post.content}</Text>
        {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
          <Ionicons 
            name={post.liked ? "heart" : "heart-outline"} 
            size={24} 
            color={post.liked ? "#FF3B30" : "#666"} 
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={sharePost}>
          <Ionicons name="send-outline" size={24} color="#6366F1" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Comment */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          style={[styles.sendCommentBtn, !commentText && styles.disabledBtn]}
          onPress={addComment}
          disabled={!commentText}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  postHeader: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#ddd', 
    marginRight: 12 
  },
  username: { fontWeight: 'bold', fontSize: 16 },
  uniqueId: { fontSize: 14, color: '#666' },
  moreBtn: { padding: 5 },
  postContent: { backgroundColor: 'white', padding: 15 },
  postText: { fontSize: 16, lineHeight: 22, marginBottom: 10 },
  postImage: { 
    width: '100%', 
    height: 300, 
    borderRadius: 12, 
    marginBottom: 10 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 15, 
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: { marginLeft: 6, fontWeight: '500', fontSize: 14 },
  commentsList: { flex: 1 },
  comment: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#f0f0f0',
  },
  commentUsername: { fontWeight: 'bold', marginRight: 8 },
  commentText: { flex: 1 },
  commentTime: { color: '#999', fontSize: 12, marginTop: 4 },
  commentInputContainer: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: 'white' 
  },
  commentInput: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    padding: 12, 
    borderRadius: 20, 
    marginRight: 10 
  },
  sendCommentBtn: { 
    backgroundColor: '#00D4AA', 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  disabledBtn: { backgroundColor: '#ccc' },
});

export default PostDetailScreen;