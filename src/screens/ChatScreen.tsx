// src/screens/ChatScreen.tsx (HomeScreen + BottomTabs INTEGRATED)
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  ChatScreen: { userId: string; userName: string };
  RandomCall: undefined;
};

type ChatScreenNavProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  read?: boolean;
  type: 'text' | 'image' | 'voice';
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<ChatScreenNavProp>();
  const { userId, userName } = route.params as { userId: string; userName: string };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [userTyping, setUserTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Sound effects
  useEffect(() => {
    Sound.setCategory('Playback');
    
    const messageSound = new Sound('message_received.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) console.log('Sound error:', error);
    });

    return () => {
      messageSound.release();
    };
  }, []);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom on new message
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      // Mock chat history
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hey! Kaisi ho?',
          time: '10:30 AM',
          isMe: false,
          type: 'text',
        },
        {
          id: '2',
          text: 'Main theek hun! Tum batao?',
          time: '10:32 AM',
          isMe: true,
          type: 'text',
          read: true,
        },
        {
          id: '3',
          text: 'Bas masti chal rahi hai 😄',
          time: '10:33 AM',
          isMe: false,
          type: 'text',
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.log('Chat history error:', error);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'text',
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Simulate reply after 2 seconds
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Nice! 😊',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          type: 'text',
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer, 
      item.isMe ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={[
        styles.messageText, 
        item.isMe ? styles.myMessageText : styles.theirMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTime, 
        item.isMe ? styles.myMessageTime : styles.theirMessageTime
      ]}>
        {item.time}
        {!item.isMe && !item.read && '  • Sent'}
      </Text>
    </View>
  ), []);

  const renderInputAccessory = () => (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.mediaButton}>
        <Image 
          source={require('../assets/icons/action/icon_add_media.png')} 
          style={styles.mediaIcon} 
        />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type a message..."
        placeholderTextColor="#64748B"
        multiline
        maxLength={1000}
      />
      
      <TouchableOpacity 
        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
        onPress={sendMessage}
        disabled={!inputText.trim()}
      >
        <Image 
          source={require('../assets/icons/action/icon_send.png')} 
          style={styles.sendIcon} 
        />
      </TouchableOpacity>
    </View>
  );

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
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/images/placeholders/default_avatar.png')} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerStatus}>online</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.videoCallButton}>
          <Image 
            source={require('../assets/icons/action/icon_video.png')} 
            style={styles.videoIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />
        
        {userTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>{userName} is typing...</Text>
          </View>
        )}
        
        {renderInputAccessory()}
      </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
  },
  videoCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 18,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#E2E8F0',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirMessageTime: {
    color: '#94A3B8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
  },
  mediaButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mediaIcon: {
    width: 22,
    height: 22,
    tintColor: '#94A3B8',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#64748B',
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

export default ChatScreen;