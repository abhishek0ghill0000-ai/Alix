// src/components/ChatListItem.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Avatar } from './Avatar';
import { formatChatTime } from '../utils/timeUtils';

interface ChatListItemProps {
  chatId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isActive: boolean;
  onPress: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chatId,
  userName,
  userAvatar,
  lastMessage,
  timestamp,
  unreadCount,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Avatar 
          size={56} 
          src={userAvatar} 
          online={isActive}
        />
        {isActive && (
          <View style={styles.activeIndicator} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={styles.timeText}>
            {formatChatTime(timestamp)}
          </Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage}
        </Text>

        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Typing indicator */}
      {isActive && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>typing...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  typingIndicator: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#10B981',
    fontWeight: '500',
  },
});