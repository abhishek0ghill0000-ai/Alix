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
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/MaterialIcons';

const BACKEND_URL = 'https://alix-renderer.com';

interface Profile {
  photo: string;
  username: string;
  uniqueId: string;
  bio: string;
  friendRequests: string[];
}

const ProfileScreen = () => {
  const router = useRouter();
  const { screen } = useLocalSearchParams(); // Ignore if not needed
  const [profile, setProfile] = useState<Profile>({
    photo: 'https://via.placeholder.com/150?text=👤',
    username: 'AlixUser',
    uniqueId: 'ALIX' + Math.floor(Math.random() * 1000000),
    bio: 'Next-gen social on Alix! 🚀',
    friendRequests: [],
  });
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/profile`, {
        headers: { Authorization: 'Bearer YOUR_JWT_TOKEN' }, // Add auth later
      });
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.log('Mock profile loaded');
    } finally {
      setLoading(false);
    }
  };

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
      const uri = result.assets[0].uri;
      setProfile({ ...profile, photo: uri });
      // Upload: POST to /upload-profile-photo
      const formData = new FormData();
      formData.append('photo', { uri } as any);
      fetch(`${BACKEND_URL}/upload-profile`, { method: 'POST', body: formData });
    }
  };

  const updateBio = () => {
    setProfile({ ...profile, bio: newBio });
    setEditingBio(false);
    // PATCH to /profile
  };

  const acceptFriendRequest = async (reqId: string) => {
    await fetch(`${BACKEND_URL}/friend-request/accept/${reqId}`, { method: 'POST' });
    setProfile({
      ...profile,
      friendRequests: profile.friendRequests.filter(id => id !== reqId),
    });
    Alert.alert('Accepted!');
  };

  const rejectFriendRequest = (reqId: string) => {
    setProfile({
      ...profile,
      friendRequests: profile.friendRequests.filter(id => id !== reqId),
    });
  };

  const blockUser = () => {
    Alert.alert('Blocked');
    // POST /block
  };

  const renderFriendRequest = ({ item }: { item: string }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Request from @{item}</Text>
      <View style={styles.actionBtns}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => acceptFriendRequest(item)}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => rejectFriendRequest(item)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Icon name="account-circle" size={100} color="#ccc" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Photo */}
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        <Image source={{ uri: profile.photo }} style={styles.photo} />
        <View style={styles.editOverlay}>
          <Icon name="camera-alt" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Username & ID */}
      <Text style={styles.username}>{profile.username}</Text>
      <Text style={styles.uniqueId}>@{profile.uniqueId}</Text>

      {/* Bio */}
      <View style={styles.bioContainer}>
        {editingBio ? (
          <>
            <TextInput
              style={styles.bioInput}
              value={newBio}
              onChangeText={setNewBio}
              multiline
              maxLength={150}
              placeholder="Update your bio..."
              onSubmitEditing={updateBio}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={updateBio}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.bio}>{profile.bio || 'Add a bio...'}</Text>
            <TouchableOpacity onPress={() => {
              setNewBio(profile.bio);
              setEditingBio(true);
            }}>
              <Icon name="edit" size={18} color="#007AFF" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Privacy Settings */}
      <TouchableOpacity style={styles.settingsBtn}>
        <Text style={styles.settingsText}>Privacy & Account Settings</Text>
        <Icon name="arrow-forward-ios" size={16} color="#666" />
      </TouchableOpacity>

      {/* Friend Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friend Requests ({profile.friendRequests.length})</Text>
        <FlatList
          data={profile.friendRequests}
          renderItem={renderFriendRequest}
          keyExtractor={(item) => item}
          style={styles.list}
        />
      </View>

      {/* Block/Report */}
      <TouchableOpacity style={styles.blockBtn} onPress={blockUser}>
        <Text style={styles.blockText}>Block / Report Options</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  iconBtn: {
    padding: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  photo: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 8,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    color: '#333',
  },
  uniqueId: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    marginBottom: 30,
  },
  bio: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  bioInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    maxHeight: 100,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 2,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  requestText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  actionBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  acceptBtn: {
    flex: 0.45,
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
  },
  rejectBtn: {
    flex: 0.45,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    maxHeight: 300,
  },
  blockBtn: {
    backgroundColor: '#FF3B30',
    padding: 16,
    margin: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  blockText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;