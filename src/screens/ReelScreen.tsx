import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PRComponent from '../components/PRcomponent';
import { useAds } from '../hooks/useAds';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight, width } = Dimensions.get('window');

const ReelScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const flatListRef = useRef(null);
  const { fetchAd, insertAdEvery7th } = useAds();

  // Reels fetch karne ka function
  const fetchReels = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `https://alix-api.onrender.com/api/reels?limit=10&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      const newReels = data.reels || [];
      
      // Har 7th reel me ad insert karo (NO FRIENDS UI)
      const reelFeedWithAds = insertAdEvery7th(newReels.map(r => ({ ...r, type: 'reel' })));
      setReels(prev => [...prev, ...reelFeedWithAds]);
      setPage(page + 1);
    } catch (error) {
      console.log('Reels fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, insertAdEvery7th]);

  useEffect(() => {
    fetchReels();
  }, []);

  const renderReel = useCallback(({ item, index }) => (
    <PRComponent
      item={item}
      type={item.isAd ? 'ad' : 'reel'}
      style={styles.reelContainer}
      fullScreen={true}
    />
  ), []);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Back button top-left */}
      <TouchableOpacity style={styles.backButton} onPress={handleClose}>
        <View style={styles.backIcon} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item, index) => `${item._id || index}_reel`}
        pagingEnabled={true}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchReels}
        onEndReachedThreshold={0.1}
        windowSize={3}
        removeClippedSubviews={true}
        maxToRenderPerBatch={1}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  reelContainer: {
    width,
    height: screenHeight,
  },
});

export default ReelScreen;
