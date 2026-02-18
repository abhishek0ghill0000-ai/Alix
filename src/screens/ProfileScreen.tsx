// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  Profile: undefined;
  CreatePostScreen: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation();

  const userStats = [
    { label: 'Posts', value: 24 },
    { label: 'Followers', value: 156 },
    { label: 'Following', value: 89 },
  ];

  const userPosts = [
    { id: '1', image: require('../../assets/images/placeholders/post1.jpg') },
    { id: '2', image: require('../../assets/images/placeholders/post2.jpg') },
    { id: '3', image: require('../../assets/images/placeholders/post3.jpg') },
  ];

  const renderUserStat = ({ item }: { item: { label: string; value: number } }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

  const renderUserPost = ({ item }: { item: { id: string; image: any } }) => (
    <Image source={item.image} style={styles.postThumbnail} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header with Create Post Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.createPostButton}
          onPress={() => navigation.navigate('CreatePostScreen')}
        >
          <Image 
            source={require('../../assets/icons/action/icon_add_post.png')} 
            style={styles.createPostIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={require('../../assets/images/placeholders/default_avatar.png')} 
          style={styles.profileAvatar} 
        />
        
        <View style={styles.profileInfo}>
          <Text style={styles.username}>priya_sharma28</Text>
          <Text style={styles.displayName}>Priya Sharma</Text>
          <Text style={styles.bio}>Love video calls & making new friends! 😊</Text>
        </View>

        <View style={styles.statsContainer}>
          <FlatList
            data={userStats}
            renderItem={renderUserStat}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={3}
            contentContainerStyle={styles.statsList}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Your Posts</Text>
        <FlatList
          data={userPosts}
          renderItem={renderUserPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsGrid}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    alignItems: 'flex-end',
  },
  createPostButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsList: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    margin: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  postsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  postsGrid: {
    gap: 2,
  },
  postThumbnail: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    margin: 1,
  },
});

export default ProfileScreen;