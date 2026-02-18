// components/UserCard.js - **SearchScreen के लिए PERFECT**

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface UserCardProps {
  user: {
    _id: string;
    username?: string;  // ✅ Added - Instagram-style
    name: string;
    avatar?: string;
    gender: 'male' | 'female';
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    distance?: number;
    isOnline?: boolean;
  };
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  // Default avatar अगर MongoDB में null हो
  const avatarUrl = user.avatar || 'https://via.placeholder.com/80x80/6366F1/FFFFFF?text=👤';
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* User Avatar */}
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      {/* Online indicator */}
      {user.isOnline && (
        <View style={styles.onlineIndicator} />
      )}

      {/* User Info - Instagram-style: username + name */}
      <View style={styles.infoContainer}>
        <Text style={styles.username} numberOfLines={1}>
          {user.username || user.name}  {/* Username first, fallback to name */}
        </Text>
        
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        
        <Text style={styles.gender} numberOfLines={1}>
          {user.gender === 'male' ? '♂️ Male' : '♀️ Female'}
        </Text>
        
        {/* Location */}
        {user.location && (
          <Text style={styles.location} numberOfLines={1}>
            {user.location.city || user.location.state || user.location.country}
          </Text>
        )}
      </View>

      {/* Distance & Action button */}
      <View style={styles.rightContainer}>
        {user.distance && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>
              {user.distance}km
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="arrow-right" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 3,
    borderColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoContainer: {
    flex: 1,
    flexShrink: 1,
  },
  username: {  // ✅ New style - Bold Instagram-style username
    fontSize: 16,
    fontWeight: '700',
    color: '#0F0F23',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  gender: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
  },
  rightContainer: {
    alignItems: 'center',
  },
  distanceBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#F8FAFC',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserCard;
