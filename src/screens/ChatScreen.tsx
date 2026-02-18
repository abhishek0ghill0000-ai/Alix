// src/screens/ChatScreen.js - **Socket.IO FULLY INTEGRATED**

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchConversations } from "../services/api";
import { connectSocket, disconnectSocket, socket } from "../services/socket";
import ChatListItem from "../components/ChatListItem";
import AdvancedAccessIcon from "../components/AdvancedAccessIcon";

const ChatScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  // Socket listeners for real-time conversation updates
  useEffect(() => {
    const setupSocketListeners = () => {
      socket.on('messageReceived', handleNewMessage);
      socket.on('messageRead', handleMessageRead);
      socket.on('typing', handleTyping);
    };

    const cleanupSocketListeners = () => {
      socket.off('messageReceived', handleNewMessage);
      socket.off('messageRead', handleMessageRead);
      socket.off('typing', handleTyping);
    };

    setupSocketListeners();
    return cleanupSocketListeners;
  }, []);

  // Load userId and connect socket
  useEffect(() => {
    const initChatScreen = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        await connectSocket(storedUserId);
        loadConversations();
      } catch (error) {
        console.log('ChatScreen init error:', error);
      }
    };

    initChatScreen();
    
    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.log("Failed to load conversations:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, []);

  // Real-time handlers
  const handleNewMessage = (newMessage) => {
    // Update conversations list in real-time
    setConversations(prev => {
      const updated = [...prev];
      const existingConvIndex = updated.findIndex(conv => 
        (conv.otherUser._id === newMessage.sender._id || conv.otherUser._id === newMessage.receiver._id) &&
        conv.otherUser._id !== userId
      );

      if (existingConvIndex >= 0) {
        // Update existing conversation (move to top + update last message)
        const updatedConv = { ...updated[existingConvIndex], lastMessage: newMessage };
        const newList = updated.filter((_, index) => index !== existingConvIndex);
        newList.unshift(updatedConv);
        return newList;
      } else {
        // New conversation - add to top
        const otherUser = newMessage.sender._id === userId 
          ? newMessage.receiver 
          : newMessage.sender;
        const newConv = {
          _id: `${userId}-${otherUser._id}`,
          otherUser,
          lastMessage: newMessage,
          unreadCount: 1
        };
        return [newConv, ...updated];
      }
    });
  };

  const handleMessageRead = (data) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.otherUser._id === data.userId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleTyping = (data) => {
    console.log('Someone is typing:', data);
  };

  const handleChatPress = (otherUser) => {
    navigation.navigate("ChatDetail", { otherUser });
  };

  return (
    <View style={styles.container}>
      {/* Header with AdvancedAccessScreen icon */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdvancedAccessScreen")}
          style={styles.advancedIconContainer}
        >
          <AdvancedAccessIcon />
        </TouchableOpacity>
      </View>

      {/* Snapchat‑style chat list */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id || item.otherUser?._id}
        renderItem={({ item }) => (
          <ChatListItem 
            item={item} 
            onPress={() => handleChatPress(item.otherUser || item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  title: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  advancedIconContainer: {
    padding: 4,
  },
});

export default ChatScreen;
