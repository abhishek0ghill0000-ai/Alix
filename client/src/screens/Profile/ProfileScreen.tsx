// client/src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native'; // npm i lottie-react-native

const BACKEND_URL = 'https://alix-renderer.com'; // Aapka backend

interface Profile {
  photo: string;
  username: string;
  uniqueId: string;
  bio: string;
  friendRequests: string[];
}

const ProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    photo: require('../assets/images/placeholders/default-avatar.png'), // ✅ Aapka asset
    username: 'SynceUser',
    uniqueId: 'SYNCE' + Math.floor(Math.random() * 1000000),
    bio: 'Real-time collaboration app! 🚀',
    friendRequests: ['user123', 'friend456'],
  });
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');

  // Profile photo change
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission needed');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfile({ ...profile, photo: { uri: result.assets[0].uri } });
    }
  };

  const updateBio = () => {
    setProfile({ ...profile, bio: newBio });
    setEditingBio(false);
  };

  const acceptFriendRequest = (reqId: string) => {
    setProfile({
      ...profile,
      friendRequests: profile.friendRequests.filter(id => id !== reqId),
    });
    Alert.alert('Accepted!');
  };

  const renderFriendRequest = ({ item }: { item: string }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Request from @{item}</Text>
      <View style={styles.actionBtns}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => acceptFriendRequest(item)}
        >
          <Image source={require('../assets/icons/subscription/check-mark.png')} style={styles.checkIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn}>
          <Image source={require('../assets/icons/action/icon_close.png')} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Image source={require('../assets/icons/action/icon_arrow_left.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Image source={require('../assets/icons/action/icon_more_vertical.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Profile Photo */}
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        <Image source={profile.photo} style={styles.photo} />
        <View style={styles.editOverlay}>
          <Image source={require('../assets/icons/action/icon_camera.png')} style={styles.cameraIcon} />
        </View>
      </TouchableOpacity>

      {/* Username & ID */}
      <Text style={styles.username}>{profile.username}</Text>
      <Text style={styles.uniqueId}>@{profile.uniqueId}</Text>

      {/* Subscription Status */}
      <View style={styles.subscriptionRow}>
        <Image source={require('../assets/icons/subscription/premium-crown.png')} style={styles.crownIcon} />
        <Text style={styles.subscriptionText}>Premium Member</Text>
        <Image source={require('../assets/icons/status/status-online.png')} style={styles.statusIcon} />
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        {editingBio ? (
          <>
            <TextInput
              style={styles.bioInput}
              value={newBio}
              onChangeText={setNewBio}
              multiline
              placeholder="Update your bio..."
              onSubmitEditing={updateBio}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={updateBio}>
              <Image source={require('../assets/icons/action/icon_check.png')} style={styles.saveIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.bio}>{profile.bio}</Text>
            <TouchableOpacity onPress={() => {
              setNewBio(profile.bio);
              setEditingBio(true);
            }}>
              <Image source={require('../assets/icons/action/icon_edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Friend Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friend Requests ({profile.friendRequests.length})</Text>
        <FlatList
          data={profile.friendRequests}
          renderItem={renderFriendRequest}
          keyExtractor={(item) => item}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
        {profile.friendRequests.length === 0 && (
          <Image source={require('../assets/images/feedback/empty-state.png')} style={styles.emptyState} />
        )}
      </View>

      {/* Background */}
      <Image source={require('../assets/images/backgrounds/profile-bg.png')} style={styles.bgImage} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  iconBtn: { padding: 8 },
  navIcon: { width: 24, height: 24, tintColor: '#fff' },
  photoContainer: { alignItems: 'center', marginTop: 20 },
  photo: { width: 140, height: 140, borderRadius: 70 },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 8,
  },
  cameraIcon: { width: 20, height: 20, tintColor: '#fff' },
  username: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 12, color: '#333' },
  uniqueId: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 },
  subscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  crownIcon: { width: 24, height: 24 },
  subscriptionText: { fontSize: 16, fontWeight: '600', color: '#34C759', marginHorizontal: 8 },
  statusIcon: { width: 16, height: 16 },
  bioContainer: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 32, marginBottom: 30 },
  bio: { flex: 1, fontSize: 16, color: '#333', lineHeight: 22 },
  bioInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  saveBtn: { backgroundColor: '#34C759', padding: 12, borderRadius: 12, marginLeft: 12 },
  saveIcon: { width: 20, height: 20, tintColor: '#fff' },
  editIcon: { width: 20, height: 20, tintColor: '#007AFF', marginLeft: 8 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 16 },
  requestItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  requestText: { fontSize: 16, color: '#333', marginBottom: 12 },
  actionBtns: { flexDirection: 'row', justifyContent: 'space-around' },
  acceptBtn: { backgroundColor: '#34C759', padding: 12, borderRadius: 8 },
  rejectBtn: { backgroundColor: '#FF3B30', padding: 12, borderRadius: 8 },
  checkIcon: { width: 24, height: 24, tintColor: '#fff' },
  closeIcon: { width: 20, height: 20, tintColor: '#fff' },
  list: { maxHeight: 300 },
  emptyState: { width: 150, height: 150, alignSelf: 'center', marginTop: 20 },
  bgImage: { 
    position: 'absolute', 
    bottom: 0, 
    right: -100, 
    width: 200, 
    height: 200,
    opacity: 0.1 
  },
});

export default ProfileScreen;
