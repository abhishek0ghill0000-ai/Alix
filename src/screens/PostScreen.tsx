import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PRComponent from '../components/PRcomponent';
import { useAds } from '../hooks/useAds';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PostScreen = () => {
  const navigation = useNavigation(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { fetchAd, insertAdEvery7th } = useAds();

  // Posts fetch karne ka function
  const fetchPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `https://alix-api.onrender.com/api/posts?limit=20&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      const newPosts = data.posts || [];
      
      // Har 7th item me ad insert karo
      const feedWithAds = insertAdEvery7th(newPosts);
      setPosts(prev => [...prev, ...feedWithAds]);
      setPage(page + 1);
    } catch (error) {
      console.log('Posts fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, insertAdEvery7th]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPost = ({ item, index }) => (
    <PRComponent
      item={item}
      type={item.isAd ? 'ad' : 'post'}
      onPressReel={() => navigation.navigate('ReelScreen')}
      style={styles.postContainer}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item, index) => `${item._id || index}`}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
      
      {/* Right top corner me Reel button */}
      <TouchableOpacity 
        style={styles.reelButton}
        onPress={() => navigation.navigate('ReelScreen')}
      >
        <View style={styles.reelIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  list: { paddingBottom: 100 },
  postContainer: { width, marginBottom: 10 },
  reelButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff0066',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reelIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default PostScreen;
