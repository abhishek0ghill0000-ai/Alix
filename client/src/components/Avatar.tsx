import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageStyle,
  ViewStyle,
} from 'react-native';

interface AvatarProps {
  size?: number;
  name?: string;
  image?: string;
  online?: boolean;
  style?: ImageStyle | ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  size = 48,
  name,
  image,
  online = false,
  style,
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ').filter(Boolean);
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const getBackgroundColor = (name?: string) => {
    if (!name) return '#D1D5DB';
    const colors = [
      '#6366F1', '#10B981', '#F59E0B', '#EF4444',
      '#06B6D4', '#8B5CF6', '#EC4899', '#14B8A6',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <View style={[styles.container, avatarSize, style]}>
      {image ? (
        <Image source={{ uri: image }} style={[avatarSize, styles.image]} />
      ) : (
        <Text style={[
          styles.initials,
          { fontSize: size * 0.4, lineHeight: size * 0.5 },
          { color: 'white', backgroundColor: getBackgroundColor(name) }
        ]}>
          {getInitials(name || '')}
        </Text>
      )}
      {online && (
        <View style={[styles.onlineIndicator, { bottom: 2, right: 2, width: size * 0.2, height: size * 0.2 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '700',
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default Avatar;