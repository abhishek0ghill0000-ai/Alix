// src/screens/CreatePostScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      setSelectedImage(image);
    }).catch(error => {
      console.log('Image picker error:', error);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      setSelectedImage(image);
    }).catch(error => {
      console.log('Camera error:', error);
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const postContent = async () => {
    if (!postText.trim() && !selectedImage) {
      Alert.alert('Empty post', 'Please add text or media');
      return;
    }

    setUploading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => {
          navigation.goBack();
          setPostText('');
          setSelectedImage(null);
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={require('../assets/icons/ui/icon_back.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Post</Text>
        
        <TouchableOpacity 
          style={[
            styles.postButton, 
            (!postText.trim() && !selectedImage) && styles.postButtonDisabled
          ]}
          onPress={postContent}
          disabled={!postText.trim() && !selectedImage}
        >
          <Text style={styles.postButtonText}>
            {uploading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 100, android: 80 })}
      >
        <ScrollView style={styles.scrollContent}>
          {/* Post Text Input */}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#64748B"
              multiline
              maxLength={2000}
              textAlignVertical="top"
              value={postText}
              onChangeText={setPostText}
              editable={!uploading}
            />
          </View>

          {/* Image Preview */}
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: selectedImage.path }} 
                style={styles.imagePreview} 
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Image 
                  source={require('../assets/icons/ui/icon_close.png')} 
                  style={styles.removeIcon} 
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Media Actions */}
          {!selectedImage && !uploading && (
            <View style={styles.mediaActions}>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={pickImage}
              >
                <Image 
                  source={require('../assets/icons/action/icon_add_media.png')} 
                  style={styles.mediaIcon} 
                />
                <Text style={styles.mediaButtonText}>Media</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={takePhoto}
              >
                <Image 
                  source={require('../assets/icons/action/icon_camera_on.png')} 
                  style={styles.mediaIcon} 
                />
                <Text style={styles.mediaButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Character Counter */}
      {postText.length > 0 && (
        <View style={styles.charCounter}>
          <Text style={styles.charCount}>{postText.length}/2000</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  postButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#64748B',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  textInputContainer: {
    minHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    flex: 1,
    minHeight: 80,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  mediaActions: {
    flexDirection: 'row',
    gap: 16,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },
  mediaIcon: {
    width: 24,
    height: 24,
    tintColor: '#3B82F6',
    marginRight: 12,
  },
  mediaButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  charCounter: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  charCount: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'right',
  },
});

export default CreatePostScreen;