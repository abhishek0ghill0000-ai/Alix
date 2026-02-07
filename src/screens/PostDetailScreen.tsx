// src/screens/PostDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Image from 'react-native-fast-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  Feed: undefined;
  PostDetailScreen: { postId: string };
};

interface Comment {
  id: string;
  userName: string;
  avatar: any;
  text: string;
  time: string;
}

const PostDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params as { postId: string };

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Mock post data
  const post = {
    id: postId,
    userName: 'priya_sharma28',
    avatar: require('../assets/images/placeholders/default_avatar.png'),
    image: require('../assets/images/placeholders/post1.jpg'),
    caption: 'Beautiful sunset today! 🌅 #nature #sunset #friends',
    likes: 234,
    comments: 12,
  };

  const comments: Comment[] = [
    {
      id: '1',
      userName: 'rohan_gupta',
      avatar: require('../assets/images/placeholders/default_avatar.png'),
      text: 'Amazing view! Where is this?',
      time: '2h ago',
    },
    {
      id: '2',
      userName: 'anita_singh',
      avatar: require('../assets/images/placeholders/default_avatar.png'),
      text: 'Love the colors! ✨',
      time: '1h ago',
    },
  ];

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentTime}>{item.time}</Text>
      </View>
    </View>
  );

  const toggleLike = () => {
    setLiked(!liked);
  };

  const postComment = () => {
    if (commentText.trim()) {
      // Add comment logic here
      setCommentText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={require('../assets/icons/ui/icon_back.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton}>
          <Image 
            source={require('../assets/icons/action/icon_share.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Post Image */}
        <Image source={post.image} style={styles.postImage} />

        {/* Post Info */}
        <View style={styles.postInfo}>
          <View style={styles.postHeader}>
            <View style={styles.headerLeft}>
              <Image source={post.avatar} style={styles.postAvatar} />
              <Text style={styles.postUsername}>{post.userName}</Text>
            </View>
            <Image 
              source={require('../assets/icons/ui/icon_more.png')} 
              style={styles.moreIcon} 
            />
          </View>

          {/* Caption */}
          <Text style={styles.caption}>{post.caption}</Text>

          {/* Likes */}
          <TouchableOpacity style={styles.likesContainer} onPress={toggleLike}>
            <Image 
              source={require('../assets/icons/action/icon_heart.png')} 
              style={[
                styles.actionIcon, 
                liked && styles.likedIcon
              ]} 
            />
            <Text style={styles.likesText}>{post.likes} likes</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>{post.comments} Comments</Text>
          
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <Image 
          source={require('../assets/images/placeholders/default_avatar.png')} 
          style={styles.inputAvatar} 
        />
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#64748B"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          style={[
            styles.postCommentButton,
            !commentText.trim() && styles.postCommentButtonDisabled
          ]}
          onPress={postComment}
          disabled={!commentText.trim()}
        >
          <Text style={styles.postCommentButtonText}>Post</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  postImage: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  postInfo: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: '#94A3B8',
  },
  caption: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 22,
    marginBottom: 16,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    marginRight: 8,
  },
  likedIcon: {
    tintColor: '#EF4444',
  },
  likesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  commentsList: {
    maxHeight: 300,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  commentTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#FFFFFF',
    marginRight: 12,
  },
  postCommentButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
  },
  postCommentButtonDisabled: {
    backgroundColor: '#64748B',
  },
  postCommentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostDetailScreen;