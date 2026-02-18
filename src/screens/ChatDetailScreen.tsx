// src/screens/ChatDetailScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { sendMessage, fetchMessages } from "../services/api";
import { socket } from "../services/socket";
import MessageBubble from "../components/MessageBubble";
import CallButton from "../components/CallButton";

const ChatDetailScreen = () => {
  const route = useRoute();
  const { otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    loadMessages();
    setupSocketListeners();
  }, []);

  const loadMessages = async () => {
    const data = await fetchMessages(otherUser._id); // backend: GET /messages/:userId
    setMessages(data);
  };

  const setupSocketListeners = () => {
    socket.on("messageReceived", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    socket.on("typing", ({ isTyping }) => {
      // typing indicator UI update
    });
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      receiver: otherUser._id,
      content: text,
      type: "text",
    };

    await sendMessage(payload);
    setText("");
  };

  return (
    <View style={styles.container}>
      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input + call buttons */}
      <View style={styles.inputContainer}>
        <CallButton type="audio" />
        <CallButton type="video" />
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0084ff",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});

export default ChatDetailScreen;
