import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  timestamp: string;
}

interface Props {
  post: Post;
  onPressLike: (postId: string) => void;
  onPressComment: (postId: string) => void;
  onPressShare: (postId: string) => void;
  onPressPost: (postId: string) => void;
}

const PostCard: React.FC<Props> = ({
  post,
  onPressLike,
  onPressComment,
  onPressShare,
  onPressPost,
}) => {
  const [liked, setLiked] = useState(post.liked);

  const handleLike = () => {
    setLiked(!liked);
    onPressLike(post.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressPost(post.id)} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content} numberOfLines={4}>{post.content}</Text>

      {/* Image */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {liked ? '❤️' : '🤍'} {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onPressComment(post.id)}>
          <Text style={styles.actionText}>💬 {post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onPressShare(post.id)}>
          <Text style={styles.actionText}>🔄 {post.shares}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 12,
    color: '#374151',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  likedText: {
    color: '#EF4444',
  },
});

export default PostCard;