// src/components/EmptyState.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  image?: string;
  buttonTitle?: string;
  onPress?: () => void;
  type?: 'noChats' | 'noCalls' | 'noPosts' | 'error' | 'loading';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  image,
  buttonTitle,
  onPress,
  type = 'noChats',
}) => {
  const getImageSource = () => {
    switch (type) {
      case 'noChats':
        return require('../../assets/images/feedback/empty_state.png');
      case 'noCalls':
        return require('../../assets/images/placeholders/no_calls.png');
      case 'noPosts':
        return require('../../assets/images/placeholders/no_chats.png');
      case 'error':
        return require('../../assets/images/feedback/error_state.png');
      case 'loading':
        return require('../../assets/images/feedback/loading_lion.png');
      default:
        return require('../../assets/images/feedback/empty_state.png');
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'noChats':
        return description || 'No chats yet. Start a new conversation!';
      case 'noCalls':
        return description || 'No calls made. Try random video call!';
      case 'noPosts':
        return description || 'No posts yet. Create your first post!';
      case 'error':
        return description || 'Something went wrong. Please try again.';
      case 'loading':
        return description || 'Loading your content...';
      default:
        return description;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={getImageSource()}
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>{title}</Text>
      
      {description !== null && (
        <Text style={styles.description}>{getDescription()}</Text>
      )}
      
      {buttonTitle && onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});