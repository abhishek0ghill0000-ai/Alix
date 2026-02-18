// src/components/Avatar.tsx
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

interface AvatarProps {
  size?: number;
  src?: string | ImageSourcePropType;
  online?: boolean;
  verified?: boolean;
  type?: 'user' | 'group';
  style?: ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 48,
  src,
  online = false,
  verified = false,
  type = 'user',
  style,
}) => {
  // Default avatars from assets
  const getDefaultAvatar = (): ImageSourcePropType => {
    if (type === 'group') {
      return require('../../assets/images/placeholders/default_group.png');
    }
    return require('../../assets/images/placeholders/default_avatar.png');
  };

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const imageSource = src 
    ? (typeof src === 'string' ? { uri: src } : src)
    : getDefaultAvatar();

  return (
    <View style={[styles.container, { width: size + 8, height: size + 8 }]}>
      {/* Online status ring */}
      {online && (
        <View style={[styles.onlineRing, avatarSize]} />
      )}
      
      {/* Main avatar */}
      <Image
        source={imageSource}
        style={[avatarSize, styles.avatar, style]}
        defaultSource={getDefaultAvatar()}
      />
      
      {/* Verified badge */}
      {verified && size >= 40 && (
        <View style={[styles.verifiedBadge, { bottom: 2, right: 2 }]}>
          {/* Replace with actual icon later */}
          <View style={styles.verifiedIcon} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#F3F4F6',
  },
  onlineRing: {
    position: 'absolute',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#10B981', // Green-500
    zIndex: -1,
  },
  verifiedBadge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6', // Blue-500
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
});