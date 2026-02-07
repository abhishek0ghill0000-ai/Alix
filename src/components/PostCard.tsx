// src/components/PostCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Avatar } from './Avatar';
import { formatPostTime } from '../utils/timeUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostCardProps {
  postId: string;
  userName: string;
  userAvatar?: string;
  userVerified?: boolean;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  onPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  postId,
  userName,
  userAvatar,
  userVerified = false,
  content,
  image,
  likes,
  comments,
  shares,
  timestamp,
  onPress,
  onLikePress,
  onCommentPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.95}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar 
            size={40} 
            src={userAvatar} 
            verified={userVerified}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
              {userVerified && <Text style={styles.verifiedText}> ✓</Text>}
            </Text>
            <Text style={styles.timeText}>{formatPostTime(timestamp)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {content ? (
        <Text style={styles.content} numberOfLines={4}>
          {content}
        </Text>
      ) : null}

      {/* Image */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <View style={[styles.actionIcon, styles.likeIcon]}>
            <Text style={styles.actionIconText}>❤️</Text>
          </View>
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <View style={[styles.actionIcon, styles.commentIcon]}>
            <Text style={styles.actionIconText}>💬</Text>
          </View>
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, styles.shareIcon]}>
            <Text style={styles.actionIconText}>📤</Text>
          </View>
          <Text style={styles.actionText}>{shares}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  verifiedText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  image: {
    width: SCREEN_WIDTH - 32,
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeIcon: {
    backgroundColor: '#FEE2E2',
  },
  commentIcon: {
    backgroundColor: '#DBEAFE',
  },
  shareIcon: {
    backgroundColor: '#F0F9FF',
  },
  actionIconText: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});