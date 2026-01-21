// Alix App - Create Post Screen
// client/screens/Posts/CreatePostScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../config/env';

const CreatePostScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Empty Post', 'Add text or image');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'post.jpg',
        } as any);
      }

      const response = await fetch(API_ENDPOINTS.posts, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        } as any,
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created!');
        setContent('');
        setImage(null);
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Post</Text>
        
        {/* Preview */}
        {image && (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        )}
        
        <TextInput
          style={styles.textInput}
          placeholder="What's happening?"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={280}
          textAlignVertical="top"
        />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>📷 Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.postBtn, loading && styles.disabledBtn]} 
            onPress={createPost}
            disabled={loading}
          >
            <Text style={styles.postBtnText}>
              {loading ? 'Posting...' : `Post${content ? ` (${content.length}/280)` : ''}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center', 
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  imagePreview: { 
    width: '100%', 
    height: 250, 
    borderRadius: 15, 
    marginBottom: 20,
    alignSelf: 'center',
  },
  textInput: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    minHeight: 120, 
    fontSize: 16,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingBottom: 30 
  },
  imageBtn: { 
    flex: 1, 
    backgroundColor: '#00D4AA', 
    padding: 15, 
    borderRadius: 12, 
    marginRight: 10,
    alignItems: 'center',
  },
  imageBtnText: { 
    color: 'white', 
    fontWeight: '600', 
    fontSize: 16 
  },
  postBtn: { 
    flex: 1, 
    backgroundColor: '#6366F1', 
    padding: 15, 
    borderRadius: 12, 
    marginLeft: 10,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#9CA3AF' },
  postBtnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});

export default CreatePostScreen;