// src/screens/FeedScreen.tsx (PostDetailScreen ✅ INTEGRATED)
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  Feed: undefined;
  CreatePostScreen: undefined;
  PostDetailScreen: { postId: string };  // ✅ PostDetailScreen navigation type
};

interface Post {
  id: string;
  userName: string;
  avatar: any;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  time: string;
}

const FeedScreen = () => {
  const navigation = useNavigation<any>();  // ✅ Flexible navigation type

  const posts: Post[] = [
    {
      id: '1',
      userName: 'priya_sharma28',
      avatar: require('../../assets/images/placeholders/default_avatar.png'),
      image: require('../../assets/images/placeholders/post1.jpg'),
      caption: 'Beautiful sunset today! 🌅 #nature #sunset',
      likes: 234,
      comments: 12,
      time: '2h',
    },
    {
      id: '2',
      userName: 'rohan_gupta',
      avatar: require('../../assets/images/placeholders/default_avatar.png'),
      image: require('../../assets/images/placeholders/post2.jpg'),
      caption: 'Random video call was fun! 😄',
      likes: 156,
      comments: 8,
      time: '5h',
    },
  ];

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postContainer}
      onPress={() => navigation.navigate('PostDetailScreen', { postId: item.id })}  // ✅ PostDetailScreen navigation
      activeOpacity={0.9}
    >
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.headerLeft}>
          <Image source={item.avatar} style={styles.postAvatar} />
          <Text style={styles.postUsername}>{item.userName}</Text>
        </View>
        <Image 
          source={require('../assets/icons/ui/icon_more.png')} 
          style={styles.moreIcon} 
        />
      </View>

      {/* Post Image */}
      <Image source={item.image} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Image 
            source={require('../../assets/icons/action/icon_heart.png')} 
            style={styles.actionIcon} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostDetailScreen', { postId: item.id })}  // ✅ Comment → PostDetailScreen
        >
          <Image 
            source={require('../../assets/icons/action/icon_comment.png')} 
            style={styles.actionIcon} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image 
            source={require('../../assets/icons/action/icon_share.png')} 
            style={styles.actionIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Likes & Caption */}
      <View style={styles.postContent}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
        <Text style={styles.usernameText}>{item.userName}</Text>
        <Text style={styles.captionText}>{item.caption}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.feedList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      />

      {/* Floating Action Button - CreatePostScreen */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePostScreen')}
        activeOpacity={0.8}
      >
        <Image 
          source={require('../../assets/icons/action/icon_add_post.png')} 
          style={styles.fabIcon} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: 100,
  },
  postContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  postImage: {
    width: '100%',
    height: 400,
    borderRadius: 16,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    marginRight: 16,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  captionText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
});

export default FeedScreen;