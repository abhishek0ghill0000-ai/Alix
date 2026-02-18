import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height: screenHeight } = Dimensions.get('window');

interface PRProps {
  item: any;
  type: 'post' | 'reel' | 'ad';
  style?: any;
  fullScreen?: boolean;
  onPressReel?: () => void;
}

const PRComponent: React.FC<PRProps> = ({ 
  item, 
  type, 
  style, 
  fullScreen = false,
  onPressReel 
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes?.length || 0);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `https://alix-api.onrender.com/api/${type}s/${item._id}/like`;
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.log('Like error:', error);
    }
  };

  const handleComment = () => {
    // Comment screen pe navigation
    console.log('Comment on:', item._id);
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share:', item._id);
  };

  const toggleVideoControls = () => {
    setShowVideoControls(!showVideoControls);
    Animated.timing(fadeAnim, {
      toValue: showVideoControls ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Post UI
  if (type === 'post' || type === 'ad') {
    return (
      <View style={[styles.container, style]}>
        {/* User info */}
        <View style={styles.header}>
          <Image source={{ uri: item.user?.profilePic || 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <Text style={styles.username}>{item.user?.username || 'user'}</Text>
        </View>

        {/* Media */}
        <Image 
          source={{ uri: item.media || item.image || 'https://via.placeholder.com/400' }} 
          style={styles.postImage}
          resizeMode="cover"
        />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Icon 
              name={liked ? "favorite" : "favorite-border"} 
              size={28} 
              color={liked ? "#ff4444" : "#fff"} 
            />
            <Text style={styles.actionText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
            <Icon name="chat-bubble-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Icon name="share" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        {item.caption && (
          <Text style={styles.caption} numberOfLines={2}>
            <Text style={styles.username}>{item.user?.username} </Text>
            {item.caption}
          </Text>
        )}

        {/* Reel button (PostScreen me top-right) */}
        {onPressReel && type === 'post' && (
          <TouchableOpacity onPress={onPressReel} style={styles.reelButtonPost}>
            <Icon name="video-collection" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Reel UI (Full screen)
  if (type === 'reel') {
    return (
      <View style={[styles.reelContainer, style]}>
        {/* Video */}
        <Video
          ref={videoRef}
          source={{ uri: item.video || item.media }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={!fullScreen}
          onPress={toggleVideoControls}
          ignoreSilentSwitch="ignore"
        />

        {/* Overlay controls (fade in/out) */}
        <Animated.View style={[styles.overlayControls, { opacity: fadeAnim }]}>
          {/* Back button */}
          <TouchableOpacity style={styles.reelBackButton}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>

          {/* Like + Comment + Share (right side) */}
          <View style={styles.rightControls}>
            <TouchableOpacity onPress={handleLike} style={styles.controlButton}>
              <Icon 
                name={liked ? "favorite" : "favorite-border"} 
                size={35} 
                color={liked ? "#ff4444" : "white"} 
              />
              <Text style={styles.controlCount}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleComment} style={styles.controlButton}>
              <Icon name="chat-bubble-outline" size={35} color="white" />
              <Text style={styles.controlCount}>{item.comments?.length || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.controlButton}>
              <Icon name="share" size={35} color="white" />
            </TouchableOpacity>

            <View style={styles.controlButton}>
              <Icon name="more-vert" size={35} color="white" />
            </View>
          </View>
        </Animated.View>

        {/* User info (bottom left) */}
        <View style={styles.reelUserInfo}>
          <Image source={{ uri: item.user?.profilePic }} style={styles.reelAvatar} />
          <Text style={styles.reelUsername}>{item.user?.username}</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Caption (bottom) */}
        {item.caption && (
          <Text style={styles.reelCaption} numberOfLines={1}>
            {item.caption}
          </Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  caption: {
    color: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  reelButtonPost: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  // Reel styles
  reelContainer: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlayControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  reelBackButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightControls: {
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '60%',
  },
  controlButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  controlCount: {
    color: '#fff',
    marginTop: 5,
    fontWeight: '600',
  },
  reelUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reelAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  reelUsername: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  followButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: '#000',
    fontWeight: '600',
  },
  reelCaption: {
    color: '#fff',
    paddingHorizontal: 20,
    fontSize: 16,
  },
});

export default PRComponent;
